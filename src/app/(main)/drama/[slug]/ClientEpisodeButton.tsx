"use client";

import Link from "next/link";
import { isEmbeddableUrl } from "@/components/VideoPlayer";

export interface EpisodeProps {
  id: string;
  episode_number: number;
  terabox_url?: string | null;
  server_1_name?: string | null;
  server_2_url?: string | null;
  server_2_name?: string | null;
  server_3_url?: string | null;
  server_3_name?: string | null;
  episode_note?: string | null;
}

export default function ClientEpisodeButton({
  episode,
  dramaSlug,
  category,
}: {
  episode: EpisodeProps;
  dramaSlug: string;
  category?: string;
}) {
  const epNum = episode.episode_number;
  const label = category === "ai_series" ? "Part" : "Episode";

  // Build the list of available servers for this episode
  const servers = [
    episode.terabox_url
      ? {
          id: 1,
          name: episode.server_1_name?.trim() || (isEmbeddableUrl(episode.terabox_url, episode.server_1_name || undefined) ? "Stream" : "Server 1"),
          url: episode.terabox_url.trim(),
          isEmbed: isEmbeddableUrl(episode.terabox_url, episode.server_1_name || undefined),
        }
      : null,
    episode.server_2_url
      ? {
          id: 2,
          name: episode.server_2_name?.trim() || (isEmbeddableUrl(episode.server_2_url, episode.server_2_name || undefined) ? "Stream" : "Server 2"),
          url: episode.server_2_url.trim(),
          isEmbed: isEmbeddableUrl(episode.server_2_url, episode.server_2_name || undefined),
        }
      : null,
    episode.server_3_url
      ? {
          id: 3,
          name: episode.server_3_name?.trim() || (isEmbeddableUrl(episode.server_3_url, episode.server_3_name || undefined) ? "Stream" : "Server 3"),
          url: episode.server_3_url.trim(),
          isEmbed: isEmbeddableUrl(episode.server_3_url, episode.server_3_name || undefined),
        }
      : null,
  ].filter((s): s is { id: number; name: string; url: string; isEmbed: boolean } => s !== null && s.url.length > 0);

  const watchUrl = `/drama/${dramaSlug}/watch/${epNum}`;

  return (
    <div className="bg-[#141519] border border-white/5 rounded-xl p-4 flex flex-col justify-between gap-3.5 hover:border-white/20 transition-all shadow-md group">
      {/* Top: Episode Number & Header (Clicks into internal Watch Page) */}
      <Link href={watchUrl} className="flex items-center justify-between gap-3 group/link">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 group-hover/link:bg-primary text-white/70 group-hover/link:text-white flex items-center justify-center font-bold text-sm transition-all shadow-inner group-hover/link:shadow-[0_0_15px_rgba(229,9,20,0.5)]">
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#92949A] block">
              {label}
            </span>
            <span className="text-base font-extrabold text-white group-hover/link:text-primary transition-colors">
              {label} {epNum}
            </span>
          </div>
        </div>

        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-[#92949A] group-hover/link:text-white group-hover/link:bg-white/10 transition-colors font-semibold">
          Watch ↗
        </span>
      </Link>

      {/* Bottom: All Server Action Buttons with Custom Names */}
      {servers.length > 0 ? (
        <div className={`grid gap-2 ${servers.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {servers.map((server) => {
            // If it's a stream/embed URL: route to the watch page with this server preselected
            if (server.isEmbed) {
              return (
                <Link
                  key={server.id}
                  href={`${watchUrl}?server=${server.id}`}
                  className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary text-primary hover:text-white shadow-sm hover:shadow-[0_0_12px_rgba(229,9,20,0.4)] truncate"
                  title={`Watch on ${server.name}`}
                >
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span className="truncate">{server.name}</span>
                </Link>
              );
            }

            // If it's an external download / cloud link (TeraBox, etc.): open in new tab
            return (
              <a
                key={server.id}
                href={server.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-[#1C1D22] hover:bg-[#25272F] border border-white/10 hover:border-white/20 text-[#A3A5AD] hover:text-white shadow-sm truncate"
                title={`Open ${server.name}`}
              >
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="truncate">{server.name}</span>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-[11px] text-[#92949A] italic py-1">No links added yet</div>
      )}
    </div>
  );
}
