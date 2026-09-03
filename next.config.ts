import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  basePath: process.env.NEXT_BASE_PATH || undefined,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    /* O otimizador reprocessava as fotos a cada visita. Elas mudam quando o
       Pedro troca o ensaio, não a cada request. */
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        // As fotos em public/fotos saíam com `max-age=0`: rebaixadas a cada visita.
        source: "/fotos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=604800" }],
      },
    ];
  },
};
export default nextConfig;
