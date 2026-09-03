import Link from "next/link";
import Image from "next/image";
import { Chrome } from "@/components/Chrome";
import { getCart } from "@/lib/cart";
import { brl } from "@/lib/money";
import { removeFromCart } from "@/app/actions";
import { Empty } from "@/components/Alert";
import { mediaUrl } from "@/lib/media-url";

export const dynamic = "force-dynamic";
export const metadata = { title: "Carrinho", robots: { index: false } };

export default async function Carrinho() {
  const { items, totalCents } = await getCart();
  return (
    <Chrome>
      <div className="wrap section">
        <h1 className="d-l text-paper">Carrinho</h1>

        {!items.length ? (
          <div className="mt-10">
            <Empty title="Seu carrinho está vazio."
              action={<Link href="/loja" className="btn btn-primary">Ver a loja</Link>} />
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
            <ul>
              {items.map((p) => (
                <li key={p.id} className="flex items-center gap-5 border-b border-white/10 py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[2px] surface">
                    {p.coverUrl && <Image src={mediaUrl(p.coverUrl)} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/loja/${p.slug}`} className="d-nar text-paper hover:text-accent transition-colors">{p.title}</Link>
                    <p className="mono text-sm text-muted mt-1">{brl(p.priceCents)}</p>
                  </div>
                  <form action={removeFromCart.bind(null, p.id)}>
                    <button type="submit" className="btn btn-ghost btn-sm" aria-label={`Remover ${p.title}`}>
                      <span className="label">Remover</span>
                    </button>
                  </form>
                </li>
              ))}
            </ul>

            <aside className="surface h-fit rounded-[2px] p-6">
              <p className="label text-faint">Resumo</p>
              <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-5">
                <span className="d-m text-paper">Total</span>
                <span className="mono text-2xl text-paper">{brl(totalCents)}</span>
              </div>
              <Link href="/checkout" className="btn btn-primary mt-6 w-full">Finalizar compra</Link>
              <p className="hint mt-4">Pagamento por Pix, à vista.</p>
            </aside>
          </div>
        )}
      </div>
    </Chrome>
  );
}
