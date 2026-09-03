"use client";
import { useEffect, useRef } from "react";

/**
 * Revelação no scroll. IntersectionObserver, uma vez só, e completamente
 * desligada sob prefers-reduced-motion. Nunca escuta o evento de scroll.
 */
export function Reveal({
  children, delay = 0, className = "", as: As = "div",
}: {
  children: React.ReactNode; delay?: number; className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.transitionDelay = `${delay}ms`;
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  // @ts-expect-error ref polimórfico
  return <As ref={ref} className={`reveal ${className}`}>{children}</As>;
}
