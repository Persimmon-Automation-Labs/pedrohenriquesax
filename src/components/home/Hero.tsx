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
    /* Nome com versão de propósito. O arquivo mudou mas o URL não, e o
     otimizador do Next (minimumCacheTTL de 30 dias) e o cache do navegador
     continuaram servindo o recorte antigo — com moldura transparente e outra
     proporção, o que empurrava a cabeça para o meio da tela. Trocar o nome é
     o que garante que ninguém sirva os bytes velhos. */
  const retratoUrl = "/fotos/g01.jpg";

  const retrato = (
    <Image
      src={mediaUrl(retratoUrl)}
      alt={`${s.name} com o saxofone`}
      fill
      priority
      sizes="(max-width: 1023px) 100vw, 46vw"
      className="object-cover object-[38%_center]"
    />
  );

  return (
    <section className="relative overflow-hidden lg:flex lg:min-h-[100dvh] lg:items-center">
      {/* Computador: retrato sangrando à direita, atrás do texto */}
      {/* Ancorado no TOPO, logo abaixo do cabeçalho fixo de 68px — e não na
          base. Ancorado embaixo, numa janela mais baixa a figura subia e a
          cabeça sumia atrás do cabeçalho: é a proporção 1:2 do recorte contra
          uma janela que nem sempre tem altura para ela.

          Assim a cabeça está sempre livre, o tamanho continua vindo só da
          LARGURA da tela, e o que falta de altura corta nas pernas, que é onde
          cortar não custa nada. O PNG foi aparado até a figura (780×1556), sem
          moldura transparente, para essa conta ser previsível. */}
      {/* Painel sangrado à direita, do topo ao pé da seção.
          O recorte anterior existia para o retrato não brigar com o fundo
          branco. Esta foto resolve isso de outro jeito: em vez de flutuar, ela
          ocupa um bloco inteiro, e o encontro entre o branco da página e o
          preto da foto vira uma linha reta — que é desenho, não emenda. */}
      <div className="absolute inset-y-0 right-0 hidden lg:block lg:w-[46%] xl:w-[44%]">
        {retrato}
      </div>

      <div className="wrap relative z-10 w-full">
        <div className="grid items-center lg:grid-cols-12">
          <div className="flex flex-col gap-6 pt-28 lg:col-span-7 lg:py-20 lg:pt-28">
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
        {/* No celular vira uma faixa sangrada embaixo do texto. As margens
            negativas cancelam o padding do .wrap, para a foto ir de borda a
            borda como vai no computador. */}
        <div className="relative mt-10 aspect-[4/3] w-[100vw] -mx-[clamp(1.15rem,5vw,3rem)] lg:hidden">{retrato}</div>
      </div>
    </section>
  );
}
