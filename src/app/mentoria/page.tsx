import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { Mentoria } from "@/components/home/Mentoria";
import { VideoSection } from "@/components/VideoSection";
import { videosJsonLd } from "@/lib/youtube";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Mentoria online",
  description: "Mentoria individual de saxofone, online, 1h15. De sonoridade a improvisação, com Pedro Lucena.",
};

export default async function MentoriaPage() {
  const [s, videos] = await Promise.all([
    getSettings(),
    prisma.mediaItem.findMany({
      where: { kind: "video", context: "estudo" },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
  const site = process.env.SITE_URL || "http://localhost:3000";
  const ld = videosJsonLd(videos, site);

  return (
    <Chrome>
      <Mentoria duration={s.mentoriaDuration} price={s.mentoriaPrice} imageUrl={s.mentoriaImageUrl} level="h1" />
      {/* As transcrições são material didático pronto: mostram o ouvido e o
          método de estudo melhor do que qualquer parágrafo sobre a mentoria. */}
      <VideoSection
        items={videos}
        id="transcricoes"
        kicker="Como eu estudo"
        title="Transcrições"
      />
      {ld.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
    </Chrome>
  );
}
