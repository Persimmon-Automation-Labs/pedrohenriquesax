import type { MediaItem } from "@prisma/client";
import { Reveal } from "@/components/Reveal";

function embed(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return null;
}

/** Oculta automaticamente se não houver material — vídeo e áudio ainda não existem. */
export function Media({ items }: { items: MediaItem[] }) {
  if (!items.length) return null;
  const [featured, ...rest] = items;
  const fe = embed(featured.url);
  return (
    <section id="midia" className="section border-t border-white/10">
      <div className="wrap">
        <Reveal>
          <p className="label text-accent">Ouvir e assistir</p>
          <h2 className="d-l text-paper mt-4">Vídeos e áudio</h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-10 aspect-video w-full overflow-hidden rounded-[2px] surface">
            {fe ? (
              <iframe src={fe} title={featured.title} allowFullScreen loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                className="h-full w-full border-0" />
            ) : (
              <audio controls src={featured.url} className="w-full mt-6 px-6">
                <track kind="captions" />
              </audio>
            )}
          </div>
        </Reveal>
        {rest.length > 0 && (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((m, i) => {
              const e = embed(m.url);
              return (
                <Reveal as="li" key={m.id} delay={i * 60}>
                  <div className="aspect-video w-full overflow-hidden rounded-[2px] surface">
                    {e ? (
                      <iframe src={e} title={m.title} allowFullScreen loading="lazy" className="h-full w-full border-0" />
                    ) : (
                      <div className="flex h-full items-center p-4"><audio controls src={m.url} className="w-full" /></div>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-muted">{m.title}</p>
                </Reveal>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
