import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog | CKDub - K-Drama and C-Drama News, Reviews and Updates',
  description: 'Read the latest K-Drama and C-Drama news, episode recaps, reviews, and dubbed series updates on the CKDub Blog.',
};

const posts = [
  { slug: 'best-korean-dramas-hindi-dubbed-2024', title: 'Top 10 Best Korean Dramas Dubbed in Hindi (2024)', excerpt: 'A curated list of the most popular and highest-rated Korean dramas available with full Hindi dubbing in 2024.', date: 'October 2024', category: 'Top Lists', readTime: '5 min read' },
  { slug: 'best-chinese-dramas-hindi-dubbed', title: 'Best Chinese Dramas Dubbed in Hindi You Must Watch', excerpt: 'From romance to historical epics - here are the best C-Dramas with Hindi dubbing that fans absolutely love.', date: 'October 2024', category: 'Top Lists', readTime: '4 min read' },
  { slug: 'what-is-kdrama', title: 'What is a K-Drama? A Complete Guide for New Viewers', excerpt: 'New to Korean dramas? This complete guide covers everything you need to know about K-Dramas and where to watch them in Hindi.', date: 'October 2024', category: 'Guides', readTime: '6 min read' },
  { slug: 'where-to-watch-korean-dramas-hindi-dubbed', title: 'Where to Watch Korean Dramas in Hindi Dubbed Online Free', excerpt: 'Looking for free Hindi dubbed Korean dramas online? Here are the best platforms where you can watch K-Dramas in Hindi for free.', date: 'October 2024', category: 'Guides', readTime: '4 min read' },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12"><h1 className="text-4xl font-bold mb-3">CKDub Blog</h1><p className="text-white/50 text-lg">K-Drama and C-Drama news, reviews, top lists, and dubbed series guides.</p></div>
        <div className="space-y-5">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-[#111] border border-white/5 hover:border-white/15 rounded-2xl p-6 group transition-all">
              <div className="flex items-center gap-3 mb-3"><span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">{post.category}</span><span className="text-white/30 text-xs">{post.date}</span><span className="text-white/30 text-xs">· {post.readTime}</span></div>
              <h2 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2">{post.title}</h2>
              <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
              <div className="mt-4 text-xs font-semibold text-primary">Read More →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
