"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdmin, setAdminSession, clearAdminSession } from "@/lib/admin/session";
import { putFile, deleteFile, publicUrl } from "@/lib/storage";
import { sendMail, tpl } from "@/lib/email";
import { brl, centsFromInput } from "@/lib/money";
import { orderItems } from "@/lib/orders";
import type { CredentialGroup, MediaKind, MediaContext, PixKeyType } from "@prisma/client";

export type AdminState = { error?: string; ok?: string };
const site = () => process.env.SITE_URL || "http://localhost:3000";

async function guard() {
  const a = await getAdmin();
  if (!a) redirect("/admin/login");
  return a;
}

/* ── Acesso ─────────────────────────────────────────────── */
export async function adminLogin(_p: AdminState, fd: FormData): Promise<AdminState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const u = await prisma.adminUser.findUnique({ where: { email } });
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return { error: "E-mail ou senha incorretos." };
  await setAdminSession(u.id);
  redirect("/admin");
}
export async function adminLogout() {
  await clearAdminSession();
  redirect("/admin/login");
}

/* ── Upload ─────────────────────────────────────────────── */
async function uploadFrom(fd: FormData, field: string, visibility: "public" | "private") {
  const f = fd.get(field);
  if (!(f instanceof File) || !f.size) return null;
  const key = await putFile(visibility, f.name, Buffer.from(await f.arrayBuffer()));
  return { key, name: f.name, size: f.size, type: f.type || "application/octet-stream" };
}

/* ── Pedidos ────────────────────────────────────────────── */
export async function confirmPayment(orderId: string) {
  const admin = await guard();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== "aguardando_pagamento") return;

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "pago", paidAt: new Date(), paidBy: admin.email },
  });

  await sendMail({
    to: order.customerEmail,
    ...tpl.orderPaid({ number: order.orderNumber, url: `${site()}/conta` }),
  });

  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
}

export async function setOrderStatus(orderId: string, status: "cancelado" | "reembolsado" | "entregue") {
  await guard();
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${orderId}`);
}

/* ── Configurações, incluindo a chave Pix ───────────────── */
export async function saveSettings(_p: AdminState, fd: FormData): Promise<AdminState> {
  await guard();
  const str = (k: string) => String(fd.get(k) ?? "").trim();

  const hero = await uploadFrom(fd, "heroImage", "public");
  const about = await uploadFrom(fd, "aboutImage", "public");
  const events = await uploadFrom(fd, "eventsImage", "public");
  const mentoria = await uploadFrom(fd, "mentoriaImage", "public");
  const creds = await uploadFrom(fd, "credentialsImage", "public");
  const contato = await uploadFrom(fd, "contactImage", "public");
  const resume = await uploadFrom(fd, "resume", "public");

  await prisma.siteSetting.update({
    where: { id: "main" },
    data: {
      name: str("name") || "Pedro Lucena",
      tagline: str("tagline"), city: str("city"),
      email: str("email"), whatsapp: str("whatsapp"),
      instagramUrl: str("instagramUrl"), youtubeUrl: str("youtubeUrl"),
      spotifyUrl: str("spotifyUrl"), tiktokUrl: str("tiktokUrl"), linkedinUrl: str("linkedinUrl"),
      pixKey: str("pixKey"),
      pixKeyType: (str("pixKeyType") || "email") as PixKeyType,
      pixName: str("pixName"), pixCity: str("pixCity") || "SAO PAULO",
      ...(hero && { heroImageUrl: publicUrl(hero.key) }),
      ...(about && { aboutImageUrl: publicUrl(about.key) }),
      ...(events && { eventsImageUrl: publicUrl(events.key) }),
      ...(mentoria && { mentoriaImageUrl: publicUrl(mentoria.key) }),
      ...(creds && { credentialsImageUrl: publicUrl(creds.key) }),
      ...(contato && { contactImageUrl: publicUrl(contato.key) }),
      ...(resume && { resumeUrl: publicUrl(resume.key) }),
    },
  });
  revalidatePath("/", "layout");
  return { ok: "Configurações salvas." };
}

export async function saveContent(_p: AdminState, fd: FormData): Promise<AdminState> {
  await guard();
  const str = (k: string) => String(fd.get(k) ?? "").trim();
  await prisma.siteSetting.update({
    where: { id: "main" },
    data: {
      bioShort: str("bioShort"), bioMedium: str("bioMedium"), bioLong: str("bioLong"),
      eventsText: str("eventsText"), mentoriaText: str("mentoriaText"),
      mentoriaDuration: str("mentoriaDuration") || "1h15", mentoriaPrice: str("mentoriaPrice"),
    },
  });
  revalidatePath("/", "layout");
  return { ok: "Conteúdo salvo." };
}

/* ── Produtos ───────────────────────────────────────────── */
export async function saveProduct(_p: AdminState, fd: FormData): Promise<AdminState> {
  await guard();
  const id = String(fd.get("id") ?? "");
  const str = (k: string) => String(fd.get(k) ?? "").trim();
  const title = str("title");
  if (!title) return { error: "Informe o título." };

  const slug = (str("slug") || title)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

  const cover = await uploadFrom(fd, "cover", "public");
  const data = {
    slug, title, subtitle: str("subtitle"), description: str("description"),
    priceCents: centsFromInput(str("price")),
    active: fd.get("active") === "on",
    sortOrder: Number(str("sortOrder") || 0),
    ...(cover && { coverUrl: publicUrl(cover.key) }),
  };

  const jaExiste = await prisma.product.findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) } });
  if (jaExiste) {
    return { error: `Já existe um produto com o endereço "${slug}". Mude o título ou informe outro endereço.` };
  }

  let product;
  try {
    product = id
      ? await prisma.product.update({ where: { id }, data })
      : await prisma.product.create({ data });
  } catch {
    return { error: "Não consegui salvar o produto. Confira os campos e tente de novo." };
  }

  const file = await uploadFrom(fd, "file", "private");
  if (file) {
    await prisma.productFile.create({
      data: {
        productId: product.id, label: str("fileLabel") || file.name,
        storageKey: file.key, sizeBytes: file.size, mimeType: file.type,
      },
    });
  }

  revalidatePath("/loja");
  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${product.id}`);
}

