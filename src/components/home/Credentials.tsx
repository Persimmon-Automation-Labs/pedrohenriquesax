import Link from "next/link";
import type { Credential } from "@prisma/client";
import { Reveal } from "@/components/Reveal";

/**
 * A assinatura do site. Nenhuma das seis referências resolve isso:
 * Grace Kelly enterra a lista, Kenny G não precisa, Braxton não tem.
 * Composta densa, condensada, em caixa alta — como cartaz de festival.
 */
const GROUPS: [string, string][] = [
  ["big_band", "Big bands e orquestras"],
  ["jazz_internacional", "Jazz internacional"],
  ["pop_nacional", "Pop nacional"],
  ["festival", "Festivais"],
];

export function Credentials({ items, limit, showAll, level = "h2" }: { level?: "h1" | "h2"; items: Credential[]; limit?: number; showAll?: boolean }) {
  const H = level;
  if (!items.length) return null;
  const byGroup = GROUPS.map(([key, label]) => ({
    key, label, list: items.filter((i) => i.context === key).slice(0, limit),
  })).filter((g) => g.list.length);

  return (
    <section id="credenciais" className="section relative border-t border-white/10 bg-surface/40">
      <div className="wrap relative">
        <Reveal>
          <p className="label text-accent">Já dividiu palco com</p>
          <H className="d-l text-paper mt-4 max-w-[16ch]">Credenciais</H>
        </Reveal>

        <div className="mt-14 flex flex-col gap-12">
          {byGroup.map((g, gi) => (
            <div key={g.key}>
              <Reveal delay={gi * 60}>
                <p className="label text-faint border-b border-white/10 pb-3">{g.label}</p>
              </Reveal>
              <ul className="mt-5 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
                {g.list.map((c, i) => (
                  <Reveal as="li" key={c.id} delay={Math.min(i * 35, 420)}>
                    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-3">
                      <span className="d-nar text-paper text-[1.05rem] leading-tight">{c.artist}</span>
                      {c.year && <span className="mono text-xs text-faint shrink-0">{c.year}</span>}
                    </div>
                    {c.note && <p className="text-xs text-faint -mt-2 pb-2">{c.note}</p>}
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {showAll && (
          <Reveal delay={120}>
            <Link href="/sobre#credenciais" className="btn btn-secondary mt-12">Ver a trajetória completa</Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
