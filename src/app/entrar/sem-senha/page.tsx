import Link from "next/link";
import { redirect } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { AuthForm, Field } from "@/components/AuthForm";
import { requestMagicLink } from "@/lib/customer/auth";
import { getCustomer } from "@/lib/customer/session";

/**
 * O caminho sem senha, numa página só dele.
 *
 * Antes os dois formulários apareciam juntos na tela de entrar, e a pessoa
 * tinha que decidir qual usar antes de saber que existiam dois. O padrão é
 * mostrar um método e revelar o segundo a pedido.
 */
export const dynamic = "force-dynamic";
export const metadata = { title: "Entrar sem senha", robots: { index: false } };

export default async function SemSenha() {
  if (await getCustomer()) redirect("/conta");
  return (
    <Chrome>
      <div className="wrap-narrow section section-first">
        <h1 className="d-l text-paper">Entrar sem senha</h1>
        <p className="mt-4 text-muted prose-w">
          Enviamos um link para o seu e-mail que te conecta direto. Vale por 15 minutos.
        </p>
        <div className="surface mt-7 rounded-[2px] p-6 md:p-8">
          <AuthForm action={requestMagicLink} submitLabel="Enviar link" showSuccessOnly>
            <Field scope="ml" label="E-mail" name="email" type="email" required inputMode="email" />
          </AuthForm>
        </div>
        <p className="mt-7 text-sm text-muted">
          <Link href="/entrar" className="link-underline">Entrar com senha</Link>
        </p>
      </div>
    </Chrome>
  );
}
