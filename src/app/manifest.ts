import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CKDub - Korean & Chinese Dramas in Hindi Dubbed",
    short_name: "CKDub",
    description: "Watch Korean and Chinese dramas dubbed in Hindi and English.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0E10",
    theme_color: "#0D0E10",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
