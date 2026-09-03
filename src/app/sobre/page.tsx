import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { Chrome } from "@/components/Chrome";
import { About } from "@/components/home/About";
import { Credentials } from "@/components/home/Credentials";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sobre",
  description: "Trajetória, formação e com quem Pedro Lucena já dividiu palco. Souza Lima & Berklee, Orquestra Jovem Tom Jobim, Berklee Global Jazz Institute.",
};

export default async function Sobre() {
  const [settings, credentials] = await Promise.all([
    getSettings(),
    prisma.credential.findMany({ orderBy: [{ context: "asc" }, { sortOrder: "asc" }] }),
  ]);
  return (
    <Chrome>
      <About settings={settings} level="h1" />
      <Credentials items={credentials} />
    </Chrome>
  );
}
