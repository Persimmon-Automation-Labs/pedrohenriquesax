/**
 * Prefixa o basePath em caminhos de mídia guardados no banco.
 *
 * O banco guarda "/midia/x.jpg", sem prefixo, para continuar válido se o site
 * ganhar domínio próprio e o basePath sumir. O next/image NÃO prefixa o `src`
 * sozinho: ele monta /pedro-lucena/_next/image?url=/midia/x.jpg, e o otimizador
 * então busca um caminho que não existe. Por isso o prefixo é aplicado aqui,
 * na renderização.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || process.env.NEXT_BASE_PATH || "";

export function mediaUrl(url: string): string {
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  if (BASE && url.startsWith(BASE + "/")) return url;
  return `${BASE}${url}`;
}
