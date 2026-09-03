import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { consumeToken } from "@/lib/customer/auth";
import { setCustomerSession } from "@/lib/customer/session";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const email = await consumeToken(token, "magic_link");
  const base = process.env.SITE_URL || new URL(req.url).origin;
  if (!email) return NextResponse.redirect(new URL("/entrar?erro=link", base));
  const c = await prisma.customer.findUnique({ where: { email } });
  if (!c) return NextResponse.redirect(new URL("/entrar?erro=link", base));
  await setCustomerSession(c.id);
  return NextResponse.redirect(new URL("/conta", base));
}
