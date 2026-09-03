import { prisma } from "@/lib/prisma";
import { saveCredential, deleteCredential } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field } from "@/components/Field";

const GROUPS: [string, string][] = [
  ["big_band", "Big bands e orquestras"], ["jazz_internacional", "Jazz internacional"],
  ["pop_nacional", "Pop nacional"], ["festival", "Festivais"],
];

export default async function Credenciais() {
  const items = await prisma.credential.findMany({ orderBy: [{ context: "asc" }, { sortOrder: "asc" }] });
  return (
    <>
      <h1 className="d-l text-paper">Credenciais</h1>
      <p className="mt-4 text-muted prose-w">Com quem você já tocou. É a seção que sustenta o seu cachê.</p>

      <div className="surface mt-8 rounded-[2px] p-6">
        <AdminForm action={saveCredential} submitLabel="Adicionar">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Artista ou grupo" name="artist" required placeholder="Guinga" />
            <div className="field">
              <label htmlFor="context">Contexto</label>
              <select id="context" name="context" className="select">
                {GROUPS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <Field label="Período" name="year" placeholder="2021—2025" />
            <Field label="Observação" name="note" placeholder="Orquestra Jovem Tom Jobim" />
          </div>
        </AdminForm>
      </div>

      {GROUPS.map(([key, label]) => {
        const list = items.filter((i) => i.context === key);
        if (!list.length) return null;
        return (
          <section key={key} className="mt-10">
            <p className="label text-faint border-b border-white/10 pb-2">{label}</p>
            <ul className="mt-3">
              {list.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 border-b border-white/[0.07] py-3">
                  <div className="min-w-0">
                    <p className="d-nar text-paper text-[1rem]">{c.artist}</p>
                    {(c.note || c.year) && <p className="text-xs text-faint mt-0.5">{[c.note, c.year].filter(Boolean).join(" · ")}</p>}
                  </div>
                  <form action={deleteCredential.bind(null, c.id)}>
                    <button className="btn btn-ghost btn-sm text-danger"><span className="label">Remover</span></button>
                  </form>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
