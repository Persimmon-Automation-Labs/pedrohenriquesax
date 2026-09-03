import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "http://localhost:3000";
  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    products = await prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } });
  } catch {
    // banco ainda não migrado (primeiro build): o mapa sai sem os produtos
  }
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...["sobre", "eventos", "mentoria", "loja", "agenda", "galeria", "contato"].map((r) => ({
      url: `${base}/${r}`, changeFrequency: "weekly" as const, priority: 0.8,
    })),
    ...products.map((p) => ({ url: `${base}/loja/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
  ];
}
