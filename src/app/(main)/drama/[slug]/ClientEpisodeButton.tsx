"use client";

import Link from "next/link";

function isYouTube(url: string) {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
}

export default function ClientEpisodeButton({ 
  episodeNumber,
  dramaSlug,
  videoUrl,
  category,
}: { 
  episodeNumber: number;
  dramaSlug: string;
  videoUrl?: string;
  category?: string;
}) {
  const label = category === 'ai_series' ? 'Part / Season' : 'Episode';

  const sharedClass =
    "relative overflow-hidden group w-full text-left rounded-xl font-medium text-sm transition-all shadow-md border flex items-center justify-between p-4 bg-[#141519] border-white/5 text-[#92949A] hover:bg-[#1C1D22] hover:text-white hover:border-white/10";

  const inner = (
    <>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-inner bg-white/5 text-white/50 group-hover:bg-[#E50914] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(229,9,20,0.5)]">
          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest opacity-60">{label}</span>
          <span className="text-lg font-bold text-white tracking-tight">{episodeNumber}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5 group-hover:bg-white/10 transition-colors">
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Play</span>
      </div>
    </>
  );

  // YouTube → go to the internal watch/embed page
  if (videoUrl && isYouTube(videoUrl)) {
    return (
      <Link href={`/drama/${dramaSlug}/watch/${episodeNumber}`} className={sharedClass}>
        {inner}
      </Link>
    );
  }

  // TeraBox / any other URL → open directly in new tab, skip the watch page entirely
  if (videoUrl) {
    return (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={sharedClass}>
        {inner}
      </a>
    );
  }

  // No URL yet — disabled state
  return (
    <div className={`${sharedClass} opacity-40 cursor-not-allowed`}>
      {inner}
    </div>
  );
}
