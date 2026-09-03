"use client";

import { useState } from "react";
import { PlayCircle } from "@phosphor-icons/react";
import { youtubeEmbed, youtubeThumb } from "@/lib/youtube";

/**
 * Fachada de vídeo: mostra a capa e só carrega o player quando alguém clica.
 *
 * Um embed normal do YouTube traz ~1,3 MB de JavaScript e trava a thread
 * principal antes mesmo de a pessoa querer assistir. Numa página com cinco
 * vídeos isso é o site inteiro. Aqui o custo até o clique é uma imagem.
 *
 * Depois do clique o player entra com `autoplay=1` — quem clicou já pediu
 * para tocar, então não há um segundo clique. Domínio `-nocookie` para não
 * plantar rastreador em quem só passou pela página.
 */
export function VideoEmbed({
  id,
  title,
  className = "",
  eager = false,
}: {
  id: string;
  title: string;
  className?: string;
  eager?: boolean;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(() => youtubeThumb(id, true));

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-surface ${className}`}>
      {playing ? (
        <iframe
          src={`${youtubeEmbed(id)}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Assistir: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <img
            src={thumb}
            alt=""
            loading={eager ? "eager" : "lazy"}
            /* A capa do YouTube sempre chega em 16:9 ou 4:3; `cover` resolve as duas. */
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setThumb(youtubeThumb(id, false))}
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/10" />
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <PlayCircle
              size={68}
              weight="fill"
              className="text-paper/85 drop-shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-accent"
            />
          </span>
        </button>
      )}
    </div>
  );
}
