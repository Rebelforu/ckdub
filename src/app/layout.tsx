import type { Metadata, Viewport } from "next";
import AdScripts from '@/components/AdScripts';
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#0D0E10",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CKDub - Watch Korean & Chinese Dramas in Hindi Dubbed Online Free",
    template: "%s | CKDub",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Korean drama in Hindi", "Korean drama Hindi dubbed", "K-Drama Hindi dubbed", "Chinese drama Hindi dubbed",
    "C-Drama in Hindi", "Hindi dubbed drama", "Asian drama Hindi", "Korean series in Hindi",
    "Korean drama English dubbed", "watch Korean drama online free", "CKDub",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "entertainment",
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "CKDub - Korean & Chinese Dramas in Hindi Dubbed",
    description: SITE_DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CKDub - Korean & Chinese Dramas in Hindi Dubbed",
    description: SITE_DESCRIPTION,
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
  other: {
    "google-adsense-account": "ca-pub-9035042995715249",
  },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon` },
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: ["CK Dub", "ckdub.com"],
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: ["en", "hi"],
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/browse?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Speed up image + ads connections */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly site summary" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-textMain min-h-screen antialiased selection:bg-primary/30 selection:text-white`}>
        {children}

        {/* Analytics + ads load after the page is interactive so they never slow down first paint */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-7FZTPHXFJH" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7FZTPHXFJH');`}
        </Script>
        <AdScripts />

        {/* Right-click & save/inspect shortcut deterrent (production only) */}
        <Script id="content-protect" strategy="lazyOnload">
          {`(function(){if(location.hostname==='localhost'||location.hostname==='127.0.0.1')return;document.addEventListener('contextmenu',function(e){e.preventDefault();});document.addEventListener('keydown',function(e){if(e.key==='F12')e.preventDefault();if(e.ctrlKey&&e.shiftKey&&(e.key==='I'||e.key==='J'||e.key==='C'))e.preventDefault();if(e.ctrlKey&&(e.key==='u'||e.key==='s'))e.preventDefault();});})();`}
        </Script>
        <ScrollToTop />
      </body>
    </html>
  );
}
