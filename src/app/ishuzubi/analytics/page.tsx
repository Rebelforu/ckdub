"use client";

import { useState } from "react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Analytics & Tracking</h1>
        <p className="text-textMuted mt-2">Monitor your website's performance and user drop-off rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surfaceLighter border border-white/5 rounded-2xl p-8 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Google Analytics (Recommended)</h2>
          <p className="text-textMuted text-sm leading-relaxed mb-6">
            To perfectly track exactly where users are dropping off, how long they stay on the Watch page, and which buttons they click, you need Google Analytics (GA4) installed. Redis only tracks raw page views.
          </p>
          <a href="https://analytics.google.com" target="_blank" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Setup Google Analytics
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>

        <div className="bg-surfaceLighter border border-white/5 rounded-2xl p-8 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">PostHog Funnel Tracking</h2>
          <p className="text-textMuted text-sm leading-relaxed mb-6">
            If you want advanced screen recordings of users clicking buttons and "Drop-off Funnels" to see exactly where they leave before clicking the Ads, PostHog is the industry standard tool.
          </p>
          <a href="https://posthog.com" target="_blank" className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Explore PostHog
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
        </div>
      </div>
      
      <div className="bg-[#1C1D22] border border-white/5 rounded-2xl p-6 mt-8">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Monetization Insight
        </h3>
        <p className="text-textMuted text-sm leading-relaxed">
          <strong>Rewarded Video Ads (30s)</strong> pay significantly more than Direct Links because advertisers pay highly for "View-Through Rate" and guaranteed engagement. However, traditional ad networks like AdSense/Monetag don't easily offer 30-second video player ads for standard websites. To achieve this, you either need an Ad Network that offers Web Rewarded Ads (like Google AdMob for Web or specialized gaming ad networks), or you can use a "Link Shortener" service (which forces users to wait 15 seconds on a page full of ads before giving them the Terabox link).
        </p>
      </div>
    </div>
  );
}
