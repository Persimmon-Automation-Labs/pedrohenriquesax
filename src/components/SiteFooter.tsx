import Link from "next/link";
import {
  InstagramLogo, TiktokLogo, YoutubeLogo, SpotifyLogo, LinkedinLogo,
  WhatsappLogo, EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import type { Settings } from "@/lib/settings";

/**
 * Rodapé.
 *
 * Sem botão de contratar: já existe no cabeçalho e no herói, e um terceiro só
 * dividia a atenção. As redes viram ícone puro — "Instagram" escrito por
 * extenso não diz nada que o ícone não diga. Telefone e e-mail ganham ícone
 * mas mantêm o texto, porque ali o dado *é* o conteúdo: a pessoa quer ler,
 * copiar e discar.
 */
const REDES = (s: Settings) =>
  ([
    ["Instagram", s.instagramUrl, InstagramLogo],
    ["TikTok", s.tiktokUrl, TiktokLogo],
    ["YouTube", s.youtubeUrl, YoutubeLogo],
    ["Spotify", s.spotifyUrl, SpotifyLogo],
    ["LinkedIn", s.linkedinUrl, LinkedinLogo],
  ] as const).filter(([, url]) => !!url);

export function SiteFooter({ settings: s }: { settings: Settings }) {
  const redes = REDES(s);
  const wa = s.whatsapp.replace(/\D/g, "");

  return (
    <footer className="chrome-bottom border-t border-black/10">
      <div className="wrap py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:gap-12">
          <div>
            <p className="d-m text-paper">{s.name}</p>
            <p className="mt-2 text-sm text-muted">
              {s.tagline}{s.city ? ` · ${s.city}` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {s.whatsapp && (
              <a
                href={`https://wa.me/${wa}?text=${encodeURIComponent("Olá, Pedro! Vim pelo site.")}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-3 text-muted transition-colors hover:text-paper"
              >
                <WhatsappLogo size={19} weight="regular" aria-hidden className="shrink-0 text-faint" />
                <span>{s.whatsapp}</span>
              </a>
            )}
            {s.email && (
              <a
                href={`mailto:${s.email}`}
                className="inline-flex min-h-[44px] items-center gap-3 break-all text-muted transition-colors hover:text-paper"
              >
                <EnvelopeSimple size={19} weight="regular" aria-hidden className="shrink-0 text-faint" />
                <span>{s.email}</span>
              </a>
            )}

            {redes.length > 0 && (
              <div className="mt-1 flex flex-wrap items-center gap-1">
                {redes.map(([label, url, Icon]) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="inline-flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-accent"
                  >
                    <Icon size={22} weight="fill" aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-xs text-faint">© {new Date().getFullYear()} {s.name}</p>
          <div className="flex flex-wrap gap-x-6">
            {[["/sobre", "Sobre"], ["/contato", "Contato"], ["/conta", "Minha conta"],
              ["/privacidade", "Privacidade"], ["/termos", "Termos"]].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="label inline-flex min-h-[44px] items-center text-faint transition-colors hover:text-muted"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
