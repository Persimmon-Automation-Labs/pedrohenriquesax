/**
 * Os vídeos, endereçados a quem eles convencem.
 * [id do YouTube OU caminho do arquivo, título, com quem/onde, ano, duração,
 *  contexto, destaque, capa (só para arquivo próprio)]
 *
 * `eventos`  — pop reconhecível, produção grande: é o que um contratante de
 *              casamento ou corporativo precisa ver antes de escrever.
 * `jazz`     — a musicalidade séria, que sustenta o cachê e a bio.
 * `estudo`   — vazio por ora. As transcrições saíram do site: o Pedro vai
 *              publicá-las como PDF dentro da mentoria, sem vídeo dele tocando.
 */
export const VIDEOS = [
  // ── Eventos ──────────────────────────────────────────────────────────
  ["ieAUlb9spk8", "Terceiro Sofrendo", "Thiago e Graciano, part. Tierry · DVD Onda de Amor", "2022", "2:53", "eventos", true],
  ["6sQbhlfHYlE", "Uma Mensagem de Amor", "Edu Cristófaro e Léo Jaime", "2026", "4:27", "eventos", true],
  ["ng9T5VGBAmg", "Codinome Beija-flor", "Edu Cristófaro", "2026", "5:16", "eventos", false],
  ["qRdgTQ-YW68", "Simples Desejo", "Edu Cristófaro", "2026", "6:42", "eventos", false],
  // Nestas duas ele não só tocou: escreveu os arranjos de metais. É um crédito
  // diferente de sideman, e o site não dizia em lugar nenhum que ele arranja.

  // ── Jazz e big band ──────────────────────────────────────────────────
  ["00zn0eg1c18", "Suite for the Americas — solo", "Big Band do Berklee Global Jazz Institute, São Paulo", "2026", "3:55", "jazz", true],
  ["3skZt0wME2k", "Clube da Esquina nº 2", "Orquestra Jovem Tom Jobim", "2023", "8:16", "jazz", false],
  ["MNWuZAFp2j4", "Affirmation", "George Benson · Music in the Park", "2024", "2:10", "jazz", false],
  ["TS2zVsZcubE", "Viajando pelo Brasil", "Hermeto Pascoal, com Carol Panesi", "2025", "1:00", "jazz", false],
  ["nJ34Bqtc_Q8", "Trumpet Tune — solo", "Freedom Big Band", "2020", "0:56", "jazz", false],
  // Hospedado aqui, não no YouTube: gravação de celular que o Pedro mandou
  // dizendo ter "um carinho enorme" por ela. Ele solando com a big band.
  ["/video/solo-bigband.mp4", "Solo com a big band", "Ao vivo", "", "0:59", "jazz", false, "/video/solo-bigband.jpg"],

];
