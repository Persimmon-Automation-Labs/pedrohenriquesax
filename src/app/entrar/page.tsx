import Link from "next/link";
import { redirect } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { AuthForm, Field } from "@/components/AuthForm";
import { login, requestMagicLink } from "@/lib/customer/auth";
import { getCustomer } from "@/lib/customer/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar", robots: { index: false } };

export default async function Entrar({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCustomer()) redirect("/conta");
  const next = (await searchParams).next;
  return (
    <Chrome>
      <div className="wrap-narrow section">
        <h1 className="d-l text-paper">Entrar</h1>
        <div className="surface mt-8 rounded-[2px] p-6 md:p-8">
          <AuthForm action={login} submitLabel="Entrar" next={next}>
            <Field label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" />
            <Field label="Senha" name="password" type="password" required autoComplete="current-password" />
          </AuthForm>
          <p className="mt-4 text-sm">
            <Link href="/esqueci-senha" className="link-underline">Esqueci minha senha</Link>
          </p>
        </div>

        <div className="surface mt-6 rounded-[2px] p-6 md:p-8">
          <p className="d-m text-paper">Entrar sem senha</p>
          <p className="hint mt-1 mb-5">Enviamos um link que te conecta direto. Vale por 15 minutos.</p>
          <AuthForm action={requestMagicLink} submitLabel="Enviar link" showSuccessOnly>
            <Field scope="ml" label="E-mail" name="email" type="email" required inputMode="email" />
          </AuthForm>
        </div>

        <p className="mt-8 text-sm text-muted">
          Ainda não tem conta? <Link href="/criar-conta" className="link-underline">Criar conta</Link>
        </p>
      </div>
    </Chrome>
  );
}
