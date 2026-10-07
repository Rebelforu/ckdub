import { getServiceSupabase } from "@/lib/supabase";
import { SITE_URL, SITE_DESCRIPTION, categoryLabel, audioLabel, stripText } from "@/lib/site";

export const revalidate = 3600;

/**
 * /llms.txt — a plain-text map of the site for AI assistants & answer engines
 * (ChatGPT, Perplexity, Gemini, Claude). See https://llmstxt.org
 */
export async function GET() {
  const supabase = getServiceSupabase();
  const { data: dramas } = await supabase
    .from("dramas")
    .select("title, slug, category, status, language, release_year, total_episodes, short_description, description, episodes(id)")
    .order("updated_at", { ascending: false });

  const lines: string[] = [
    "# CKDub",
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "CKDub (www.ckdub.com) is an index of Korean dramas (K-Dramas), Chinese dramas (C-Dramas) and other Asian series available with Hindi dubbing, English dubbing or English subtitles. Each drama page lists every available episode with a direct watch link. The library is updated as new episodes release. Free, no sign-up required.",
    "",
    "## Main pages",
    `- [Home](${SITE_URL}/): Featured and recently updated dramas`,
    `- [Browse all dramas](${SITE_URL}/browse): Full searchable catalogue with filters`,
    `- [Korean dramas in Hindi](${SITE_URL}/category/korean)`,
    `- [Chinese dramas in Hindi](${SITE_URL}/category/chinese)`,
    `- [Request a drama](${SITE_URL}/request): Ask for a drama to be added`,
    "",
    "## Dramas",
  ];

  for (const d of (dramas || []) as any[]) {
    const eps = d.episodes?.length || 0;
    const facts = [
      categoryLabel(d.category),
      audioLabel(d.language),
      d.release_year,
      d.status,
      eps ? `${eps} episode${eps > 1 ? "s" : ""} available${d.total_episodes && d.total_episodes > eps ? ` of ${d.total_episodes}` : ""}` : null,
    ].filter(Boolean).join(", ");
    lines.push(`- [${d.title}](${SITE_URL}/drama/${d.slug}): ${facts}. ${stripText(d.short_description || d.description, 200)}`);
  }

  lines.push("", "## Policies", `- [About](${SITE_URL}/about)`, `- [DMCA](${SITE_URL}/dmca)`, `- [Privacy Policy](${SITE_URL}/privacy-policy)`, `- [Contact](${SITE_URL}/contact)`, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
