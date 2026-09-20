import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL('https://ckdub.com'),
  title: {
    default: "CKDub — Stream Korean, Chinese & Asian Dramas Dubbed in Hindi & English",
    template: "%s | CKDub",
  },
  description: "Watch the best Korean Dramas, Chinese Dramas, and Thai series dubbed in high-quality Hindi and English audio. Free streaming, updated daily.",
  keywords: ["Korean Drama Hindi Dubbed", "K-Drama Hindi", "C-Drama Hindi", "Asian Drama Dubbed", "Watch Korean Drama Online", "CKDub", "Hindi Dubbed Drama", "Korean Series Hindi"],
  openGraph: {
    type: "website",
    siteName: "CKDub",
    title: "CKDub — The Ultimate Asian Drama Streaming Experience",
    description: "Stream premium Korean, Chinese, and Thai series dubbed in Hindi and English. Updated daily with new episodes.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CKDub — Stream Asian Dramas Dubbed in Hindi & English",
    description: "Your premium destination for dubbed Asian dramas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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

        {/* Monetag In-Page Push Banner */}
        <Script
          id="monetag-in-page"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='11844940',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
          }}
        />

        {/* Adsterra Social Bar */}
        <Script
          strategy="afterInteractive"
          src="https://pl31425888.profitableratecpmnetwork.com/eb/05/ca/eb05ca575029ef6605ab1f5e6a859334.js"
        />

        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CKDub",
              "url": "https://ckdub.com",
              "description": "Stream premium Korean, Chinese, and Thai series dubbed in Hindi and English.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ckdub.com/browse?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-textMain min-h-screen antialiased selection:bg-primary/30 selection:text-white`}>
        
        {/* Screen Recording Deterrent Watermark */}
        <div className="watermark-overlay" aria-hidden="true" />
        
        {children}

        {/* === PRODUCTION SECURITY SCRIPTS === */}
        
        {/* Console Suppression */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if(location.hostname !== 'localhost' && location.hostname !== '127.0.0.1'){
                  var n=function(){};
                  window.console.log=n;
                  window.console.warn=n;
                  window.console.info=n;
                  window.console.debug=n;
                  window.console.table=n;
                  window.console.dir=n;
                  window.console.dirxml=n;
                  window.console.group=n;
                  window.console.groupEnd=n;
                  window.console.time=n;
                  window.console.timeEnd=n;
                  window.console.trace=n;
                  window.console.count=n;
                }
              })();
            `
          }}
        />

        {/* Right-Click & Key Shortcut Disable */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                if(location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
                document.addEventListener('contextmenu',function(e){e.preventDefault();});
                document.addEventListener('keydown',function(e){
                  if(e.key==='F12') e.preventDefault();
                  if(e.ctrlKey && e.shiftKey && (e.key==='I'||e.key==='J'||e.key==='C')) e.preventDefault();
                  if(e.ctrlKey && e.key==='u') e.preventDefault();
                  if(e.ctrlKey && e.key==='s') e.preventDefault();
                });
              })();
            `
          }}
        />
      </body>
    </html>
  );
}
