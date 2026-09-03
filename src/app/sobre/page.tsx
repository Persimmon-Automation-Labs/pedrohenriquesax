import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { About } from "@/components/home/About";
import { Credentials } from "@/components/home/Credentials";
import { VideoSection } from "@/components/VideoSection";
import { videosJsonLd } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sobre",
  description: "Trajetória, formação e palcos de Pedro Lucena. Souza Lima & Berklee, Orquestra Jovem Tom Jobim, Berklee Global Jazz Institute.",
};

export default async function Sobre() {
  const [settings, credentials, videos] = await Promise.all([
    getSettings(),
    prisma.credential.findMany({ orderBy: [{ context: "asc" }, { sortOrder: "asc" }] }),
    prisma.mediaItem.findMany({
      where: { kind: "video", context: "jazz" },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    }),
  ]);
  const site = process.env.SITE_URL || "http://localhost:3000";
  const ld = videosJsonLd(videos, site);

  return (
    <Chrome>
      <About settings={settings} level="h1" />
      {/* O vídeo vem antes da lista: quem chega aqui quer saber se ele toca,
          e a lista de nomes só significa alguma coisa depois disso. */}
      <VideoSection
        items={videos}
        lead
        id="videos"
        kicker="Ouvir e assistir"
        title="Em performance"
        body="Big band, jazz e música brasileira — gravações ao vivo, sem retoque."
      />
      <Credentials items={credentials} />
      {ld.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
    </Chrome>
  );
}
