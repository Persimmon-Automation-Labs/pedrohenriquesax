import { readFile } from "@/lib/storage";
import { NextResponse } from "next/server";

/** Imagens do site. O depósito privado nunca passa por aqui. */
export async function GET(_r: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  try {
    const buf = await readFile("public", key);
    const ext = key.split(".").pop()?.toLowerCase();
    const type = ext === "png" ? "image/png" : ext === "webp" ? "image/webp"
      : ext === "avif" ? "image/avif" : ext === "pdf" ? "application/pdf" : "image/jpeg";
    return new NextResponse(new Uint8Array(buf), {
      headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch { return new NextResponse("Não encontrado", { status: 404 }); }
}
