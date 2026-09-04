import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { VIDEOS } from "./videos.mjs";

const prisma = new PrismaClient();

/** Dados reais do documento de requisitos preenchido pelo Pedro em 01/09/2026. */

const CREDENCIAIS = [
  // Big bands e orquestras
  ["Guinga", "big_band", "2021—2025", "Orquestra Jovem Tom Jobim"],
  ["Mônica Salmaso", "big_band", "2021—2025", "Orquestra Jovem Tom Jobim"],
  ["Vanessa Moreno", "big_band", "2021—2025", "Orquestra Jovem Tom Jobim"],
  ["Nailor Proveta", "big_band", "2021—2025", "Orquestra Jovem Tom Jobim"],
  ["Lulinha Alencar", "big_band", "2021—2025", "Orquestra Jovem Tom Jobim"],
  ["Nelson Ayres", "big_band", "2021—2025", "Direção da Orquestra Jovem Tom Jobim"],
  ["Tiago Costa", "big_band", "2021—2025", "Direção da Orquestra Jovem Tom Jobim"],
  ["Debora Gurgel", "big_band", null, "Big Band Souza Lima"],
  ["Pablo Gil", "big_band", null, "Big Band Souza Lima"],
  // Jazz internacional
  ["Danilo Pérez", "jazz_internacional", "2026", "Big Band do Berklee Global Jazz Institute, sax alto lead"],
  ["Jeff Coffin", "jazz_internacional", null, "Big Band Souza Lima"],
  ["Anat Cohen", "jazz_internacional", null, "Big Band Souza Lima"],
  ["John Surman", "jazz_internacional", null, "Orquestra Jovem Tom Jobim"],
  ["Jens Lindeman", "jazz_internacional", "2023", "Speakin Jazz Big Band"],
  ["Georgina Jackson", "jazz_internacional", "2019", "Freedom Big Band"],
  ["Vince Di Martino", "jazz_internacional", "2019", "Freedom Big Band"],
  ["Orion Lion", "jazz_internacional", null, "Big Band Souza Lima"],
  // Pop nacional
  ["Dilsinho", "pop_nacional", null, null],
  ["Luiza Possi", "pop_nacional", null, null],
  ["Guilherme Arantes", "pop_nacional", null, null],
  ["Falamansa", "pop_nacional", null, null],
  ["Léo Jaime", "pop_nacional", null, null],
  ["Tierry", "pop_nacional", null, null],
  ["Natanzinho Lima", "pop_nacional", null, null],
  ["Toninho Geraes", "pop_nacional", null, null],
  ["Thiago e Graciano", "pop_nacional", null, null],
  ["Chrigor", "pop_nacional", null, null],
  // Grandes eventos e festivais
  // A CCXP veio por áudio, depois de o currículo já estar escrito: é o maior
  // evento de cultura pop do mundo e o palco Thunder é o principal dele.
  // Como credencial de evento corporativo, vale mais do que metade da lista.
  ["CCXP", "festival", "2024", "Palco Thunder, Qualcomm — abertura, trilhas de games e cinema"],
  ["Festival Internacional de Campos do Jordão", "festival", "2022", "Bolsista"],
  ["Nelson Faria", "festival", "2022", "Campos do Jordão"],
  ["Gian Correa", "festival", "2022", "Campos do Jordão"],
  ["Ari Colares", "festival", "2025", "Freedom Big Band"],
];

const BIO_LONGA = `Pedro Lucena é saxofonista, natural de São Paulo, bacharel em Música com especialidade em saxofone pela Faculdade Souza Lima & Berklee College of Music.

Começou aos 13 anos num projeto de iniciação musical na igreja, por incentivo da mãe. Aos 14 entrou na Associação Comunitária Pró Morato e, aos 15, na Escola Municipal de Música de São Paulo, onde estudou com os saxofonistas Samuel Pompeo e Mauricio de Souza.

Em 2018, indicado por Samuel Pompeo como aluno destaque, ganhou bolsa integral na Souza Lima & Berklee. Na faculdade teve aula com Sizão Machado, Daniel D'Alcantara, Rodrigo Morte, Pedro Ramos, Nenê, Vitor Alcântara e Rodrigo Ursaia. Com a Big Band Souza Lima, acompanhou Jeff Coffin, Anat Cohen, Debora Gurgel e Pablo Gil.

De 2021 a 2025 integrou a Orquestra Jovem Tom Jobim, sob direção de Nelson Ayres e Tiago Costa, acompanhando Guinga, Mônica Salmaso, John Surman, Vanessa Moreno e Nailor "Proveta" Azevedo.

Em 2026 foi selecionado entre os músicos brasileiros da Big Band do Berklee Global Jazz Institute, em projeto realizado no Brasil sob direção de Danilo Pérez, atuando como saxofonista alto lead.

Hoje atua em casamentos de alto padrão, eventos corporativos, live sax, shows autorais com seu quinteto, e acompanha artistas do pop nacional. Também dá mentoria online individual para saxofonistas.`;


