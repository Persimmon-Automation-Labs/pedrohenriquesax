import Image from "next/image";
import { mediaUrl } from "@/lib/media-url";
import { RequestForm } from "@/components/RequestForm";

/**
 * O parágrafo de apresentação saiu: dizia em prosa o que a tabela abaixo já
 * diz em três linhas — duração, preço, formato. Quem chega aqui quer saber
 * quanto custa e como funciona, não ler sobre sonoridade.
 */
export function Mentoria({
  duration, price, imageUrl = "", level = "h2",
}: { level?: "h1" | "h2"; duration: string; price: string; text?: string; imageUrl?: string }) {
  const H = level;

  return (
    <section id="mentoria" className="section section-first">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="label text-accent">Aulas</p>
          <H className="d-l text-paper mt-3">Mentoria online</H>

          <dl className="mt-7 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {[["Duração", duration], ["Investimento", price || "Sob consulta"], ["Formato", "Individual, online"]].map(
              ([k, v]) => (
                <div key={k} className="card flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="label text-faint">{k}</dt>
                  <dd className="mono text-paper">{v}</dd>
                </div>
              ),
            )}
          </dl>

          {imageUrl && (
            <div className="relative mt-7 aspect-[4/5] w-full overflow-hidden rounded-[2px] group">
              <Image
                src={mediaUrl(imageUrl)}
                alt="Pedro Lucena em estúdio"
                fill
                sizes="(max-width:1024px) 100vw, 40vw"
                className="object-cover zoom-img"
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <div className="surface rounded-[2px] p-6 md:p-8">
            <p className="d-m text-paper mb-6">Quero estudar</p>
            <RequestForm defaultTipo="mentoria" />
          </div>
        </div>
      </div>
    </section>
  );
}
