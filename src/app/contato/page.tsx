import type { Metadata } from "next";
import Image from "next/image";
import {
  InstagramLogo, TiktokLogo, YoutubeLogo, SpotifyLogo, LinkedinLogo,
  WhatsappLogo, EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import { mediaUrl } from "@/lib/media-url";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { PageHeader } from "@/components/PageHeader";
import { RequestForm } from "@/components/RequestForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com Pedro Lucena: contratação de eventos, mentoria, imprensa e assessoria.",
};

/**
 * Uma página, um caminho.
 *
 * Antes havia três coisas disputando a mesma atenção: um botão de WhatsApp no
 * topo, um formulário no meio e uma lista de atalhos que levava de volta para
 * páginas que já tinham formulário. A pessoa tinha que rolar para descobrir o
 * que queria. Agora o formulário é a página, e o contato direto fica ao lado
 * como alternativa — não como concorrente.
 */
export default async function Contato() {
  const s = await getSettings();
  const wa = s.whatsapp.replace(/\D/g, "");
  const waHref = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent("Olá, Pedro! Vim pelo site.")}`
    : "";

  const redes = ([
    ["Instagram", s.instagramUrl, InstagramLogo],
    ["TikTok", s.tiktokUrl, TiktokLogo],
    ["YouTube", s.youtubeUrl, YoutubeLogo],
    ["Spotify", s.spotifyUrl, SpotifyLogo],
    ["LinkedIn", s.linkedinUrl, LinkedinLogo],
  ] as const).filter(([, u]) => !!u);

  return (
    <Chrome>
      <PageHeader kicker="Falar comigo" title="Contato" />

      <div className="wrap section section-first grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-14">
        <div className="surface rounded-[2px] p-6 md:p-8">
          <RequestForm defaultTipo="evento" />
        </div>

        <aside className="flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <p className="label text-faint">Direto</p>
            {s.whatsapp && (
              <a
                href={waHref}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-3 text-muted transition-colors hover:text-paper"
              >
                <WhatsappLogo size={19} aria-hidden className="shrink-0 text-faint" />
                <span>{s.whatsapp}</span>
              </a>
            )}
            {s.email && (
              <a
                href={`mailto:${s.email}`}
                className="inline-flex min-h-[44px] items-center gap-3 break-all text-muted transition-colors hover:text-paper"
              >
                <EnvelopeSimple size={19} aria-hidden className="shrink-0 text-faint" />
                <span>{s.email}</span>
              </a>
            )}
          </div>

          {redes.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="label text-faint">Redes</p>
              <div className="flex flex-wrap items-center gap-1">
                {redes.map(([label, url, Icon]) => (
                  <a
                    key={label} href={url} target="_blank" rel="noopener noreferrer"
                    aria-label={label} title={label}
                    className="inline-flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-accent"
                  >
                    <Icon size={22} weight="fill" aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          )}

          {s.contactImageUrl && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] group">
              <Image
                src={mediaUrl(s.contactImageUrl)} alt={s.name} fill
                sizes="(max-width:1024px) 100vw, 300px"
                className="object-cover zoom-img"
              />
            </div>
          )}
        </aside>
      </div>
    </Chrome>
  );
}
