import Image from "next/image";
import type { Settings } from "@/lib/settings";
import { basePath } from "@/lib/storage";
import { Reveal } from "@/components/Reveal";

export function About({ settings: s, level = "h2" }: { level?: "h1" | "h2"; settings: Settings }) {
  const H = level;
  const paras = (s.bioLong || s.bioMedium || "").split(/\n\s*\n/).filter(Boolean);
  return (
    <section id="sobre" className="section border-t border-white/10">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] group">
            {s.aboutImageUrl ? (
              <Image src={s.aboutImageUrl} alt={s.name} fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover zoom-img" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#1b2429] to-ink" />
            )}
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="label text-accent">Quem sou eu</p>
            <H className="d-l text-paper mt-4">Sobre</H>
          </Reveal>
          <div className="mt-8 flex flex-col gap-4 prose-w">
            {paras.map((p, i) => (
              <Reveal key={i} delay={i * 50}>
                <p className="text-muted leading-relaxed">{p}</p>
              </Reveal>
            ))}
          </div>
          {s.resumeUrl && (
            <Reveal delay={120}>
              <a href={`${basePath}${s.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-8">
                Baixar currículo
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
