import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Smaky Track — Cigarette Smoking Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(107,98,242,0.3), transparent)",
          }}
        />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              backgroundColor: "rgba(107,98,242,0.2)",
              border: "1px solid rgba(107,98,242,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            🚬
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <h1
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: "#e5e5e5",
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              Smaky Track
            </h1>
            <p
              style={{
                fontSize: 24,
                color: "#686868",
                margin: 0,
                textAlign: "center",
                maxWidth: 700,
              }}
            >
              Cigarette smoking tracker & analytics platform
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 8,
            }}
          >
            {["Track habits", "Analytics", "Reduce spending"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#b2b2b2",
                  fontSize: 16,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
