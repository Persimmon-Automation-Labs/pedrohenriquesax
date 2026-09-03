import { prisma } from "@/lib/prisma";
import { saveMedia, deleteMedia } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field } from "@/components/Field";

export default async function Midia() {
  const items = await prisma.mediaItem.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }] });
  return (
    <>
      <h1 className="d-l text-paper">Vídeos e áudio</h1>
      <p className="mt-4 text-muted prose-w">A seção fica oculta no site enquanto não houver nenhum item aqui.</p>
      <div className="surface mt-8 rounded-[2px] p-6">
        <AdminForm action={saveMedia} submitLabel="Adicionar">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Título" name="title" required />
            <div className="field">
              <label htmlFor="kind">Tipo</label>
              <select id="kind" name="kind" className="select"><option value="video">Vídeo</option><option value="audio">Áudio</option></select>
            </div>
          </div>
          <Field label="Link" name="url" required hint="Link do YouTube, ou endereço direto do áudio." />
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="field">
              <label htmlFor="context">Onde aparece</label>
              <select id="context" name="context" className="select" defaultValue="jazz">
                <option value="eventos">Eventos — página de contratação</option>
                <option value="jazz">Jazz e big band — página Sobre e home</option>
                <option value="estudo">Estudo — página da mentoria</option>
              </select>
            </div>
            <Field label="Com quem / onde" name="credit" hint="Ex.: Orquestra Jovem Tom Jobim" />
            <div className="grid grid-cols-2 gap-5">
              <Field label="Ano" name="year" />
              <Field label="Duração" name="duration" hint="3:55" />
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm text-muted cursor-pointer">
            <input type="checkbox" name="featured" className="h-4 w-4 accent-[#4FA8C4]" /> Destaque na home
          </label>
        </AdminForm>
      </div>
      {items.length ? (
        <ul className="mt-8">
          {items.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-4 border-b border-white/10 py-3">
              <div className="min-w-0">
                <p className="text-paper truncate">{m.title} {m.featured && <span className="pill text-accent ml-2">Destaque</span>}</p>
                <p className="mono text-xs text-faint truncate">{m.url}</p>
              </div>
              <form action={deleteMedia.bind(null, m.id)}>
                <button className="btn btn-ghost btn-sm text-danger"><span className="label">Remover</span></button>
              </form>
            </li>
          ))}
        </ul>
      ) : <p className="mt-8 text-muted">Nada cadastrado.</p>}
    </>
  );
}
