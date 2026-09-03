import Link from "next/link";
import type { Settings } from "@/lib/settings";

const SOCIALS = (s: Settings) =>
  [
    ["Instagram", s.instagramUrl], ["YouTube", s.youtubeUrl], ["Spotify", s.spotifyUrl],
    ["TikTok", s.tiktokUrl], ["LinkedIn", s.linkedinUrl],
  ].filter(([, url]) => !!url) as [string, string][];

export function SiteFooter({ settings: s }: { settings: Settings }) {
  const socials = SOCIALS(s);
  const wa = s.whatsapp.replace(/\D/g, "");
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="wrap py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="d-l text-paper">{s.name}</p>
            <p className="mt-3 text-muted prose-w">{s.tagline}{s.city ? ` · ${s.city}` : ""}</p>
            <Link href="/eventos" className="btn btn-primary mt-7">Contratar</Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="label text-faint">Contato</p>
            {s.email && <a href={`mailto:${s.email}`} className="text-muted hover:text-paper transition-colors break-all">{s.email}</a>}
            {s.whatsapp && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-paper transition-colors">{s.whatsapp}</a>}
          </div>

          <div className="flex flex-col gap-3">
            <p className="label text-faint">Redes</p>
            {socials.length ? socials.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-paper transition-colors">{label}</a>
            )) : <span className="text-faint text-sm">Em breve</span>}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="mono text-xs text-faint">© {new Date().getFullYear()} {s.name}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/sobre" className="label text-faint hover:text-muted transition-colors">Sobre</Link>
            <Link href="/loja" className="label text-faint hover:text-muted transition-colors">Loja</Link>
            <Link href="/contato" className="label text-faint hover:text-muted transition-colors">Contato</Link>
            <Link href="/conta" className="label text-faint hover:text-muted transition-colors">Minha conta</Link>
            <Link href="/privacidade" className="label text-faint hover:text-muted transition-colors">Privacidade</Link>
            <Link href="/termos" className="label text-faint hover:text-muted transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
