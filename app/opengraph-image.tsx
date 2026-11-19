import { ImageResponse } from "next/og";

export const alt = "HookTos AI — Viral Hooks for Social Video";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          color: "#ffffff",
          background:
            "linear-gradient(135deg, #0b0f17 0%, #171a36 55%, #312e81 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
            color: "#a5b4fc",
          }}
        >
          HOOKTOS AI
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            maxWidth: 1000,
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.08,
          }}
        >
          Make every first second count.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#cbd5e1",
          }}
        >
          Viral hooks for Reels, Shorts, and TikTok
        </div>
        <div
          style={{
            display: "flex",
            width: 150,
            height: 8,
            marginTop: 44,
            borderRadius: 8,
            background: "#818cf8",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
