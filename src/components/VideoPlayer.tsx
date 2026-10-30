"use client";

import { useState } from "react";

/** Detect URL type for rendering */
function detectType(url: string): "youtube" | "doodstream" | "external" {
  if (!url) return "external";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  // DoodStream domains: dood.to, dood.la, dood.so, dood.watch, doodstream.com, doodapi.co, etc.
  if (/dood\.|doodstream\.com/i.test(url)) return "doodstream";
  return "external";
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/** Convert any DoodStream URL to the /e/ embed format */
function getDoodEmbedUrl(url: string) {
  // Already an embed URL → use as-is
  if (url.includes("/e/")) return url;
  // Extract file code from /d/ download or bare code
  const match = url.match(/\/(?:d|f|v)\/([a-zA-Z0-9]+)/);
  if (match) {
    // Build embed on dood.to (most reliable)
    return `https://dood.to/e/${match[1]}`;
  }
  return url;
}

interface Server {
  name: string;
  url: string;
  type: "youtube" | "doodstream" | "external";
}

export default function VideoPlayer({ episode, drama }: { episode: any; drama?: any }) {
  // Build server list from episode fields — respect custom names set by admin
  const servers: Server[] = [
    {
      name: episode.server_1_name || "TeraBox",
      url: episode.terabox_url,
      type: detectType(episode.terabox_url),
    },
    {
      name: episode.server_2_name || "DoodStream",
      url: episode.server_2_url,
      type: detectType(episode.server_2_url),
    },
    {
      name: episode.server_3_name || "Server 3",
      url: episode.server_3_url,
      type: detectType(episode.server_3_url),
    },
  ].filter((s) => s.url);

  const [activeServer, setActiveServer] = useState<Server>(servers[0] || { name: "", url: "", type: "external" });

  return (
    <div className="flex flex-col gap-3">

      {/* Server Selection — only show when multiple servers exist */}
      {servers.length > 1 && (
        <div className="flex flex-wrap gap-2 items-center bg-[#141519] px-4 py-3 rounded-xl border border-[#1C1D22]">
          <span className="text-xs font-bold text-[#92949A] uppercase tracking-widest mr-2">Watch On:</span>
          {servers.map((server, i) => (
            <button
              key={i}
              onClick={() => setActiveServer(server)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                activeServer.url === server.url
                  ? "bg-[#E50914] border-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.4)]"
                  : "bg-[#1C1D22] border-white/10 text-[#92949A] hover:bg-[#2A2B31] hover:text-white"
              }`}
            >
              {/* Icon hint */}
              {server.type === "doodstream" && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              )}
              {server.type === "external" && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              )}
              {server.name}
            </button>
          ))}
        </div>
      )}

      {/* Video Player */}
      <div className="w-full aspect-video bg-gradient-to-br from-[#141519] to-[#0a0a0a] rounded-2xl border border-[#1C1D22] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {activeServer.url ? (
          activeServer.type === "youtube" ? (
            /* YouTube — embed directly */
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${getYouTubeId(activeServer.url)}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : activeServer.type === "doodstream" ? (
            /* DoodStream — embed via protected /e/ iframe */
            <iframe
              className="absolute inset-0 w-full h-full"
              src={getDoodEmbedUrl(activeServer.url)}
              title={`${drama?.title || "Episode"} — DoodStream`}
              frameBorder="0"
              scrolling="no"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            /* External (TeraBox, etc.) — big play button, opens in new tab */
            <a
              href={activeServer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 group"
            >
              {/* Big play button */}
              <div className="w-24 h-24 rounded-full bg-[#E50914] flex items-center justify-center shadow-[0_0_60px_rgba(229,9,20,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_80px_rgba(229,9,20,0.7)] transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white ml-1">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg mb-1">Watch on {activeServer.name}</p>
                <p className="text-white/50 text-sm">Opens in a new tab →</p>
              </div>
            </a>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#92949A] flex-col gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <p className="text-sm">Video not available</p>
          </div>
        )}
      </div>

      {/* Optional Episode Note */}
      {episode.episode_note && (
        <div className="mt-2 bg-[#E50914]/10 border border-[#E50914]/20 rounded-lg p-4 flex gap-3">
          <svg className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p className="text-sm text-white/90 leading-relaxed">{episode.episode_note}</p>
        </div>
      )}
    </div>
  );
}
