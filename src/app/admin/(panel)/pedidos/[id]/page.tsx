import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { brl } from "@/lib/money";
import { orderItems, STATUS_LABEL } from "@/lib/orders";
import { confirmPayment, setOrderStatus } from "@/app/admin/actions";

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function PedidoAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await prisma.order.findUnique({ where: { id } });
  if (!o) notFound();
  const items = orderItems(o);

  return (
    <>
      <Link href="/admin/pedidos" className="label text-faint hover:text-muted">← Pedidos</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-accent">{o.orderNumber}</p>
          <h1 className="d-l text-paper mt-2">{brl(o.totalCents)}</h1>
        </div>
        <span className="pill text-muted">{STATUS_LABEL[o.status]}</span>
      </div>

      {o.status === "aguardando_pagamento" && (
        <div className="surface mt-8 rounded-[2px] p-6">
          <p className="d-m text-paper">Confirmar pagamento</p>
          <p className="hint mt-2 max-w-prose">
            Confira se o Pix de <strong className="text-paper">{brl(o.totalCents)}</strong> caiu no seu extrato,
            com a referência <strong className="text-paper">{o.orderNumber}</strong>. Confirmar libera o download
            na conta do cliente e dispara o e-mail de acesso.
          </p>
          <form action={confirmPayment.bind(null, o.id)} className="mt-5">
            <button className="btn btn-primary">Confirmar pagamento</button>
          </form>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="surface rounded-[2px] p-6">
          <p className="label text-faint">Itens</p>
          <ul className="mt-4 flex flex-col gap-2">
            {items.map((i) => (
              <li key={i.productId} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-paper">{i.title}</span>
                <span className="mono text-muted">{brl(i.priceCents)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-black/10 pt-4">
            <span className="label text-faint">Total</span>
            <span className="mono text-lg text-paper">{brl(o.totalCents)}</span>
          </div>
        </section>

        <section className="surface rounded-[2px] p-6">
          <p className="label text-faint">Comprador</p>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            {[["Nome", o.customerName], ["E-mail", o.customerEmail], ["WhatsApp", o.customerPhone || "—"],
              ["CPF", o.customerCpf || "—"], ["Downloads", String(o.downloadCount)]].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <dt className="text-faint">{k}</dt><dd className="text-paper text-right break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {o.pixPayload && (
        <section className="surface mt-6 rounded-[2px] p-6">
          <p className="label text-faint">Código Pix gerado</p>
          <p className="mono mt-3 break-all text-[0.68rem] leading-relaxed text-accent">{o.pixPayload}</p>
        </section>
      )}

      <section className="mt-6">
        <p className="label text-faint">Histórico</p>
        <ul className="mt-3 flex flex-col gap-1 text-sm text-muted">
          <li>Criado em {fmt.format(o.createdAt)}</li>
          {o.paidAt && <li>Pago em {fmt.format(o.paidAt)}{o.paidBy ? ` · confirmado por ${o.paidBy}` : ""}</li>}
        </ul>
      </section>

      {o.status !== "cancelado" && o.status !== "reembolsado" && (
        <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
          <form action={setOrderStatus.bind(null, o.id, "cancelado")}>
            <button className="btn btn-danger btn-sm">Cancelar pedido</button>
          </form>
          {(o.status === "pago" || o.status === "entregue") && (
            <form action={setOrderStatus.bind(null, o.id, "reembolsado")}>
              <button className="btn btn-danger btn-sm">Marcar reembolsado</button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
