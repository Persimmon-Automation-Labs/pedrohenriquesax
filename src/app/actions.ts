"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { sendMail, tpl } from "@/lib/email";
import { eventFormSchema, mentoriaFormSchema, generalFormSchema } from "@/lib/validate";
import { readCartIds, writeCartIds } from "@/lib/cart";

export type FormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string>; waUrl?: string };

function fieldErrors(e: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  const issues = (e as { issues?: { path: (string | number)[]; message: string }[] }).issues;
  if (issues) for (const i of issues) out[String(i.path[0])] = i.message;
  return out;
}

const siteUrl = () => process.env.SITE_URL || "http://localhost:3000";

async function notifyAdmin(kind: string, name: string, body: string) {
  const s = await getSettings();
  if (!s.email) return;
  const m = tpl.adminNewMessage({ kind, name, body, url: `${siteUrl()}/admin/mensagens` });
  await sendMail({ to: s.email, ...m });
}

/* ── Formulário de eventos: grava, notifica e devolve o WhatsApp preenchido ── */
export async function submitEventForm(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = eventFormSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Confira os campos destacados.", fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  await prisma.contactMessage.create({
    data: { kind: "evento", name: d.name, email: d.email, phone: d.phone ?? "", payload: d },
  });

  const linhas = [
    `Olá, Pedro! Vim pelo site.`,
    ``,
    `Nome: ${d.name}`,
    d.eventType && `Tipo de evento: ${d.eventType}`,
    d.eventDate && `Data: ${d.eventDate}`,
    d.city && `Cidade: ${d.city}`,
    d.duration && `Duração: ${d.duration}`,
    d.format && `Formato: ${d.format}`,
    d.message && ``,
    d.message && d.message,
  ].filter(Boolean) as string[];

  const s = await getSettings();
  await notifyAdmin("evento", d.name, linhas.join("\n"));

  const wa = s.whatsapp.replace(/\D/g, "");
  const waUrl = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(linhas.join("\n"))}` : "";
  return { ok: true, waUrl };
}

export async function submitMentoriaForm(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = mentoriaFormSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Confira os campos destacados.", fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  await prisma.contactMessage.create({
    data: { kind: "mentoria", name: d.name, email: d.email, phone: d.phone ?? "", payload: d },
  });
  await notifyAdmin("mentoria", d.name,
    [`Nome: ${d.name}`, `E-mail: ${d.email}`, d.phone && `Telefone: ${d.phone}`,
     d.level && `Nível: ${d.level}`, d.availability && `Disponibilidade: ${d.availability}`,
     d.goal && `\n${d.goal}`].filter(Boolean).join("\n"));
  return { ok: true };
}

export async function submitGeneralForm(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = generalFormSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Confira os campos destacados.", fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;
  await prisma.contactMessage.create({
    data: { kind: "geral", name: d.name, email: d.email, phone: d.phone ?? "", payload: d },
  });
  await notifyAdmin("geral", d.name, `${d.email}\n\n${d.message}`);
  return { ok: true };
}

/* ── Carrinho ── */
export async function addToCart(productId: string) {
  const ids = await readCartIds();
  if (!ids.includes(productId)) await writeCartIds([...ids, productId]);
  revalidatePath("/carrinho");
  redirect("/carrinho");
}

export async function removeFromCart(productId: string) {
  await writeCartIds((await readCartIds()).filter((i) => i !== productId));
  revalidatePath("/carrinho");
}
