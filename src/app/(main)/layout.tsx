"use client";
import Link from "next/link";
import AdBlockDetector from "@/components/AdBlockDetector";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Discover', path: '/' },
    { name: 'Browse', path: '/browse' },
    { name: 'K-Dramas', path: '/category/korean' },
    { name: 'C-Dramas', path: '/category/chinese' },
    { name: 'Blog', path: '/blog' },
    { name: 'Request', path: '/request' },
  ];

  return (
    <>
      {/* Floating Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-500">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl px-5 py-3 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_12px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_22px_rgba(229,9,20,0.6)] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">CK<span className="text-primary">Dub</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/5">
            {navLinks.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="px-4 py-2 rounded-full text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <SearchBar />
            <Link href="/request" className="text-[13px] font-bold text-white bg-primary/90 hover:bg-primary px-5 py-2 rounded-full transition-all shadow-lg">
              Request
            </Link>
          </div>

          {/* Mobile: Search + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <SearchBar />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileOpen && (
          <div className="mt-2 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex flex-col gap-1 md:hidden shadow-2xl">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Ad Block Detection */}
      <AdBlockDetector />

      <main className="flex-1 animate-fade-in relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/[0.05] mt-24">
        <div className="container mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">CK<span className="text-primary">Dub</span></span>
            </Link>
            <p className="text-white/40 leading-relaxed max-w-sm text-[13px]">
              Your premium destination for Korean, Chinese &amp; Asian dramas fully dubbed in Hindi and English. We do not host any videos.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white/50 mb-5 tracking-widest text-[10px] uppercase">Explore</h3>
            <ul className="space-y-3 text-[13px] font-medium text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/browse" className="hover:text-white transition-colors">Browse Dramas</Link></li>
              <li><Link href="/category/korean" className="hover:text-white transition-colors">K-Dramas</Link></li>
              <li><Link href="/category/chinese" className="hover:text-white transition-colors">C-Dramas</Link></li>
              <li><Link href="/request" className="hover:text-white transition-colors">Request a Drama</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white/50 mb-5 tracking-widest text-[10px] uppercase">Legal</h3>
            <ul className="space-y-3 text-[13px] font-medium text-white/60">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/dmca" className="hover:text-white transition-colors">DMCA Disclaimer</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.04] py-6">
          <div className="container mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/25">
            <span>&copy; {new Date().getFullYear()} CKDub.com &mdash; All rights reserved.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacy-policy" className="hover:text-white/50 transition-colors">Privacy</Link>
              <Link href="/dmca" className="hover:text-white/50 transition-colors">DMCA</Link>
              <Link href="/cookies" className="hover:text-white/50 transition-colors">Cookies</Link>
              <Link href="/terms" className="hover:text-white/50 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
