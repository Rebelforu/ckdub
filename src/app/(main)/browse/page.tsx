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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dramas.map((drama) => {
              const episodeCount = drama.episodes?.length || 0;
              return (
                  <Link key={drama.id} href={`/drama/${drama.slug}`} className="group relative block transition-transform duration-300 hover:scale-105">
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-[#141519] border border-white/5 group-hover:border-white/20">
                      {drama.backdrop_url || drama.poster_url ? (
                        <Image
                          src={drama.backdrop_url || drama.poster_url}
                          alt={drama.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#92949A]">
                          No Image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase">
                        {episodeCount} {episodeCount === 1 ? 'EP' : 'EPs'}
                      </div>
                      {/* Always show bottom title on horizontal cards for better UX */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <h3 className="font-bold text-white line-clamp-1">{drama.title}</h3>
                        <div className="text-xs text-gray-300 mt-1 flex items-center justify-between">
                          <span>{drama.release_year || new Date(drama.created_at).getFullYear()}</span>
                          <span>{drama.status}</span>
                        </div>
                      </div>
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
