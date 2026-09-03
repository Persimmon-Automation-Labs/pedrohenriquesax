"use client";
import { useActionState } from "react";
import { submitGeneralForm, type FormState } from "@/app/actions";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitGeneralForm, {});
  if (state.ok) return <Alert kind="ok">Mensagem recebida. Respondo assim que possível.</Alert>;
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Alert kind="error">{state.error}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field scope="ct" label="Nome" name="name" required autoComplete="name" error={state.fieldErrors?.name} />
        <Field scope="ct" label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" error={state.fieldErrors?.email} />
      </div>
      <Field scope="ct" label="WhatsApp" name="phone" autoComplete="tel" inputMode="tel" />
      <Field scope="ct" label="Mensagem" name="message" textarea required error={state.fieldErrors?.message} />
      <button disabled={pending} className="btn btn-primary self-start">{pending ? "Enviando…" : "Enviar mensagem"}</button>
    </form>
  );
}
