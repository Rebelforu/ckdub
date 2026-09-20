import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/ishuzubi", "/api/", "/_next/", "/admin"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/ishuzubi", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/ishuzubi", "/api/"],
      },
    ],
    sitemap: "https://ckdub.com/sitemap.xml",
    host: "https://ckdub.com",
  };
}
