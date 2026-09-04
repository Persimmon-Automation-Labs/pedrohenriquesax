"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mediaUrl } from "@/lib/media-url";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBagOpen, List, X, UserCircle } from "@phosphor-icons/react";

/**
 * Uma linha, sempre. 68px. Abaixo de 1024px vira gaveta em tela cheia,
 * com o carrinho permanecendo visível na barra.
 *
 * Esse é o defeito visível do site do Braxton Cook (nav quebrando em duas
 * linhas a 1440px) e ele não se repete aqui.
 */
const LINKS = [
  { href: "/sobre", label: "Sobre" },
  { href: "/eventos", label: "Eventos" },
  { href: "/mentoria", label: "Mentoria" },
  { href: "/videos", label: "Vídeos" },
  { href: "/loja", label: "Loja" },
  { href: "/agenda", label: "Agenda" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader({ cartCount = 0, loggedIn = false, whatsapp = "", hasProducts = true, hasShows = true }: {
  cartCount?: number; loggedIn?: boolean; whatsapp?: string; hasProducts?: boolean; hasShows?: boolean;
}) {
  /* Loja sem produto e agenda sem data não entram no menu: um link que só leva
     a um pedido de desculpas custa mais do que a ausência dele. */
  const links = LINKS.filter((l) =>
    (l.href !== "/loja" || hasProducts) && (l.href !== "/agenda" || hasShows));
  const wa = whatsapp.replace(/\D/g, "");
  /* Abrir uma conversa em branco faz a pessoa ter que inventar a primeira
     frase, que é onde muita gente desiste. O texto já vai escrito. */
  const waHref = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent("Olá, Pedro! Vim pelo site e queria um orçamento para um evento.")}`
    : "";
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" });
    const sentinel = document.getElementById("top-sentinel");
    if (sentinel) io.observe(sentinel);
    else setSolid(true);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid || open ? "chrome-top backdrop-blur border-b border-black/10" : "border-b border-transparent"
        }`}
      >
        <div className="wrap flex h-[68px] items-center justify-between gap-4">
          {/* O monograma dele ao lado do nome. Estava só no ícone da aba, que
              é onde ninguém procura por uma marca. */}
          <Link href="/" className="flex min-h-[44px] shrink-0 items-center gap-2.5 sm:gap-3">
            <Image
              src={mediaUrl("/marca/monograma-escuro.png")}
              alt=""
              width={150}
              height={170}
              priority
              className="h-[22px] w-auto sm:h-[26px]"
            />
            <span
              className="d-nar uppercase text-paper text-[0.78rem] sm:text-[0.95rem]"
              style={{ fontVariationSettings: '"wdth" 112, "wght" 700', letterSpacing: "0.05em" }}
            >
              Pedro Lucena
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden lg:flex items-center gap-6">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`label transition-colors ${active ? "text-accent" : "text-muted hover:text-paper"}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            {/* A ação que dá dinheiro estava fora do cabeçalho no celular: só
                sobravam "entrar" e um carrinho de loja vazia. Abaixo de sm a
                linha não comporta mais um botão, então lá ele abre a gaveta
                como primeiro item. */}
            {wa && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm mr-1 hidden sm:inline-flex"
              >
                Contratar
              </a>
            )}
            <Link href="/conta" aria-label={loggedIn ? "Minha conta" : "Entrar"} title={loggedIn ? "Minha conta" : "Entrar"} className="btn btn-ghost px-2 sm:px-3">
              <UserCircle size={22} weight="regular" aria-hidden />
            </Link>
            {hasProducts && <Link href="/carrinho" aria-label={`Carrinho, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`} title="Carrinho" className="btn btn-ghost relative px-2 sm:px-3 gap-1.5">
              <ShoppingBagOpen size={22} weight="regular" aria-hidden />
              {cartCount > 0 && (
                <span className="mono text-[0.65rem] bg-accent text-ink rounded-[2px] px-1.5 py-0.5 leading-none" aria-live="polite">
                  {cartCount}
                </span>
              )}
            </Link>}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"} title={open ? "Fechar" : "Menu"}
              className="btn btn-ghost lg:hidden px-2 sm:px-3"
            >
              {open ? <X size={22} aria-hidden /> : <List size={22} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="menu-mobile" className="fixed inset-0 z-40 bg-ink pt-[68px] lg:hidden">
          <nav aria-label="Principal (celular)" className="wrap flex flex-col py-6">
            {wa && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="btn btn-primary mb-5 w-full"
                style={{ animation: "rise .5s cubic-bezier(.16,1,.3,1) both" }}
              >
                Contratar pelo WhatsApp
              </a>
            )}
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="d-m text-paper hover:text-accent transition-colors border-b border-black/10 py-4"
                style={{ animation: `rise .5s cubic-bezier(.16,1,.3,1) ${i * 35}ms both` }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/conta"
              onClick={() => setOpen(false)}
              className="d-m text-accent hover:text-paper transition-colors border-b border-black/10 py-4"
              style={{ animation: `rise .5s cubic-bezier(.16,1,.3,1) ${links.length * 35}ms both` }}
            >
              {loggedIn ? "Minha conta" : "Entrar"}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
