import { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = { title: 'What is a K-Drama? Complete Beginner Guide | CKDub Blog', description: 'New to Korean dramas? This complete guide explains what K-Dramas are, why they are so popular, and where to watch them dubbed in Hindi for free.', openGraph: { type: 'article' } };
export default function Post() {
  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="text-xs text-white/40 hover:text-white mb-8 block">Back to Blog</Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">Guides</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-3">What is a K-Drama? A Complete Guide for New Viewers</h1>
        <p className="text-white/40 text-sm mb-10">October 2024 · 6 min read</p>
        <div className="space-y-6 text-white/70 text-[15px]">
          <p>If you have been hearing about K-Dramas everywhere but are not sure what they are, you are in the right place.</p>
          <h2 className="text-xl font-bold text-white">What Does K-Drama Mean?</h2>
          <p>K-Drama stands for Korean Drama - television series produced in South Korea. They are typically 16 to 20 episodes long and follow a single complete story arc.</p>
          <h2 className="text-xl font-bold text-white">Why Are K-Dramas So Popular?</h2>
          <p>K-Dramas have become a worldwide phenomenon thanks to their high production quality, compelling storylines, relatable characters, and emotionally satisfying endings.</p>
          <h2 className="text-xl font-bold text-white">Why Watch K-Dramas in Hindi?</h2>
          <p>For Hindi-speaking audiences, watching with subtitles can be tiring. Hindi dubbed versions make the experience much more immersive and enjoyable - especially for family viewing.</p>
          <h2 className="text-xl font-bold text-white">Where Can I Watch K-Dramas in Hindi?</h2>
          <p>CKDub is your dedicated platform for K-Dramas dubbed in Hindi and English. We update our library regularly. <Link href="/browse" className="text-primary hover:underline">Browse our full collection here.</Link></p>
        </div>
      </div>
    </div>
  );
}
