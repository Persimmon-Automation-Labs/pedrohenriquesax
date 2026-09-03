import type { Credential } from "@prisma/client";
import { Reveal } from "@/components/Reveal";

/**
 * A trajetória, em voz baixa.
 *
 * A versão anterior gastava seis linhas idênticas — Guinga, Salmaso, Moreno,
 * Proveta, Lulinha, Ayres — todas dizendo "2021—2025 · Orquestra Jovem Tom
 * Jobim", que é um fato só repartido em seis. Quem conhece o meio lê isso como
 * inflação, não como currículo.
 *
 * Agora agrupa pelo conjunto: o grupo aparece uma vez, com quem passou por ele
 * em seguida. Fica mais curto e diz mais. O agrupamento é no render, não no
 * banco — o Pedro continua cadastrando uma linha por artista.
 *
 * O rótulo também mudou. "Já dividiu palco com" era a leitura mais generosa
 * possível de tocar numa orquestra jovem atrás de um solista convidado, e as
 * pessoas capazes de notar a diferença são exatamente as que ele quer impressionar.
 */
const GROUPS: [string, string][] = [
  ["big_band", "Big bands e orquestras"],
  ["jazz_internacional", "Jazz internacional"],
  ["pop_nacional", "Pop nacional"],
  ["festival", "Festivais"],
];

/** Junta as credenciais que compartilham o mesmo conjunto, preservando a ordem. */
function byEnsemble(list: Credential[]) {
  const out: { note: string; years: string; artists: string[] }[] = [];
  for (const c of list) {
    const note = c.note || "";
    const found = out.find((g) => g.note === note);
    if (found) {
      found.artists.push(c.artist);
      if (c.year && !found.years) found.years = c.year;
    } else {
      out.push({ note, years: c.year || "", artists: [c.artist] });
    }
  }
  return out;
}

export function Credentials({
  items,
  level = "h2",
}: {
  level?: "h1" | "h2";
  items: Credential[];
}) {
  const H = level;
  if (!items.length) return null;

  const byGroup = GROUPS.map(([key, label]) => ({
    key,
    label,
    ensembles: byEnsemble(items.filter((i) => i.context === key)),
  })).filter((g) => g.ensembles.length);

  return (
    <section id="credenciais" className="section border-t border-white/10">
      <div className="wrap">
        <Reveal>
          <p className="label text-accent">Trajetória</p>
          <H className="d-l text-paper mt-4">Palcos e formações</H>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {byGroup.map((g, gi) => (
            <div key={g.key}>
              <Reveal delay={gi * 50}>
                <p className="label text-faint border-b border-white/10 pb-3">{g.label}</p>
              </Reveal>

              <ul className="mt-4 flex flex-col">
                {g.ensembles.map((e, i) => (
                  <Reveal as="li" key={`${g.key}-${i}`} delay={Math.min(i * 40, 320)}>
                    <div className="flex flex-col gap-1 border-b border-white/[0.07] py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                      <p className="text-paper">
                        {e.artists.join(" · ")}
                      </p>
                      {(e.note || e.years) && (
                        <p className="shrink-0 text-sm text-faint sm:text-right">
                          {e.note}
                          {e.note && e.years ? " · " : ""}
                          {e.years && <span className="mono">{e.years}</span>}
                        </p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
