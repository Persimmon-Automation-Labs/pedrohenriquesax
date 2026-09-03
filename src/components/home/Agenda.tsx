import type { Show } from "@prisma/client";
import { Reveal } from "@/components/Reveal";

const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "America/Sao_Paulo" });

/** Oculta automaticamente se não houver apresentação futura. */
export function Agenda({ shows, level = "h2" }: { level?: "h1" | "h2"; shows: Show[] }) {
  const H = level;
  if (!shows.length) return null;
  return (
    <section id="agenda" className="section border-t border-white/10">
      <div className="wrap">
        <Reveal>
          <p className="label text-accent">Onde me ver</p>
          <H className="d-l text-paper mt-4">Agenda</H>
        </Reveal>
        <ul className="mt-10">
          {shows.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 55}>
              <div className="grid grid-cols-1 gap-1 border-b border-white/10 py-5 sm:grid-cols-[130px_1fr_auto] sm:items-baseline sm:gap-6">
                <time dateTime={s.date.toISOString()} className="mono text-sm text-accent">{fmt.format(s.date)}</time>
                <div>
                  <p className="d-nar text-paper text-[1.05rem]">{s.venue}</p>
                  <p className="text-sm text-faint">{s.city}</p>
                </div>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-underline text-sm justify-self-start sm:justify-self-end">
                    Ingressos
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
