import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/** Carrinho em cookie: lista de ids. Produto digital, quantidade sempre 1. */
const COOKIE = "pl_cart";

export async function readCartIds(): Promise<string[]> {
  try {
    const raw = (await cookies()).get(COOKIE)?.value;
    if (!raw) return [];
    const v = JSON.parse(decodeURIComponent(raw));
    return Array.isArray(v) ? [...new Set(v.filter((x) => typeof x === "string"))].slice(0, 40) : [];
  } catch { return []; }
}

export async function writeCartIds(ids: string[]) {
  const jar = await cookies();
  const unique = [...new Set(ids)].slice(0, 40);
  if (!unique.length) { jar.delete(COOKIE); return; }
  jar.set(COOKIE, encodeURIComponent(JSON.stringify(unique)), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getCart() {
  const ids = await readCartIds();
  if (!ids.length) return { items: [], totalCents: 0 };
  const products = await prisma.product.findMany({ where: { id: { in: ids }, active: true } });
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  return { items, totalCents: items.reduce((s, p) => s + p.priceCents, 0) };
}

export async function cartCount() { return (await readCartIds()).length; }
