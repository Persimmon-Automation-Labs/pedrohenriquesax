"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { randomToken, hashToken } from "@/lib/crypto";
import { setCustomerSession, clearCustomerSession } from "@/lib/customer/session";
import { sendMail, tpl } from "@/lib/email";
import { emailSchema, nameSchema, passwordSchema } from "@/lib/validate";

export type AuthState = { error?: string; ok?: string };
const site = () => process.env.SITE_URL || "http://localhost:3000";
const safeNext = (n: string | null | undefined) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/conta");

/* Limite simples de tentativas, por e-mail, em memória do processo. */
const attempts = new Map<string, { n: number; t: number }>();
function rateLimited(key: string, max = 6, windowMs = 10 * 60_000) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || now - a.t > windowMs) { attempts.set(key, { n: 1, t: now }); return false; }
  a.n += 1;
  return a.n > max;
}

export async function register(_p: AuthState, fd: FormData): Promise<AuthState> {
  const name = nameSchema.safeParse(fd.get("name"));
  const email = emailSchema.safeParse(fd.get("email"));
  const pass = passwordSchema.safeParse(fd.get("password"));
  if (!name.success) return { error: "Informe seu nome." };
  if (!email.success) return { error: "E-mail inválido." };
  if (!pass.success) return { error: "A senha precisa de pelo menos 8 caracteres." };

  const existing = await prisma.customer.findUnique({ where: { email: email.data } });
  if (existing?.passwordHash) return { error: "Já existe uma conta com esse e-mail. Tente entrar." };

  const passwordHash = await bcrypt.hash(pass.data, 10);
  const c = existing
    ? await prisma.customer.update({ where: { id: existing.id }, data: { passwordHash, name: name.data } })
    : await prisma.customer.create({ data: { email: email.data, name: name.data, passwordHash } });

  await setCustomerSession(c.id);
  redirect(safeNext(fd.get("next") as string));
}

export async function login(_p: AuthState, fd: FormData): Promise<AuthState> {
  const email = emailSchema.safeParse(fd.get("email"));
  const password = String(fd.get("password") ?? "");
  if (!email.success) return { error: "E-mail ou senha incorretos." };
  if (rateLimited(`login:${email.data}`)) return { error: "Muitas tentativas. Espere alguns minutos." };

  const c = await prisma.customer.findUnique({ where: { email: email.data } });
  // Mensagem genérica de propósito: não revela se o e-mail existe.
  if (!c?.passwordHash || !(await bcrypt.compare(password, c.passwordHash))) {
    return { error: "E-mail ou senha incorretos." };
  }
  await setCustomerSession(c.id);
  redirect(safeNext(fd.get("next") as string));
}

export async function requestMagicLink(_p: AuthState, fd: FormData): Promise<AuthState> {
  const email = emailSchema.safeParse(fd.get("email"));
  const generic = { ok: "Se existir uma conta com esse e-mail, o link de acesso já está a caminho." };
  if (!email.success) return generic;
  if (rateLimited(`magic:${email.data}`, 4)) return generic;

  const c = await prisma.customer.findUnique({ where: { email: email.data } });
  if (c) {
    const token = randomToken();
    await prisma.customerLoginToken.create({
      data: { tokenHash: hashToken(token), email: c.email, purpose: "magic_link", expiresAt: new Date(Date.now() + 15 * 60_000) },
    });
    await sendMail({ to: c.email, ...tpl.magicLink(`${site()}/entrar/link?token=${token}`) });
  }
  return generic;
}

export async function requestPasswordReset(_p: AuthState, fd: FormData): Promise<AuthState> {
  const email = emailSchema.safeParse(fd.get("email"));
  const generic = { ok: "Se existir uma conta com esse e-mail, o link de redefinição já está a caminho." };
  if (!email.success) return generic;
  if (rateLimited(`reset:${email.data}`, 4)) return generic;

  const c = await prisma.customer.findUnique({ where: { email: email.data } });
  if (c) {
    const token = randomToken();
    await prisma.customerLoginToken.create({
      data: { tokenHash: hashToken(token), email: c.email, purpose: "password_reset", expiresAt: new Date(Date.now() + 60 * 60_000) },
    });
    await sendMail({ to: c.email, ...tpl.passwordReset(`${site()}/redefinir-senha?token=${token}`) });
  }
  return generic;
}

/** Consome um token de uso único e devolve o e-mail, ou null. */
export async function consumeToken(token: string, purpose: "magic_link" | "password_reset") {
  const row = await prisma.customerLoginToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!row || row.purpose !== purpose || row.consumedAt || row.expiresAt < new Date()) return null;
  await prisma.customerLoginToken.update({ where: { id: row.id }, data: { consumedAt: new Date() } });
  return row.email;
}

export async function resetPassword(_p: AuthState, fd: FormData): Promise<AuthState> {
  const token = String(fd.get("token") ?? "");
  const pass = passwordSchema.safeParse(fd.get("password"));
  if (!pass.success) return { error: "A senha precisa de pelo menos 8 caracteres." };

  const email = await consumeToken(token, "password_reset");
  if (!email) return { error: "Este link expirou ou já foi usado. Peça um novo." };

  const c = await prisma.customer.update({
    where: { email }, data: { passwordHash: await bcrypt.hash(pass.data, 10) },
  });
  await setCustomerSession(c.id);
  redirect("/conta");
}

export async function updateProfile(_p: AuthState, fd: FormData): Promise<AuthState> {
  const { getCustomer } = await import("@/lib/customer/session");
  const c = await getCustomer();
  if (!c) return { error: "Sessão expirada." };
  const name = nameSchema.safeParse(fd.get("name"));
  if (!name.success) return { error: "Informe seu nome." };
  await prisma.customer.update({
    where: { id: c.id }, data: { name: name.data, phone: String(fd.get("phone") ?? "").slice(0, 32) },
  });
  return { ok: "Dados atualizados." };
}

export async function logout() {
  await clearCustomerSession();
  redirect("/");
}
