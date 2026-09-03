"use client";
import { useActionState } from "react";
import type { AdminState } from "@/app/admin/actions";
import { Alert } from "@/components/Alert";

export function AdminForm({
  action, submitLabel = "Salvar", children, encType,
}: {
  action: (p: AdminState, fd: FormData) => Promise<AdminState>;
  submitLabel?: string; children: React.ReactNode; encType?: string;
}) {
  const [state, formAction, pending] = useActionState<AdminState, FormData>(action, {});
  return (
    <form action={formAction} encType={encType} className="flex flex-col gap-5">
      {state.error && <Alert kind="error">{state.error}</Alert>}
      {state.ok && <Alert kind="ok">{state.ok}</Alert>}
      {children}
      <button disabled={pending} className="btn btn-primary self-start">{pending ? "Salvando…" : submitLabel}</button>
    </form>
  );
}
