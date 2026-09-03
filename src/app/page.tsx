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
  { href: "/loja", kicker: "Estudo", title: "Métodos e e-books", body: "Os materiais que uso com meus alunos, para baixar na hora." },
];

export default async function Home() {
  const [settings, videos, products, shows, count, customer] = await Promise.all([
    getSettings(),
    /* Destaque primeiro (o solo com a Big Band do Global Jazz), depois os dois
       primeiros de eventos — Tierry e Léo Jaime. Um vídeo de musicalidade e
       dois de nome reconhecível: a home atende os dois públicos sem virar
       uma página de mídia. */
    prisma.mediaItem.findMany({
      where: { kind: "video" },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      take: 3,
    }),
    prisma.product.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" }, take: 3 }),
    prisma.show.findMany({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" }, take: 4 }),
    cartCount(),
    getCustomer(),
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
      <SiteHeader cartCount={count} loggedIn={!!customer} whatsapp={settings.whatsapp} />
      <main id="conteudo">
        <Hero settings={settings} />

        <section aria-labelledby="caminhos" className="section border-t border-white/10">
          <h2 id="caminhos" className="sr-only">O que eu faço</h2>
          <div className="wrap grid gap-px sm:grid-cols-3 bg-white/10">
            {CAMINHOS.map((c, i) => (
              <Reveal key={c.href} delay={i * 80}>
                <Link href={c.href} className="group flex h-full flex-col gap-3 bg-ink p-7 transition-colors hover:bg-surface">
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
          body="Um solo, e duas gravações com quem me chamou para gravar."
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
