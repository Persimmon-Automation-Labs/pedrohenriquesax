"use client";

import { useState } from "react";
import { PlayCircle } from "@phosphor-icons/react";
import { youtubeEmbed, youtubeThumb, youtubeId, YT_PLACEHOLDER_W, YT_QUALIDADES } from "@/lib/youtube";
import { mediaUrl } from "@/lib/media-url";

/**
 * Um player para as duas origens: YouTube e arquivo hospedado aqui.
 *
 * YouTube entra por fachada — mostra a capa e só carrega o player no clique.
 * Um embed normal traz ~1,3 MB de JavaScript e trava a thread principal antes
 * de alguém querer assistir; numa página com sete vídeos isso é a página
 * inteira. Até o clique, o custo é uma imagem.
 *
 * Arquivo próprio usa <video> nativo com `preload="none"`, que não baixa nada
 * até o play. Sem autoplay nos dois casos: o som é o argumento, e ninguém deve
 * levar um susto de saxofone ao abrir a página.
 */
export function VideoEmbed({
  url,
  title,
  poster = "",
  aspect = "",
  className = "",
  eager = false,
}: {
  url: string;
  title: string;
  poster?: string;
  /** "630/1120". Sem isto, com preload="none" o navegador não sabe o tamanho
   *  do vídeo antes do play e reserva uma caixa larga e baixa qualquer — o
   *  bloco pula de altura quando os metadados chegam. */
  aspect?: string;
  className?: string;
  eager?: boolean;
}) {
  const id = youtubeId(url);
  const [tocando, setTocando] = useState(false);
  const [nivel, setNivel] = useState(0);

  // ── Arquivo hospedado aqui (vertical, gravado no celular) ─────────────
  if (!id) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-surface ${className}`}
        style={aspect ? { aspectRatio: aspect.replace("/", " / ") } : undefined}
      >
        <video
          className="h-full w-full object-contain"
          src={mediaUrl(url)}
          poster={poster ? mediaUrl(poster) : undefined}
          controls
          preload="none"
          playsInline
        >
          Seu navegador não toca este vídeo.
        </video>
      </div>
    );
  }

  // ── YouTube, por fachada ──────────────────────────────────────────────
  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-surface ${className}`}>
      {tocando ? (
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
          onClick={() => setTocando(true)}
          aria-label={`Assistir: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
              botão de play precisa de contraste contra ela em qualquer tema.
              Por isso branco fixo, e não `text-paper`, que no tema claro é
              escuro e sumia contra a própria vinheta. */}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <PlayCircle
              size={68}
              weight="fill"
              className="text-white/90 drop-shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-[#89CFF0]"
            />
          </span>
        </button>
      )}
    </div>
  );
}
