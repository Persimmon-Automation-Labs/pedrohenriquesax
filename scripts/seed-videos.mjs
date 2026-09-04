/**
 * Semeia só os vídeos, sem tocar em mais nada.
 *
 * O `db:seed` completo apaga e recria as credenciais, o que é seguro numa base
 * local e não é numa base onde o Pedro já pode ter editado alguma coisa. Este
 * script mexe apenas em MediaItem, e só insere o que ainda não está lá — dá
 * para rodar de novo sem duplicar.
 *
 *   infra db exec pedro-lucena -- node scripts/seed-videos.mjs
 */
import { PrismaClient } from "@prisma/client";
import { VIDEOS } from "../prisma/videos.mjs";

const prisma = new PrismaClient();

const main = async () => {
  const existentes = await prisma.mediaItem.findMany({ select: { url: true } });
  const jaTem = new Set(existentes.map((m) => m.url));

  let ordem = await prisma.mediaItem.count();
  let novos = 0;

  for (const [id, title, credit, year, duration, context, featured, poster] of VIDEOS) {
    const url = id.startsWith("/") ? id : `https://www.youtube.com/watch?v=${id}`;
    if (jaTem.has(url)) continue;
    await prisma.mediaItem.create({
      data: { kind: "video", url, title, credit, year, duration, context, poster: poster || "", featured: !!featured, sortOrder: ordem++ },
    });
    novos++;
  }

  const total = await prisma.mediaItem.count();
  console.log(`✓ ${novos} vídeos inseridos (${VIDEOS.length - novos} já existiam) · total agora: ${total}`);
};

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
