import Link from "next/link";
import AdBlockDetector from "@/components/AdBlockDetector";
import SearchBar from "@/components/SearchBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Futuristic Floating Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl transition-all duration-500">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-3xl px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white ml-0.5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">CK<span className="text-primary">Dub</span></span>
          </Link>
          
          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-black/20 rounded-full px-2 py-1 border border-white/5">
            {[
              { name: 'Discover', path: '/' },
              { name: 'Browse', path: '/browse' },
              { name: 'K-Dramas', path: '/category/korean' },
              { name: 'C-Dramas', path: '/category/chinese' },
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.path} 
                className="px-5 py-2 rounded-full text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <SearchBar />
            <Link href="/request" className="hidden sm:flex items-center gap-2 text-[13px] font-bold text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all border border-white/10 shadow-lg">
              Request
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-surfaceLighter to-surface border border-white/10 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white/50">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
        </div>
      </header>

      {/* Ad Block Detection */}
      <AdBlockDetector />
      
      <main className="flex-1 animate-fade-in relative z-10">
        {children}
      </main>
      
      {/* Modern Minimal Footer */}
      <footer className="bg-surfaceLighter/30 pt-20 pb-10 border-t border-white/[0.03] mt-24">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">CK<span className="text-primary">Dub</span></span>
            </Link>
            <p className="text-textMuted leading-relaxed max-w-sm mb-6">
              Your premium destination for high-quality Asian dramas dubbed in Hindi and English. Immerse yourself in a world of storytelling.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-6 tracking-wide text-xs uppercase text-white/50">Links</h3>
            <ul className="space-y-3 font-medium text-white/70">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/browse" className="hover:text-white transition-colors">Browse</Link></li>
              <li><Link href="/request" className="hover:text-white transition-colors">Request a Drama</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-6 tracking-wide text-xs uppercase text-white/50">Legal</h3>
            <ul className="space-y-3 font-medium text-white/70">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 lg:px-12 mt-12 pt-8 border-t border-white/[0.03] text-center text-xs text-white/30 font-medium">
          &copy; {new Date().getFullYear()} CKDub. All rights reserved.
        </div>
      </footer>
    </>
  );
}
