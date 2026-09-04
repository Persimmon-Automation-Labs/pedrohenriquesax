import { notFound } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { Chrome } from "@/components/Chrome";
import { brl } from "@/lib/money";
import { orderItems, STATUS_LABEL } from "@/lib/orders";
import { getCustomer } from "@/lib/customer/session";
import { CopyButton } from "@/components/CopyButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Seu pedido", robots: { index: false } };

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) notFound();

  // Só o dono vê. Sessão de cliente, nunca id adivinhável sozinho.
  const customer = await getCustomer();
  const isOwner = customer && (customer.id === order.customerId || customer.email === order.customerEmail);
  if (!isOwner) {
    return (
      <Chrome>
        <div className="wrap-narrow section text-center">
          <h1 className="d-l text-paper">Pedido protegido</h1>
          <p className="mt-5 text-muted">Entre com o e-mail usado na compra para ver este pedido.</p>
          <Link href={`/entrar?next=/pedido/${order.id}`} className="btn btn-primary mt-8">Entrar</Link>
        </div>
      </Chrome>
    );
  }

  const items = orderItems(order);
  const qr = order.pixPayload
    ? await QRCode.toDataURL(order.pixPayload, { margin: 1, width: 480, color: { dark: "#0B0D0E", light: "#F2F4F5" } })
    : null;
  const pending = order.status === "aguardando_pagamento";
  const paid = order.status === "pago" || order.status === "entregue";

  return (
    <Chrome>
      <div className="wrap-narrow section">
        <p className="label text-accent">Pedido {order.orderNumber}</p>
        <h1 className="d-l text-paper mt-4">
          {pending ? "Falta o pagamento" : paid ? "Pagamento confirmado" : STATUS_LABEL[order.status]}
        </h1>

        <div className="surface mt-8 rounded-[2px] p-6">
          <ul className="flex flex-col gap-3">
            {items.map((i) => (
              <li key={i.productId} className="flex items-baseline justify-between gap-4 text-sm">
                <span className="text-paper">{i.title}</span>
                <span className="mono text-muted">{brl(i.priceCents)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-baseline justify-between border-t border-black/10 pt-5">
            <span className="d-m text-paper">Total</span>
            <span className="mono text-2xl text-paper">{brl(order.totalCents)}</span>
          </div>
        </div>

        {pending && order.pixPayload && (
          <div className="surface mt-6 rounded-[2px] p-6 md:p-8">
            <p className="d-m text-paper">Pague com Pix</p>
            <p className="hint mt-2">Abra o aplicativo do seu banco, escolha Pix e leia o QR ou cole o código.</p>

            {qr && (
              <div className="mt-6 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt={`QR Code Pix do pedido ${order.orderNumber}`} width={220} height={220} className="rounded-[2px]" />
              </div>
            )}

            <div className="mt-6">
              <p className="label text-faint">Pix copia e cola</p>
              <p className="mono mt-2 break-all rounded-[2px] border border-black/10 bg-ink p-3 text-[0.7rem] leading-relaxed text-accent">
                {order.pixPayload}
              </p>
              <CopyButton text={order.pixPayload} />
            </div>

            <div className="mt-7 border-t border-black/10 pt-5">
              <p className="text-sm text-muted">
                Assim que o Pedro confirmar o recebimento, o material é liberado aqui e enviado no seu e-mail.
                Normalmente leva alguns minutos.
              </p>
            </div>
          </div>
        )}

        {pending && !order.pixPayload && (
          <div className="surface mt-6 rounded-[2px] p-6">
            <p className="text-danger text-sm">
              Não foi possível gerar o código Pix. Fale comigo pelo WhatsApp que eu resolvo na hora.
            </p>
          </div>
        )}

        {paid && (
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-muted">Seus materiais já estão liberados na sua conta.</p>
            <Link href="/conta" className="btn btn-primary self-start">Acessar meus materiais</Link>
          </div>
        )}

        <p className="mono mt-8 text-xs text-faint">
          Situação: {STATUS_LABEL[order.status]} · criado em{" "}
          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(order.createdAt)}
        </p>
      </div>
    </Chrome>
  );
}
