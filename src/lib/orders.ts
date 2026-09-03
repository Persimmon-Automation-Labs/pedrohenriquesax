import "server-only";
import { prisma } from "@/lib/prisma";
import { buildPixPayload } from "@/lib/pix";
import { getSettings } from "@/lib/settings";

/** PL-260902-A1B2 — legível no extrato e curto o bastante para o txid. */
export async function nextOrderNumber(): Promise<string> {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  for (let i = 0; i < 12; i++) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    const candidate = `PL${ymd}${suffix}`;
    if (!(await prisma.order.findUnique({ where: { orderNumber: candidate } }))) return candidate;
  }
  return `PL${ymd}${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

export type OrderItem = { productId: string; title: string; priceCents: number };

export async function buildPixForOrder(orderNumber: string, totalCents: number) {
  const s = await getSettings();
  if (!s.pixKey) return null;
  return buildPixPayload({
    key: s.pixKey,
    merchantName: s.pixName || s.name,
    merchantCity: s.pixCity,
    amountCents: totalCents,
    txid: orderNumber,
  });
}

export const orderItems = (o: { items: unknown }) => (o.items as OrderItem[]) ?? [];

export const STATUS_LABEL: Record<string, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  pago: "Pago",
  entregue: "Entregue",
  expirado: "Expirado",
  cancelado: "Cancelado",
  reembolsado: "Reembolsado",
};
