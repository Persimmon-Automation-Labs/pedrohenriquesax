import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { Events } from "@/components/home/Events";
import { VideoSection } from "@/components/VideoSection";
import { LiveSax } from "@/components/LiveSax";
import { videosJsonLd } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Eventos",
  description: "Contratação de saxofonista para casamento, evento corporativo, recepção, live sax e show autoral em São Paulo. Sete formatos, do solo ao quinteto.",
};

export default async function Eventos() {
  const [s, videos] = await Promise.all([
    getSettings(),
    prisma.mediaItem.findMany({
      where: { kind: "video", context: "eventos" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  const site = process.env.SITE_URL || "http://localhost:3000";
  const ld = videosJsonLd(videos, site);

  return (
    <Chrome>
      <Events imageUrl={s.eventsImageUrl} text={s.eventsText} level="h1" />
      {/* Primeiro a prova mais próxima do que a pessoa está imaginando: ele
          tocando num salão. Só depois as gravações de estúdio. */}
      <LiveSax />
      {/* Pop reconhecível, produção grande, nomes que o contratante conhece.
          É a prova que faltava: Tierry e Léo Jaime estavam na parede de
          credenciais como afirmação, e agora estão em vídeo. */}
      <VideoSection
        items={videos}
        id="videos"
        kicker="Como soa"
        title="Gravações"
        verMais
      />
      {ld.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
    </Chrome>
  );
}
