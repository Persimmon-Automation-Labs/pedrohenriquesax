export function PageHeader({ kicker, title, lead }: { kicker: string; title: string; lead?: string }) {
  return (
    <header className="wrap pt-16 pb-2 md:pt-24">
      <p className="label text-accent">{kicker}</p>
      <h1 className="d-l text-paper mt-4">{title}</h1>
      {lead && <p className="mt-6 text-lg text-muted prose-w">{lead}</p>}
    </header>
  );
}
