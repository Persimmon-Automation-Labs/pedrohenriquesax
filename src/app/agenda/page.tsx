import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { Agenda } from "@/components/home/Agenda";

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

  /* Agenda vazia num site de músico é lida como "não é chamado". Enquanto não
     houver data cadastrada, a página não existe — some do menu e do mapa do
     site. Basta o Pedro cadastrar uma data no painel para ela voltar. */
  if (!shows.length) notFound();

  return (
    <Chrome>
      <Agenda shows={shows} level="h1" className="section-first" />
    </Chrome>
  );
}
