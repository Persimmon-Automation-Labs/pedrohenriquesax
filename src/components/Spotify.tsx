"use client";

import { useState } from "react";
import { SpotifyLogo } from "@phosphor-icons/react";
import { Reveal } from "@/components/Reveal";

/**
 * A playlist de gravações em que o Pedro tocou.
 *
 * Mesma regra dos vídeos: fachada. O iframe do Spotify carrega o player
 * inteiro, e ninguém deve pagar por isso só por rolar a página — entra no
 * clique. Até lá é um botão.
 *
 * É a única prova no site de trabalho de estúdio: as credenciais dizem com
 * quem ele gravou, e aqui dá para ouvir.
 */
export function Spotify({
  playlistId,
  kicker = "Ouvir",
  title = "Gravações em que toquei",
  body,
}: {
  playlistId: string;
  kicker?: string;
  title?: string;
  body?: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <section id="spotify" className="section border-t border-black/10">
      <div className="wrap">
        <Reveal>
          <p className="label text-accent">{kicker}</p>
          <h2 className="d-l text-paper mt-3">{title}</h2>
          {body && <p className="mt-5 text-muted prose-w">{body}</p>}
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 max-w-2xl">
            {aberto ? (
              <iframe
                title="Playlist no Spotify: gravações em que Pedro Lucena tocou"
                src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
                width="100%"
                height="420"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-[2px] border border-black/10"
              />
            ) : (
              <button
                type="button"
                onClick={() => setAberto(true)}
                className="card flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-black/[0.03]"
              >
                <SpotifyLogo size={40} weight="fill" aria-hidden className="shrink-0 text-accent" />
                <span className="flex flex-col">
                  <span className="text-paper">Abrir a playlist no Spotify</span>
                  <span className="text-sm text-muted">
                    Carrega o player aqui mesmo, sem sair do site.
                  </span>
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
