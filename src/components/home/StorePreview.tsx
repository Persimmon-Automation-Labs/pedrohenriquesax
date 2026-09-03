import Link from "next/link";
import type { Product } from "@prisma/client";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export function StorePreview({ products, level = "h2" }: { level?: "h1" | "h2"; products: Product[] }) {
  const H = level;
  if (!products.length) return null;
  return (
    <section id="loja" className="section border-t border-white/10">
      <div className="wrap">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label text-accent">Materiais de estudo</p>
              <H className="d-l text-paper mt-4">Loja</H>
            </div>
            <Link href="/loja" className="btn btn-secondary">Ver tudo</Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 70}><ProductCard p={p} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
