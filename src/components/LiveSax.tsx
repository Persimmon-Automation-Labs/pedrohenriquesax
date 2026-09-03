import { Reveal } from "@/components/Reveal";

/**
 * O único registro de evento de verdade que existe: o Pedro tocando live sax
 * num salão, com PA, luz e gente. Ele mandou dizendo "aqui é uma onda live sax".
 *
 * Vale mais para quem contrata do que qualquer gravação de estúdio — é
 * exatamente a situação que a pessoa está tentando imaginar. Fica hospedado
 * aqui (não no YouTube) porque é vertical, curto, e não precisa de player de
 * terceiro: 4,4 MB com `preload="none"` não custa nada até alguém dar play.
 *
 * Com controles e sem autoplay de propósito: o som é o argumento, e ninguém
 * deve levar um susto de saxofone ao abrir a página.
 */
export function LiveSax({ src = "/video/live-sax.mp4", poster = "/video/live-sax.jpg" }: { src?: string; poster?: string }) {
  return (
    <section id="live-sax" className="section border-t border-white/10">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
        <Reveal>
          <video
            className="w-full max-w-[340px] rounded-[2px] border border-white/10 bg-surface"
            src={src}
            poster={poster}
            controls
            preload="none"
            playsInline
          >
            Seu navegador não toca este vídeo.
          </video>
        </Reveal>

        <Reveal delay={90}>
          <div>
            <p className="label text-accent">Ao vivo</p>
            <h2 className="d-l text-paper mt-4">Live sax</h2>
            <p className="mt-6 text-muted prose-w">
              Saxofone por cima da pista, junto com o DJ ou a banda. É o formato mais pedido
              em recepção e festa — entra e sai da música sem parar o som, e muda o ar da sala.
            </p>
            <p className="mt-4 text-muted prose-w">
              Gravado em evento, sem retoque: é assim que soa na sua festa.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
