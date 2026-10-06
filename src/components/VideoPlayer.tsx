"use client";

import { useState } from "react";

export default function VideoPlayer({ episode, drama }: { episode: any, drama?: any }) {
  const servers = [
    { name: "Server 1", url: episode.terabox_url },
    { name: "Server 2", url: episode.server_2_url },
    { name: "Server 3", url: episode.server_3_url },
  ].filter(s => s.url);

  const [activeServerUrl, setActiveServerUrl] = useState(servers[0]?.url || "");

  const isYouTube = (url: string) =>
    url && (url.includes('youtube.com') || url.includes('youtu.be'));

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Server Selection Buttons */}
      {servers.length > 1 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-semibold text-[#92949A] mr-2">Select Server:</span>
          {servers.map((server, i) => (
            <button
              key={i}
              onClick={() => setActiveServerUrl(server.url)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all border ${
                activeServerUrl === server.url
                  ? "bg-[#E50914] border-[#E50914] text-white"
                  : "bg-[#1C1D22] border-white/10 text-[#92949A] hover:bg-[#2A2B31] hover:text-white"
              }`}
            >
              {server.name}
            </button>
          ))}
        </div>
      )}

      {/* Video Player */}
      <div className="w-full aspect-video bg-gradient-to-br from-[#141519] to-[#0a0a0a] rounded-2xl border border-[#1C1D22] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {activeServerUrl ? (
          isYouTube(activeServerUrl) ? (
            /* YouTube — embed directly */
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${getYouTubeId(activeServerUrl)}?autoplay=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            /* External link — single clean play button, no referral screen */
            <a
              href={activeServerUrl}
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
              <span className="text-white/60 text-sm font-medium group-hover:text-white transition-colors">Click to Watch</span>
            </a>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#92949A] flex-col gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <p>Video not available</p>
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
