"use client";

interface AdSlotProps {
  size?: "banner" | "sidebar" | "leaderboard" | "rectangle";
  className?: string;
  zoneId?: string;
  scriptSrc?: string;
}

const sizeMap = {
  banner: { width: "728px", height: "90px", label: "728×90 Banner" },
  sidebar: { width: "300px", height: "600px", label: "300×600 Sidebar" },
  leaderboard: { width: "100%", height: "90px", label: "Leaderboard" },
  rectangle: { width: "300px", height: "250px", label: "300×250 Rectangle" },
};

export default function AdSlot({ size = "banner", className = "", zoneId, scriptSrc }: AdSlotProps) {
  const dimensions = sizeMap[size];

  // If a real ad script is provided, render it
  if (scriptSrc || zoneId) {
    return (
      <div
        className={`ad-banner ad-placement flex items-center justify-center overflow-hidden ${className}`}
        style={{ maxWidth: dimensions.width, minHeight: dimensions.height }}
      >
        {scriptSrc && (
          <script async src={scriptSrc} data-zone={zoneId}></script>
        )}
        {zoneId && !scriptSrc && (
          <div id={`ad-zone-${zoneId}`} />
        )}
      </div>
    );
  }

  // Placeholder when no ad is configured
  return (
    <div
      className={`ad-banner ad-placement bg-surfaceLighter/50 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden relative ${className}`}
      style={{ maxWidth: dimensions.width, minHeight: dimensions.height }}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.015)_10px,rgba(255,255,255,0.015)_20px)]" />
      <div className="text-center relative z-10 p-4">
        <span className="text-textMuted text-[9px] uppercase tracking-[0.2em] font-bold bg-background/80 px-2.5 py-1 rounded backdrop-blur-sm border border-white/5">
          Advertisement
        </span>
        <p className="text-white/20 text-[10px] mt-2">{dimensions.label}</p>
      </div>
    </div>
  );
}
