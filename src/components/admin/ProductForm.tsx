import Link from "next/link";
import type { Product, ProductFile } from "@prisma/client";
import { saveProduct, deleteProductFile, deleteProduct } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field } from "@/components/Field";

export function ProductForm({ product }: { product?: Product & { files: ProductFile[] } }) {
  return (
    <>
      <Link href="/admin/produtos" className="label text-faint hover:text-muted">← Produtos</Link>
      <h1 className="d-l text-paper mt-4">{product ? product.title : "Novo produto"}</h1>

      <div className="surface mt-8 rounded-[2px] p-6 md:p-8">
        <AdminForm action={saveProduct} encType="multipart/form-data" submitLabel={product ? "Salvar produto" : "Criar produto"}>
          {product && <input type="hidden" name="id" value={product.id} />}
          <Field label="Título" name="title" required defaultValue={product?.title} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Subtítulo" name="subtitle" defaultValue={product?.subtitle} />
            <Field label="Endereço (slug)" name="slug" defaultValue={product?.slug} hint="Deixe vazio para gerar do título." />
            <Field label="Preço" name="price" required defaultValue={product ? (product.priceCents / 100).toFixed(2).replace(".", ",") : ""} hint="Ex.: 150,00" inputMode="numeric" />
            <Field label="Ordem" name="sortOrder" defaultValue={String(product?.sortOrder ?? 0)} inputMode="numeric" />
          </div>
          <Field label="Descrição" name="description" textarea defaultValue={product?.description} />

          <label className="flex items-center gap-3 text-sm text-muted cursor-pointer">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="h-4 w-4 accent-[#1B6E8C]" />
            Visível na loja
          </label>

          <div className="field border-t border-black/10 pt-6">
            <label htmlFor="cover">Capa (quadrada)</label>
            <input id="cover" name="cover" type="file" accept="image/*" className="input pt-2.5" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="file">Arquivo entregue</label>
              <p className="hint">Vai para o depósito privado. Nunca fica acessível sem pedido pago.</p>
              <input id="file" name="file" type="file" className="input pt-2.5" />
            </div>
            <Field label="Nome do arquivo para o cliente" name="fileLabel" placeholder="Método completo (PDF)" />
          </div>
        </AdminForm>
      </div>

      {product && product.files.length > 0 && (
        <section className="mt-8">
          <p className="label text-faint">Arquivos deste produto</p>
          <ul className="mt-4">
            {product.files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 border-b border-black/10 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-paper truncate">{f.label}</p>
                  <p className="mono text-xs text-faint">{(f.sizeBytes / 1024).toFixed(0)} KB · {f.mimeType}</p>
                </div>
                <form action={deleteProductFile.bind(null, f.id)}>
                  <button className="btn btn-danger btn-sm">Remover</button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}

      {product && (
        <form action={deleteProduct.bind(null, product.id)} className="mt-10 border-t border-black/10 pt-6">
          <button className="btn btn-danger btn-sm">Excluir produto</button>
        </form>
      )}
    </>
  );
}
