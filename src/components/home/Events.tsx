"use client";
import { useActionState } from "react";
import Image from "next/image";
import { submitEventForm, type FormState } from "@/app/actions";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

const FORMATOS = ["Sax e playback", "Sax e DJ", "DJ, cantora e sax", "Duo", "Trio", "Com banda", "Quinteto autoral"];
const SEGMENTOS = ["Casamento", "Corporativo", "Igreja", "Recepção", "Baile", "Live sax", "Show autoral"];

export function Events({ imageUrl, text, level = "h2" }: { level?: "h1" | "h2"; imageUrl: string; text: string }) {
  const H = level;
  const [state, action, pending] = useActionState<FormState, FormData>(submitEventForm, {});

  return (
    <section id="eventos" className="section border-t border-white/10">
      <div className="wrap">
        <div className="max-w-3xl">
          <p className="label text-accent">Contratação</p>
          <H className="d-l text-paper mt-4">Eventos</H>
          {text && <p className="mt-6 text-muted prose-w">{text}</p>}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <p className="label text-faint border-b border-white/10 pb-3">Segmentos atendidos</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SEGMENTOS.map((f) => (
                  <li key={f} className="pill text-muted !font-sans !normal-case !tracking-normal !text-[0.8rem] px-2.5 py-1">{f}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label text-faint border-b border-white/10 pb-3">Formatos</p>
              <ul className="mt-4 flex flex-col">
                {FORMATOS.map((f) => (
                  <li key={f} className="d-nar text-paper text-[1rem] border-b border-white/[0.07] py-2.5">{f}</li>
                ))}
              </ul>
            </div>
            {imageUrl && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-[2px] group">
                <Image src={imageUrl} alt="Pedro Lucena em evento" fill sizes="(max-width:1024px) 100vw, 40vw" className="object-cover zoom-img" />
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="surface rounded-[2px] p-6 md:p-8">
              {state.ok ? (
                <div className="flex flex-col gap-5 py-4">
                  <Alert kind="ok">Recebi seu pedido. Vou te responder pelo WhatsApp.</Alert>
                  {state.waUrl && (
                    <>
                      <p className="text-muted text-sm">
                        Clique abaixo para abrir a conversa já com os dados do seu evento preenchidos.
                      </p>
                      <a href={state.waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary self-start">
                        Abrir no WhatsApp
                      </a>
                    </>
                  )}
                </div>
              ) : (
                <form action={action} className="flex flex-col gap-5">
                  <div>
                    <p className="d-m text-paper">Pedir um orçamento</p>
                    <p className="hint mt-1">Preencha e a conversa abre no WhatsApp já com tudo escrito.</p>
                  </div>
                  {state.error && <Alert kind="error">{state.error}</Alert>}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field scope="ev" label="Nome" name="name" required autoComplete="name" error={state.fieldErrors?.name} />
                    <Field scope="ev" label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" error={state.fieldErrors?.email} />
                    <Field scope="ev" label="WhatsApp" name="phone" autoComplete="tel" inputMode="tel" placeholder="(11) 90000-0000" />
                    <Field scope="ev" label="Data do evento" name="eventDate" placeholder="12/10/2026" />
                    <Field scope="ev" label="Tipo de evento" name="eventType" placeholder="Casamento" />
                    <Field scope="ev" label="Cidade" name="city" placeholder="São Paulo" />
                    <Field scope="ev" label="Duração" name="duration" placeholder="2 horas" />
                    <Field scope="ev" label="Formato desejado" name="format" placeholder="Sax e DJ" />
                  </div>
                  <Field scope="ev" label="Observações" name="message" textarea placeholder="Conte um pouco sobre o evento." />
                  <button type="submit" disabled={pending} className="btn btn-primary self-start">
                    {pending ? "Enviando…" : "Enviar e abrir WhatsApp"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
