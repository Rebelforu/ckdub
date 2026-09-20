import Image from 'next/image';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return {
    title: `${categoryName} Series | CKDub`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const supabase = getServiceSupabase();
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  
  const { data: dramas } = await supabase
    .from('dramas')
    .select('*, episodes(count)')
    .eq('category', params.slug)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#0D0E10] text-[#F5F5F3] pt-24 pb-12 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryName} Series</h1>
          <p className="text-[#92949A] text-lg max-w-2xl">
            Explore our collection of high-quality {categoryName} series, fully dubbed and ready to watch.
          </p>
        </div>

        {dramas && dramas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {dramas.map((drama) => {
              const episodesCount = drama.episodes?.[0]?.count || 0;
              return (
                <Link key={drama.id} href={`/drama/${drama.slug}`} className="group relative block transition-transform duration-300 hover:scale-105">
                  <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-[#141519]">
                    {drama.cover_image_url ? (
                      <Image
                        src={drama.cover_image_url}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#92949A]">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {drama.status === 'Ongoing' && (
                      <div className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Ongoing
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-sm md:text-base line-clamp-1 group-hover:text-[#E50914] transition-colors">{drama.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#92949A]">
                      <span>{drama.release_year}</span>
                      <span className="w-1 h-1 rounded-full bg-[#92949A]" />
                      <span>{episodesCount} Episodes</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[#141519] rounded-xl border border-[#1C1D22]">
            <p className="text-xl text-[#92949A] mb-4">No {categoryName} dramas available yet.</p>
            <Link href="/browse" className="px-6 py-2 bg-[#E50914] hover:bg-[#F40612] text-white rounded-md font-medium transition-colors">
              Browse All Series
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
