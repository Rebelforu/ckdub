export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">Terms of Service</h1>
      <div className="bg-surface p-8 md:p-12 rounded-3xl border border-white/5 shadow-xl text-textMuted">
        <h2 className="text-2xl text-white font-semibold mb-4 mt-0">1. Acceptance of Terms</h2>
        <p className="mb-8 leading-relaxed">
          By accessing and using CKDub, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-2xl text-white font-semibold mb-4">2. Content Disclaimer</h2>
        <p className="mb-8 leading-relaxed">
          CKDub does not host any video files on its own servers. All video content is hosted by third-party services (such as TeraBox). We simply provide links and an aggregated view of publicly available content on the internet. We are not responsible for the accuracy, compliance, copyright, legality, decency, or any other aspect of the content of other linked sites.
        </p>

        <h2 className="text-2xl text-white font-semibold mb-4">3. User Conduct</h2>
        <p className="mb-8 leading-relaxed">
          You agree not to use the site in a way that may cause the site to be interrupted, damaged, or impaired. You may not attempt to bypass our image protection, download scripts, or reverse engineer the video players.
        </p>

        <h2 className="text-2xl text-white font-semibold mb-4">4. Privacy Policy</h2>
        <p className="leading-relaxed">
          We respect your privacy. We do not collect personally identifiable information unless explicitly provided by you (e.g., through contact forms). Any data collected is used solely for improving user experience.
        </p>
      </div>
    </div>
  );
}
