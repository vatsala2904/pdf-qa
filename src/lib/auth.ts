import { jwtVerify, SignJWT } from "jose";

const ALG = "HS256";
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function createSessionToken() {
  return new SignJWT({ ok: true })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifySessionToken(token: string) {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}
