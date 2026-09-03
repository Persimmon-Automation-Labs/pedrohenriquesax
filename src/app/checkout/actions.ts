"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCart, writeCartIds } from "@/lib/cart";
import { checkoutSchema } from "@/lib/validate";
import { nextOrderNumber, buildPixForOrder, type OrderItem } from "@/lib/orders";
import { getCustomer, setCustomerSession } from "@/lib/customer/session";
import { getSettings } from "@/lib/settings";
import { sendMail, tpl } from "@/lib/email";
import { brl } from "@/lib/money";
import { TERMS_VERSION } from "@/lib/constants";

export type CheckoutState = { error?: string; fieldErrors?: Record<string, string> };

export async function placeOrder(_prev: CheckoutState, fd: FormData): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) {
    const fe: Record<string, string> = {};
    for (const i of parsed.error.issues) fe[String(i.path[0])] = i.message;
    return { error: "Confira os campos destacados.", fieldErrors: fe };
  }
  const d = parsed.data;

  const { items, totalCents } = await getCart();
  if (!items.length) return { error: "Seu carrinho está vazio." };

  // Conta: reaproveita a sessão, ou acha pelo e-mail, ou cria na hora.
  let customer = await getCustomer();
  if (!customer) {
    customer =
      (await prisma.customer.findUnique({ where: { email: d.email } })) ??
      (await prisma.customer.create({ data: { email: d.email, name: d.name, phone: d.phone } }));
    await setCustomerSession(customer.id);
  }

  const orderNumber = await nextOrderNumber();
  const orderItems: OrderItem[] = items.map((p) => ({ productId: p.id, title: p.title, priceCents: p.priceCents }));
  const pixPayload = await buildPixForOrder(orderNumber, totalCents);

  const order = await prisma.order.create({
    data: {
      orderNumber, customerId: customer.id,
      customerName: d.name, customerEmail: d.email, customerPhone: d.phone ?? "", customerCpf: d.cpf || null,
      items: orderItems, totalCents, pixPayload,
      termsAcceptedAt: new Date(), termsVersion: TERMS_VERSION,
    },
  });

  await writeCartIds([]);

  const site = process.env.SITE_URL || "http://localhost:3000";
  const url = `${site}/pedido/${order.id}`;
  const s = await getSettings();

  await sendMail({ to: d.email, ...tpl.orderCreated({ number: orderNumber, total: brl(totalCents), pix: pixPayload ?? "(chave Pix não configurada)", url }) });
  if (s.email) {
    await sendMail({ to: s.email, ...tpl.adminNewOrder({ number: orderNumber, total: brl(totalCents), customer: d.name, url: `${site}/admin/pedidos/${order.id}` }) });
  }

  redirect(`/pedido/${order.id}`);
}
