/** Extrai o id de qualquer formato de link do YouTube que o Pedro possa colar no painel. */
export function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
  );
  return m ? m[1] : null;
}

/**
 * A capa do vídeo. `maxresdefault` é 1280×720 e não existe para todo vídeo;
 * quem não tem cai para `hqdefault`, que existe sempre. O componente troca
 * sozinho no `onError`.
 */
export const youtubeThumb = (id: string, max = true) =>
  `https://i.ytimg.com/vi/${id}/${max ? "maxresdefault" : "hqdefault"}.jpg`;

export const youtubeWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeEmbed = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;

/** "3:55" → "PT3M55S", que é o formato que o Google espera no schema. */
export function isoDuration(mmss: string): string | undefined {
  const m = mmss.match(/^(\d+):(\d{2})$/);
  if (!m) return undefined;
  return `PT${Number(m[1])}M${Number(m[2])}S`;
}

type VideoLike = { url: string; title: string; credit: string; year: string; duration: string };

/**
 * VideoObject para os vídeos que estão de fato tocando na página.
 *
 * O Google pede name, description, thumbnailUrl e uploadDate, mais um entre
 * contentUrl e embedUrl. Marcar vídeo que não está embutido na página é
 * violação de política, então isto é sempre gerado a partir da mesma lista
 * que renderiza — nunca de um catálogo à parte.
 */
export function videosJsonLd(items: VideoLike[], siteUrl: string) {
  return items
    .map((m) => {
      const id = youtubeId(m.url);
      if (!id) return null;
      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: m.title,
        description: [m.title, m.credit].filter(Boolean).join(" — "),
        thumbnailUrl: youtubeThumb(id),
        uploadDate: m.year ? `${m.year}-01-01` : undefined,
        duration: isoDuration(m.duration),
        embedUrl: youtubeEmbed(id),
        contentUrl: youtubeWatch(id),
        publisher: { "@type": "Person", name: "Pedro Lucena", url: siteUrl },
      };
    })
    .filter(Boolean);
}
