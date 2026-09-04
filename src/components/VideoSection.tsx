import Link from "next/link";
import type { MediaItem } from "@prisma/client";
import { youtubeId } from "@/lib/youtube";
import { Reveal } from "@/components/Reveal";
import { VideoEmbed } from "@/components/VideoEmbed";

/**
 * Vídeo colocado ao lado do que ele prova.
 *
 * O acervo inteiro mora em /videos. Aqui cada página mostra só o recorte que
 * interessa a quem está nela: quem contrata casamento não garimpa transcrição
 * de Mark Turner, e quem quer aula não se convence com DVD de sertanejo.
 *
 * Todos usam fachada, então cinco vídeos numa página custam cinco imagens.
 */
function Legenda({ item }: { item: MediaItem }) {
  return (
    <figcaption className="mt-3">
      <p className="text-paper leading-snug">{item.title}</p>
      {item.credit && <p className="mt-1 text-sm text-muted">{item.credit}</p>}
      {(item.year || item.duration) && (
        <p className="mt-1 flex gap-2 text-xs text-faint">
          {item.year && <span className="mono">{item.year}</span>}
          {item.year && item.duration && <span aria-hidden>·</span>}
          {item.duration && <span className="mono">{item.duration}</span>}
        </p>
      )}
    </figcaption>
  );
}

export function VideoSection({
  items, kicker, title, body, lead = false, level = "h2",
  id = "videos", className = "", verMais = false, sub = false,
}: {
  items: MediaItem[];
  kicker: string;
  title: string;
  body?: string;
  lead?: boolean;
  level?: "h1" | "h2";
  id?: string;
  className?: string;
  verMais?: boolean;
  /** Subseção de uma página que já tem título próprio (o acervo em /videos).
   *  Sem o par rótulo-de-acento + display grande, que repetido logo abaixo do
   *  h1 da página vira a mesma construção duas vezes seguidas. */
  sub?: boolean;
}) {
  const H = level;
  const playable = items.filter((m) => m.url);
  if (!playable.length) return null;

  const [first, ...rest] = playable;
  const grid = lead ? rest : playable;

  return (
    <section id={id} className={`${sub ? "section-sm" : "section border-t border-black/10"} ${className}`}>
      <div className="wrap">
        <Reveal>
          {sub ? (
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-black/10 pb-3">
              <H className="d-s text-paper">{title}</H>
              <span className="label text-faint">{kicker}</span>
            </div>
          ) : (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label text-accent">{kicker}</p>
                <H className="d-l text-paper mt-3">{title}</H>
              </div>
              {verMais && (
                <Link href="/videos" className="btn btn-secondary btn-sm">Ver todos os vídeos</Link>
              )}
            </div>
          )}
          {body && <p className="mt-5 text-muted prose-w">{body}</p>}
        </Reveal>

        {lead && (
          /* O destaque era largura inteira — grande demais numa tela de
             computador, e o título ficava ao lado do texto em vez de embaixo,
             diferente de todos os outros. Agora tem a mesma forma dos demais,
             só maior. */
          <Reveal delay={80}>
            <figure className="mt-8 max-w-2xl">
              <VideoEmbed url={first.url} poster={first.poster} title={first.title} eager />
              <Legenda item={first} />
            </figure>
          </Reveal>
        )}

        {grid.length > 0 && (
          <ul className={`grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 ${lead ? "mt-12" : sub ? "mt-6" : "mt-8"}`}>
            {grid.map((m, i) => (
              <Reveal as="li" key={m.id} delay={Math.min(i * 60, 360)}>
                <figure>
                  <VideoEmbed url={m.url} poster={m.poster} title={m.title}
                    aspect={youtubeId(m.url) ? "" : "630/1120"}
                    className={youtubeId(m.url) ? "" : "mx-auto max-w-[15rem]"} />
                  <Legenda item={m} />
                </figure>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
