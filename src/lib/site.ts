// Single source of truth for the canonical site URL & brand info.
// ckdub.com 308-redirects to www.ckdub.com, so www is the canonical host.
export const SITE_URL = "https://www.ckdub.com";
export const SITE_NAME = "CKDub";
export const SITE_TAGLINE = "Korean & Chinese Dramas in Hindi Dubbed";
export const SITE_DESCRIPTION =
  "Watch Korean dramas, Chinese dramas and Asian series dubbed in Hindi and English. All episodes, ongoing and completed, updated regularly on CKDub.";

export const absoluteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export function categoryLabel(category?: string | null) {
  switch (category) {
    case "korean":
      return "K-Drama";
    case "chinese":
      return "C-Drama";
    case "english":
      return "English Series";
    case "ai_series":
      return "AI Original";
    default:
      return category ? category.charAt(0).toUpperCase() + category.slice(1) : "Drama";
  }
}

export function categoryCountry(category?: string | null) {
  switch (category) {
    case "korean":
      return "South Korea";
    case "chinese":
      return "China";
    default:
      return undefined;
  }
}

/** Human readable audio label, e.g. "Hindi Dubbed", "English Dubbed", "English Subbed". */
export function audioLabel(language?: string | null) {
  const l = (language || "Hindi Dub").toLowerCase();
  if (l.includes("multi")) return "Multi Audio (Hindi + English)";
  if (l.includes("eng") && l.includes("sub")) return "English Subtitles";
  if (l.includes("hindi") && l.includes("sub")) return "Hindi Subtitles";
  if (l.includes("eng")) return "English Dubbed";
  if (l.includes("original")) return "Original Audio";
  return "Hindi Dubbed";
}

/** ISO language code for schema.org inLanguage */
export function audioLangCode(language?: string | null) {
  const l = (language || "hindi").toLowerCase();
  if (l.includes("eng") && !l.includes("sub")) return "en";
  if (l.includes("original")) return "ko";
  return "hi";
}

export function stripText(s?: string | null, max = 160) {
  if (!s) return "";
  const clean = s.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + "…" : clean;
}
