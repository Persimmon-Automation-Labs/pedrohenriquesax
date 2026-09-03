import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { Agenda } from "@/components/home/Agenda";
import { PageHeader } from "@/components/PageHeader";
import { Empty } from "@/components/Alert";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Agenda",
  description: "Próximas apresentações de Pedro Lucena em São Paulo.",
};

export default async function AgendaPage() {
  const shows = await prisma.show.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
  });

  if (!shows.length) {
    return (
      <Chrome>
        <PageHeader kicker="Onde me ver" title="Agenda" />
        <div className="wrap section pt-8">
          {/* Uma agenda vazia num site de músico é lida como "não é chamado".
              Enquanto não há data pública, a saída é mandar para o que existe
              — as gravações — em vez de deixar a pessoa no vazio. */}
          <Empty
            title="As próximas datas ainda não são públicas."
            body="Boa parte do que toco é evento fechado. Para saber de agenda e disponibilidade, me chame no WhatsApp — ou veja as gravações."
            action={
              <div className="flex flex-wrap gap-3">
                <Link href="/contato" className="btn btn-primary">Falar comigo</Link>
                <Link href="/sobre#videos" className="btn btn-secondary">Ver gravações</Link>
              </div>
            }
          />
        </div>
      </Chrome>
    );
  }

  return (
    <Chrome>
      <Agenda shows={shows} level="h1" />
    </Chrome>
  );
}
