export function Alert({ kind = "info", children }: { kind?: "info" | "error" | "ok"; children: React.ReactNode }) {
  const tone =
    kind === "error" ? "border-danger/45 text-danger"
    : kind === "ok" ? "border-ok/45 text-ok"
    : "border-white/15 text-muted";
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`surface border ${tone} rounded-[2px] px-4 py-3 text-sm`}>
      {children}
    </div>
  );
}

export function Empty({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="surface rounded-[2px] px-6 py-14 text-center">
      <p className="d-m text-paper">{title}</p>
      {body && <p className="mt-3 text-muted mx-auto max-w-md">{body}</p>}
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-white/5 rounded-[2px] animate-pulse ${className}`} />;
}
