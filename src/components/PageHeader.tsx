export function PageHeader({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <header className="wrap pt-10 pb-1 md:pt-12">
      <p className="label text-accent">{kicker}</p>
      <h1 className="d-l text-paper mt-3">{title}</h1>
      {lead && <p className="mt-5 text-lg text-muted prose-w">{lead}</p>}
    </header>
  );
}
