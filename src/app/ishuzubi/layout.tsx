"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Note: this works for client-side sign out
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  // Only show the admin sidebar if logged in (the AdminAuth component handles the actual lock)
  if (!session || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Overview", path: "/ishuzubi", icon: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" },
    { name: "Manage Dramas", path: "/ishuzubi/dramas", icon: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" },
    { name: "Requests", path: "/ishuzubi/requests", icon: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" },
    { name: "Analytics", path: "/ishuzubi/analytics", icon: "M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" }
  ];

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex text-textMain font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-surfaceLighter border-r border-white/5 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.5)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CK<span className="text-primary">Admin</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textMuted hover:bg-white/5 hover:text-white'}`}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d={item.icon} /></svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-textMuted hover:bg-white/5 hover:text-white transition-colors text-sm font-medium mb-2" target="_blank">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            View Live Site
          </Link>
          <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 bg-surfaceLighter/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="text-textMuted text-sm font-medium">
            Welcome back, <span className="text-white font-bold">Admin</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-textMuted font-medium uppercase tracking-widest">System Live</span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
