"use client";
import { useActionState } from "react";
import { submitMentoriaForm, type FormState } from "@/app/actions";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

export function Mentoria({ duration, price, text, level = "h2" }: { level?: "h1" | "h2"; duration: string; price: string; text: string }) {
  const H = level;
  const [state, action, pending] = useActionState<FormState, FormData>(submitMentoriaForm, {});
  return (
    <section id="mentoria" className="section border-t border-white/10 bg-surface/40">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="label text-accent">Aulas</p>
          <H className="d-l text-paper mt-4">Mentoria online</H>
          {text && <p className="mt-6 text-muted prose-w">{text}</p>}
          <dl className="mt-8 flex flex-col">
            <div className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3">
              <dt className="label text-faint">Duração</dt>
              <dd className="mono text-paper">{duration}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3">
              <dt className="label text-faint">Investimento</dt>
              <dd className="mono text-paper">{price || "Sob consulta"}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3">
              <dt className="label text-faint">Formato</dt>
              <dd className="mono text-paper">Individual, online</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <div className="surface rounded-[2px] p-6 md:p-8">
            {state.ok ? (
              <div className="py-6">
                <Alert kind="ok">Inscrição recebida. Vou entrar em contato para combinarmos o horário.</Alert>
              </div>
            ) : (
              <form action={action} className="flex flex-col gap-5">
                <div>
                  <p className="d-m text-paper">Quero estudar</p>
                  <p className="hint mt-1">Me conta onde você está e onde quer chegar.</p>
                </div>
                {state.error && <Alert kind="error">{state.error}</Alert>}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field scope="mt" label="Nome" name="name" required autoComplete="name" error={state.fieldErrors?.name} />
                  <Field scope="mt" label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" error={state.fieldErrors?.email} />
                  <Field scope="mt" label="WhatsApp" name="phone" autoComplete="tel" inputMode="tel" />
                  <Field scope="mt" label="Há quanto tempo toca" name="level" placeholder="2 anos" />
                </div>
                <Field scope="mt" label="Disponibilidade" name="availability" placeholder="Terças e quintas à noite" />
                <Field scope="mt" label="O que você quer desenvolver" name="goal" textarea placeholder="Sonoridade, improvisação, leitura…" />
                <button type="submit" disabled={pending} className="btn btn-primary self-start">
                  {pending ? "Enviando…" : "Quero estudar"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
