import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { brl } from "@/lib/money";

/** Capa tratada como capa de disco, não como thumbnail de PDF. */
export function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/loja/${p.slug}`} className="group flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-[2px] surface">
        {p.coverUrl ? (
          <Image src={p.coverUrl} alt={p.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover zoom-img" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1d2a2f] to-ink flex items-end p-5">
            <span className="d-nar text-paper/40 text-sm">{p.title}</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h3 className="d-nar text-paper text-[1.05rem] group-hover:text-accent transition-colors">{p.title}</h3>
          {p.subtitle && <p className="text-sm text-faint mt-1">{p.subtitle}</p>}
        </div>
        <span className="mono text-paper shrink-0">{brl(p.priceCents)}</span>
      </div>
    </Link>
  );
}
