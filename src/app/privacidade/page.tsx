import { Chrome } from "@/components/Chrome";
export const dynamic = "force-dynamic";
export const metadata = { title: "Política de privacidade" };
export default function P() {
  return (
    <Chrome><div className="wrap-narrow section">
      <h1 className="d-l text-paper">Política de privacidade</h1>
      <div className="mt-8 flex flex-col gap-4 text-muted prose-w">
        <p>Este site coleta apenas os dados necessários para responder a um pedido de contratação, uma inscrição em mentoria ou uma compra: nome, e-mail, telefone, e as informações do evento ou do pedido.</p>
        <p>Os dados são usados exclusivamente para esse atendimento. Não são vendidos nem compartilhados com terceiros para fins comerciais.</p>
        <p>Senhas são armazenadas de forma criptografada e não podem ser lidas por ninguém, inclusive por nós. Toda a comunicação com o site é cifrada.</p>
        <p>Nos termos da Lei nº 13.709/2018 (LGPD), você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados. Basta escrever para o e-mail de contato no rodapé.</p>
      </div>
    </div></Chrome>
  );
}
