import type { MediaItem } from "@prisma/client";
import { Reveal } from "@/components/Reveal";
import { VideoEmbed } from "@/components/VideoEmbed";
import { youtubeId } from "@/lib/youtube";

/**
 * Vídeo colocado ao lado do que ele prova.
 *
 * A alternativa seria uma página "Mídia" com tudo junto — e é o que a maioria
 * dos sites de músico faz. Mas quem está contratando um casamento não vai
 * caçar, no meio de dezesseis vídeos, os que parecem um casamento; e quem quer
 * aula não se convence com um DVD de sertanejo. Cada página mostra a prova do
 * que aquela página está afirmando.
 *
 * O primeiro item pode entrar grande (`lead`); o resto vira grade. Todos usam
 * fachada, então cinco vídeos numa página custam cinco imagens, não cinco players.
 */
export function VideoSection({
  items,
  kicker,
  title,
  body,
  lead = false,
  level = "h2",
  id = "videos",
  className = "",
}: {
  items: MediaItem[];
  kicker: string;
  title: string;
  body?: string;
  lead?: boolean;
  level?: "h1" | "h2";
  id?: string;
  className?: string;
}) {
  const H = level;
  const playable = items.filter((m) => youtubeId(m.url));
  if (!playable.length) return null;

  const [first, ...rest] = playable;
  const grid = lead ? rest : playable;

  return (
    <section id={id} className={`section border-t border-white/10 ${className}`}>
      <div className="wrap">
        <Reveal>
          <p className="label text-accent">{kicker}</p>
          <H className="d-l text-paper mt-4">{title}</H>
          {body && <p className="mt-6 text-muted prose-w">{body}</p>}
        </Reveal>

        {lead && (
          <Reveal delay={80}>
            <figure className="mt-10">
              <VideoEmbed id={youtubeId(first.url)!} title={first.title} eager />
              <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="d-m text-paper">{first.title}</span>
                {first.credit && <span className="text-sm text-muted">{first.credit}</span>}
                {first.year && <span className="mono text-xs text-faint">{first.year}</span>}
              </figcaption>
            </figure>
          </Reveal>
        )}

        {grid.length > 0 && (
          <ul className={`grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 ${lead ? "mt-16" : "mt-12"}`}>
            {grid.map((m, i) => (
              <Reveal as="li" key={m.id} delay={Math.min(i * 60, 360)}>
                <figure>
                  <VideoEmbed id={youtubeId(m.url)!} title={m.title} />
                  <figcaption className="mt-3">
                    <p className="text-paper leading-snug">{m.title}</p>
                    {m.credit && <p className="mt-1 text-sm text-muted">{m.credit}</p>}
                    <p className="mt-1 flex gap-2 text-xs text-faint">
                      {m.year && <span className="mono">{m.year}</span>}
                      {m.year && m.duration && <span aria-hidden>·</span>}
                      {m.duration && <span className="mono">{m.duration}</span>}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
