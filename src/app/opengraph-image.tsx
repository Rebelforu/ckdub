import { ImageResponse } from "next/og";

export const alt = "CKDub - Korean & Chinese Dramas in Hindi Dubbed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default social-share card for pages that don't have their own image
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0D0E10 0%, #1a0a0c 60%, #3a0408 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: "#E50914", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 6 }}>
              <path d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" />
            </svg>
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, display: "flex" }}>
            CK<span style={{ color: "#E50914" }}>Dub</span>
          </div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>
          Korean &amp; Chinese Dramas in Hindi Dubbed
        </div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.6)", marginTop: 24 }}>
          All episodes · Hindi &amp; English dub · Updated regularly
        </div>
      </div>
    ),
    size
  );
}
