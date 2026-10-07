import { getServiceSupabase } from "@/lib/supabase";
import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getServiceSupabase();

  const { data: dramas } = await supabase
    .from("dramas")
    .select("slug, category, created_at, updated_at, episodes(episode_number, created_at)")
    .order("updated_at", { ascending: false });

  const list = dramas || [];
  const newest = list[0]?.updated_at ? new Date(list[0].updated_at) : new Date();

  const dramaEntries: MetadataRoute.Sitemap = list.map((drama: any) => ({
    url: `${SITE_URL}/drama/${drama.slug}`,
    lastModified: new Date(drama.updated_at || drama.created_at),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const episodeEntries: MetadataRoute.Sitemap = list.flatMap((drama: any) =>
    (drama.episodes || []).map((ep: any) => ({
      url: `${SITE_URL}/drama/${drama.slug}/watch/${ep.episode_number}`,
      lastModified: new Date(ep.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  const categories = Array.from(new Set(list.map((d: any) => d.category).filter(Boolean))) as string[];
  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE_URL}/category/${c}`,
    lastModified: newest,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const staticPage = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" | "yearly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: path === "" || path === "/browse" ? newest : new Date("2026-10-01"),
    changeFrequency,
    priority,
  });

  return [
    staticPage("", 1, "daily"),
    staticPage("/browse", 0.9, "daily"),
    ...categoryEntries,
    ...dramaEntries,
    staticPage("/blog", 0.7, "weekly"),
    staticPage("/blog/best-korean-dramas-hindi-dubbed-2024", 0.6, "monthly"),
    staticPage("/blog/best-chinese-dramas-hindi-dubbed", 0.6, "monthly"),
    staticPage("/blog/what-is-kdrama", 0.6, "monthly"),
    staticPage("/blog/where-to-watch-korean-dramas-hindi-dubbed", 0.6, "monthly"),
    staticPage("/request", 0.5, "monthly"),
    staticPage("/about", 0.5, "monthly"),
    staticPage("/contact", 0.3, "yearly"),
    staticPage("/privacy-policy", 0.2, "yearly"),
    staticPage("/dmca", 0.2, "yearly"),
    staticPage("/cookies", 0.2, "yearly"),
    staticPage("/terms", 0.2, "yearly"),
    ...episodeEntries,
  ];
}
