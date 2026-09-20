import { getServiceSupabase } from "@/lib/supabase";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getServiceSupabase();
  
  const { data: dramas } = await supabase
    .from("dramas")
    .select("slug, created_at, episodes(episode_number, created_at)")
    .order("created_at", { ascending: false });

  const dramaEntries: MetadataRoute.Sitemap = (dramas || []).map((drama) => ({
    url: `https://ckdub.com/drama/${drama.slug}`,
    lastModified: new Date(drama.created_at),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Episode pages for better indexing
  const episodeEntries: MetadataRoute.Sitemap = (dramas || []).flatMap((drama) =>
    (drama.episodes || []).map((ep: any) => ({
      url: `https://ckdub.com/drama/${drama.slug}/watch/${ep.episode_number}`,
      lastModified: new Date(ep.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [
    {
      url: "https://ckdub.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://ckdub.com/browse",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://ckdub.com/category/korean",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://ckdub.com/category/chinese",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: "https://ckdub.com/request",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://ckdub.com/contact",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://ckdub.com/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...dramaEntries,
    ...episodeEntries,
  ];
}
