import Image from 'next/image';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';
import ClientEpisodeButton from './ClientEpisodeButton';
import { getServiceSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ViewTracker from '@/components/ViewTracker';
import { redis } from '@/lib/redis';
import CommentForm from '@/components/CommentForm';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = getServiceSupabase();
  const { data: drama } = await supabase
    .from('dramas')
    .select('title, description, poster_url, backdrop_url, meta_description, alt_titles, release_year')
    .eq('slug', params.slug)
    .single();

  if (!drama) return {};

  const seoTitle = `${drama.title} ${drama.release_year ? `(${drama.release_year})` : ''} - Watch Hindi Dubbed | CKDub`;
  const seoDescription = drama.meta_description || drama.description;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `https://ckdub.com/drama/${params.slug}`
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: [drama.backdrop_url || drama.poster_url].filter(Boolean),
      type: "video.tv_show",
    },
    other: {
      "keywords": `${drama.title}, ${drama.alt_titles || ''}, Hindi Dubbed, Watch Online`
    }
  };
}

export default async function DramaDetail({ params }: { params: { slug: string } }) {
  const supabase = getServiceSupabase();
  const { data: drama } = await supabase
    .from('dramas')
    .select('*, episodes(*)')
    .eq('slug', params.slug)
    .single();

  if (!drama) {
    notFound();
  }

  // Sort episodes by episode_number ascending
  const episodes = [...(drama.episodes || [])].sort((a: any, b: any) => a.episode_number - b.episode_number);
  
  const lastEpisode = episodes[episodes.length - 1];
  const lastUpdated = lastEpisode?.created_at;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": drama.title,
    "alternateName": drama.alt_titles ? drama.alt_titles.split(',').map((t: string) => t.trim()) : undefined,
    "description": drama.meta_description || drama.description,
    "image": drama.backdrop_url || drama.poster_url,
    "numberOfEpisodes": drama.total_episodes || episodes.length,
    "datePublished": drama.release_year ? `${drama.release_year}-01-01` : undefined,
    "inLanguage": drama.audio_languages || "hi",
    "genre": Array.isArray(drama.genres) ? drama.genres : (drama.genres ? drama.genres.split(',') : ["Drama"]),
    "actors": drama.cast_list ? drama.cast_list.split(',').map((actor: string) => ({
      "@type": "Person",
      "name": actor.trim()
    })) : undefined
  };

  return (
    <main className="min-h-screen bg-[#0D0E10] text-white">
      <ViewTracker slug={params.slug} />
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Cinematic Hero */}
      <section className="relative min-h-[70vh] w-full flex items-end pt-32 pb-16">
        {/* Background Poster/Backdrop */}
        <div className="absolute inset-0 z-0">
          {(drama.backdrop_url || drama.poster_url) ? (
            <Image
              src={drama.backdrop_url || drama.poster_url}
              alt={drama.title}
              fill
              className="object-cover opacity-70 object-top"
              priority
            />
          ) : (
            <div className="w-full h-full bg-[#141519]" />
          )}
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0E10] via-[#0D0E10]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full">
            {/* Breadcrumbs */}
            <div className="text-[#92949A] text-sm mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
              <span>/</span>
              <span className="text-white line-clamp-1">{drama.title}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 leading-[1.1] drop-shadow-lg text-white">
              {drama.title}
            </h1>
            
            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold mb-6 text-[#92949A] uppercase tracking-wider">
              <span className="text-[#E50914] bg-[#E50914]/10 px-3 py-1 rounded">98% Match</span>
              <span>{drama.release_year || new Date().getFullYear()}</span>
              <span>•</span>
              <span>{drama.category || 'Korean Drama'}</span>
              <span>•</span>
              <span>{drama.total_episodes ? `${drama.total_episodes} Episodes` : `${episodes.length} Episodes`}</span>
              <span>•</span>
              <span className="text-white">Hindi Dubbed</span>
              
              {drama.content_rating && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 border border-[#92949A] rounded text-[10px]">{drama.content_rating}</span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-[#F5F5F3] text-lg max-w-3xl mb-10 line-clamp-3 md:line-clamp-none drop-shadow-md leading-relaxed">
              {drama.short_description || drama.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href={`/drama/${params.slug}/watch/1`}
                className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Play Ep 1
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Synopsis & Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/5 flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
          <div className="text-[#92949A] leading-relaxed text-lg">
            {(drama.description || "No synopsis available.").split('\n').map((paragraph: string, idx: number) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Right Column: Ads & Series Info */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          
          {/* Side Ad Placeholder */}
          <div className="w-full h-[250px] bg-[#141519] rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
             <div className="text-center">
                <span className="text-[#92949A] text-xs font-semibold tracking-widest uppercase mb-2 block">Advertisement</span>
                {/* 
                  Drop your Adsterra 300x250 Banner Code here.
                  Example: <script type="text/javascript" src="//plXXXXX.com/xxxx.js"></script>
                */}
             </div>
          </div>

          {/* AI / Entity SEO Fact Block - Moved here */}
          <div className="text-sm text-[#92949A] bg-[#141519] p-6 rounded-2xl border border-white/5 shadow-lg">
            <h3 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Series Information</h3>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-white mr-2">Original Title:</span>
                <span>{drama.alt_titles?.split(',')[1]?.trim() || drama.title}</span>
              </div>
              {drama.alt_titles && (
                <div>
                  <span className="font-semibold text-white mr-2">Also Known As:</span>
                  <span>{drama.alt_titles}</span>
                </div>
              )}
              {drama.country && (
                <div>
                  <span className="font-semibold text-white mr-2">Country:</span>
                  <span>{drama.country}</span>
                </div>
              )}
              <div>
                <span className="font-semibold text-white mr-2">Language:</span>
                <span>Korean (Available in Hindi Dubbed)</span>
              </div>
              {drama.network && (
                <div>
                  <span className="font-semibold text-white mr-2">Network:</span>
                  <span>{drama.network}</span>
                </div>
              )}
              <div>
                <span className="font-semibold text-white mr-2">Release Year:</span>
                <span>{drama.release_year}</span>
              </div>
              <div>
                <span className="font-semibold text-white mr-2">Status:</span>
                <span>{drama.status}</span>
              </div>
              <div>
                <span className="font-semibold text-white mr-2">Episodes:</span>
                <span>{drama.total_episodes || episodes.length}</span>
              </div>
              <div>
                <span className="font-semibold text-white mr-2">Genres:</span>
                <span>{Array.isArray(drama.genres) ? drama.genres.join(', ') : drama.genres}</span>
              </div>
              {drama.cast_list && (
                <div>
                  <span className="font-semibold text-white mr-2">Main Cast:</span>
                  <span>{drama.cast_list}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Episodes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">Episodes</h2>
            <span className="bg-[#1C1D22] px-3 py-1 rounded text-sm font-medium border border-white/10">
              S1
            </span>
          </div>
          {lastUpdated && (
            <div className="text-[#92949A] text-sm flex items-center gap-2">
              <span className="hidden sm:inline">Updated:</span>
              <span>{timeAgo(lastUpdated)}</span>
            </div>
          )}
        </div>

        {episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {episodes.map((ep: any) => (
              <ClientEpisodeButton
                key={ep.id || ep.episode_number}
                episodeNumber={ep.episode_number}
                slug={params.slug}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#141519] border border-white/5 rounded-lg p-12 text-center text-[#92949A]">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h18M3 16h18"/></svg>
            <p className="text-lg">No episodes available yet.</p>
            <p className="text-sm mt-2">Check back later for updates.</p>
          </div>
        )}
      </section>

      {/* Episode Schedule Note - Only shown if present */}
      {drama.episode_schedule_note && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-r from-[#141519] to-[#1C1D22] border border-white/5 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-1">Episode Schedule</h3>
              <p className="text-[#92949A] text-sm leading-relaxed">{drama.episode_schedule_note}</p>
            </div>
          </div>
        </section>
      )}

      {/* Referral / Earning Link - Only shown if present */}
      {drama.referral_link && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <a 
            href={drama.referral_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h3 className="text-emerald-300 font-bold text-lg">Wanna Start Earning?</h3>
                  <p className="text-[#92949A] text-sm">Join TeraBox and start earning rewards today — it's free!</p>
                </div>
              </div>
              <svg className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </a>
        </section>
      )}

      {/* Private Admin Feedback Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CommentForm dramaSlug={params.slug} />
      </section>
    </main>
  );
}
