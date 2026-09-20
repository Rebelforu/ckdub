"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [authMsg, setAuthMsg] = useState("");

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthMsg("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) setError(error.message);
      else setAuthMsg("Signup successful! Please check your email (if confirmation is enabled) or log in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading Security Protocols...</div>;
  }

  // If not logged in, show Auth Screen
  if (!session) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-primary mx-auto flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(229,9,20,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white ml-0.5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CKDub restricted</h1>
            <p className="text-white/50 text-sm mt-1">{isSignUp ? 'Create an account' : 'Authorized Personnel Only'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all" 
                placeholder="admin@ckdub.com" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all" 
                placeholder="••••••••" 
              />
            </div>

            {error && <div className="text-red-500 text-xs font-semibold bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</div>}
            {authMsg && <div className="text-green-500 text-xs font-semibold bg-green-500/10 p-3 rounded-xl border border-green-500/20">{authMsg}</div>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:shadow-[0_0_30px_rgba(229,9,20,0.5)] mt-4 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : (isSignUp ? 'Create Account' : 'Secure Login')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If logged in but NOT the admin email
  // NOTE: In a real production app, you would check a roles table, but this perfectly matches your requirement 
  // "there will be only one admin" based on email matching.
  if (session.user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-red-500/30 text-center shadow-[0_0_50px_rgba(229,9,20,0.1)]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60 text-sm mb-6">
            Account <strong>{session.user.email}</strong> is a standard User level.<br/>Only the Master Admin has access to this dashboard.
          </p>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-full transition-colors border border-white/10"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // If Admin
  return (
    <>
      {children}
    </>
  );
}
