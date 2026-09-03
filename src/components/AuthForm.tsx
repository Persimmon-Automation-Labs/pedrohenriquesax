"use client";
import { useActionState } from "react";
import type { AuthState } from "@/lib/customer/auth";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

export function AuthForm({
  action, submitLabel, next, children, showSuccessOnly,
}: {
  action: (p: AuthState, fd: FormData) => Promise<AuthState>;
  submitLabel: string; next?: string; children?: React.ReactNode; showSuccessOnly?: boolean;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});
  if (showSuccessOnly && state.ok) return <Alert kind="ok">{state.ok}</Alert>;
  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && <Alert kind="error">{state.error}</Alert>}
      {state.ok && <Alert kind="ok">{state.ok}</Alert>}
      {next && <input type="hidden" name="next" value={next} />}
      {children}
      <button type="submit" disabled={pending} className="btn btn-primary">
        {pending ? "Aguarde…" : submitLabel}
      </button>
    </form>
  );
}
export { Field };
