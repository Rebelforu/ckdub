"use client";

import { useEffect, useState } from "react";

export default function AdBlockDetector() {
  const [adBlockDetected, setAdBlockDetected] = useState(false);

  useEffect(() => {
    const detectAdBlock = async () => {
      try {
        // Method 1: Try to fetch a known ad script URL
        await fetch(
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
          { method: "HEAD", mode: "no-cors" }
        );
      } catch {
        // If blocked, the adblocker prevented the request
        setAdBlockDetected(true);
        return;
      }

      // Method 2: Create a bait element styled like an ad
      const bait = document.createElement("div");
      bait.className = "ad-banner ads adsbox ad-placement ad-placeholder textads banner-ads";
      bait.style.cssText =
        "position:absolute;top:-10px;left:-10px;width:1px;height:1px;overflow:hidden;";
      bait.innerHTML = "&nbsp;";
      document.body.appendChild(bait);

      // Wait a moment for adblockers to process
      await new Promise((r) => setTimeout(r, 150));

      if (
        bait.offsetHeight === 0 ||
        bait.offsetParent === null ||
        getComputedStyle(bait).display === "none" ||
        getComputedStyle(bait).visibility === "hidden"
      ) {
        setAdBlockDetected(true);
      }

      // Cleanup
      if (bait.parentNode) {
        bait.parentNode.removeChild(bait);
      }
    };

    detectAdBlock();
  }, []);

  if (!adBlockDetected) return null;

  return (
    <div className="adblock-overlay">
      <div className="bg-surface border border-white/10 rounded-2xl p-10 max-w-md text-center shadow-2xl mx-4">
        {/* Shield Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">Ad Blocker Detected</h2>
        <p className="text-textMuted text-sm leading-relaxed mb-6">
          We rely on ads to keep CKDub free for everyone. Please disable your ad blocker to continue watching your favorite dramas.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 text-sm"
          >
            I've Disabled My Ad Blocker — Reload
          </button>
          <p className="text-white/30 text-xs">
            Still seeing this? Try refreshing the page after disabling.
          </p>
        </div>
      </div>
    </div>
  );
}
