import Link from "next/link";

/**
 * A tela de endereço errado. Antes era o padrão do Next: "404: This page could
 * not be found." — em inglês, sem marca e sem saída, num site em português.
 *
 * Sem banco e sem `Chrome` de propósito: é a página que precisa funcionar
 * justamente quando alguma outra coisa não funcionou.
 */
export const metadata = { title: "Página não encontrada", robots: { index: false, follow: false } };

const SAIDAS: [string, string, string][] = [
  ["/eventos", "Eventos", "Contratação para casamento, corporativo e show"],
  ["/mentoria", "Mentoria", "Aula individual online de saxofone"],
  ["/sobre", "Sobre", "Trajetória, formação e credenciais"],
  ["/contato", "Contato", "Falar comigo direto"],
];

export default function NotFound() {
  return (
    <main className="wrap-narrow flex min-h-[100dvh] flex-col justify-center py-24">
      <p className="label text-accent">Erro 404</p>
      <h1 className="d-l text-paper mt-4">Essa página não existe</h1>
      <p className="mt-6 text-muted prose-w">
        O endereço pode ter mudado, ou o link que te trouxe até aqui veio com um pedaço a menos.
      </p>

      <ul className="mt-12 border-t border-white/10">
        {SAIDAS.map(([href, title, body]) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex flex-col gap-1 border-b border-white/10 py-5 transition-colors hover:bg-surface"
            >
              <span className="d-m text-paper transition-colors group-hover:text-accent">{title}</span>
              <span className="text-sm text-muted">{body}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link href="/" className="btn btn-primary">Voltar ao início</Link>
      </div>
    </main>
  );
}
