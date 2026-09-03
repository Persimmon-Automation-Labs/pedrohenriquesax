import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("E-mail inválido");
export const nameSchema = z.string().trim().min(2, "Informe seu nome").max(120);
export const phoneSchema = z.string().trim().max(32).optional().default("");
export const passwordSchema = z.string().min(8, "A senha precisa de pelo menos 8 caracteres").max(200);

export const eventFormSchema = z.object({
  name: nameSchema, email: emailSchema, phone: phoneSchema,
  eventDate: z.string().trim().max(40).optional().default(""),
  eventType: z.string().trim().max(80).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  duration: z.string().trim().max(40).optional().default(""),
  format: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
});

export const mentoriaFormSchema = z.object({
  name: nameSchema, email: emailSchema, phone: phoneSchema,
  level: z.string().trim().max(60).optional().default(""),
  goal: z.string().trim().max(2000).optional().default(""),
  availability: z.string().trim().max(200).optional().default(""),
});

export const generalFormSchema = z.object({
  name: nameSchema, email: emailSchema, phone: phoneSchema,
  message: z.string().trim().min(4, "Escreva uma mensagem").max(2000),
});

export const checkoutSchema = z.object({
  name: nameSchema, email: emailSchema,
  phone: z.string().trim().max(32).optional().default(""),
  cpf: z.string().trim().max(20).optional().default(""),
  terms: z.union([z.literal("on"), z.literal("true"), z.boolean()]),
});
