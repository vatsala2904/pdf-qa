import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
const pdf = require("pdf-parse");

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // auth
    const cookieStore = await cookies();
    const token = cookieStore.get("fe_session")?.value;
    if (!token || !(await verifySessionToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // form-data
    const form = await req.formData();
    const file = form.get("pdf");
    if (!file) return NextResponse.json({ error: "No file 'pdf' provided" }, { status: 400 });
    if (!(file instanceof Blob)) return NextResponse.json({ error: "Invalid file" }, { status: 400 });

    // type check
    const mime = (file as any).type || "";
    if (mime && mime !== "application/pdf") {
      return NextResponse.json({ error: `Only PDF allowed (got: ${mime})` }, { status: 400 });
    }

    // parse
    const buf = Buffer.from(await file.arrayBuffer());
    const parsed = await pdf(buf);
    const text = parsed.text ?? "";
    const pages = parsed.numpages ?? 0;

    // persist
    const base = path.join(process.cwd(), "data");
    await fs.mkdir(base, { recursive: true });
    await fs.writeFile(path.join(base, "document.txt"), text, "utf8");
    await fs.writeFile(
      path.join(base, "meta.json"),
      JSON.stringify({ pages, info: parsed.info }, null, 2),
      "utf8"
    );

    return NextResponse.json({ ok: true, pages, chars: text.length });
  } catch (err: any) {
    console.error("UPLOAD_ERROR:", err);
    return NextResponse.json(
      { error: err?.message || String(err) || "Upload failed" },
      { status: 500 }
    );
  }
}
