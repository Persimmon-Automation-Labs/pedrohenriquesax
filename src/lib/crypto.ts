import "server-only";
import { createHmac, timingSafeEqual, randomBytes, createHash } from "node:crypto";

function key(): Buffer {
  const raw = process.env.ENCRYPTION_KEY;
  if (raw) { try { const b = Buffer.from(raw, "base64"); if (b.length) return b; } catch {} }
  return Buffer.from("fallback-dev-key-not-for-production");
}
const b64u = (b: Buffer) => b.toString("base64url");

/** Assina um payload JSON. Formato: base64url(json).base64url(hmac) */
export function sign(payload: object): string {
  const body = b64u(Buffer.from(JSON.stringify(payload)));
  const sig = b64u(createHmac("sha256", key()).update(body).digest());
  return `${body}.${sig}`;
}

/** Verifica e devolve o payload, ou null. Nunca lança. */
export function unsign<T>(token: string | undefined): T | null {
  if (!token || !token.includes(".")) return null;
  try {
    const [body, sig] = token.split(".");
    const expected = createHmac("sha256", key()).update(body).digest();
    const given = Buffer.from(sig, "base64url");
    if (given.length !== expected.length) return null;
    if (!timingSafeEqual(given, expected)) return null;
    return JSON.parse(Buffer.from(body, "base64url").toString()) as T;
  } catch { return null; }
}

export const randomToken = () => randomBytes(32).toString("base64url");
export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");
