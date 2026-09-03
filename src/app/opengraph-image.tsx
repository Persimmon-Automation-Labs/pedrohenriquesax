import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

/**
 * A imagem que aparece quando alguém cola o link do site no WhatsApp.
 *
 * É o formato em que este site mais vai ser visto: o botão principal do herói
 * abre uma conversa, então o caminho normal até aqui é alguém mandando o
 * endereço para outra pessoa. Sem esta imagem o link chega como texto cinza.
 *
 * Desenhada a partir do retrato que já está no repositório, com a mesma
 * vinheta do herói — nada a preencher depois. Quando o Pedro mandar uma foto
 * feita para 1200×630, basta trocar o arquivo em `public/fotos/`.
 */
export const runtime = "nodejs";
export const alt = "Pedro Lucena — saxofonista em São Paulo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0b0d0e";
const PAPER = "#f2f4f5";
const ACCENT = "#4fa8c4";

export default async function OpengraphImage() {
  let photo = "";
  try {
    /* Caminho relativo estático (não `process.cwd()` + join): assim o tracing
       do Turbopack enxerga exatamente este arquivo, em vez de concluir que a
       rota lê o projeto inteiro. */
    const buf = await readFile(new URL("../../public/fotos/hero.jpg", import.meta.url));
    photo = `data:image/jpeg;base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    // Sem a foto o cartão ainda sai: fundo do tema, tipografia igual.
  }

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: INK, position: "relative" }}>
        {photo ? (
          <img
            src={photo}
            width={size.width}
            height={size.height}
            style={{ position: "absolute", top: 0, left: 0, width: size.width, height: size.height, objectFit: "cover", objectPosition: "72% 18%" }}
          />
        ) : null}

        <div
          style={{
            position: "absolute", top: 0, left: 0, width: size.width, height: size.height,
            background: `linear-gradient(100deg, ${INK} 10%, rgba(11,13,14,0.88) 46%, rgba(11,13,14,0.28) 84%, rgba(11,13,14,0) 100%)`,
          }}
        />

        <div
          style={{
            position: "relative", display: "flex", flexDirection: "column", justifyContent: "center",
            width: 780, height: "100%", padding: "0 76px",
          }}
        >
          <div style={{ display: "flex", color: ACCENT, fontSize: 21, letterSpacing: 4, textTransform: "uppercase" }}>
            Saxofonista · São Paulo
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
            <div style={{ display: "flex", fontSize: 108, fontWeight: 800, color: PAPER, lineHeight: 1, letterSpacing: -3, textTransform: "uppercase" }}>
              Pedro
            </div>
            <div style={{ display: "flex", fontSize: 108, fontWeight: 800, color: PAPER, lineHeight: 1, letterSpacing: -3, textTransform: "uppercase" }}>
              Lucena
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 30, fontSize: 27, color: "rgba(242,244,245,0.82)", lineHeight: 1.35 }}>
            Souza Lima &amp; Berklee · big bands, jazz e eventos
          </div>

          <div style={{ display: "flex", marginTop: 26, width: 64, height: 3, background: ACCENT }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
