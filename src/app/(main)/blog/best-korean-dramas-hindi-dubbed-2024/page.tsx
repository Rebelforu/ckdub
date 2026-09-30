import { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'Top 10 Korean Dramas Dubbed in Hindi (2024) | CKDub Blog', description: 'Discover the top 10 best Korean dramas available with full Hindi dubbing in 2024. Watch them free on CKDub.', openGraph: { type: 'article' } };
export default function Post() {
  const dramas = [
    { num: 1, title: 'Crash Landing on You', desc: 'A South Korean heiress accidentally paraglides into North Korea and falls in love with a military officer. One of the most beloved K-Dramas ever made.' },
    { num: 2, title: 'Goblin (Guardian: The Lonely and Great God)', desc: 'A 939-year-old goblin needs a human bride to end his immortal life. Stunning cinematography and a legendary romance.' },
    { num: 3, title: 'My Love from the Star', desc: 'An alien who landed on Earth in the Joseon era falls in love with a top actress in modern Seoul.' },
    { num: 4, title: 'A Love Other Than Yours', desc: 'A beautiful and emotional love story that has captured millions of fans worldwide - now dubbed in Hindi on CKDub.' },
    { num: 5, title: 'Descendants of the Sun', desc: 'A military captain and a surgeon find love amidst dangerous missions.' },
    { num: 6, title: 'Itaewon Class', desc: 'A man seeks revenge against a powerful food conglomerate while building his own restaurant empire.' },
    { num: 7, title: 'Strong Woman Do Bong-soon', desc: 'A girl born with superhuman strength gets hired as a bodyguard by a gaming CEO.' },
    { num: 8, title: 'Business Proposal', desc: 'A woman goes on a blind date disguised as her friend, only to discover her date is her boss.' },
    { num: 9, title: 'Extraordinary Attorney Woo', desc: 'A brilliant young lawyer with autism spectrum disorder navigates the competitive legal world.' },
    { num: 10, title: 'Vincenzo', desc: 'An Italian-Korean mafia lawyer returns to Korea and fights villains using his own villainous methods.' },
  ];
  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-xs text-white/40 hover:text-white mb-8 block">Back to Blog</Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">Top Lists</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">Top 10 Best Korean Dramas Dubbed in Hindi (2024)</h1>
        <p className="text-white/40 text-sm mb-10">October 2024 · 5 min read</p>
        <div className="space-y-4 text-white/70 text-[15px]">
          <p>Korean dramas have taken the world by storm. Here are the top 10 K-Dramas you can watch with Hindi dubbing right now on CKDub.</p>
          {dramas.map((item) => (<div key={item.num} className="bg-white/[0.03] border border-white/5 rounded-xl p-5"><h2 className="text-white font-bold text-base mb-1">#{item.num} — {item.title}</h2><p className="text-sm text-white/60">{item.desc}</p></div>))}
          <p>All of these dramas are available or being added to <Link href="/browse" className="text-primary hover:underline">CKDub library</Link>.</p>
        </div>
      </div>
    </div>
  );
}
