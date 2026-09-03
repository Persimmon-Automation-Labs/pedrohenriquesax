import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditarProduto({ params }: { params: Promise<{ id: string }> }) {
  const p = await prisma.product.findUnique({ where: { id: (await params).id }, include: { files: true } });
  if (!p) notFound();
  return <ProductForm product={p} />;
}
