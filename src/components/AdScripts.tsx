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

    </>
  );
}
