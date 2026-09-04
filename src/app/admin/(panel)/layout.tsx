import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/session";
import { adminLogout } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "Painel", robots: { index: false, follow: false } };

const NAV: [string, string][] = [
  ["/admin", "Painel"],
  ["/admin/pedidos", "Pedidos"],
  ["/admin/produtos", "Produtos"],
  ["/admin/clientes", "Clientes"],
  ["/admin/mensagens", "Mensagens"],
  ["/admin/credenciais", "Credenciais"],
  ["/admin/agenda", "Agenda"],
  ["/admin/galeria", "Galeria"],
  ["/admin/midia", "Vídeos e áudio"],
  ["/admin/conteudo", "Textos"],
  ["/admin/configuracoes", "Configurações"],
];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const [pendingOrders, unread] = await Promise.all([
    prisma.order.count({ where: { status: "aguardando_pagamento" } }),
    prisma.contactMessage.count({ where: { readAt: null } }),
  ]);

  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-b border-black/10 lg:border-b-0 lg:border-r lg:min-h-[100dvh]">
        <div className="p-6">
          <Link href="/" className="d-nar text-paper" style={{ fontVariationSettings: '"wdth" 112,"wght" 700', fontSize: ".9rem" }}>
            Pedro Lucena
          </Link>
          <p className="mono text-[0.65rem] text-faint mt-1">painel</p>
        </div>
        <nav className="flex flex-wrap gap-1 px-3 pb-4 lg:flex-col">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="label flex items-center justify-between gap-2 rounded-[2px] px-3 py-2.5 text-muted hover:bg-black/5 hover:text-paper transition-colors">
              <span>{label}</span>
              {href === "/admin/pedidos" && pendingOrders > 0 && (
                <span className="mono text-[0.6rem] bg-accent text-ink rounded-[2px] px-1.5">{pendingOrders}</span>
              )}
              {href === "/admin/mensagens" && unread > 0 && (
                <span className="mono text-[0.6rem] bg-accent text-ink rounded-[2px] px-1.5">{unread}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="px-6 pb-6 pt-2">
          <p className="hint truncate">{admin.email}</p>
          <form action={adminLogout}><button className="btn btn-secondary btn-sm mt-3 w-full">Sair</button></form>
        </div>
      </aside>
      <main className="p-6 md:p-10 max-w-[1100px]">{children}</main>
    </div>
  );
}
