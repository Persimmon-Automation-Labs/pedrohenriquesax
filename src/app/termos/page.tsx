import { Chrome } from "@/components/Chrome";
export const metadata = { title: "Termos de compra" };
export default function T() {
  return (
    <Chrome><div className="wrap-narrow section">
      <h1 className="d-l text-paper">Termos de compra</h1>
      <div className="mt-8 flex flex-col gap-4 text-muted prose-w">
        <p><strong className="text-paper">Produtos.</strong> Os materiais vendidos aqui são digitais: e-books, métodos e arquivos de estudo. Não há envio físico.</p>
        <p><strong className="text-paper">Pagamento.</strong> Por Pix, à vista. O valor vai direto para a conta do titular do site. O código Pix é gerado no momento do pedido e vale para aquele pedido.</p>
        <p><strong className="text-paper">Entrega.</strong> Assim que o recebimento for confirmado, o material é liberado na sua conta e um e-mail de acesso é enviado. A confirmação é feita manualmente, então pode levar alguns minutos.</p>
        <p><strong className="text-paper">Arrependimento.</strong> Conforme o artigo 49 do Código de Defesa do Consumidor, você pode desistir da compra em até 7 dias corridos, contados do recebimento, e receber o valor de volta. Basta escrever para o e-mail de contato.</p>
        <p><strong className="text-paper">Uso.</strong> O material é para uso pessoal. Não é permitido redistribuir, revender ou compartilhar publicamente os arquivos.</p>
      </div>
    </div></Chrome>
  );
}
