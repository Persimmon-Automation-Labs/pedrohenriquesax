import { Chrome } from "@/components/Chrome";
import { AuthForm, Field } from "@/components/AuthForm";
import { requestPasswordReset } from "@/lib/customer/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Esqueci minha senha", robots: { index: false } };

export default function EsqueciSenha() {
  return (
    <Chrome>
      <div className="wrap-narrow section">
        <h1 className="d-l text-paper">Esqueci minha senha</h1>
        <p className="mt-4 text-muted">Informe seu e-mail e enviamos um link para criar uma nova senha.</p>
        <div className="surface mt-8 rounded-[2px] p-6 md:p-8">
          <AuthForm action={requestPasswordReset} submitLabel="Enviar link" showSuccessOnly>
            <Field label="E-mail" name="email" type="email" required inputMode="email" />
          </AuthForm>
        </div>
      </div>
    </Chrome>
  );
}
