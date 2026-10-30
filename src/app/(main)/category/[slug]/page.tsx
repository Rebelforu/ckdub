import Image from 'next/image';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

type Props = {
  params: { slug: string };
};

const CATEGORY_SEO: Record<
  string,
  {
    title: string;
    h1: string;
    description: string;
    keywords: string[];
    intro: string;
    faqs: { q: string; a: string }[];
  }
> = {
  chinese: {
    title: 'Chinese Drama Hindi Dubbed (C-Drama) - Watch Online & Download Free HD',
    h1: 'Chinese Dramas in Hindi Dubbed (C-Drama)',
    description:
      'Watch top Chinese dramas in Hindi dubbed (C-Dramas) online free in 720p/1080p HD. Stream historical, romance, fantasy & modern Chinese series dubbed in Hindi on CKDub.',
    keywords: [
      'chinese drama hindi dubbed',
      'chinese drama in hindi dubbed',
      'cdrama hindi dubbed',
      'c drama in hindi dubbed',
      'china drama hindi dubbed',
      'c-drama hindi dubbed',
      'chinese dramas hindi dubbed',
      'best chinese drama in hindi dubbed',
      'chinese historical drama in hindi dubbed',
      'chinese fantasy drama in hindi dubbed',
      'new chinese drama hindi dubbed',
      'chinese drama in hindi website',
      'chinese web series hindi',
      'all chinese drama hindi dubbed',
    ],
    intro:
      'Welcome to the ultimate collection of Chinese Dramas (C-Dramas) dubbed in Hindi. From breathtaking historical wuxia and xianxia romances to thrilling modern stories, stream every episode in high-definition Hindi audio online or download for offline viewing on CKDub.',
    faqs: [
      {
        q: 'Where can I watch Chinese dramas in Hindi dubbed online?',
        a: 'You can stream and download Chinese dramas in Hindi dubbed directly on CKDub (www.ckdub.com). All episodes are available in HD 720p/1080p with Hindi audio and English subtitles.',
      },
      {
        q: 'Are Chinese dramas on CKDub free to watch?',
        a: 'Yes, 100% free! You can watch ongoing and completed C-Dramas on CKDub without any subscription or sign-up fees.',
      },
      {
        q: 'Can I download Chinese dramas in Hindi dubbed?',
        a: 'Yes, every episode page provides fast TeraBox download links so you can save Chinese dramas in Hindi dubbed to your device for offline viewing.',
      },
    ],
  },
  korean: {
    title: 'Korean Drama Hindi Dubbed (K-Drama) - Watch Online & Download Free HD',
    h1: 'Korean Dramas in Hindi Dubbed (K-Drama)',
    description:
      'Watch top Korean dramas in Hindi dubbed (K-Dramas) online free in 720p/1080p HD. Stream romantic, thriller, school & fantasy Korean series dubbed in Hindi on CKDub.',
    keywords: [
      'korean drama hindi dubbed',
      'kdrama hindi dubbed',
      'k-drama hindi dubbed',
      'korean drama in hindi dubbed',
      'best korean drama in hindi dubbed',
      'korean series hindi dubbed',
      'k drama in hindi dubbed',
      'korean dramas in hindi dubbed',
      'new korean drama in hindi dubbed',
      'korean drama hindi dubbed website',
      'watch korean drama online free in hindi',
      'kdrama in hindi',
      'all k drama hindi dubbed',
    ],
    intro:
      'Discover the best Korean Dramas (K-Dramas) dubbed in Hindi. Whether you love heartwarming romance, edge-of-your-seat thrillers, high school dramas, or fantasy sagas, binge all episodes in crystal-clear Hindi dubbing on CKDub.',
    faqs: [
      {
        q: 'Where to watch Korean dramas in Hindi dubbed for free?',
        a: 'CKDub (www.ckdub.com) is the premier free platform to watch Korean dramas in Hindi dubbed with high quality video and audio.',
      },
      {
        q: 'How frequently are new K-Drama Hindi episodes uploaded?',
        a: 'We update our catalog daily. Whenever a new episode is released or dubbed, it is immediately uploaded with multiple streaming servers.',
      },
      {
        q: 'Is sign-up required to watch K-Dramas in Hindi?',
        a: 'No sign-up or registration is needed. Simply click on any drama, choose your episode, and start watching instantly.',
      },
    ],
  },
  ai_series: {
    title: 'AI Original Series Hindi Dubbed - Watch Online Free | CKDub',
    h1: 'AI Original Series in Hindi Dubbed',
    description:
      'Watch cutting-edge AI Original dramas and series dubbed in Hindi online free in HD on CKDub.',
    keywords: ['ai series hindi dubbed', 'ai original drama hindi', 'ai korean drama hindi'],
    intro:
      'Explore futuristic AI Original series and dramas with captivating storylines, immersive visuals, and Hindi dubbed audio.',
    faqs: [
      {
        q: 'What are AI Original series on CKDub?',
        a: 'AI Originals are exclusive next-generation series created with advanced AI visual storytelling and dubbed in Hindi for our audience.',
      },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const catKey = params.slug.toLowerCase();
  const config = CATEGORY_SEO[catKey];
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  const title = config ? config.title : `${categoryName} Series in Hindi Dubbed | CKDub`;
  const description = config
    ? config.description
    : `Explore our collection of high-quality ${categoryName} series, fully dubbed in Hindi and English on CKDub.`;
  const url = `${SITE_URL}/category/${params.slug}`;

  return {
    title,
    description,
    keywords: config ? config.keywords : [`${categoryName} series`, `${categoryName} drama in hindi`],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const supabase = getServiceSupabase();
  const catKey = params.slug.toLowerCase();
  const config = CATEGORY_SEO[catKey];
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  // Sorted by updated_at so newly updated series always appear first
  const { data: dramas } = await supabase
    .from('dramas')
    .select('*, episodes(id)')
    .eq('category', params.slug)
    .order('updated_at', { ascending: false });

  const dramaList = dramas || [];
  const url = `${SITE_URL}/category/${params.slug}`;

  // Structured Data Schema for Category Collection
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': url,
        name: config ? config.title : `${categoryName} Series in Hindi`,
        url,
        description: config ? config.description : undefined,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: dramaList.map((d: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}/drama/${d.slug}`,
            name: d.title,
          })),
        },
      },
      ...(config?.faqs
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: config.faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-[#0D0E10] text-[#F5F5F3] pt-24 pb-16 px-4 md:px-8 lg:px-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[#92949A] text-xs md:text-sm mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
          <span>/</span>
          <span className="text-white">{categoryName}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-10 bg-gradient-to-r from-[#141519] to-transparent p-6 md:p-8 rounded-2xl border border-white/5">
          <h1 className="text-3xl md:text-5xl font-black mb-4 text-white">
            {config ? config.h1 : `${categoryName} Series`}
          </h1>
          <p className="text-[#92949A] text-sm md:text-base max-w-3xl leading-relaxed">
            {config ? config.intro : `Explore our collection of high-quality ${categoryName} series, fully dubbed in Hindi and English on CKDub.`}
          </p>
        </div>

        {/* Drama Grid */}
        {dramaList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {dramaList.map((drama: any) => {
              const episodesCount = drama.episodes?.length || 0;
              return (
                <Link
                  key={drama.id}
                  href={`/drama/${drama.slug}`}
                  className="group relative block transition-all duration-300"
                >
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-[#1a1b1f] border border-white/5 group-hover:border-white/25 group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:shadow-black/60 transition-all duration-300">
                    {drama.backdrop_url || drama.poster_url ? (
                      <Image
                        src={drama.backdrop_url || drama.poster_url}
                        alt={drama.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#92949A]">
                        No Image
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                    {drama.status === 'Ongoing' && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Live
                      </div>
                    )}
                    {episodesCount > 0 && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider shadow-lg">
                        {episodesCount} EP
                      </div>
                    )}

                    {/* Bottom title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-white text-xs line-clamp-1 drop-shadow-lg">{drama.title}</h3>
                      <p className="text-white/50 text-[10px] mt-0.5 flex items-center justify-between">
                        <span>{drama.release_year || new Date(drama.created_at).getFullYear()}</span>
                        <span>{drama.status}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[#141519] rounded-xl border border-[#1C1D22]">
            <p className="text-xl text-[#92949A] mb-4">No {categoryName} dramas available yet.</p>
            <Link href="/browse" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors">
              Browse All Series
            </Link>
          </div>
        )}

        {/* Category FAQs for SEO & AEO */}
        {config?.faqs && config.faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-white/5">
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {config.faqs.map((f, i) => (
                <div key={i} className="bg-[#141519] border border-white/5 rounded-xl p-5">
                  <h3 className="text-base font-semibold text-white mb-2">{f.q}</h3>
                  <p className="text-sm text-[#92949A] leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