async function main() {
  // O app cria uma linha em branco na primeira visita, então o upsert sozinho
  // não bastava: preenche o que estiver vazio, sem sobrescrever o que o Pedro editou.
  const DADOS = {
    name: "Pedro Lucena",
    tagline: "Saxofonista",
    city: "São Paulo",
    email: "pedrohenrique1315@yahoo.com.br",
    whatsapp: "+55 11 96121-6535",
    bioShort: "Bacharel pela Souza Lima & Berklee. Big bands, jazz e eventos, de Guinga a Danilo Pérez.",
    bioMedium: "Saxofonista formado pela Souza Lima & Berklee, cinco anos na Orquestra Jovem Tom Jobim e sax alto lead da Big Band do Berklee Global Jazz Institute em 2026.",
    bioLong: BIO_LONGA,
    instagramUrl: "https://instagram.com/pedrolucenasax",
    tiktokUrl: "https://tiktok.com/@lucenasax",
    eventsText: "Toco em casamentos de alto padrão, recepções, eventos corporativos, igrejas, bailes e shows autorais. Cada evento pede um formato diferente, e eu monto o que faz sentido para o seu.",
    mentoriaText: "Mentoria online individual, para quem quer estudar saxofone de verdade. Trabalhamos sonoridade, técnica, leitura e improvisação, no ponto em que você está.",
    mentoriaDuration: "1h15",
    mentoriaPrice: "R$ 150,00",
    pixKey: "pedrohenrique1315@yahoo.com.br",
    pixKeyType: "email",
    pixName: "Pedro Lucena",
    pixCity: "SAO PAULO",
    heroImageUrl: "/fotos/hero.jpg",
    aboutImageUrl: "/fotos/sobre.jpg",
    eventsImageUrl: "/fotos/eventos.jpg",
    mentoriaImageUrl: "/fotos/mentoria.jpg",
    credentialsImageUrl: "/fotos/credenciais.jpg",
    contactImageUrl: "/fotos/contato.jpg",
  };

  const atual = await prisma.siteSetting.findUnique({ where: { id: "main" } });
  if (!atual) {
    await prisma.siteSetting.create({ data: { id: "main", ...DADOS } });
  } else {
    const faltando = Object.fromEntries(
      Object.entries(DADOS).filter(([k]) => !atual[k] || atual[k] === "")
    );
    if (Object.keys(faltando).length) {
      await prisma.siteSetting.update({ where: { id: "main" }, data: faltando });
      console.log(`  preenchidos: ${Object.keys(faltando).join(", ")}`);
    }
  }

  await prisma.credential.deleteMany();
  let i = 0;
  for (const [artist, context, year, note] of CREDENCIAIS) {
    await prisma.credential.create({ data: { artist, context, year, note, sortOrder: i++ } });
  }

  // Vídeos: só semeia se estiver vazio, para não apagar o que o Pedro editar.
  // Os quatro primeiros de `eventos` foram escolhidos pelo próprio Pedro, e são
  // gravações em canal de terceiro — é ele tocando com Tierry e com Léo Jaime,
  // dois nomes que já estavam na parede de credenciais sem prova nenhuma.
  if ((await prisma.mediaItem.count()) === 0) {
    let ordem = 0;
    for (const [id, title, credit, year, duration, context, featured] of VIDEOS) {
      await prisma.mediaItem.create({
        data: {
          kind: "video",
          url: `https://www.youtube.com/watch?v=${id}`,
          title, credit, year, duration, context,
          featured: !!featured,
          sortOrder: ordem++,
        },
      });
    }
    console.log(`  ${VIDEOS.length} vídeos semeados`);
  }

  // Galeria: só semeia se estiver vazia, para não apagar o que o Pedro subir.
  if ((await prisma.galleryItem.count()) === 0) {
    for (let i = 1; i <= 13; i++) {
      const n = String(i).padStart(2, "0");
      await prisma.galleryItem.create({ data: { url: `/fotos/g${n}.jpg`, sortOrder: i - 1 } });
    }
    console.log("  galeria semeada com 13 fotos");
  }

  const email = "pedro@pedrolucenasax.com";
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, name: "Pedro Lucena", passwordHash: await bcrypt.hash("pedro2026", 10) },
    update: {},
  });

  console.log(`✓ configurações, ${CREDENCIAIS.length} credenciais, admin ${email}`);
}

main().finally(() => prisma.$disconnect());
