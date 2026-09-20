"use client";

import { useState } from "react";

export default function VideoPlayer({ episode }: { episode: any }) {
  const servers = [
    { name: "Server 1 (TeraBox)", url: episode.terabox_url },
    { name: "Server 2 (Backup)", url: episode.server_2_url },
    { name: "Server 3 (Alt)", url: episode.server_3_url },
  ].filter(s => s.url); // only keep available servers

  const [activeServerUrl, setActiveServerUrl] = useState(servers[0]?.url || "");

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

      {/* Video Player Placeholder / Redirect */}
      <div className="w-full aspect-video bg-gradient-to-br from-[#141519] to-[#0a0a0a] rounded-2xl border border-[#1C1D22] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-6 text-center">
        {activeServerUrl ? (
          <div className="flex flex-col items-center max-w-lg space-y-6 animate-fade-in">
            {/* Terabox Logo / Icon */}
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-blue-500">
                  <path d="M19.5 22.5h-15A4.5 4.5 0 0 1 0 18V6a4.5 4.5 0 0 1 4.5-4.5h15A4.5 4.5 0 0 1 24 6v12a4.5 4.5 0 0 1-4.5 4.5Zm-15-18a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5h-15Z"/>
                  <path d="M16 11.25h-2.25V9a.75.75 0 0 0-.75-.75h-2a.75.75 0 0 0-.75.75v2.25H8a.75.75 0 0 0-.75.75v2a.75.75 0 0 0 .75.75h2.25V17a.75.75 0 0 0 .75.75h2a.75.75 0 0 0 .75-.75v-2.25H16a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 0-.75-.75Z"/>
               </svg>
            </div>
            
            <div>
              <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">Unlock Full Episode</h3>
              <p className="text-[#92949A] text-sm leading-relaxed max-w-md mx-auto">
                For the best streaming experience without buffering, please join TeraBox to watch or download this episode easily.
              </p>
            </div>

            <div className="flex flex-col w-full sm:w-auto gap-3 mt-4">
              {/* Step 1: Join via Referral */}
              <a 
                href="https://dm.terabox.com/referral/4398076333227"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                Step 1: Join TeraBox Free
              </a>

              {/* Step 2: Watch Video */}
              <a 
                href={activeServerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1C1D22] hover:bg-[#2A2B31] border border-white/10 text-white px-8 py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Step 2: Play Episode
              </a>
            </div>
            
            <p className="text-[10px] text-textMuted/50 uppercase tracking-widest mt-6">
              Opens securely in TeraBox App
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#92949A] flex-col gap-2">
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

