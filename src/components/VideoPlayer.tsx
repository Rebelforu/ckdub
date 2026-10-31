"use client";

import { useState } from "react";

/**
 * Universal detector: determines if a URL can be embedded in an inline <iframe>
 * or if it must be opened externally (e.g. TeraBox, cloud storage, download links).
 */
export function isEmbeddableUrl(url?: string | null, name?: string): boolean {
  if (!url) return false;
  const u = url.toLowerCase().trim();
  const n = (name || "").toLowerCase().trim();

  // If the admin explicitly named the button "download" and it's not an explicit /e/ or /embed/ URL, treat as download
  if (n.includes("download") && !u.includes("/e/") && !u.includes("/embed/")) {
    return false;
  }

  // Cloud storage / file download links that strictly block iframes via X-Frame-Options
  if (
    u.includes("terabox") ||
    u.includes("1024terabox") ||
    u.includes("terasharelink") ||
    u.includes("nephobox") ||
    u.includes("mega.nz") ||
    u.includes("mediafire.com") ||
    u.includes("4shared.com") ||
    u.includes("dropbox.com")
  ) {
    return false;
  }

  // Universal embed indicators: any URL containing /e/ or /embed/ or /player/
  // (matches playmogo.com/e/..., dood.to/e/..., streamtape.com/e/..., etc.)
  if (u.includes("/e/") || u.includes("/embed/") || u.includes("/embed?") || u.includes("/player/")) {
    return true;
  }

  // YouTube
  if (u.includes("youtube.com") || u.includes("youtu.be")) {
    return true;
  }

  // Known video streaming hosts / DoodStream networks & clones
  if (
    u.includes("playmogo") ||
    u.includes("dood") ||
    u.includes("do0od") ||
    u.includes("ds2play") ||
    u.includes("doodstream") ||
    u.includes("streamtape") ||
    u.includes("mp4upload") ||
    u.includes("filemoon") ||
    u.includes("vidcloud") ||
    u.includes("vidsrc") ||
    u.includes("streamwish")
  ) {
    return true;
  }

  // Direct video files
  if (u.endsWith(".mp4") || u.endsWith(".m3u8") || u.endsWith(".webm")) {
    return true;
  }

  return false;
}

/** Convert any video stream URL to its proper iframe embed src */
export function getEmbedSrc(url?: string | null): string {
  if (!url) return "";
  const u = url.trim();

  // 1. YouTube
  if (u.includes("youtube.com") || u.includes("youtu.be")) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = u.match(regExp);
    const id = match && match[2].length === 11 ? match[2] : null;
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : u;
  }

  // 2. Already an embed URL (e.g. playmogo.com/e/..., dood.to/e/..., etc.)
  if (u.includes("/e/") || u.includes("/embed/") || u.includes("/player/")) {
    return u;
  }

  // 3. DoodStream / Playmogo download link (/d/ or /f/ or /v/) converted to embed
  const doodMatch = u.match(/https?:\/\/([^/]+)\/(?:d|f|v)\/([a-zA-Z0-9_-]+)/i);
  if (doodMatch) {
    const domain = doodMatch[1];
    const code = doodMatch[2];
    return `https://${domain}/e/${code}`;
  }

  return u;
}

export interface ServerOption {
  id: number;
  name: string;
  url: string;
  isEmbed: boolean;
}

