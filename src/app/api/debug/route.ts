import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    CLIENT_PASSCODE: process.env.CLIENT_PASSCODE || "not set",
  });
}
