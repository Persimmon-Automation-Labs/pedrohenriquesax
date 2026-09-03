"use client";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="btn btn-secondary mt-4 w-full sm:w-auto"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch {}
        setDone(true); setTimeout(() => setDone(false), 2200);
      }}>
      <span aria-live="polite">{done ? "Código copiado" : "Copiar código Pix"}</span>
    </button>
  );
}
