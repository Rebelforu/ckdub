import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import VideoPlayer from '@/components/VideoPlayer';
import { SITE_URL, audioLabel, categoryLabel, stripText } from '@/lib/site';

export const revalidate = 3600;

interface Props {
  params: {
    slug: string;
    episode: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = getServiceSupabase();
  const { data: drama } = await supabase
    .from('dramas')
    .select('title, short_description, meta_description, description, language, category, release_year, poster_url, backdrop_url')
    .eq('slug', params.slug)
    .single();

  if (!drama) {
    return { title: 'Episode Not Found | CKDub', robots: { index: false } };
  }

  const episodeNumber = parseInt(params.episode, 10);
  const audio = audioLabel(drama.language);
  const baseTitle = drama.title.replace(/\s*(hindi|english)\s*dubbed\s*$/i, '').trim();
  const url = `${SITE_URL}/drama/${params.slug}/watch/${episodeNumber}`;

  const seoTitle = `${baseTitle} Episode ${episodeNumber} Hindi Dubbed - Watch Online & Download HD`;
  const seoDescription = stripText(
    `Watch and download ${baseTitle} Episode ${episodeNumber} in Hindi dubbed online free in HD. Stream in 720p/1080p with Hindi audio on DoodStream and TeraBox on CKDub.`,
    160
  );

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      `${baseTitle} episode ${episodeNumber} Hindi dubbed`,
      `${baseTitle} ep ${episodeNumber} in Hindi`,
      `${baseTitle} episode ${episodeNumber} in Hindi`,
      `${baseTitle} ep ${episodeNumber} Hindi dubbed`,
      `${baseTitle} episode ${episodeNumber} watch online`,
      `${baseTitle} episode ${episodeNumber} download`,
      `${baseTitle} ep ${episodeNumber} Hindi download`,
      `${baseTitle} episode ${episodeNumber} ${audio}`,
      `${baseTitle} ${audio}`,
      `${baseTitle} in Hindi`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `${baseTitle} Episode ${episodeNumber} Hindi Dubbed | CKDub`,
      description: seoDescription,
      url,
      type: 'video.episode',
      images: drama.backdrop_url || drama.poster_url
        ? [{ url: drama.backdrop_url || drama.poster_url!, width: 1280, height: 720, alt: seoTitle }]
        : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function WatchPage({ params }: Props) {
  const episodeNumber = parseInt(params.episode, 10);

  if (isNaN(episodeNumber)) {
    notFound();
  }

  const supabase = getServiceSupabase();

  // Fetch drama and its episodes
  const { data: drama } = await supabase
    .from('dramas')
    .select(`
      *,
      episodes (*)
    `)
    .eq('slug', params.slug)
    .single();

  if (!drama) {
    notFound();
  }

  const currentEpisode = drama.episodes?.find((ep: any) => ep.episode_number === episodeNumber);

  if (!currentEpisode) {
    notFound();
  }

  const allEpisodes = drama.episodes?.sort((a: any, b: any) => a.episode_number - b.episode_number) || [];
  const currentEpIndex = allEpisodes.findIndex((ep: any) => ep.episode_number === episodeNumber);

  const prevEpisode = currentEpIndex > 0 ? allEpisodes[currentEpIndex - 1] : null;
  const nextEpisode = currentEpIndex < allEpisodes.length - 1 ? allEpisodes[currentEpIndex + 1] : null;

  const audio = audioLabel(drama.language);
  const baseTitle = drama.title.replace(/\s*(hindi|english)\s*dubbed\s*$/i, '').trim();
  const url = `${SITE_URL}/drama/${params.slug}/watch/${episodeNumber}`;
  const dramaUrl = `${SITE_URL}/drama/${params.slug}`;

  // TVEpisode structured data for Google
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TVEpisode',
        '@id': url,
        name: `${baseTitle} Episode ${episodeNumber} ${audio}`,
        episodeNumber,
        url,
        inLanguage: drama.language?.toLowerCase().includes('hindi') ? 'hi' : 'en',
        partOfTVSeries: {
          '@type': 'TVSeries',
          name: drama.title,
          url: dramaUrl,
          image: drama.backdrop_url || drama.poster_url || undefined,
        },
        description: drama.short_description || drama.description || undefined,
        thumbnailUrl: drama.backdrop_url || drama.poster_url || undefined,
        datePublished: currentEpisode.created_at,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: drama.title, item: dramaUrl },
          { '@type': 'ListItem', position: 3, name: `Episode ${episodeNumber}`, item: url },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0D0E10] text-[#F5F5F3]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Top navigation bar */}
      <div className="w-full bg-[#141519] border-b border-[#1C1D22] p-4 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/drama/${params.slug}`}
              className="text-[#92949A] hover:text-[#E50914] transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Drama
            </Link>
            <h1 className="text-xl font-bold truncate max-w-md">
              {drama.title} <span className="text-[#92949A] font-normal">— Episode {episodeNumber}</span>
            </h1>
          </div>

          <div className="text-sm text-[#92949A] items-center gap-2 hidden sm:flex">
            <Link href="/" className="hover:text-[#F5F5F3]">Home</Link>
            <span>/</span>
            <Link href={`/drama/${params.slug}`} className="hover:text-[#F5F5F3] truncate max-w-[150px]">{drama.title}</Link>
            <span>/</span>
            <span className="text-[#F5F5F3]">Episode {episodeNumber}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl p-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Video Player and Info */}
          <div className="lg:col-span-12 flex flex-col gap-6">

