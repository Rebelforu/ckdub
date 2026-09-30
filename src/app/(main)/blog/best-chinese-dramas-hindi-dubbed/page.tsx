import { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Best Chinese Dramas Dubbed in Hindi | CKDub Blog', description: 'The best Chinese dramas available with Hindi dubbing. Watch C-Dramas in Hindi free on CKDub.', openGraph: { type: 'article' } };
export default function Post() {
  const dramas = [
    { title: 'The Story of Ming Lan', desc: 'A brilliant woman navigates treacherous ancient Chinese society using her wits. A masterpiece of historical drama.' },
    { title: 'Love O2O', desc: 'A romance between two top gaming students that blossoms both online and in real life.' },
    { title: 'Nirvana in Fire', desc: 'A political thriller following a wronged military genius who returns to clear his name.' },
    { title: 'Ashes of Love', desc: 'A magical fantasy romance between a flower fairy and the God of Fire. Visually breathtaking.' },
    { title: 'The Untamed', desc: 'Two talented cultivators navigate a world of clans, conspiracy and forbidden love. A cultural phenomenon.' },
  ];
  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-xs text-white/40 hover:text-white mb-8 block">Back to Blog</Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">Top Lists</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">Best Chinese Dramas Dubbed in Hindi You Must Watch</h1>
        <p className="text-white/40 text-sm mb-10">October 2024 · 4 min read</p>
        <div className="space-y-4 text-white/70 text-[15px]">
          <p>Chinese dramas have exploded in global popularity. Here are the must-watch C-Dramas with Hindi dubbing.</p>
          {dramas.map((item) => (<div key={item.title} className="bg-white/[0.03] border border-white/5 rounded-xl p-5"><h2 className="text-white font-bold text-base mb-1">{item.title}</h2><p className="text-sm text-white/60">{item.desc}</p></div>))}
          <p>Browse our full <Link href="/category/chinese" className="text-primary hover:underline">Chinese Dramas collection</Link> on CKDub.</p>
        </div>
      </div>
    </div>
  );
}
