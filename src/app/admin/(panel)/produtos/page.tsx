import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { brl } from "@/lib/money";
import { mediaUrl } from "@/lib/media-url";

export default async function Produtos() {
  const items = await prisma.product.findMany({ orderBy: { sortOrder: "asc" }, include: { files: true } });
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="d-l text-paper">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn btn-primary btn-sm">Novo produto</Link>
      </div>
      {items.length ? (
        <ul className="mt-8">
          {items.map((p) => (
            <li key={p.id} className="flex items-center gap-4 border-b border-black/10 py-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[2px] surface">
                {p.coverUrl && <Image src={mediaUrl(p.coverUrl)} alt="" fill sizes="56px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/produtos/${p.id}`} className="d-nar text-paper hover:text-accent transition-colors">{p.title}</Link>
                <p className="mono text-xs text-faint mt-1">{p.files.length} arquivo(s) · /loja/{p.slug}</p>
              </div>
              <span className="mono text-paper">{brl(p.priceCents)}</span>
              <span className={`pill ${p.active ? "text-ok" : "text-faint"}`}>{p.active ? "Ativo" : "Oculto"}</span>
            </li>
          ))}
        </ul>
      ) : <p className="mt-8 text-muted">Nenhum produto ainda.</p>}
    </>
  );
}