export async function deleteProductFile(fileId: string) {
  await guard();
  const f = await prisma.productFile.findUnique({ where: { id: fileId } });
  if (!f) return;
  await deleteFile("private", f.storageKey);
  await prisma.productFile.delete({ where: { id: fileId } });
  revalidatePath(`/admin/produtos/${f.productId}`);
}

export async function deleteProduct(id: string) {
  await guard();
  const files = await prisma.productFile.findMany({ where: { productId: id } });
  await Promise.all(files.map((f) => deleteFile("private", f.storageKey)));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

/* ── Credenciais ────────────────────────────────────────── */
export async function saveCredential(_p: AdminState, fd: FormData): Promise<AdminState> {
  await guard();
  const id = String(fd.get("id") ?? "");
  const artist = String(fd.get("artist") ?? "").trim();
  if (!artist) return { error: "Informe o nome." };
  const data = {
    artist,
    context: (String(fd.get("context") ?? "big_band")) as CredentialGroup,
    year: String(fd.get("year") ?? "").trim() || null,
    note: String(fd.get("note") ?? "").trim() || null,
    sortOrder: Number(fd.get("sortOrder") ?? 0),
  };
  if (id) await prisma.credential.update({ where: { id }, data });
  else await prisma.credential.create({ data });
  revalidatePath("/"); revalidatePath("/admin/credenciais");
  return { ok: "Credencial salva." };
}
export async function deleteCredential(id: string) {
  await guard();
  await prisma.credential.delete({ where: { id } });
  revalidatePath("/"); revalidatePath("/admin/credenciais");
}

/* ── Agenda ─────────────────────────────────────────────── */
export async function saveShow(_p: AdminState, fd: FormData): Promise<AdminState> {
  await guard();
  const venue = String(fd.get("venue") ?? "").trim();
  const dateRaw = String(fd.get("date") ?? "");
  if (!venue || !dateRaw) return { error: "Informe data e local." };
  await prisma.show.create({
    data: { date: new Date(dateRaw), venue, city: String(fd.get("city") ?? "").trim(), url: String(fd.get("url") ?? "").trim() },
  });
  revalidatePath("/"); revalidatePath("/admin/agenda");
  return { ok: "Apresentação adicionada." };
}
export async function deleteShow(id: string) {
  await guard();
  await prisma.show.delete({ where: { id } });
  revalidatePath("/"); revalidatePath("/admin/agenda");
}

/* ── Galeria ────────────────────────────────────────────── */
export async function addGalleryItems(_p: AdminState, fd: FormData): Promise<AdminState> {
  await guard();
  const files = fd.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { error: "Escolha ao menos uma foto." };
  const start = await prisma.galleryItem.count();
  let i = 0;
  for (const f of files) {
    const key = await putFile("public", f.name, Buffer.from(await f.arrayBuffer()));
    await prisma.galleryItem.create({ data: { url: publicUrl(key), sortOrder: start + i++ } });
  }
  revalidatePath("/"); revalidatePath("/admin/galeria");
  return { ok: `${files.length} foto(s) adicionada(s).` };
}
export async function deleteGalleryItem(id: string) {
  await guard();
  const g = await prisma.galleryItem.findUnique({ where: { id } });
  if (g) { await deleteFile("public", g.url.split("/").pop() ?? ""); await prisma.galleryItem.delete({ where: { id } }); }
  revalidatePath("/"); revalidatePath("/admin/galeria");
}
export async function moveGalleryItem(id: string, dir: -1 | 1) {
  await guard();
  const all = await prisma.galleryItem.findMany({ orderBy: { sortOrder: "asc" } });
  const idx = all.findIndex((g) => g.id === id);
  const swap = idx + dir;
  if (idx < 0 || swap < 0 || swap >= all.length) return;
  await prisma.$transaction([
    prisma.galleryItem.update({ where: { id: all[idx].id }, data: { sortOrder: swap } }),
    prisma.galleryItem.update({ where: { id: all[swap].id }, data: { sortOrder: idx } }),
  ]);
  revalidatePath("/"); revalidatePath("/admin/galeria");
}

/* ── Mídia ──────────────────────────────────────────────── */
export async function saveMedia(_p: AdminState, fd: FormData): Promise<AdminState> {
  await guard();
  const url = String(fd.get("url") ?? "").trim();
  const title = String(fd.get("title") ?? "").trim();
  if (!url || !title) return { error: "Informe título e link." };
  await prisma.mediaItem.create({
    data: {
      url, title,
      kind: (String(fd.get("kind") ?? "video")) as MediaKind,
      context: (String(fd.get("context") ?? "jazz")) as MediaContext,
      credit: String(fd.get("credit") ?? "").trim(),
      year: String(fd.get("year") ?? "").trim(),
      duration: String(fd.get("duration") ?? "").trim(),
      featured: fd.get("featured") === "on",
      sortOrder: await prisma.mediaItem.count(),
    },
  });
  revalidatePath("/"); revalidatePath("/eventos"); revalidatePath("/mentoria");
  revalidatePath("/sobre"); revalidatePath("/admin/midia");
  return { ok: "Item adicionado." };
}
/** Liga/desliga o destaque — é isto que decide o que aparece na home. */
export async function toggleMediaFeatured(id: string) {
  await guard();
  const m = await prisma.mediaItem.findUnique({ where: { id } });
  if (!m) return;
  await prisma.mediaItem.update({ where: { id }, data: { featured: !m.featured } });
  revalidatePath("/"); revalidatePath("/videos"); revalidatePath("/admin/midia");
}

/** Move o vídeo para outra página. */
export async function setMediaContext(id: string, context: MediaContext) {
  await guard();
  await prisma.mediaItem.update({ where: { id }, data: { context } });
  revalidatePath("/"); revalidatePath("/videos"); revalidatePath("/eventos");
  revalidatePath("/mentoria"); revalidatePath("/admin/midia");
}

/** Sobe ou desce um vídeo na ordem em que aparece. */
export async function moveMedia(id: string, dir: "up" | "down") {
  await guard();
  const todos = await prisma.mediaItem.findMany({ orderBy: { sortOrder: "asc" } });
  const i = todos.findIndex((m) => m.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= todos.length) return;
  await prisma.$transaction([
    prisma.mediaItem.update({ where: { id: todos[i].id }, data: { sortOrder: j } }),
    prisma.mediaItem.update({ where: { id: todos[j].id }, data: { sortOrder: i } }),
  ]);
  revalidatePath("/"); revalidatePath("/videos"); revalidatePath("/admin/midia");
}

export async function deleteMedia(id: string) {
  await guard();
  await prisma.mediaItem.delete({ where: { id } });
  revalidatePath("/"); revalidatePath("/eventos"); revalidatePath("/mentoria");
  revalidatePath("/sobre"); revalidatePath("/admin/midia");
}

/* ── Mensagens ──────────────────────────────────────────── */
export async function toggleMessageRead(id: string, read: boolean) {
  await guard();
  await prisma.contactMessage.update({ where: { id }, data: { readAt: read ? new Date() : null } });
  revalidatePath("/admin/mensagens");
}
export async function deleteMessage(id: string) {
  await guard();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/mensagens");
}

