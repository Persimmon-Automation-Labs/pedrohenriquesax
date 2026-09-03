import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  // Festivais
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
  await prisma.siteSetting.upsert({
    where: { id: "main" },
    create: {
      id: "main",
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
    },
    update: {},
  });

  await prisma.credential.deleteMany();
  let i = 0;
  for (const [artist, context, year, note] of CREDENCIAIS) {
    await prisma.credential.create({ data: { artist, context, year, note, sortOrder: i++ } });
  }

  const email = "pedro@pedrolucenasax.com.br";
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, name: "Pedro Lucena", passwordHash: await bcrypt.hash("pedro2026", 10) },
    update: {},
  });

  console.log(`✓ configurações, ${CREDENCIAIS.length} credenciais, admin ${email}`);
}

main().finally(() => prisma.$disconnect());
