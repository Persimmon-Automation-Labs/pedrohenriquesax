import { prisma } from "@/lib/prisma";
import { toggleMessageRead, deleteMessage } from "@/app/admin/actions";

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" });
const KIND: Record<string, string> = { evento: "Evento", mentoria: "Mentoria", geral: "Geral" };

export default async function Mensagens() {
  const msgs = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <>
      <h1 className="d-l text-paper">Mensagens</h1>
      {msgs.length ? (
        <ul className="mt-8 flex flex-col gap-3">
          {msgs.map((m) => {
            const p = m.payload as Record<string, string>;
            const fields = Object.entries(p).filter(([k, v]) => v && !["name", "email", "phone"].includes(k));
            return (
              <li key={m.id} className={`surface rounded-[2px] p-5 ${m.readAt ? "opacity-60" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="d-nar text-paper text-[1.05rem]">{m.name} <span className="pill text-accent ml-2">{KIND[m.kind]}</span></p>
                    <p className="mono text-xs text-faint mt-1">{m.email}{m.phone ? ` · ${m.phone}` : ""} · {fmt.format(m.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={toggleMessageRead.bind(null, m.id, !m.readAt)}>
                      <button className="btn btn-secondary btn-sm">{m.readAt ? "Marcar não lida" : "Marcar lida"}</button>
                    </form>
                    <form action={deleteMessage.bind(null, m.id)}>
                      <button className="btn btn-danger btn-sm">Excluir</button>
                    </form>
                  </div>
                </div>
                {fields.length > 0 && (
                  <dl className="mt-4 grid gap-2 border-t border-black/10 pt-4 sm:grid-cols-2">
                    {fields.map(([k, v]) => (
                      <div key={k}><dt className="label text-faint">{k}</dt><dd className="text-sm text-paper whitespace-pre-line">{v}</dd></div>
                    ))}
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      ) : <p className="mt-8 text-muted">Nenhuma mensagem ainda.</p>}
    </>
  );
}
