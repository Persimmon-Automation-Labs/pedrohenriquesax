import Image from "next/image";
import { RequestForm } from "@/components/RequestForm";
import { mediaUrl } from "@/lib/media-url";

const FORMATOS = ["Sax e playback", "Sax e DJ", "DJ, cantora e sax", "Duo", "Trio", "Com banda", "Quinteto autoral"];
const SEGMENTOS = ["Casamento", "Corporativo", "Igreja", "Recepção", "Baile", "Live sax", "Show autoral"];

export function Events({ imageUrl, text, level = "h2" }: { level?: "h1" | "h2"; imageUrl: string; text: string }) {
  const H = level;

  return (
    <section id="eventos" className="section section-first">
      <div className="wrap">
        <div className="max-w-3xl">
          <p className="label text-accent">Contratação</p>
          <H className="d-l text-paper mt-3">Eventos</H>
          {text && <p className="mt-5 text-muted prose-w">{text}</p>}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 flex flex-col gap-7">
            {/* Eram duas listas de linhas com filete embaixo, que ocupavam meia
                tela para dizer sete palavras. Em cartão, lê-se de relance. */}
            <div>
              <p className="label text-faint">Segmentos atendidos</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SEGMENTOS.map((f) => (
                  <li key={f} className="card px-3 py-1.5 text-[0.9rem] text-muted">{f}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label text-faint">Formatos</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {FORMATOS.map((f) => (
                  <li key={f} className="card px-3 py-2.5 text-[0.95rem] text-paper">{f}</li>
                ))}
              </ul>
            </div>

            {imageUrl && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-[2px] group">
                <Image
                  src={mediaUrl(imageUrl)}
                  alt="Pedro Lucena em evento"
                  fill
                  sizes="(max-width:1024px) 100vw, 40vw"
                  className="object-cover zoom-img"
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="surface rounded-[2px] p-6 md:p-8">
              <p className="d-m text-paper mb-6">Pedir um orçamento</p>
              <RequestForm defaultTipo="evento" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
