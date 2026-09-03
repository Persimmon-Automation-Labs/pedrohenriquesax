import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  basePath: process.env.NEXT_BASE_PATH || undefined,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};
export default nextConfig;
