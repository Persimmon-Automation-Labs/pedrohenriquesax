import { ImageResponse } from "next/og";

/** O favicon que faltava — `/favicon.ico` respondia 404 em toda página. */
export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#4fa8c4", color: "#0b0d0e", fontSize: 19, fontWeight: 800, letterSpacing: -1,
        }}
      >
        PL
      </div>
    ),
    { ...size },
  );
}
