import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { Agenda } from "@/components/home/Agenda";
import { Media } from "@/components/home/Media";
import { PageHeader } from "@/components/PageHeader";
import { Empty } from "@/components/Alert";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Agenda",
  description: "Próximas apresentações de Pedro Lucena, além de vídeos e áudios.",
};

export default async function AgendaPage() {
  const [shows, media] = await Promise.all([
    prisma.show.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" } }),
    prisma.mediaItem.findMany({ orderBy: [{ featured: "desc" }, { sortOrder: "asc" }] }),
  ]);
  const vazio = !shows.length && !media.length;
  return (
    <Chrome>
      {vazio ? (
        <>
          <PageHeader kicker="Onde me ver" title="Agenda" />
          <div className="wrap section pt-8">
            <Empty
              title="Nenhuma data confirmada no momento."
              body="Para saber das próximas, me chame no WhatsApp ou acompanhe pelo Instagram."
              action={<Link href="/contato" className="btn btn-primary">Falar comigo</Link>}
            />
          </div>
        </>
      ) : (
        <>
          <Agenda shows={shows} level="h1" />
          <Media items={media} />
        </>
      )}
    </Chrome>
  );
}
