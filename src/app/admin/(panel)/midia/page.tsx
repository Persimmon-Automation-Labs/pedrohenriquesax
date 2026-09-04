import { prisma } from "@/lib/prisma";
import {
  saveMedia, deleteMedia, toggleMediaFeatured, setMediaContext, moveMedia,
} from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field } from "@/components/Field";
import { youtubeId, youtubeThumb } from "@/lib/youtube";
import type { MediaContext } from "@prisma/client";

const ONDE: [MediaContext, string][] = [
  ["eventos", "Eventos"],
  ["jazz", "Big band e jazz"],
  ["estudo", "Estudo / mentoria"],
];

/**
 * O painel dos vídeos. Tudo o que decide onde um vídeo aparece está aqui:
 * a página, a ordem e a caixa de destaque, que é o que escolhe o que vai
 * para a home. Nada disso exige mexer em código.
 */
export default async function Midia() {
  const items = await prisma.mediaItem.findMany({
    orderBy: [{ sortOrder: "asc" }],
  });
  const naHome = items.filter((m) => m.featured);

  return (
    <>
      <h1 className="d-l text-paper">Vídeos e áudio</h1>
      <p className="mt-4 text-muted prose-w">
        Todos os vídeos aparecem em <strong className="text-paper">/videos</strong>. A página escolhida
        manda o vídeo também para a página correspondente. Os marcados como{" "}
        <strong className="text-paper">destaque</strong> são os que aparecem na home.
      </p>

      {/* A ordem da home se edita aqui, entre os vídeos da home — e não
          empurrando cada um por cima da lista inteira. */}
      <section className="surface mt-8 rounded-[2px] p-6">
        <h2 className="d-s text-paper">Na home, nesta ordem</h2>
        {naHome.length ? (
          <ol className="mt-4 flex flex-col gap-2">
            {naHome.map((m, i) => (
              <li key={m.id} className="card flex items-center gap-3 p-3">
                <span className="mono w-6 shrink-0 text-center text-sm text-faint">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-paper">{m.title}</span>
                <span className="hidden truncate text-xs text-faint sm:block">{m.credit}</span>
                <form action={moveMedia.bind(null, m.id, "up", "destaque")}>
                  <button className="btn btn-ghost btn-sm" disabled={i === 0} title="Subir na home">↑</button>
                </form>
                <form action={moveMedia.bind(null, m.id, "down", "destaque")}>
                  <button className="btn btn-ghost btn-sm" disabled={i === naHome.length - 1} title="Descer na home">↓</button>
                </form>
                <form action={toggleMediaFeatured.bind(null, m.id)}>
                  <button className="btn btn-ghost btn-sm text-danger" title="Tirar da home">Tirar</button>
                </form>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-muted">
            Nenhum vídeo na home. Marque um como destaque na lista abaixo.
          </p>
        )}
      </section>

      <div className="surface mt-8 rounded-[2px] p-6">
        <AdminForm action={saveMedia} submitLabel="Adicionar">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Título" name="title" required />
            <div className="field">
              <label htmlFor="kind">Tipo</label>
              <select id="kind" name="kind" className="select">
                <option value="video">Vídeo</option>
                <option value="audio">Áudio</option>
              </select>
            </div>
          </div>
          <Field label="Link" name="url" required hint="Link do YouTube, ou endereço direto do áudio." />
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="field">
              <label htmlFor="context">Onde aparece</label>
              <select id="context" name="context" className="select" defaultValue="jazz">
                {ONDE.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <Field label="Com quem / onde" name="credit" hint="Ex.: Orquestra Jovem Tom Jobim" />
            <div className="grid grid-cols-2 gap-5">
              <Field label="Ano" name="year" />
              <Field label="Duração" name="duration" hint="3:55" />
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 text-sm text-muted">
            <input type="checkbox" name="featured" className="h-4 w-4 accent-[#1B6E8C]" /> Mostrar na home
          </label>
        </AdminForm>
      </div>

      {items.length ? (
        <ul className="mt-8 flex flex-col gap-2">
          {items.map((m, i) => {
            const yid = youtubeId(m.url);
            return (
              <li key={m.id} className="card flex flex-wrap items-center gap-4 p-3">
                {yid ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={youtubeThumb(yid, 2)} alt="" width={96} height={54}
                       className="h-[54px] w-24 shrink-0 rounded-[2px] object-cover" />
                ) : (
                  <div className="h-[54px] w-24 shrink-0 rounded-[2px] bg-black/5" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-paper">{m.title}</p>
                  <p className="truncate text-xs text-faint">
                    {[m.credit, m.year, m.duration].filter(Boolean).join(" · ") || m.url}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {ONDE.map(([v, l]) => (
                    <form key={v} action={setMediaContext.bind(null, m.id, v)}>
                      <button
                        className={`btn btn-sm ${m.context === v ? "btn-primary" : "btn-ghost"}`}
                        title={`Mover para ${l}`}
                      >
                        {l}
                      </button>
                    </form>
                  ))}
                </div>

                <form action={toggleMediaFeatured.bind(null, m.id)}>
                  <button className={`btn btn-sm ${m.featured ? "btn-primary" : "btn-secondary"}`}>
                    {m.featured ? "Na home" : "Fora da home"}
                  </button>
                </form>

                <div className="flex gap-1">
                  <form action={moveMedia.bind(null, m.id, "up", "tudo")}>
                    <button className="btn btn-ghost btn-sm" disabled={i === 0} title="Subir">↑</button>
                  </form>
                  <form action={moveMedia.bind(null, m.id, "down", "tudo")}>
                    <button className="btn btn-ghost btn-sm" disabled={i === items.length - 1} title="Descer">↓</button>
                  </form>
                  <form action={deleteMedia.bind(null, m.id)}>
                    <button className="btn btn-ghost btn-sm text-danger" title="Remover">Remover</button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-8 text-muted">Nada cadastrado.</p>
      )}
    </>
  );
}
