"use client";
import { useState } from "react";
import Splash from "@/components/Splash";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [q, setQ] = useState("");
  const [a, setA] = useState("");

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setMsg("yo, pick a PDF first 🤌"); return; }
    const fd = new FormData();
    fd.append("pdf", file);
    setMsg("beaming your PDF…");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    setMsg(res.ok ? "all set. lore locked 🔒" : `whoa: ${data.error || "upload failed"}`);
  }

  async function onAsk(e: React.FormEvent) {
    e.preventDefault();
    setA("thinking hard…");
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    });
    const data = await res.json().catch(() => ({}));
    setA(res.ok ? data.answer : `error: ${data.error}`);
  }

  return (
    <>
      <Splash />
      <main className="min-h-screen flex flex-col items-center justify-start p-6
                       bg-gradient-to-br from-black via-neutral-900 to-black">
        {/* HERO */}
        <header className="text-center mt-10">
          <h1 className="text-7xl md:text-8xl font-extrabold tracking-widest
                         text-neon-yellow drop-shadow-neonYellow animate-pulseNeon">
            ASK PDF
          </h1>
          <p className="mt-4 text-neutral-400 text-lg">Upload • Ask • Get instant answers</p>
        </header>

        {/* CARD */}
        <div className="w-full max-w-2xl mt-12 rounded-3xl border border-neon-pink neon-border
                        bg-black/70 backdrop-blur-xl shadow-glow p-10 flex flex-col gap-10">

          {/* Upload Section */}
          <div className="rounded-2xl border border-neon-yellow p-6 space-y-4 shadow-glow">
            <form onSubmit={onUpload} className="space-y-4 text-center">
              <label className="mx-auto flex h-28 w-full max-w-md cursor-pointer items-center justify-center
                                 rounded-xl border-2 border-dashed border-neon-pink
                                 hover:border-neon-orange bg-neutral-800/50 text-white transition">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <span className="text-sm">
                  {file ? file.name : "📄 Drag & Drop or Click to Choose PDF"}
                </span>
              </label>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl
                           bg-neon-orange px-6 py-3 font-semibold text-black
                           hover:bg-neon-yellow transition shadow-glow">
                ⬆ Upload PDF
              </button>

              {msg && <p className="text-xs text-neutral-400">{msg}</p>}
            </form>
          </div>

          {/* Ask Section */}
          <div className="rounded-2xl border border-neon-yellow p-6 space-y-3 shadow-glow">
            <form onSubmit={onAsk} className="space-y-3">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="🤔 ask me anything…"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-900/70
                           px-4 py-3 text-white placeholder-neutral-500
                           focus:outline-none focus:ring-2 focus:ring-neon-blue"
              />
              <button
                className="w-full rounded-xl bg-neon-red px-4 py-3 font-semibold text-white
                           hover:bg-neon-pink transition shadow-glow">
                ⚡ Ask
              </button>
            </form>
          </div>

          {/* Answer Section */}
          <div className="rounded-2xl border border-neon-yellow p-6 shadow-glow">
            <section className="text-sm text-white min-h-[120px]">
              {a || "💡 your answer will appear here..."}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
