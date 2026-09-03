import { prisma } from "@/lib/prisma";
import { saveShow, deleteShow } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field } from "@/components/Field";

const fmt = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "America/Sao_Paulo" });

export default async function Agenda() {
  const shows = await prisma.show.findMany({ orderBy: { date: "desc" } });
  return (
    <>
      <h1 className="d-l text-paper">Agenda</h1>
      <div className="surface mt-8 rounded-[2px] p-6">
        <AdminForm action={saveShow} submitLabel="Adicionar apresentação">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Data" name="date" type="datetime-local" required />
            <Field label="Local" name="venue" required placeholder="Blue Note São Paulo" />
            <Field label="Cidade" name="city" placeholder="São Paulo" />
            <Field label="Link de ingressos" name="url" />
          </div>
        </AdminForm>
      </div>
      {shows.length ? (
        <ul className="mt-8">
          {shows.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 border-b border-white/10 py-3">
              <div>
                <p className="text-paper">{s.venue}</p>
                <p className="mono text-xs text-faint">{fmt.format(s.date)} · {s.city}</p>
              </div>
              <form action={deleteShow.bind(null, s.id)}>
                <button className="btn btn-ghost btn-sm text-danger"><span className="label">Remover</span></button>
              </form>
            </li>
          ))}
        </ul>
      ) : <p className="mt-8 text-muted">Nenhuma apresentação cadastrada.</p>}
    </>
  );
}
