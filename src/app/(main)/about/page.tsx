import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | CKDub',
  description: 'Learn about CKDub - your go-to platform for Korean, Chinese and Asian dramas dubbed in Hindi and English.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About <span className="text-primary">CKDub</span></h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">Bringing the best of Asian drama to Hindi and English-speaking audiences - completely free.</p>
        </div>
        <div className="space-y-8 text-white/70 leading-relaxed text-[15px]">
          <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8"><h2 className="text-2xl font-bold text-white mb-4">Our Story</h2><p>CKDub was built for drama fans who love Korean and Chinese storytelling but face a language barrier. We curate the best K-Dramas and C-Dramas and index dubbed versions so that Hindi and English-speaking viewers can enjoy them without subtitles.</p><p className="mt-3">We are a fan-driven platform. We do not produce or host video content - we simply organize and surface links to dubbed content, making it easy for millions of fans to discover and watch their favourite shows.</p></section>
          <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8"><h2 className="text-2xl font-bold text-white mb-4">What We Offer</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">{[{icon:'🎬',title:'Hindi Dubbed Dramas',desc:'Full Hindi dubs of the most popular K-Dramas and C-Dramas.'},{icon:'🌍',title:'English Dubbed',desc:'English dub versions for international viewers.'},{icon:'📺',title:'Ongoing Updates',desc:'New episodes added regularly as they release.'},{icon:'🆓',title:'Completely Free',desc:'No subscriptions, no sign-ups - just watch.'}].map((item)=>(<div key={item.title} className="bg-white/[0.03] rounded-xl p-4"><div className="text-2xl mb-2">{item.icon}</div><h3 className="font-bold text-white text-sm mb-1">{item.title}</h3><p className="text-white/50 text-xs">{item.desc}</p></div>))}</div></section>
          <section className="bg-white/[0.03] border border-white/5 rounded-2xl p-8"><h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2><p>CKDub does not host, store, or distribute any video files. All content is linked from external third-party sources. If you are a copyright holder, please visit our <Link href="/dmca" className="text-primary hover:underline">DMCA page</Link>.</p></section>
          <div className="text-center pt-4"><Link href="/contact" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold transition-colors">Get in Touch</Link></div>
        </div>
      </div>
    </div>
  );
}
