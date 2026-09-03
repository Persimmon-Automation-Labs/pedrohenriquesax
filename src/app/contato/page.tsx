import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com Pedro Lucena: contratação de eventos, mentoria, imprensa e assessoria.",
};

export default async function Contato() {
  const s = await getSettings();
  const wa = s.whatsapp.replace(/\D/g, "");
  const redes = ([["Instagram", s.instagramUrl], ["YouTube", s.youtubeUrl], ["Spotify", s.spotifyUrl],
    ["TikTok", s.tiktokUrl], ["LinkedIn", s.linkedinUrl]] as [string, string][]).filter(([, u]) => u);

  return (
    <Chrome>
      <PageHeader kicker="Falar comigo" title="Contato"
        lead="Para contratar um evento, o caminho mais rápido é o WhatsApp. Para imprensa, assessoria ou qualquer outro assunto, use o formulário." />

      <div className="wrap section pt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-16">
        <div className="surface rounded-[2px] p-6 md:p-8">
          <p className="d-m text-paper mb-6">Mandar uma mensagem</p>
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="label text-faint">Direto</p>
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">WhatsApp</a>}
            {s.email && <a href={`mailto:${s.email}`} className="text-muted hover:text-paper transition-colors break-all">{s.email}</a>}
          </div>

          <div className="flex flex-col gap-2">
            <p className="label text-faint">Atalhos</p>
            <Link href="/eventos" className="link-underline">Orçamento de evento</Link>
            <Link href="/mentoria" className="link-underline">Inscrição na mentoria</Link>
          </div>

          {redes.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="label text-faint">Redes</p>
              {redes.map(([l, u]) => (
                <a key={l} href={u} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-paper transition-colors">{l}</a>
              ))}
            </div>
          )}
        </aside>
      </div>
    </Chrome>
  );
}
