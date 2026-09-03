import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { addGalleryItems, deleteGalleryItem, moveGalleryItem } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { mediaUrl } from "@/lib/media-url";

export default async function Galeria() {
  const items = await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <h1 className="d-l text-paper">Galeria</h1>
      <div className="surface mt-8 rounded-[2px] p-6">
        <AdminForm action={addGalleryItems} encType="multipart/form-data" submitLabel="Enviar fotos">
          <div className="field">
            <label htmlFor="photos">Fotos</label>
            <p className="hint">Pode escolher várias de uma vez.</p>
            <input id="photos" name="photos" type="file" accept="image/*" multiple className="input pt-2.5" />
          </div>
        </AdminForm>
      </div>
      {items.length ? (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((g) => (
            <li key={g.id} className="surface rounded-[2px] overflow-hidden">
              <div className="relative aspect-square"><Image src={mediaUrl(g.url)} alt="" fill sizes="200px" className="object-cover" /></div>
              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <form action={moveGalleryItem.bind(null, g.id, -1)}><button className="btn btn-ghost btn-sm px-2" aria-label="Mover para trás">←</button></form>
                  <form action={moveGalleryItem.bind(null, g.id, 1)}><button className="btn btn-ghost btn-sm px-2" aria-label="Mover para frente">→</button></form>
                </div>
                <form action={deleteGalleryItem.bind(null, g.id)}><button className="btn btn-ghost btn-sm text-danger px-2" aria-label="Remover">✕</button></form>
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="mt-8 text-muted">Nenhuma foto ainda.</p>}
    </>
  );
}
