import Image from 'next/image';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Browse All Dramas | CKDub',
  description: 'Browse our complete collection of dubbed Chinese and Korean dramas.',
};

export default async function BrowsePage() {
  const supabase = getServiceSupabase();
  const { data: dramas } = await supabase
    .from('dramas')
    .select('*, episodes(id)')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Browse All Dramas</h1>
          <div className="flex gap-4">
            <select className="bg-surface border border-surfaceLighter text-textMain px-4 py-2 rounded-md focus:outline-none focus:border-primary">
              <option value="">All Genres</option>
              <option value="romance">Romance</option>
              <option value="historical">Historical</option>
              <option value="fantasy">Fantasy</option>
            </select>
            <select className="bg-surface border border-surfaceLighter text-textMain px-4 py-2 rounded-md focus:outline-none focus:border-primary">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {!dramas || dramas.length === 0 ? (
          <div className="text-center py-20 text-textMuted">
            <p className="text-xl">No dramas available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {dramas.map((drama) => {
              const episodeCount = drama.episodes?.length || 0;
              return (
                <Link key={drama.id} href={`/drama/${drama.slug}`} className="group relative">
                  <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-surface transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(229,9,20,0.3)]">
                    {drama.poster_url ? (
                      <Image
                        src={drama.poster_url}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-textMuted">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-md">
                      {episodeCount} {episodeCount === 1 ? 'EP' : 'EPs'}
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-medium text-textMain group-hover:text-primary transition-colors line-clamp-2">
                      {drama.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
