"use client";

import { useState, useEffect } from "react";

export default function ClientEpisodeButton({ 
  episodeNumber, 
  videoUrl, 
  adUrl = "https://www.profitableratecpmnetwork.com/rdtb4gi5j4?key=7d7d50d1c80fa3c1ae977b7062424ddb"
}: { 
  episodeNumber: number; 
  videoUrl: string;
  adUrl?: string;
}) {
  const [hasClickedAd, setHasClickedAd] = useState(false);

  // Check on mount if user has already triggered the smartlink anywhere this session
  useEffect(() => {
    if (sessionStorage.getItem('ckdub_smartlink_triggered')) {
      setHasClickedAd(true);
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!hasClickedAd) {
      // First click of the entire session: Open Ad in new tab
      window.open(adUrl, '_blank');
      setHasClickedAd(true);
      sessionStorage.setItem('ckdub_smartlink_triggered', 'true');
    } else {
      // Already clicked an ad this session: Navigate directly to TeraBox url
      window.location.href = videoUrl || '#';
    }
  };

  return (
    <button 
      onClick={handleClick}
      className={`relative overflow-hidden group w-full text-left rounded-xl font-medium text-sm transition-all shadow-md border flex items-center justify-between p-4 ${
        hasClickedAd 
          ? "bg-gradient-to-r from-[#1C1D22] to-[#25262B] border-[#E50914]/30 text-white hover:border-[#E50914]/60" 
          : "bg-[#141519] border-white/5 text-[#92949A] hover:bg-[#1C1D22] hover:text-white"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Play Icon Circle */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-inner ${
          hasClickedAd 
            ? "bg-[#E50914]/10 text-[#E50914]" 
            : "bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white"
        }`}>
          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        
        {/* Episode Number */}
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest opacity-60">Episode</span>
          <span className="text-lg font-bold text-white tracking-tight">{episodeNumber}</span>
        </div>
      </div>

      {/* Unlock / Check Status */}
      <div className="flex items-center">
        {!hasClickedAd ? (
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <svg className="w-3.5 h-3.5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Unlock</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#E50914]/20 flex items-center justify-center border border-[#E50914]/30 animate-fade-in">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-[#E50914]"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        )}
      </div>
    </button>
  );
}
