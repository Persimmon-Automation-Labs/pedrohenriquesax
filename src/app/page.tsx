import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { cartCount } from "@/lib/cart";
import { getCustomer } from "@/lib/customer/session";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/home/Hero";
import { StorePreview } from "@/components/home/StorePreview";
import { VideoSection } from "@/components/VideoSection";
import { Agenda } from "@/components/home/Agenda";
import { Reveal } from "@/components/Reveal";
import { videosJsonLd } from "@/lib/youtube";

export const dynamic = "force-dynamic";

const CAMINHOS = [
  { href: "/eventos", kicker: "Contratação", title: "Eventos", body: "Casamentos de alto padrão, corporativo, live sax, shows autorais. Sete formatos, do solo ao quinteto." },
  { href: "/mentoria", kicker: "Aulas", title: "Mentoria online", body: "Individual, 1h15. De sonoridade a improvisação, no ponto em que você está." },
  { href: "/loja", kicker: "Estudo", title: "Métodos e e‑books", body: "Os materiais que uso com meus alunos, para baixar na hora." },
];

export default async function Home() {
  const [settings, videos, products, shows, count, customer, produtosAtivos, showsFuturos] = await Promise.all([
    getSettings(),
    /* Quem escolhe o que aparece na home é o Pedro, pela caixa "destaque" no
       painel — não uma regra de ordenação escondida aqui. */
    prisma.mediaItem.findMany({
      where: { kind: "video", featured: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
    prisma.show.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 4 }),
    cartCount(),
    getCustomer(),
    prisma.product.count({ where: { active: true } }),
    prisma.show.count({ where: { date: { gte: new Date() } } }),
  ]);

  const site = process.env.SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Person",
    name: settings.name, jobTitle: "Saxofonista",
    description: settings.bioShort || settings.bioMedium, url: site,
    address: { "@type": "PostalAddress", addressLocality: settings.city, addressCountry: "BR" },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Faculdade Souza Lima & Berklee College of Music" },
      { "@type": "EducationalOrganization", name: "Escola de Música do Estado de São Paulo (EMESP)" },
    ],
    knowsAbout: ["Saxofone", "Jazz", "Big Band", "Música brasileira", "Improvisação"],
    areaServed: settings.city,
    sameAs: [settings.instagramUrl, settings.youtubeUrl, settings.spotifyUrl, settings.tiktokUrl, settings.linkedinUrl].filter(Boolean),
  };

  const videoLd = videosJsonLd(videos, site);

  return (
    <>
      <div id="top-sentinel" aria-hidden className="absolute top-0 h-px w-px" />
      <SiteHeader cartCount={count} loggedIn={!!customer} whatsapp={settings.whatsapp} hasProducts={produtosAtivos > 0} hasShows={showsFuturos > 0} />
      <main id="conteudo">
        <Hero settings={settings} />

        <section aria-labelledby="caminhos" className="section border-t border-black/10">
          <h2 id="caminhos" className="sr-only">O que eu faço</h2>
          {/* Antes isto era um grid com fundo branco a 10% e gap de 1px: o fundo
              aparecia nas bordas externas e virava duas faixas cinzas soltas nos
              lados. Agora a divisória é borda de verdade, só entre os cartões. */}
          <div className="wrap grid sm:grid-cols-3 sm:divide-x sm:divide-black/10 divide-y sm:divide-y-0 divide-black/10 border-y border-black/10">
            {CAMINHOS.map((c, i) => (
              <Reveal key={c.href} delay={i * 80}>
                <Link href={c.href} className="group flex h-full flex-col gap-3 p-7 transition-colors hover:bg-black/[0.03]">
                  <p className="label text-accent">{c.kicker}</p>
                  <p className="d-m text-paper group-hover:text-accent transition-colors">{c.title}</p>
                  <p className="text-sm text-muted">{c.body}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Onde ficava a parede de credenciais. Um solo tocando prova mais do
            que trinta e uma linhas afirmando, e não obriga ninguém a acreditar. */}
        <VideoSection
          items={videos}
          lead
          id="midia"
          kicker="Ouvir e assistir"
          title="Assista"
          verMais
        />

        <StorePreview products={products} />
        <Agenda shows={shows} />
      </main>
      <SiteFooter settings={settings} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {videoLd.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      )}
    </>
  );
}
