import { Chrome } from "@/components/Chrome";
import { AuthForm, Field } from "@/components/AuthForm";
import { resetPassword } from "@/lib/customer/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Redefinir senha", robots: { index: false } };

export default async function RedefinirSenha({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token ?? "";
  return (
    <Chrome>
      <div className="wrap-narrow section">
        <h1 className="d-l text-paper">Criar nova senha</h1>
        <div className="surface mt-8 rounded-[2px] p-6 md:p-8">
          <AuthForm action={resetPassword} submitLabel="Salvar nova senha">
            <input type="hidden" name="token" value={token} />
            <Field label="Nova senha" name="password" type="password" required autoComplete="new-password" hint="Pelo menos 8 caracteres." />
          </AuthForm>
        </div>
      </div>
    </Chrome>
  );
}
