import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { Gallery } from "@/components/home/Gallery";
import { PageHeader } from "@/components/PageHeader";
import { Empty } from "@/components/Alert";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Galeria",
  description: "Fotos de palco, big band, estúdio e bastidores.",
};

export default async function GaleriaPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
  if (!items.length) {
    return (
      <Chrome>
        <PageHeader kicker="Registros" title="Galeria" />
        <div className="wrap section pt-8"><Empty title="As fotos estão a caminho." /></div>
      </Chrome>
    );
  }
  return <Chrome><Gallery items={items} level="h1" /></Chrome>;
}