export default function VideoPlayer({
  episode,
  drama,
  initialServerId,
}: {
  episode: any;
  drama?: any;
  initialServerId?: number;
}) {
  // Build active servers list
  const rawServers: (ServerOption | null)[] = [
    episode.terabox_url
      ? {
          id: 1,
          name: episode.server_1_name?.trim() || (isEmbeddableUrl(episode.terabox_url, episode.server_1_name) ? "Stream Server 1" : "Server 1 (TeraBox)"),
          url: episode.terabox_url.trim(),
          isEmbed: isEmbeddableUrl(episode.terabox_url, episode.server_1_name),
        }
      : null,
    episode.server_2_url
      ? {
          id: 2,
          name: episode.server_2_name?.trim() || (isEmbeddableUrl(episode.server_2_url, episode.server_2_name) ? "Stream Server 2" : "Server 2"),
          url: episode.server_2_url.trim(),
          isEmbed: isEmbeddableUrl(episode.server_2_url, episode.server_2_name),
        }
      : null,
    episode.server_3_url
      ? {
          id: 3,
          name: episode.server_3_name?.trim() || (isEmbeddableUrl(episode.server_3_url, episode.server_3_name) ? "Stream Server 3" : "Server 3"),
          url: episode.server_3_url.trim(),
          isEmbed: isEmbeddableUrl(episode.server_3_url, episode.server_3_name),
        }
      : null,
  ];

  const servers = rawServers.filter((s): s is ServerOption => s !== null && s.url.length > 0);

  // Pick initial server:
  // 1) Match initialServerId if provided
  // 2) Or pick the first embeddable stream server so video plays immediately
  // 3) Or fallback to the first server
  const defaultServer =
    (initialServerId && servers.find((s) => s.id === initialServerId)) ||
    servers.find((s) => s.isEmbed) ||
    servers[0] ||
    null;

  const [activeServer, setActiveServer] = useState<ServerOption | null>(defaultServer);

  const embedSrc = activeServer && activeServer.isEmbed ? getEmbedSrc(activeServer.url) : "";

  return (
    <div className="flex flex-col gap-4">
      {/* Server Selection Buttons Bar */}
      {servers.length > 0 && (
        <div className="flex flex-wrap gap-2.5 items-center bg-[#141519] p-3.5 rounded-xl border border-white/5 shadow-md">
          <span className="text-xs font-bold text-[#92949A] uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            Available Servers:
          </span>

          <div className="flex flex-wrap gap-2">
            {servers.map((server) => {
              const isActive = activeServer?.id === server.id;
              return (
                <button
                  key={server.id}
                  onClick={() => setActiveServer(server)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
                    isActive
                      ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(229,9,20,0.5)] scale-[1.02]"
                      : "bg-[#1C1D22] border-white/10 text-[#92949A] hover:bg-[#25272F] hover:text-white hover:border-white/20"
                  }`}
                >
                  {server.isEmbed ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  <span>{server.name}</span>

                  {!server.isEmbed && (
                    <a
                      href={server.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Open link in new tab"
                      className="ml-1 p-0.5 hover:text-white opacity-70 hover:opacity-100"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Video Player Display Area */}
      <div className="w-full aspect-video bg-black rounded-2xl border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {activeServer ? (
          activeServer.isEmbed ? (
            /* Inline Embed Video Player (DoodStream, Playmogo, YouTube, etc.) */
            <div className="relative w-full h-full bg-black">
              <iframe
                key={embedSrc}
                className="absolute inset-0 w-full h-full"
                src={embedSrc}
                title={`${drama?.title || "Series"} Episode ${episode.episode_number} — ${activeServer.name}`}
                frameBorder="0"
                scrolling="no"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            /* External Download / Cloud Link (TeraBox, Direct download, etc.) */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#141519] via-[#0D0E10] to-black">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-5 text-primary shadow-[0_0_40px_rgba(229,9,20,0.3)]">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{activeServer.name}</h3>
              <p className="text-[#92949A] text-sm max-w-md mb-6 leading-relaxed">
                This server provides a high-speed direct download link and external cloud storage for Episode {episode.episode_number}.
              </p>

              <div className="flex flex-wrap gap-3 justify-center items-center">
                <a
                  href={activeServer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-primary hover:bg-primaryHover text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] flex items-center gap-2 hover:scale-105"
                >
                  <span>Open {activeServer.name} in New Tab</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* If another server is an embeddable stream, show quick switch button */}
                {servers.some((s) => s.isEmbed && s.id !== activeServer.id) && (
                  <button
                    onClick={() => {
                      const streamServer = servers.find((s) => s.isEmbed);
                      if (streamServer) setActiveServer(streamServer);
                    }}
                    className="px-5 py-3 bg-[#1C1D22] hover:bg-[#25272F] text-white font-semibold rounded-xl text-sm border border-white/10 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Stream Online on CKDub</span>
                  </button>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#92949A] flex-col gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <p className="text-sm">Video not available for this episode yet.</p>
          </div>
        )}
      </div>

      {/* Optional Episode Note */}
      {episode.episode_note && (
        <div className="bg-[#18191E] border border-white/5 rounded-xl p-4 flex gap-3 items-start">
          <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-0.5">Admin Note</span>
            <p className="text-sm text-white/90 leading-relaxed">{episode.episode_note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