            {/* Video Player & Server Selection */}
            <VideoPlayer episode={currentEpisode} drama={drama} />

            {/* Episode Navigation */}
            <div className="flex items-center justify-between bg-[#141519] p-4 rounded-xl border border-[#1C1D22]">
              {prevEpisode ? (
                <Link
                  href={`/drama/${params.slug}/watch/${prevEpisode.episode_number}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1C1D22] hover:bg-[#E50914] text-white rounded-lg transition-colors font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Previous Ep {prevEpisode.episode_number}
                </Link>
              ) : (
                <div className="px-4 py-2 text-[#92949A] font-medium opacity-50 cursor-not-allowed flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Previous Ep
                </div>
              )}

              <div className="text-[#92949A] font-medium">
                Episode {episodeNumber} of {allEpisodes.length}
              </div>

              {nextEpisode ? (
                <Link
                  href={`/drama/${params.slug}/watch/${nextEpisode.episode_number}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1C1D22] hover:bg-[#E50914] text-white rounded-lg transition-colors font-medium"
                >
                  Next Ep {nextEpisode.episode_number}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </Link>
              ) : (
                <div className="px-4 py-2 text-[#92949A] font-medium opacity-50 cursor-not-allowed flex items-center gap-2">
                  Next Ep
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Drama Info Below Video */}
            <div className="bg-[#141519] p-6 rounded-2xl border border-[#1C1D22] flex flex-col md:flex-row gap-6">
              {drama.poster_url && (
                <div className="shrink-0 hidden sm:block">
                  <div className="w-48 aspect-video relative rounded-lg overflow-hidden border border-[#1C1D22] bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={drama.poster_url || drama.backdrop_url}
                      alt={drama.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{drama.title}</h2>
                  <p className="text-[#92949A] text-sm mb-3">Season 1 &bull; Episode {episodeNumber} &bull; {audio}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {drama.language && (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-[#1C1D22] text-[#F5F5F3] rounded-md border border-[#2A2B32]">
                        {drama.language}
                      </span>
                    )}
                    {drama.category && (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-[#1C1D22] text-[#F5F5F3] rounded-md border border-[#2A2B32]">
                        {categoryLabel(drama.category)}
                      </span>
                    )}
                    {drama.status && (
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${drama.status === 'Ongoing' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                        {drama.status}
                      </span>
                    )}
                  </div>

                  <p className="text-[#92949A] text-sm leading-relaxed max-w-3xl">
                    {drama.description || 'No description available for this drama.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
