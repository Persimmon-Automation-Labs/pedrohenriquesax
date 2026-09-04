import Link from "next/link";
import { redirect } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { AuthForm, Field } from "@/components/AuthForm";
import { login } from "@/lib/customer/auth";
import { getCustomer } from "@/lib/customer/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar", robots: { index: false } };

export default async function Entrar({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCustomer()) redirect("/conta");
  const next = (await searchParams).next;
  return (
    <Chrome>
      <div className="wrap-narrow section section-first">
        <h1 className="d-l text-paper">Entrar</h1>
        <div className="surface mt-7 rounded-[2px] p-6 md:p-8">
          <AuthForm action={login} submitLabel="Entrar" next={next}>
            <Field label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" />
            <Field label="Senha" name="password" type="password" required autoComplete="current-password" />
          </AuthForm>
          <p className="mt-4 text-sm">
            <Link href="/esqueci-senha" className="link-underline">Esqueci minha senha</Link>
          </p>
        </div>

        {/* Um método por vez: o segundo caminho é um botão, não um segundo
            formulário competindo pela mesma tela. */}
        <Link href="/entrar/sem-senha" className="btn btn-secondary mt-5 w-full">
          Prefere entrar sem senha?
        </Link>

        <p className="mt-8 text-sm text-muted">
          Ainda não tem conta? <Link href="/criar-conta" className="link-underline">Criar conta</Link>
        </p>
      </div>
    </Chrome>
  );
}
