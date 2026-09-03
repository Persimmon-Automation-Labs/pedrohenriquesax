import { prisma } from "@/lib/prisma";
import { brl } from "@/lib/money";

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeZone: "America/Sao_Paulo" });

export default async function Clientes() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { orders: { where: { status: { in: ["pago", "entregue"] } } } },
  });
  return (
    <>
      <h1 className="d-l text-paper">Clientes</h1>
      {customers.length ? (
        <ul className="mt-8">
          {customers.map((c) => {
            const spent = c.orders.reduce((s, o) => s + o.totalCents, 0);
            return (
              <li key={c.id} className="grid gap-2 border-b border-white/10 py-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center sm:gap-5">
                <div className="min-w-0">
                  <p className="text-paper truncate">{c.name || "—"}</p>
                  <p className="mono text-xs text-faint truncate">{c.email}</p>
                </div>
                <span className="mono text-xs text-faint">{fmt.format(c.createdAt)}</span>
                <span className="mono text-sm text-muted">{c.orders.length} compra(s)</span>
                <span className="mono text-paper">{brl(spent)}</span>
              </li>
            );
          })}
        </ul>
      ) : <p className="mt-8 text-muted">Nenhum cliente cadastrado.</p>}
    </>
  );
}
