import Link from "next/link";
import { redirect } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { AuthForm, Field } from "@/components/AuthForm";
import { register } from "@/lib/customer/auth";
import { getCustomer } from "@/lib/customer/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Criar conta", robots: { index: false } };

export default async function CriarConta({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCustomer()) redirect("/conta");
  const next = (await searchParams).next;
  return (
    <Chrome>
      <div className="wrap-narrow section">
        <h1 className="d-l text-paper">Criar conta</h1>
        <p className="mt-4 text-muted">É por ela que você acessa os materiais que comprar, quando quiser.</p>
        <div className="surface mt-8 rounded-[2px] p-6 md:p-8">
          <AuthForm action={register} submitLabel="Criar conta" next={next}>
            <Field label="Nome" name="name" required autoComplete="name" />
            <Field label="E-mail" name="email" type="email" required autoComplete="email" inputMode="email" />
            <Field label="Senha" name="password" type="password" required autoComplete="new-password" hint="Pelo menos 8 caracteres." />
          </AuthForm>
        </div>
        <p className="mt-8 text-sm text-muted">
          Já tem conta? <Link href="/entrar" className="link-underline">Entrar</Link>
        </p>
      </div>
    </Chrome>
  );
}
