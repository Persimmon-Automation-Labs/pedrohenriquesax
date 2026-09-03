import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sign, unsign } from "@/lib/crypto";

const COOKIE = "pl_admin";
const TTL = 1000 * 60 * 60 * 12;
type Payload = { sub: string; exp: number };

export async function setAdminSession(id: string) {
  const jar = await cookies();
  jar.set(COOKIE, sign({ sub: id, exp: Date.now() + TTL } satisfies Payload), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: TTL / 1000,
  });
}
export async function clearAdminSession() { (await cookies()).delete(COOKIE); }

export async function getAdmin() {
  try {
    const p = unsign<Payload>((await cookies()).get(COOKIE)?.value);
    if (!p || p.exp < Date.now()) return null;
    return await prisma.adminUser.findUnique({ where: { id: p.sub } });
  } catch { return null; }
}
