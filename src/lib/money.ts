export function brl(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function centsFromInput(v: string): number {
  const n = Number(String(v).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}
