"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function AdScripts() {
  const pathname = usePathname();

  // Completely disable all ads on the admin panel
  if (pathname.startsWith('/ishuzubi')) {
    return null;
  }

  return (
    <>
      {/* Google AdSense Auto Ads */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9035042995715249"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Monetag Multitag — all-in-one (Popunder, In-Page Push, Vignette, etc.) */}
      <Script
        src="https://quge5.com/88/tag.min.js"
        data-zone="288991"
        async
        data-cfasync="false"
        strategy="afterInteractive"
      />

      {/* Monetag Push Notifications */}
      <Script
        src="https://5gvci.com/act/files/tag.min.js?z=11926250"
        data-cfasync="false"
        async
        strategy="afterInteractive"
      />
    </>
  );
}
