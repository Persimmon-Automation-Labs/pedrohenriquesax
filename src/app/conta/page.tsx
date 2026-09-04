import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { getCustomer } from "@/lib/customer/session";
import { logout, updateProfile } from "@/lib/customer/auth";
import { AuthForm, Field } from "@/components/AuthForm";
import { brl } from "@/lib/money";
import { orderItems, STATUS_LABEL } from "@/lib/orders";
import { signedDownload } from "@/lib/storage";
import { Empty } from "@/components/Alert";

export const dynamic = "force-dynamic";
export const metadata = { title: "Minha conta", robots: { index: false } };

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function Conta() {
  const customer = await getCustomer();
  if (!customer) redirect("/entrar?next=/conta");

  const orders = await prisma.order.findMany({
    where: { OR: [{ customerId: customer.id }, { customerEmail: customer.email }] },
    orderBy: { createdAt: "desc" },
  });

  const paidOrders = orders.filter((o) => o.status === "pago" || o.status === "entregue");
  const productIds = [...new Set(paidOrders.flatMap((o) => orderItems(o).map((i) => i.productId)))];
  const products = productIds.length
    ? await prisma.product.findMany({ where: { id: { in: productIds } }, include: { files: true } })
    : [];

  const library = paidOrders.flatMap((o) =>
    orderItems(o).map((i) => ({ order: o, product: products.find((p) => p.id === i.productId), title: i.title })),
  ).filter((l) => l.product);

  return (
    <Chrome>
      <div className="wrap section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label text-accent">Minha conta</p>
            <h1 className="d-l text-paper mt-4">{customer.name || customer.email}</h1>
          </div>
          <form action={logout}><button className="btn btn-secondary btn-sm">Sair</button></form>
        </div>

        <section className="mt-14">
          <h2 className="d-m text-paper">Meus materiais</h2>
          <div className="mt-6">
            {library.length ? (
              <ul className="flex flex-col gap-3">
                {library.map((l, idx) => (
                  <li key={`${l.order.id}-${idx}`} className="surface rounded-[2px] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="d-nar text-paper text-[1.05rem]">{l.title}</p>
                        <p className="mono text-xs text-faint mt-1">Pedido {l.order.orderNumber}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {l.product!.files.map((f) => (
                          <a key={f.id} href={signedDownload(l.order.id, f.id)} className="btn btn-primary btn-sm">
                            Baixar {f.label}
                          </a>
                        ))}
                        {!l.product!.files.length && <span className="hint">Arquivo em preparação.</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="Você ainda não tem materiais."
                body="Depois que um pagamento for confirmado, tudo aparece aqui."
                action={<Link href="/loja" className="btn btn-primary">Ver a loja</Link>} />
            )}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="d-m text-paper">Meus pedidos</h2>
          {orders.length ? (
            <ul className="mt-6">
              {orders.map((o) => (
                <li key={o.id} className="grid gap-2 border-b border-black/10 py-4 sm:grid-cols-[150px_1fr_auto_auto] sm:items-center sm:gap-6">
                  <span className="mono text-sm text-accent">{o.orderNumber}</span>
                  <span className="text-sm text-muted">{fmt.format(o.createdAt)}</span>
                  <span className="pill text-muted justify-self-start">{STATUS_LABEL[o.status]}</span>
                  <Link href={`/pedido/${o.id}`} className="mono text-sm text-paper justify-self-start sm:justify-self-end hover:text-accent transition-colors">
                    {brl(o.totalCents)}
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="mt-6 text-muted">Nenhum pedido ainda.</p>}
        </section>

        <section className="mt-16 max-w-md">
          <h2 className="d-m text-paper">Meus dados</h2>
          <div className="surface mt-6 rounded-[2px] p-6">
            <AuthForm action={updateProfile} submitLabel="Salvar">
              <Field label="Nome" name="name" defaultValue={customer.name ?? ""} required />
              <Field label="WhatsApp" name="phone" defaultValue={customer.phone ?? ""} inputMode="tel" />
              <p className="hint">E-mail: {customer.email}</p>
            </AuthForm>
          </div>
        </section>
      </div>
    </Chrome>
  );
}
