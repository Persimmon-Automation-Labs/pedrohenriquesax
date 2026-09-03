import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSettings() {
  return (
    (await prisma.siteSetting.findUnique({ where: { id: "main" } })) ??
    (await prisma.siteSetting.create({ data: { id: "main" } }))
  );
}
export type Settings = Awaited<ReturnType<typeof getSettings>>;
