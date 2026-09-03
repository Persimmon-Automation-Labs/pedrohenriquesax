import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: { default: "Pedro Lucena — Saxofonista em São Paulo", template: "%s · Pedro Lucena" },
  description:
    "Saxofonista, bacharel pela Souza Lima & Berklee. Big bands, jazz, eventos e mentoria online. Contratação para casamentos, eventos corporativos e shows.",
  openGraph: {
    type: "website", locale: "pt_BR", siteName: "Pedro Lucena",
    title: "Pedro Lucena — Saxofonista em São Paulo",
    description: "Saxofonista, bacharel pela Souza Lima & Berklee. Contratação, mentoria e materiais de estudo.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0b0d0e", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${mono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
