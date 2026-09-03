"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  { href: "/loja", label: "Loja" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeria", label: "Galeria" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader({ cartCount = 0, loggedIn = false }: { cartCount?: number; loggedIn?: boolean }) {
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
          solid || open ? "bg-ink/95 backdrop-blur border-b border-white/10" : "border-b border-transparent"
        }`}
      >
        <div className="wrap flex h-[68px] items-center justify-between gap-4">
          <Link href="/" className="d-nar text-paper shrink-0 text-[0.78rem] sm:text-[0.95rem]" style={{ fontVariationSettings: '"wdth" 112, "wght" 700', letterSpacing: "0.05em" }}>
            Pedro Lucena
          </Link>

          <nav aria-label="Principal" className="hidden lg:flex items-center gap-6">
            {LINKS.map((l) => {
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
            <Link href="/conta" aria-label={loggedIn ? "Minha conta" : "Entrar"} className="btn btn-ghost px-2 sm:px-3">
              <UserCircle size={20} weight="regular" aria-hidden />
              <span className="label hidden xl:inline">{loggedIn ? "Conta" : "Entrar"}</span>
            </Link>
            <Link href="/carrinho" aria-label={`Carrinho, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`} className="btn btn-ghost relative px-2 sm:px-3 gap-1.5">
              <ShoppingBagOpen size={20} weight="regular" aria-hidden />
              <span className="label hidden xl:inline">Carrinho</span>
              {cartCount > 0 && (
                <span className="mono text-[0.65rem] bg-accent text-ink rounded-[2px] px-1.5 py-0.5 leading-none" aria-live="polite">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="btn btn-ghost lg:hidden px-2 sm:px-3"
            >
              {open ? <X size={20} aria-hidden /> : <List size={20} aria-hidden />}
              <span className="label hidden xl:inline">{open ? "Fechar" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="menu-mobile" className="fixed inset-0 z-40 bg-ink pt-[68px] lg:hidden">
          <nav aria-label="Principal (celular)" className="wrap flex flex-col py-6">
            {LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="d-m text-paper hover:text-accent transition-colors border-b border-white/10 py-4"
                style={{ animation: `rise .5s cubic-bezier(.16,1,.3,1) ${i * 35}ms both` }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/conta"
              onClick={() => setOpen(false)}
              className="d-m text-accent hover:text-paper transition-colors border-b border-white/10 py-4"
              style={{ animation: `rise .5s cubic-bezier(.16,1,.3,1) ${LINKS.length * 35}ms both` }}
            >
              {loggedIn ? "Minha conta" : "Entrar"}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
