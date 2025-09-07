import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import { buildIndex, answerQuestion } from "@/lib/rag";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("fe_session")?.value;
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (body?.rebuild) {
      await buildIndex();
      return NextResponse.json({ ok: true, note: "Index rebuilt" });
    }
    const answer = await answerQuestion(String(body?.question || ""));
    return NextResponse.json({ ok: true, answer });
  } catch (err: any) {
    const status = Number(err?.status || err?.response?.status || 500);
    const msg =
      err?.message ||
      err?.response?.data?.error?.message ||
      String(err) ||
      "ask failed";
    console.error("ASK_ERROR >>>", status, msg);
    return NextResponse.json({ error: msg }, { status });
  }
}
