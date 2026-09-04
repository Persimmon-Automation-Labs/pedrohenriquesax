import Image from "next/image";
import { mediaUrl } from "@/lib/media-url";
import { RequestForm } from "@/components/RequestForm";

/**
 * Conteúdo escrito pelo próprio Pedro: como a aula funciona e quais são os
 * planos. Substituiu a tabela de duração/preço/formato, que dizia menos.
 *
 * Os preços não estão aqui porque ele mandou os planos sem valores — falta
 * combinar se cada plano mostra o seu.
 */
const COMO_FUNCIONA: [string, string][] = [
  ["Frequência e duração", "Aulas semanais, de 50 minutos a 1h15."],
  ["Formato", "100% online, pela plataforma Google Meet."],
  ["Material de apoio", "Cada aluno tem uma pasta individual no Google Drive, com todo o material e um cronograma de estudos personalizado."],
  ["Suporte extra", "Vídeos complementares para tirar dúvidas fora do horário de aula."],
  ["Teoria musical", "Incluída no conteúdo para quem ainda não tem essa base."],
];
const PLANOS = ["Aulas mensais (1x por semana)", "Aulas quinzenais", "Aulas avulsas", "Consultoria"];
export function Mentoria({
  imageUrl = "", level = "h2",
}: { level?: "h1" | "h2"; imageUrl?: string }) {
  const H = level;

  return (
    <section id="mentoria" className="section section-first">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="label text-accent">Aulas</p>
          <H className="d-l text-paper mt-3">Mentoria online</H>

          <h3 className="d-s text-paper mt-8">Como funcionam as aulas</h3>
          <dl className="mt-4 flex flex-col gap-2">
            {COMO_FUNCIONA.map(([k, v]) => (
              <div key={k} className="card px-4 py-3">
                <dt className="label text-faint">{k}</dt>
                <dd className="mt-1 text-paper">{v}</dd>
              </div>
            ))}
          </dl>

          <h3 className="d-s text-paper mt-8">Planos disponíveis</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {PLANOS.map((x) => (
              <li key={x} className="card px-4 py-3 text-paper">{x}</li>
            ))}
          </ul>

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
