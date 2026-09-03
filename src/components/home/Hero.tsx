import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/lib/settings";
import { mediaUrl } from "@/lib/media-url";

/**
 * Herói dividido 7fr / 5fr. Não centralizado — as referências que centralizam
 * (Braxton, Grace Kelly) dependem de uma composição pesada que o Pedro não tem.
 * Máximo 4 elementos de texto: rótulo, nome, uma linha, dois CTAs.
 */
export function Hero({ settings: s }: { settings: Settings }) {
  const wa = s.whatsapp.replace(/\D/g, "");
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Retrato sangrado à direita */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[62%] lg:w-[56%]">
        {s.heroImageUrl ? (
          <Image
            src={mediaUrl(s.heroImageUrl)}
            alt={`${s.name} tocando saxofone`}
            fill priority sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-[center_22%]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-bl from-[#1d2f36] via-[#141b1f] to-ink" />
        )}
      </div>
      <div className="absolute inset-0 hero-scrim" />

      <div className="wrap relative z-10 w-full">
        <div className="grid lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 pt-24 pb-16 md:py-20">
            <p className="label text-accent rise" style={{ animationDelay: "60ms" }}>
              {s.tagline}{s.city ? ` · ${s.city}` : ""}
            </p>

            <h1 className="d-xl text-paper rise" style={{ animationDelay: "140ms" }}>
              {s.name.split(" ").map((w, i) => (
                <span key={i} className="block">{w}</span>
              ))}
            </h1>

            {s.bioShort && (
              <p className="text-lg text-paper/85 max-w-[46ch] rise" style={{ animationDelay: "240ms" }}>
                {s.bioShort}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2 rise" style={{ animationDelay: "330ms" }}>
              <a href={wa ? `https://wa.me/${wa}` : "#eventos"} target={wa ? "_blank" : undefined} rel="noopener noreferrer" className="btn btn-primary">
                Contratar
              </a>
              <Link href="/#mentoria" className="btn btn-secondary">Estudar comigo</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
