"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import type { GalleryItem } from "@prisma/client";

export function Gallery({ items, level = "h2" }: { level?: "h1" | "h2"; items: GalleryItem[] }) {
  const H = level;
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback((d: number) => {
    setOpen((cur) => (cur === null ? null : (cur + d + items.length) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, move]);

  if (!items.length) return null;

  return (
    <section id="galeria" className="section border-t border-white/10 bg-surface/40">
      <div className="wrap">
        <p className="label text-accent">Registros</p>
        <H className="d-l text-paper mt-4">Galeria</H>
        <ul className="mt-10 columns-2 md:columns-3 gap-4 [&>li]:mb-4">
          {items.map((g, i) => (
            <li key={g.id} className="break-inside-avoid">
              <button type="button" onClick={() => setOpen(i)}
                className="group block w-full overflow-hidden rounded-[2px] surface"
                aria-label={g.caption || `Abrir foto ${i + 1}`}>
                <span className="relative block w-full" style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "1/1" : "4/3" }}>
                  <Image src={g.url} alt={g.caption || `Pedro Lucena, foto ${i + 1}`} fill
                    sizes="(max-width:768px) 50vw, 33vw" className="object-cover zoom-img" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label="Foto ampliada"
          className="fixed inset-0 z-[80] bg-ink/97 flex items-center justify-center p-4 fade"
          onClick={() => setOpen(null)}>
          <div className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={items[open].url} alt={items[open].caption || "Foto ampliada"} fill sizes="100vw" className="object-contain" />
          </div>
          <button onClick={() => setOpen(null)} aria-label="Fechar" className="btn btn-ghost absolute right-4 top-4 z-10"><span className="label">Fechar</span></button>
          <button onClick={(e) => { e.stopPropagation(); move(-1); }} aria-label="Anterior" className="btn btn-ghost absolute left-2 top-1/2 -translate-y-1/2 z-10 text-2xl">‹</button>
          <button onClick={(e) => { e.stopPropagation(); move(1); }} aria-label="Próxima" className="btn btn-ghost absolute right-2 top-1/2 -translate-y-1/2 z-10 text-2xl">›</button>
        </div>
      )}
    </section>
  );
}
