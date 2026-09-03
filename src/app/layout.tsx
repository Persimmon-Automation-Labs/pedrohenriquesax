import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/* Só o subconjunto `latin`: ele já cobre todo o português (à á â ã ç é ê í ó ô õ ú
   vivem em Latin-1). Carregar `latin-ext` junto dobrava os arquivos de fonte sem
   render um caractere a mais neste site. Um peso de mono basta — o `.mono` nunca
   pede negrito. Quatro arquivos viraram dois. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jetbrains",
});

const SITE = process.env.SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Pedro Lucena — Saxofonista em São Paulo", template: "%s · Pedro Lucena" },
  description:
    "Saxofonista, bacharel pela Souza Lima & Berklee. Big bands, jazz, eventos e mentoria online. Contratação para casamentos, eventos corporativos e shows.",
  alternates: { canonical: "/" },
  /* O link deste site quase sempre chega às pessoas colado numa conversa de
     WhatsApp — é para lá que o botão principal manda. Sem `images` aqui, esse
     link aparece como texto cinza sem foto nenhuma. A imagem é gerada em
     `opengraph-image.tsx`. */
  openGraph: {
    type: "website", locale: "pt_BR", siteName: "Pedro Lucena", url: "/",
    title: "Pedro Lucena — Saxofonista em São Paulo",
    description: "Saxofonista, bacharel pela Souza Lima & Berklee. Contratação, mentoria e materiais de estudo.",
  },
  twitter: {
    card: "summary_large_image",
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
