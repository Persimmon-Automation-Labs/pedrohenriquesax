"use client";

import { useState } from "react";
import { PlayCircle } from "@phosphor-icons/react";
import { youtubeEmbed, youtubeThumb, YT_PLACEHOLDER_W, YT_QUALIDADES } from "@/lib/youtube";

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
  const [nivel, setNivel] = useState(0);

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
            src={youtubeThumb(id, nivel)}
            alt=""
            loading={eager ? "eager" : "lazy"}
            /* A capa do YouTube sempre chega em 16:9 ou 4:3; `cover` resolve as duas. */
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setNivel((n) => Math.min(n + 1, YT_QUALIDADES.length - 1))}
            /* O 404 do YouTube vem com um JPEG cinza de 120×90 que carrega sem
               disparar erro — só a largura denuncia. Vídeo antigo pode não ter
               nem maxres nem sd, então desce até o hqdefault, que existe sempre. */
            onLoad={(e) => {
              if (e.currentTarget.naturalWidth <= YT_PLACEHOLDER_W) {
                setNivel((n) => Math.min(n + 1, YT_QUALIDADES.length - 1));
              }
            }}
          />
          {/* Escurece a foto, não a página: a capa é sempre uma imagem, e o
              botão de play precisa de contraste contra ela em qualquer tema. */}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <PlayCircle
              size={68}
              weight="fill"
              className="text-paper/80 drop-shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-accent"
            />
          </span>
        </button>
      )}
    </div>
  );
}
