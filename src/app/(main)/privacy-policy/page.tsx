import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CKDub',
  description: 'Learn how CKDub collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: October 2024</p>
        <div className="space-y-8 text-white/70 leading-relaxed text-[15px]">
          <section><h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2><p>CKDub does not require you to create an account. When you visit our website, we may automatically collect non-personally identifiable information such as your browser type, operating system, referring URLs, and pages visited. This data is used solely to improve our service.</p><p className="mt-3">If you submit a drama request via our contact or request form, we collect the information you voluntarily provide (e.g., your name and email address) to respond to your inquiry.</p></section>
          <section><h2 className="text-xl font-bold text-white mb-3">2. Cookies and Tracking</h2><p>We use cookies and similar tracking technologies (including those from Google Analytics, Google AdSense, and Monetag) to analyze website traffic and display advertisements. These third-party services may collect information about your browsing activity across websites.</p></section>
          <section><h2 className="text-xl font-bold text-white mb-3">3. Third-Party Content and Links</h2><p>CKDub does not host any video content. All episodes link to third-party platforms (such as TeraBox). We are not responsible for the privacy practices or content of those external sites.</p></section>
          <section><h2 className="text-xl font-bold text-white mb-3">4. Advertising</h2><p>We display advertisements via Google AdSense and Monetag. These networks may use cookies to serve ads based on your prior visits to our site and other websites. You can opt out of personalised advertising by visiting Google Ad Settings.</p></section>
          <section><h2 className="text-xl font-bold text-white mb-3">5. Data Security</h2><p>We take reasonable precautions to protect any information you share with us. However, no method of transmission over the Internet is 100% secure.</p></section>
          <section><h2 className="text-xl font-bold text-white mb-3">6. Contact</h2><p>If you have any questions about this Privacy Policy, please contact us at <a href="/contact" className="text-primary hover:underline">our Contact page</a>.</p></section>
        </div>
      </div>
    </div>
  );
}
