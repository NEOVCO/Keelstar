import { ImageResponse } from "next/og";

export const alt = "Keelstar — Operational Workflow Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Text-free branded mark to avoid build-time font fetching in restricted environments.
// Replace with a typographic OG image once a local font file is added to /public.
export default function Og() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FBFAF8",
          padding: 0,
        }}
      >
        <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
          <div style={{ position: "absolute", left: 80, top: 80, width: 120, height: 120, border: "10px solid #1F3A5F", borderRadius: 28, display: "flex" }} />
          <div style={{ position: "absolute", left: 80, top: 134, width: 120, height: 10, background: "#1F3A5F" }} />
          <div style={{ position: "absolute", left: 134, top: 80, width: 10, height: 120, background: "#1F3A5F" }} />
          <div style={{ position: "absolute", left: 80, bottom: 80, width: 1040, height: 6, background: "#E8E4DC", display: "flex" }} />
          <div style={{ position: "absolute", left: 80, bottom: 120, width: 760, height: 24, background: "#1A1C1E", borderRadius: 6, display: "flex" }} />
          <div style={{ position: "absolute", left: 80, bottom: 168, width: 980, height: 24, background: "#5B6068", borderRadius: 6, opacity: 0.5, display: "flex" }} />
          <div style={{ position: "absolute", left: 80, bottom: 204, width: 880, height: 24, background: "#5B6068", borderRadius: 6, opacity: 0.5, display: "flex" }} />
        </div>
      </div>
    ),
    size
  );
}
