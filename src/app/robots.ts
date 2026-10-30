import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only block internal API routes — do NOT list admin path so no one learns it from robots.txt
const PRIVATE = ["/api/"];

// AI / answer-engine crawlers we explicitly WANT (GEO / AEO visibility in ChatGPT, Perplexity, Gemini, Claude, Copilot)
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "GoogleOther",
  "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "Applebot", "Applebot-Extended",
  "Bingbot", "DuckDuckBot", "YandexBot", "cohere-ai", "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // NOTE: /_next/ must NOT be blocked — crawlers need the JS/CSS to render pages.
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: "Googlebot", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
