import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sign, unsign } from "@/lib/crypto";

/**
 * Sessão do cliente da loja. COMPLETAMENTE separada do painel administrativo
 * (src/lib/admin/session.ts) e nunca toca nele. Cookie assinado httpOnly.
 */
const COOKIE = "pl_customer";
const TTL = 1000 * 60 * 60 * 24 * 30;

type Payload = { sub: string; exp: number };

export async function setCustomerSession(customerId: string) {
  const jar = await cookies();
  jar.set(COOKIE, sign({ sub: customerId, exp: Date.now() + TTL } satisfies Payload), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: TTL / 1000,
  });
}

export async function clearCustomerSession() {
  (await cookies()).delete(COOKIE);
}

export async function getCustomer() {
  try {
    const raw = (await cookies()).get(COOKIE)?.value;
    const p = unsign<Payload>(raw);
    if (!p || p.exp < Date.now()) return null;
    return await prisma.customer.findUnique({ where: { id: p.sub } });
  } catch { return null; }
}

export async function requireCustomer() {
  const c = await getCustomer();
  if (!c) throw new Error("UNAUTHENTICATED");
  return c;
}
