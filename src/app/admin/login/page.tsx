"use client";
import { useActionState } from "react";
import { adminLogin, type AdminState } from "@/app/admin/actions";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

export default function AdminLogin() {
  const [state, action, pending] = useActionState<AdminState, FormData>(adminLogin, {});
  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="label text-accent">Painel</p>
        <h1 className="d-l text-paper mt-3">Entrar</h1>
        <form action={action} className="surface mt-8 flex flex-col gap-5 rounded-[2px] p-6">
          {state.error && <Alert kind="error">{state.error}</Alert>}
          <Field label="E-mail" name="email" type="email" required autoComplete="username" inputMode="email" />
          <Field label="Senha" name="password" type="password" required autoComplete="current-password" />
          <button disabled={pending} className="btn btn-primary">{pending ? "Entrando…" : "Entrar"}</button>
        </form>
      </div>
    </main>
  );
}
