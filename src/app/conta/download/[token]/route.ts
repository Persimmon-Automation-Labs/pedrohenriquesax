import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readDownloadToken, readFile } from "@/lib/storage";
import { getCustomer } from "@/lib/customer/session";

/**
 * Entrega do arquivo. Três verificações, todas obrigatórias:
 *  1. token assinado e dentro da validade de 15 minutos
 *  2. pedido pago
 *  3. pedido pertence a quem está logado
 * O arquivo nunca tem URL pública.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payload = readDownloadToken(decodeURIComponent(token));
  if (!payload) return new NextResponse("Link expirado. Volte à sua conta e baixe de novo.", { status: 403 });

  const [order, file, customer] = await Promise.all([
    prisma.order.findUnique({ where: { id: payload.o } }),
    prisma.productFile.findUnique({ where: { id: payload.f } }),
    getCustomer(),
  ]);

  if (!order || !file) return new NextResponse("Não encontrado", { status: 404 });
  if (order.status !== "pago" && order.status !== "entregue") {
    return new NextResponse("Este pedido ainda não foi pago.", { status: 403 });
  }
  if (!customer || (customer.id !== order.customerId && customer.email !== order.customerEmail)) {
    return new NextResponse("Acesso negado.", { status: 403 });
  }
  const inOrder = (order.items as { productId: string }[]).some((i) => i.productId === file.productId);
  if (!inOrder) return new NextResponse("Acesso negado.", { status: 403 });

  try {
    const buf = await readFile("private", file.storageKey);
    await prisma.order.update({ where: { id: order.id }, data: { downloadCount: { increment: 1 } } });
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.label)}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch { return new NextResponse("Arquivo indisponível.", { status: 404 }); }
}
