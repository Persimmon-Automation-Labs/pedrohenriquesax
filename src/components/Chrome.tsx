import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSettings } from "@/lib/settings";
import { cartCount } from "@/lib/cart";
import { getCustomer } from "@/lib/customer/session";

/** Cabeçalho e rodapé com os dados reais, para as rotas que não são a home. */
export async function Chrome({ children }: { children: React.ReactNode }) {
  const [settings, count, customer] = await Promise.all([getSettings(), cartCount(), getCustomer()]);
  return (
    <>
      <SiteHeader cartCount={count} loggedIn={!!customer} whatsapp={settings.whatsapp} />
      <main id="conteudo" className="pt-[68px] min-h-[60vh]">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
