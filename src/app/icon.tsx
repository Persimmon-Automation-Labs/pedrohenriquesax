import { ImageResponse } from "next/og";

/**
 * O "PL" — o Pedro gostou deste e pediu para voltar.
 *
 * Isto é o ícone da aba, e só ele: o logotipo dele continua no cabeçalho do
 * site. Aqui a marca dele não caberia, porque o monograma dela é fino demais
 * para 32px.
 */
export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center",
          background: "#89CFF0", color: "#0E2430",
          fontSize: 38, fontWeight: 800, letterSpacing: -2,
        }}
      >
        PL
      </div>
    ),
    { ...size },
  );
}
