import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookies Policy | CKDub',
  description: 'Learn how CKDub uses cookies to improve your experience.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Cookies Policy</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: October 2024</p>
        <div className="space-y-8 text-white/70 leading-relaxed text-[15px]">
          <section><h2 className="text-xl font-bold text-white mb-3">What Are Cookies?</h2><p>Cookies are small text files placed on your device when you visit a website. They are used to make websites work efficiently, remember your preferences, and provide reporting information.</p></section>
          <section><h2 className="text-xl font-bold text-white mb-3">How We Use Cookies</h2><div className="mt-4 space-y-4"><div className="bg-white/5 rounded-xl p-4"><h3 className="font-bold text-white mb-1">Essential Cookies</h3><p className="text-sm">Required for the website to function. These cannot be disabled.</p></div><div className="bg-white/5 rounded-xl p-4"><h3 className="font-bold text-white mb-1">Analytics Cookies (Google Analytics)</h3><p className="text-sm">Help us understand how visitors interact with our website. All data is anonymised.</p></div><div className="bg-white/5 rounded-xl p-4"><h3 className="font-bold text-white mb-1">Advertising Cookies (Google AdSense and Monetag)</h3><p className="text-sm">Used to show you relevant advertisements. These may track your browsing across websites.</p></div></div></section>
          <section><h2 className="text-xl font-bold text-white mb-3">Managing Cookies</h2><p>You can control cookies through your browser settings. You can also opt out of personalised ads at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ad Settings</a>.</p></section>
        </div>
      </div>
    </div>
  );
}
