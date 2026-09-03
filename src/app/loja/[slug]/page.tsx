import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { brl } from "@/lib/money";
import { addToCart } from "@/app/actions";
import { mediaUrl } from "@/lib/media-url";

export const dynamic = "force-dynamic";

async function get(slug: string) {
  return prisma.product.findFirst({ where: { slug, active: true }, include: { files: true } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await get((await params).slug);
  if (!p) return { title: "Produto não encontrado" };
  return { title: p.title, description: p.subtitle || p.description.slice(0, 160) };
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await get((await params).slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product",
    name: p.title, description: p.description,
    offers: { "@type": "Offer", price: (p.priceCents / 100).toFixed(2), priceCurrency: "BRL", availability: "https://schema.org/InStock" },
  };

  return (
    <Chrome>
      <div className="wrap section grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2px] surface">
          {p.coverUrl
            ? <Image src={mediaUrl(p.coverUrl)} alt={p.title} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            : <div className="h-full w-full bg-gradient-to-br from-[#1d2a2f] to-ink" />}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="label text-accent">Material digital</p>
            <h1 className="d-l text-paper mt-4">{p.title}</h1>
            {p.subtitle && <p className="mt-3 text-lg text-muted">{p.subtitle}</p>}
          </div>

          <p className="mono text-3xl text-paper">{brl(p.priceCents)}</p>

          <div className="prose-w whitespace-pre-line text-muted leading-relaxed">{p.description}</div>

          {p.files.length > 0 && (
            <div>
              <p className="label text-faint border-b border-white/10 pb-2">O que você recebe</p>
              <ul className="mt-3 flex flex-col gap-2">
                {p.files.map((f) => (
                  <li key={f.id} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-paper">{f.label}</span>
                    <span className="mono text-xs text-faint">{f.mimeType.split("/").pop()?.toUpperCase()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form action={addToCart.bind(null, p.id)}>
            <button type="submit" className="btn btn-primary w-full sm:w-auto">Adicionar ao carrinho</button>
          </form>
          <p className="hint">Pagamento por Pix. O material fica disponível na sua conta assim que o pagamento for confirmado.</p>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Chrome>
  );
}
