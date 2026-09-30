import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA Disclaimer | CKDub',
  description: 'CKDub DMCA policy. We respect intellectual property rights and process takedown requests promptly.',
};

export default function DmcaPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">DMCA Disclaimer</h1>
        <p className="text-white/40 text-sm mb-10">Last updated: October 2024</p>
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-10">
          <p className="text-white/80 text-sm leading-relaxed"><strong className="text-white">Important:</strong> CKDub does not host, store, or distribute any video content. All content on this platform consists of links to files hosted on third-party services (such as TeraBox). We act solely as an index.</p>
        </div>
        <div className="space-y-8 text-white/70 leading-relaxed text-[15px]">
          <section><h2 className="text-xl font-bold text-white mb-3">Our Policy</h2><p>CKDub respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA) and applicable law, we will respond to notices of alleged copyright infringement that comply with the DMCA.</p></section>
          <section><h2 className="text-xl font-bold text-white mb-3">Filing a DMCA Takedown Request</h2><p>If you believe that content accessible via CKDub infringes your copyright, please send a written notice to us containing the following:</p><ul className="mt-3 space-y-2 list-disc list-inside text-white/60"><li>Your full legal name and contact information</li><li>A description of the copyrighted work you claim has been infringed</li><li>The exact URL(s) on CKDub that allegedly contain infringing content</li><li>A good faith statement that the use is not authorized by the copyright owner</li><li>Your electronic or physical signature</li></ul></section>
          <section><h2 className="text-xl font-bold text-white mb-3">Where to Send Notices</h2><p>Please submit all DMCA notices via our <a href="/contact" className="text-primary hover:underline">Contact page</a>. We will process all valid notices within 3-5 business days.</p></section>
        </div>
      </div>
    </div>
  );
}
