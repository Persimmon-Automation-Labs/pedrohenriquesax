"use client";

import { useActionState, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { submitRequest, type FormState } from "@/app/actions";
import { Field } from "@/components/Field";
import { Alert } from "@/components/Alert";

type Tipo = "evento" | "mentoria";

/**
 * Um formulário só, com o tipo escolhido no topo.
 *
 * Antes eram dois formulários em páginas diferentes, cada um com o seu botão.
 * Quem chegava querendo aula pela página de eventos tinha que descobrir sozinho
 * que existia outro lugar. Agora a pergunta é a primeira coisa, e os campos
 * mudam conforme a resposta.
 *
 * Os detalhes ficam fechados de propósito. A taxa de conclusão cai de ~17%
 * com cinco campos à vista para ~7% com dez, e a versão anterior deste
 * formulário mostrava dez de uma vez. Cidade, duração e formato ajudam o Pedro
 * a orçar, mas nenhum deles vale perder a pessoa antes de ela escrever o nome —
 * ele pergunta isso na conversa, que é onde a informação sai de graça.
 */
export function RequestForm({ defaultTipo = "evento" }: { defaultTipo?: Tipo }) {
  const [tipo, setTipo] = useState<Tipo>(defaultTipo);
  const [state, action, pending] = useActionState<FormState, FormData>(submitRequest, {});

  if (state.ok) {
    return (
      <div className="flex flex-col gap-5 py-2">
        <Alert kind="ok">
          {tipo === "evento"
            ? "Recebi seu pedido. Vou te responder pelo WhatsApp."
            : "Inscrição recebida. Entro em contato para combinarmos o horário."}
        </Alert>
        {state.waUrl && (
          <a href={state.waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary self-start">
            Abrir no WhatsApp
          </a>
        )}
      </div>
    );
  }

  const evento = tipo === "evento";

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Alert kind="error">{state.error}</Alert>}

      <div className="field">
        <label htmlFor="rq-tipo">Sobre o que você quer falar</label>
        <select
          id="rq-tipo" name="tipo" className="select"
          value={tipo} onChange={(e) => setTipo(e.target.value as Tipo)}
        >
          <option value="evento">Contratar para um evento</option>
          <option value="mentoria">Aula particular de saxofone</option>
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field scope="rq" label="Nome" name="name" required autoComplete="name" error={state.fieldErrors?.name} />
        <Field scope="rq" label="WhatsApp" name="phone" autoComplete="tel" inputMode="tel" placeholder="(11) 90000-0000" />
      </div>
      <Field scope="rq" label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" error={state.fieldErrors?.email} />

      <Field
        scope="rq"
        label={evento ? "Sobre o evento" : "O que você quer desenvolver"}
        name="message"
        textarea
        placeholder={evento ? "Que tipo de evento, data e cidade, se já souber." : "Sonoridade, improvisação, leitura…"}
      />

      <details className="group border-t border-white/10 pt-4">
        <summary className="label flex cursor-pointer list-none items-center gap-2 text-faint transition-colors hover:text-muted">
          <CaretDown size={13} weight="bold" aria-hidden className="transition-transform group-open:rotate-180" />
          {evento ? "Detalhes do evento (opcional)" : "Sobre você (opcional)"}
        </summary>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {evento ? (
            <>
              <Field scope="rq" label="Data do evento" name="eventDate" placeholder="12/10/2026" />
              <Field scope="rq" label="Tipo de evento" name="eventType" placeholder="Casamento" />
              <Field scope="rq" label="Cidade" name="city" placeholder="São Paulo" />
              <Field scope="rq" label="Duração" name="duration" placeholder="2 horas" />
              <Field scope="rq" label="Formato desejado" name="format" placeholder="Sax e DJ" />
            </>
          ) : (
            <>
              <Field scope="rq" label="Há quanto tempo toca" name="level" placeholder="2 anos" />
              <Field scope="rq" label="Disponibilidade" name="availability" placeholder="Terças e quintas à noite" />
            </>
          )}
        </div>
      </details>

      <button type="submit" disabled={pending} className="btn btn-primary self-start">
        {pending ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
