import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { ProductCard } from "@/components/ProductCard";
import { Empty } from "@/components/Alert";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Loja",
  description: "E-books, métodos e materiais de estudo de saxofone por Pedro Lucena.",
};

export default async function Loja() {
  const products = await prisma.product.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  return (
    <Chrome>
      <div className="wrap section">
        <p className="label text-accent">Materiais de estudo</p>
        <h1 className="d-l text-paper mt-4">Loja</h1>
        <p className="mt-6 text-muted prose-w">
          Métodos e materiais que uso nas minhas aulas. Você paga por Pix e eu confirmo o recebimento manualmente — em até 2 horas, das 9h às 21h. Confirmado, o material aparece na sua conta e vai um e-mail de acesso.
        </p>

        {products.length ? (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <div className="mt-14">
            <Empty
              title="Ainda não há material publicado."
              body="A mentoria individual está aberta, e é onde uso esse mesmo material."
              action={<Link href="/#mentoria" className="btn btn-primary">Ver mentoria</Link>}
            />
          </div>
        )}
      </div>
    </Chrome>
  );
}
