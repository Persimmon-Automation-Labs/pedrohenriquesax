import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";

/**
 * SMTP autenticado quando configurado. Sem SMTP (desenvolvimento e verificação),
 * grava o e-mail em .mail/ para poder inspecionar o que teria sido enviado.
 */
type Mail = { to: string; subject: string; html: string; text: string };

export async function sendMail({ to, subject, html, text }: Mail) {
  const host = process.env.SMTP_HOST;
  if (host) {
    const t = nodemailer.createTransport({
      host, port: Number(process.env.SMTP_PORT || 465), secure: true,
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    });
    await t.sendMail({ from: process.env.MAIL_FROM, to, subject, html, text });
    return { delivered: "smtp" as const };
  }
  const dir = path.join(process.cwd(), ".mail");
  await fs.mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${to.replace(/[^a-z0-9]/gi, "_")}.html`;
  await fs.writeFile(path.join(dir, name),
    `<!-- para: ${to} | assunto: ${subject} -->\n${html}`);
  return { delivered: "file" as const, file: name };
}

const SHELL = (title: string, body: string) => `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#0B0D0E;font-family:-apple-system,Segoe UI,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
<table width="100%" style="max-width:520px" cellpadding="0" cellspacing="0">
<tr><td style="padding-bottom:28px"><span style="font-size:19px;font-weight:800;letter-spacing:.08em;color:#fff;text-transform:uppercase">PEDRO LUCENA</span></td></tr>
<tr><td style="background:#14191C;border:1px solid rgba(255,255,255,.09);border-radius:3px;padding:28px">
<h1 style="margin:0 0 16px;font-size:19px;color:#F2F4F5;font-weight:700">${title}</h1>
${body}
</td></tr>
<tr><td style="padding-top:22px;font-size:12px;color:#6A757B">pedrolucenasax.com</td></tr>
</table></td></tr></table></body></html>`;

const P = (t: string) => `<p style="margin:0 0 13px;font-size:15px;line-height:1.6;color:#C0CACE">${t}</p>`;
const BTN = (href: string, label: string) =>
  `<p style="margin:22px 0 4px"><a href="${href}" style="display:inline-block;background:#4FA8C4;color:#0B0D0E;text-decoration:none;padding:13px 22px;border-radius:2px;font-weight:700;font-size:13px;letter-spacing:.08em;text-transform:uppercase">${label}</a></p>`;
const CODE = (t: string) =>
  `<p style="margin:14px 0;padding:13px;background:#0B0D0E;border:1px solid rgba(255,255,255,.14);border-radius:2px;font-family:ui-monospace,Menlo,monospace;font-size:11px;color:#4FA8C4;word-break:break-all;line-height:1.55">${t}</p>`;

export const tpl = {
  orderCreated: (o: { number: string; total: string; pix: string; url: string }) => ({
    subject: `Pedido ${o.number} — falta o pagamento`,
    html: SHELL("Pedido recebido", P(`Seu pedido <strong style="color:#F2F4F5">${o.number}</strong> foi registrado no valor de <strong style="color:#F2F4F5">${o.total}</strong>.`) + P("Copie o código Pix abaixo e pague pelo aplicativo do seu banco:") + CODE(o.pix) + P("Assim que o Pedro confirmar o recebimento, o arquivo é liberado na sua conta e você recebe um e-mail. Normalmente leva alguns minutos.") + BTN(o.url, "Ver meu pedido")),
    text: `Pedido ${o.number} — ${o.total}\n\nPix copia e cola:\n${o.pix}\n\nAcompanhe em: ${o.url}`,
  }),
  orderPaid: (o: { number: string; url: string }) => ({
    subject: `Pagamento confirmado — pedido ${o.number}`,
    html: SHELL("Pagamento confirmado", P(`O pagamento do pedido <strong style="color:#F2F4F5">${o.number}</strong> foi confirmado.`) + P("Seus materiais já estão disponíveis na sua conta.") + BTN(o.url, "Acessar meus materiais")),
    text: `Pagamento do pedido ${o.number} confirmado. Acesse: ${o.url}`,
  }),
  magicLink: (url: string) => ({
    subject: "Seu link de acesso",
    html: SHELL("Entrar na sua conta", P("Use o botão abaixo para entrar. O link vale por 15 minutos e só pode ser usado uma vez.") + BTN(url, "Entrar") + P("Se não foi você que pediu, pode ignorar este e-mail.")),
    text: `Entre com este link (15 min): ${url}`,
  }),
  passwordReset: (url: string) => ({
    subject: "Redefinir sua senha",
    html: SHELL("Redefinir senha", P("Use o botão abaixo para criar uma nova senha. O link vale por 1 hora.") + BTN(url, "Criar nova senha") + P("Se não foi você que pediu, pode ignorar este e-mail — sua senha continua a mesma.")),
    text: `Redefina sua senha (1h): ${url}`,
  }),
  adminNewOrder: (o: { number: string; total: string; customer: string; url: string }) => ({
    subject: `Novo pedido ${o.number} — ${o.total}`,
    html: SHELL("Novo pedido", P(`<strong style="color:#F2F4F5">${o.customer}</strong> fez um pedido de <strong style="color:#F2F4F5">${o.total}</strong>.`) + P("Confirme assim que o Pix cair no seu extrato.") + BTN(o.url, "Abrir pedido")),
    text: `Novo pedido ${o.number} de ${o.customer} — ${o.total}. ${o.url}`,
  }),
  adminNewMessage: (m: { kind: string; name: string; body: string; url: string }) => ({
    subject: `Nova mensagem (${m.kind}) — ${m.name}`,
    html: SHELL("Nova mensagem", P(`De <strong style="color:#F2F4F5">${m.name}</strong>, pelo formulário de ${m.kind}.`) + CODE(m.body) + BTN(m.url, "Ver no painel")),
    text: `Mensagem de ${m.name} (${m.kind}):\n${m.body}\n${m.url}`,
  }),
};
