import { promises as fs } from "fs";
import path from "path";
import OpenAI from "openai";

const CHUNK_SIZE = 800;
const MAX_CHUNKS = 100; // cap to avoid many API calls

function chunkText(text: string, size = CHUNK_SIZE): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
  return chunks;
}

function overlapScore(q: string, c: string) {
  const norm = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const qs = new Set(norm(q));
  const cs = norm(c);
  let score = 0;
  for (const w of cs) if (qs.has(w)) score++;
  return score / Math.sqrt(cs.length + 1);
}

export async function buildIndex() {
  const text = await fs.readFile(path.join(process.cwd(), "data/document.txt"), "utf8");
  const chunks = chunkText(text).slice(0, MAX_CHUNKS);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // lexical-only index (no API)
    await fs.writeFile(
      path.join(process.cwd(), "data/index.json"),
      JSON.stringify({ mode: "lexical", chunks }),
      "utf8"
    );
    return;
  }

  const client = new OpenAI({ apiKey });
  try {
    const embeddings = [];
    for (const chunk of chunks) {
      const res = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });
      embeddings.push({ embedding: res.data[0].embedding, chunk });
    }
    await fs.writeFile(
      path.join(process.cwd(), "data/index.json"),
      JSON.stringify({ mode: "embed", entries: embeddings }),
      "utf8"
    );
  } catch {
    // fallback to lexical on quota/rate errors, and DO NOT throw
    await fs.writeFile(
      path.join(process.cwd(), "data/index.json"),
      JSON.stringify({ mode: "lexical", chunks }),
      "utf8"
    );
    return;
  }
}

export async function answerQuestion(question: string) {
  const idxPath = path.join(process.cwd(), "data/index.json");
  const raw = await fs.readFile(idxPath, "utf8");
  const idx = JSON.parse(raw);

  if (idx.mode === "embed") {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const qEmbed = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    });
    const q = qEmbed.data[0].embedding;

    const cosine = (a: number[], b: number[]) => {
      let dot = 0,
        na = 0,
        nb = 0;
      for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        na += a[i] ** 2;
        nb += b[i] ** 2;
      }
      return dot / (Math.sqrt(na) * Math.sqrt(nb));
    };

    const top = idx.entries
      .map((e: any) => ({ score: cosine(q, e.embedding), chunk: e.chunk }))
      .sort((a: any, b: any) => b.score - a.score)[0];

    // if quota hits here, throw to route catch
    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Answer concisely using ONLY the context." },
        { role: "user", content: `Context:\n${top.chunk}\n\nQuestion: ${question}` },
      ],
    });
    return chat.choices[0].message.content || top.chunk;
  } else {
    // lexical fallback: return the best chunk
    const top = (idx.chunks as string[])
      .map((c) => ({ s: overlapScore(question, c), c }))
      .sort((a, b) => b.s - a.s)[0];
    return `Best match from document:\n\n${top.c}`;
  }
}
