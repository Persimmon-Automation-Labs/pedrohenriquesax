"use client";
import { useActionState } from "react";
import { placeOrder, type CheckoutState } from "./actions";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

export function CheckoutForm({ defaults }: { defaults: { name: string; email: string; phone: string } }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Alert kind="error">{state.error}</Alert>}
      <Field label="Nome completo" name="name" required autoComplete="name" defaultValue={defaults.name} error={state.fieldErrors?.name} />
      <Field label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email"
        defaultValue={defaults.email} hint="É por aqui que você recebe o acesso ao material." error={state.fieldErrors?.email} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="WhatsApp" name="phone" autoComplete="tel" inputMode="tel" defaultValue={defaults.phone} />
        <Field label="CPF" name="cpf" inputMode="numeric" hint="Opcional, para nota fiscal." />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted cursor-pointer">
        <input type="checkbox" name="terms" required value="on"
          className="mt-1 h-4 w-4 shrink-0 accent-[#D9A441] cursor-pointer" />
        <span>
          Li e aceito os <a href="/termos" target="_blank" className="link-underline">termos de compra</a> e a{" "}
          <a href="/privacidade" target="_blank" className="link-underline">política de privacidade</a>.
        </span>
      </label>

      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Gerando pedido…" : "Gerar código Pix"}
      </button>
    </form>
  );
}
