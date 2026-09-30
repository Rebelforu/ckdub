"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function AdScripts() {
  const pathname = usePathname();

  // Completely disable all ads in the admin panel routes
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

      {/* Monetag Push Notifications */}
      <Script
        src="https://5gvci.com/act/files/tag.min.js?z=11844932"
        data-cfasync="false"
        strategy="afterInteractive"
      />

      {/* Monetag Onclick Popunder */}
      <Script
        id="monetag-popunder"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='11844948',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
        }}
      />

      {/* Monetag In-Page Push Banner */}
      <Script
        id="monetag-in-page"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='11844940',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
        }}
      />
    </>
  );
}
