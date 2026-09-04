import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { brl } from "@/lib/money";
import { STATUS_LABEL } from "@/lib/orders";
import { confirmPayment } from "@/app/admin/actions";

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function Dashboard() {
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const [pending, unread, paidMonth, shows] = await Promise.all([
    prisma.order.findMany({ where: { status: "aguardando_pagamento" }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.contactMessage.count({ where: { readAt: null } }),
    prisma.order.aggregate({ _sum: { totalCents: true }, _count: true, where: { status: { in: ["pago", "entregue"] }, paidAt: { gte: monthStart } } }),
    prisma.show.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 3 }),
  ]);

  return (
    <>
      <h1 className="d-l text-paper">Painel</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Aguardando confirmação", String(pending.length), pending.length ? "text-accent" : "text-paper"],
          ["Vendas do mês", brl(paidMonth._sum.totalCents ?? 0), "text-paper"],
          ["Mensagens não lidas", String(unread), unread ? "text-accent" : "text-paper"],
        ].map(([label, value, tone]) => (
          <div key={label} className="surface rounded-[2px] p-5">
            <p className="label text-faint">{label}</p>
            <p className={`mono text-2xl mt-2 ${tone}`}>{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="d-m text-paper">Pedidos aguardando pagamento</h2>
          <Link href="/admin/pedidos" className="label text-accent">Ver todos</Link>
        </div>
        {pending.length ? (
          <ul className="mt-5">
            {pending.map((o) => (
              <li key={o.id} className="grid gap-3 border-b border-black/10 py-4 sm:grid-cols-[130px_1fr_auto_auto] sm:items-center sm:gap-5">
                <Link href={`/admin/pedidos/${o.id}`} className="mono text-sm text-accent">{o.orderNumber}</Link>
                <div className="min-w-0">
                  <p className="text-sm text-paper truncate">{o.customerName}</p>
                  <p className="mono text-xs text-faint">{fmt.format(o.createdAt)}</p>
                </div>
                <span className="mono text-paper">{brl(o.totalCents)}</span>
                <form action={confirmPayment.bind(null, o.id)}>
                  <button className="btn btn-primary btn-sm w-full">Confirmar pagamento</button>
                </form>
              </li>
            ))}
          </ul>
        ) : <p className="mt-5 text-muted">Nenhum pedido aguardando. Tudo em dia.</p>}
      </section>

      {shows.length > 0 && (
        <section className="mt-12">
          <h2 className="d-m text-paper">Próximas apresentações</h2>
          <ul className="mt-5">
            {shows.map((s) => (
              <li key={s.id} className="flex items-baseline justify-between gap-4 border-b border-black/10 py-3">
                <span className="text-paper">{s.venue}</span>
                <span className="mono text-sm text-faint">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(s.date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
