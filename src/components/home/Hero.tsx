import Image from "next/image";
import Link from "next/link";
import type { Settings } from "@/lib/settings";
import { mediaUrl } from "@/lib/media-url";

/**
 * Herói. Máximo 4 elementos de texto: rótulo, nome, uma linha, dois CTAs.
 *
 * A foto é um RECORTE com fundo transparente. No tema escuro era a foto
 * inteira, e a máscara e a vinheta existiam só para esconder a borda dura entre
 * o fundo escuro do estúdio e a página. No claro aquilo virava uma faixa cinza
 * suja no meio da tela — o Pedro apontou, e com razão. Sem fundo na foto não há
 * borda a esconder, então máscara e vinheta saíram em vez de serem ajustadas.
 *
 * Duas composições, e não uma sobreposição que se vira:
 *   • no computador o recorte é absoluto à direita e o texto fica na esquerda;
 *   • no celular eles EMPILHAM. Sobrepor só funcionava porque a vinheta
 *     escurecia a foto atrás do texto; sem ela, o retrato passava por cima do
 *     nome e dos botões e não se lia nada.
 */
export function Hero({ settings: s }: { settings: Settings }) {
  const wa = s.whatsapp.replace(/\D/g, "");
  const recorte = "/fotos/hero-recorte.png";

  const retrato = (
    <Image
      src={mediaUrl(recorte)}
      alt={`${s.name} tocando saxofone`}
      width={1100}
      height={1650}
      priority
      sizes="(max-width: 768px) 70vw, 50vw"
      className="h-auto w-auto object-contain object-bottom"
    />
  );

  return (
    <section className="relative overflow-hidden md:flex md:min-h-[100dvh] md:items-center">
      {/* Computador: retrato sangrando à direita, atrás do texto */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-end justify-end md:flex md:w-[60%] lg:w-[54%] xl:w-[50%] [&_img]:max-h-[100dvh]">
        {retrato}
      </div>

      <div className="wrap relative z-10 w-full">
        <div className="grid items-center lg:grid-cols-12">
          <div className="flex flex-col gap-6 pt-28 md:col-span-7 md:py-20 md:pt-28">
            <p className="label text-accent rise" style={{ animationDelay: "60ms" }}>
              {s.tagline}{s.city ? ` · ${s.city}` : ""}
            </p>

            {/* Os espaços entre os spans são de propósito: os spans são `block`,
                então a quebra é visual, mas o nome acessível e o texto que o
                Google indexa continuam sendo "Pedro Lucena", e não "PedroLucena". */}
            <h1 className="d-xl text-paper rise" style={{ animationDelay: "140ms" }}>
              {s.name.split(" ").map((w, i) => (
                <span key={i} className="block">
                  {i > 0 ? " " : ""}{w}
                </span>
              ))}
            </h1>

            {s.bioShort && (
              <p className="text-lg text-paper/80 max-w-[46ch] rise" style={{ animationDelay: "240ms" }}>
                {s.bioShort}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-2 rise" style={{ animationDelay: "330ms" }}>
              <a
                href={wa ? `https://wa.me/${wa}?text=${encodeURIComponent("Olá, Pedro! Vim pelo site e queria um orçamento para um evento.")}` : "#eventos"}
                target={wa ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Contratar
              </a>
              <Link href="/#mentoria" className="btn btn-secondary">Estudar comigo</Link>
            </div>
          </div>
        </div>

        {/* Celular: o retrato entra embaixo, no fluxo, sem cobrir nada */}
        <div className="mt-10 flex justify-center md:hidden [&_img]:max-h-[56dvh]">
          {retrato}
        </div>
      </div>
    </section>
  );
}
