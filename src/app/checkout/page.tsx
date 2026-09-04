import { redirect } from "next/navigation";
import Link from "next/link";
import { Chrome } from "@/components/Chrome";
import { getCart } from "@/lib/cart";
import { getCustomer } from "@/lib/customer/session";
import { brl } from "@/lib/money";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout", robots: { index: false } };

export default async function Checkout() {
  const { items, totalCents } = await getCart();
  if (!items.length) redirect("/carrinho");
  const customer = await getCustomer();

  return (
    <Chrome>
      <div className="wrap section">
        <h1 className="d-l text-paper">Finalizar compra</h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          <div className="surface rounded-[2px] p-6 md:p-8">
            <CheckoutForm defaults={{ name: customer?.name ?? "", email: customer?.email ?? "", phone: customer?.phone ?? "" }} />
          </div>

          <aside className="surface h-fit rounded-[2px] p-6">
            <p className="label text-faint">Seu pedido</p>
            <ul className="mt-4 flex flex-col gap-3">
              {items.map((p) => (
                <li key={p.id} className="flex items-baseline justify-between gap-4 text-sm">
                  <Link href={`/loja/${p.slug}`} className="text-paper hover:text-accent transition-colors">{p.title}</Link>
                  <span className="mono text-muted shrink-0">{brl(p.priceCents)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t border-black/10 pt-5">
              <span className="d-m text-paper">Total</span>
              <span className="mono text-2xl text-paper">{brl(totalCents)}</span>
            </div>
          </aside>
        </div>
      </div>
    </Chrome>
  );
}
