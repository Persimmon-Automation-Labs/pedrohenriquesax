import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { brl } from "@/lib/money";
import { STATUS_LABEL } from "@/lib/orders";
import { confirmPayment } from "@/app/admin/actions";

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });
const ALL = ["todos", "aguardando_pagamento", "pago", "entregue", "cancelado", "reembolsado", "expirado"] as const;

export default async function Pedidos({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const s = (await searchParams).s ?? "todos";
  const orders = await prisma.order.findMany({
    where: s !== "todos" ? { status: s as never } : undefined,
    orderBy: { createdAt: "desc" }, take: 200,
  });

  return (
    <>
      <h1 className="d-l text-paper">Pedidos</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {ALL.map((k) => (
          <Link key={k} href={`/admin/pedidos?s=${k}`}
            className={`pill transition-colors ${s === k ? "text-accent" : "text-faint hover:text-muted"}`}>
            {k === "todos" ? "Todos" : STATUS_LABEL[k]}
          </Link>
        ))}
      </div>

      {orders.length ? (
        <ul className="mt-8">
          {orders.map((o) => (
            <li key={o.id} className="grid gap-3 border-b border-black/10 py-4 sm:grid-cols-[130px_1fr_130px_auto_auto] sm:items-center sm:gap-5">
              <Link href={`/admin/pedidos/${o.id}`} className="mono text-sm text-accent">{o.orderNumber}</Link>
              <div className="min-w-0">
                <p className="text-sm text-paper truncate">{o.customerName}</p>
                <p className="mono text-xs text-faint">{fmt.format(o.createdAt)}</p>
              </div>
              <span className="pill text-muted justify-self-start">{STATUS_LABEL[o.status]}</span>
              <span className="mono text-paper">{brl(o.totalCents)}</span>
              {o.status === "aguardando_pagamento" ? (
                <form action={confirmPayment.bind(null, o.id)}>
                  <button className="btn btn-primary btn-sm w-full">Confirmar</button>
                </form>
              ) : <span />}
            </li>
          ))}
        </ul>
      ) : <p className="mt-8 text-muted">Nenhum pedido nesta situação.</p>}
    </>
  );
}
