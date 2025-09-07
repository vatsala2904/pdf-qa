import { NextResponse } from "next/server";
import { z } from "zod";
import { createSessionToken } from "@/lib/auth";

const bodySchema = z.object({ passcode: z.string().min(1) });

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  if (parsed.data.passcode !== process.env.CLIENT_PASSCODE)
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("fe_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}
