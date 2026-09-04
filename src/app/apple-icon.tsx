import { ImageResponse } from "next/og";

/** Ícone de quando alguém salva o site na tela inicial do iPhone. */
export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", background: "#0b0d0e",
        }}
      >
        <div style={{ display: "flex", fontSize: 78, fontWeight: 800, color: "#d9a441", letterSpacing: -4 }}>PL</div>
        <div style={{ display: "flex", marginTop: 12, width: 44, height: 3, background: "#d9a441" }} />
      </div>
    ),
    { ...size },
  );
}
