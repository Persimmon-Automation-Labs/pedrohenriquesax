import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { PageHeader } from "@/components/PageHeader";
import { VideoSection } from "@/components/VideoSection";
import { Empty } from "@/components/Alert";
import { videosJsonLd } from "@/lib/youtube";
import Link from "next/link";

/**
 * O acervo. Um lugar só com tudo.
 *
 * As outras páginas continuam mostrando o recorte que serve a elas — eventos
 * na página de contratação, transcrições na da mentoria —, mas o cadastro é
 * único e vive aqui. Antes /sobre e /eventos repetiam vídeo sem que ninguém
 * soubesse qual era a lista de verdade.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Vídeos",
  description: "Gravações de Pedro Lucena: eventos, big band e jazz, e transcrições de estudo.",
};

const GRUPOS = [
  {
    key: "eventos" as const,
    kicker: "Eventos e gravações",
    title: "Em evento e em estúdio",
  },
  {
    key: "jazz" as const,
    kicker: "Big band e jazz",
    title: "Em performance",
  },
  {
    key: "estudo" as const,
    kicker: "Estudo",
    title: "Transcrições",
  },
];

export default async function Videos() {
  const items = await prisma.mediaItem.findMany({
    where: { kind: "video" },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });

  const site = process.env.SITE_URL || "http://localhost:3000";
  const ld = videosJsonLd(items, site);

  return (
    <Chrome>
      <PageHeader kicker="Acervo" title="Vídeos" />

      {items.length ? (
        GRUPOS.map((g, i) => {
          const doGrupo = items.filter((m) => m.context === g.key);
          if (!doGrupo.length) return null;
          return (
            <VideoSection
              key={g.key}
              items={doGrupo}
              id={g.key}
              kicker={g.kicker}
              title={g.title}
              className={i === 0 ? "section-first" : ""}
            />
          );
        })
      ) : (
        <div className="wrap section section-first">
          <Empty
            title="Ainda não há vídeos publicados."
            action={<Link href="/contato" className="btn btn-primary">Falar comigo</Link>}
          />
        </div>
      )}

      {ld.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
    </Chrome>
  );
}
