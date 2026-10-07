import Image from 'next/image';
import Link from 'next/link';
import { timeAgo } from '@/lib/utils';
import ClientEpisodeButton from './ClientEpisodeButton';
import { getServiceSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ViewTracker from '@/components/ViewTracker';
import CommentForm from '@/components/CommentForm';
import { SITE_URL, categoryLabel, categoryCountry, audioLabel, audioLangCode, stripText } from '@/lib/site';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = getServiceSupabase();
  const { data: drama } = await supabase
    .from('dramas')
    .select('title, description, short_description, poster_url, backdrop_url, meta_description, alt_titles, release_year, language, category, total_episodes, status, episodes(id)')
    .eq('slug', params.slug)
    .single();

  if (!drama) return { title: 'Drama Not Found', robots: { index: false } };

  const audio = audioLabel(drama.language);
  const eps = drama.episodes?.length || 0;
  // Avoid "X Hindi Dubbed - Hindi Dubbed" when the admin title already contains it
  const baseTitle = drama.title.replace(/\s*(hindi|english)\s*dubbed\s*$/i, '').trim();
  const seoTitle = `${baseTitle}${drama.release_year ? ` (${drama.release_year})` : ''} ${audio} - All Episodes`;
  const seoDescription = stripText(
    drama.meta_description ||
      `Watch ${baseTitle} ${audio} online. ${eps ? `${eps} episodes available` : 'Episodes'}${drama.status ? ` (${drama.status})` : ''}. ${drama.short_description || drama.description || ''}`,
    160
  );
  const image = drama.backdrop_url || drama.poster_url;
  const url = `${SITE_URL}/drama/${params.slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      `${baseTitle} ${audio}`, `${baseTitle} in Hindi`, `${baseTitle} all episodes`, `${baseTitle} watch online`,
      `${baseTitle} episode 1`, `${categoryLabel(drama.category)} ${audio}`,
      ...(drama.alt_titles ? drama.alt_titles.split(',').map((t: string) => t.trim()) : []),
    ],
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url,
      type: 'video.tv_show',
      images: image ? [{ url: image, width: 1280, height: 720, alt: `${baseTitle} ${audio}` }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: image ? [image] : undefined,
    },
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

  const latestEpisode = [...episodes].sort((a: any, b: any) => +new Date(b.created_at) - +new Date(a.created_at))[0];
  const lastUpdated = latestEpisode?.created_at;

  // Fetch related dramas (same category, exclude current)
  const { data: relatedDramas } = await supabase
    .from('dramas')
    .select('id, title, slug, poster_url, backdrop_url, status, release_year, episodes(id)')
    .eq('category', drama.category || 'korean')
    .neq('id', drama.id)
    .order('updated_at', { ascending: false })
    .limit(6);

  const url = `${SITE_URL}/drama/${params.slug}`;
  const audio = audioLabel(drama.language);
  const typeLabel = categoryLabel(drama.category);
  const country = drama.country || categoryCountry(drama.category);
  const baseTitle = drama.title.replace(/\s*(hindi|english)\s*dubbed\s*$/i, '').trim();
  const epCount = episodes.length;
  const totalEps = drama.total_episodes && drama.total_episodes > epCount ? drama.total_episodes : epCount;
  const genres: string[] = Array.isArray(drama.genres) ? drama.genres : drama.genres ? String(drama.genres).split(',').map((g) => g.trim()) : [];
  const cast: string[] = drama.cast_list ? drama.cast_list.split(',').map((a: string) => a.trim()).filter(Boolean) : [];
  const image = drama.backdrop_url || drama.poster_url;

  // Answer-first summary: the exact sentence AI assistants & Google featured snippets like to quote
  const summary = `${baseTitle}${drama.release_year ? ` (${drama.release_year})` : ''} is a ${country ? `${country} ` : ''}${typeLabel.toLowerCase().includes('drama') ? typeLabel : `${typeLabel} series`}${genres.length ? ` (${genres.slice(0, 3).join(', ')})` : ''} available on CKDub in ${audio}. ${epCount > 0 ? `${epCount} episode${epCount > 1 ? 's are' : ' is'} available to watch${drama.total_episodes && drama.total_episodes > epCount ? ` out of ${drama.total_episodes}` : ''}` : 'Episodes will be added soon'}${drama.status ? ` and the series is ${drama.status.toLowerCase()}` : ''}.${cast.length ? ` It stars ${cast.slice(0, 3).join(', ')}.` : ''}`;

  const faqs = [
    {
      q: `Where can I watch ${baseTitle} in ${audio.replace(' Dubbed', '')}?`,
      a: `You can watch ${baseTitle} ${audio} on CKDub (www.ckdub.com). Open the episode list on this page and tap any episode to start watching — no sign-up needed.`,
    },
    {
      q: `How many episodes does ${baseTitle} have?`,
      a: drama.total_episodes
        ? `${baseTitle} has ${drama.total_episodes} episodes in total. ${epCount} ${epCount === 1 ? 'is' : 'are'} currently available in ${audio} on CKDub.`
        : `${epCount} episode${epCount === 1 ? ' is' : 's are'} currently available in ${audio} on CKDub.`,
    },
    {
      q: `Is ${baseTitle} completed or ongoing?`,
      a: drama.status === 'Completed'
        ? `${baseTitle} is completed. All available episodes are listed on this page.`
        : `${baseTitle} is ongoing. New ${audio} episodes are added on CKDub as they release${drama.episode_schedule_note ? ` — ${drama.episode_schedule_note}` : ''}.`,
    },
    ...(lastUpdated
      ? [{ q: `When was the latest episode of ${baseTitle} added?`, a: `The latest episode (Episode ${latestEpisode.episode_number}) was added on ${new Date(lastUpdated).toDateString().slice(4)}.` }]
      : []),
    ...(cast.length ? [{ q: `Who is in the cast of ${baseTitle}?`, a: `The main cast of ${baseTitle} includes ${cast.slice(0, 6).join(', ')}.` }] : []),
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TVSeries',
        '@id': `${url}#series`,
        name: baseTitle,
        alternateName: drama.alt_titles ? drama.alt_titles.split(',').map((t: string) => t.trim()) : undefined,
        url,
        description: stripText(drama.description || drama.short_description, 500),
        image: image || undefined,
        thumbnailUrl: drama.poster_url || image || undefined,
        genre: genres.length ? genres : undefined,
        inLanguage: audioLangCode(drama.language),
        countryOfOrigin: country ? { '@type': 'Country', name: country } : undefined,
        startDate: drama.release_year ? `${drama.release_year}` : undefined,
        numberOfEpisodes: totalEps || undefined,
        numberOfSeasons: 1,
        contentRating: drama.content_rating || undefined,
        productionCompany: drama.network ? { '@type': 'Organization', name: drama.network } : undefined,
        actor: cast.length ? cast.map((name) => ({ '@type': 'Person', name })) : undefined,
        dateModified: drama.updated_at || lastUpdated || undefined,
        episode: episodes.map((ep: any) => ({
          '@type': 'TVEpisode',
          episodeNumber: ep.episode_number,
          name: `${baseTitle} Episode ${ep.episode_number} ${audio}`,
          url: `${url}/watch/${ep.episode_number}`,
          datePublished: ep.created_at,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          ...(drama.category ? [{ '@type': 'ListItem', position: 2, name: typeLabel, item: `${SITE_URL}/category/${drama.category}` }] : [{ '@type': 'ListItem', position: 2, name: 'Browse', item: `${SITE_URL}/browse` }]),
          { '@type': 'ListItem', position: 3, name: baseTitle, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0D0E10] text-white pt-28">
      <ViewTracker slug={params.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Cinematic Hero */}
      <section className="relative min-h-[70vh] w-full flex items-end pt-32 pb-16">
        <div className="absolute inset-0 z-0">
          {image ? (
            <Image
              src={image}
              alt={`${baseTitle} ${audio} poster`}
              fill
              className="object-cover opacity-70 object-top"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-[#141519]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-[#0D0E10]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0E10] via-[#0D0E10]/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="text-[#92949A] text-sm mb-4 flex items-center gap-2">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              {drama.category ? (
                <Link href={`/category/${drama.category}`} className="hover:text-white transition-colors">{typeLabel}</Link>
              ) : (
                <Link href="/browse" className="hover:text-white transition-colors">Browse</Link>
              )}
              <span>/</span>
              <span className="text-white line-clamp-1">{baseTitle}</span>
            </nav>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 leading-[1.1] drop-shadow-lg text-white">
              {drama.title}
            </h1>

            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-bold mb-6 text-[#92949A] uppercase tracking-wider">
              {drama.category && (
                <span className="text-primary bg-primary/10 px-3 py-1 rounded font-bold">
                  {drama.category === 'ai_series' ? 'AI Original ✨' : typeLabel}
                </span>
              )}
              {drama.release_year && <span>{drama.release_year}</span>}
              {country && (<><span>•</span><span>{country}</span></>)}
              <span>•</span>
              <span>{totalEps} Episodes</span>
              <span>•</span>
              <span className="text-white">{audio}</span>
              {drama.content_rating && (
                <>
                  <span>•</span>
                  <span className="px-2 py-0.5 border border-[#92949A] rounded text-[10px]">{drama.content_rating}</span>
                </>
              )}
            </div>

            <p className="text-[#F5F5F3] text-lg max-w-3xl mb-10 line-clamp-3 md:line-clamp-none drop-shadow-md leading-relaxed">
              {drama.short_description || drama.description}
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#episodes"
                className="bg-primary text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                View Episodes
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Synopsis & Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/5 flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          {/* Quick answer (AEO / GEO) */}
          <div className="mb-8 bg-[#141519] border-l-4 border-primary rounded-r-xl p-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Quick Facts</h2>
            <p className="text-[#E5E5E3] leading-relaxed">{summary}</p>
          </div>

          <h2 className="text-2xl font-bold mb-4">{baseTitle} Synopsis</h2>
          <div className="text-[#92949A] leading-relaxed text-lg">
            {(drama.description || "No synopsis available.").split('\n').filter(Boolean).map((paragraph: string, idx: number) => (
              <p key={idx} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        <aside className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="text-sm text-[#92949A] bg-[#141519] p-6 rounded-2xl border border-white/5 shadow-lg">
            <h2 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Series Information</h2>
            <dl className="space-y-3">
              {[
                ['Title', baseTitle],
                ['Also Known As', drama.alt_titles],
                ['Type', typeLabel],
                ['Country', country],
                ['Audio', audio],
                ['Network', drama.network],
                ['Release Year', drama.release_year],
                ['Status', drama.status],
                ['Episodes', totalEps ? `${epCount}${drama.total_episodes && drama.total_episodes > epCount ? ` of ${drama.total_episodes}` : ''}` : null],
                ['Genres', genres.join(', ')],
                ['Main Cast', cast.join(', ')],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k as string}>
                    <dt className="inline font-semibold text-white mr-2">{k}:</dt>
                    <dd className="inline">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </aside>
      </section>

      {/* Episodes */}
      <section id="episodes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
        <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">{baseTitle} Episodes</h2>
            <span className="bg-[#1C1D22] px-3 py-1 rounded text-sm font-medium border border-white/10">S1</span>
          </div>
          {lastUpdated && (
            <div className="text-[#92949A] text-sm flex items-center gap-2">
              <span className="hidden sm:inline">Updated:</span>
              <time dateTime={lastUpdated}>{timeAgo(lastUpdated)}</time>
            </div>
          )}
        </div>

        {episodes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {episodes.map((ep: any) => (
              <ClientEpisodeButton
                key={ep.id || ep.episode_number}
                episodeNumber={ep.episode_number}
                dramaSlug={params.slug}
                videoUrl={ep.terabox_url}
                category={drama.category}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#141519] border border-white/5 rounded-lg p-12 text-center text-[#92949A]">
            <p className="text-lg">No episodes available yet.</p>
            <p className="text-sm mt-2">Check back later for updates.</p>
          </div>
        )}
      </section>

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

      {drama.referral_link && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <a
            href={drama.referral_link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h3 className="text-emerald-300 font-bold text-lg">Wanna Start Earning?</h3>
                  <p className="text-[#92949A] text-sm">Join TeraBox and start earning rewards today — it&apos;s free!</p>
                </div>
              </div>
              <svg className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </div>
          </a>
        </section>
      )}

      {/* FAQ (visible — required for FAQ rich results & loved by AI answer engines) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-black text-white mb-6">{baseTitle} — Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group bg-[#141519] border border-white/5 rounded-xl p-5 open:border-white/10">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-white">
                <h3 className="text-base">{f.q}</h3>
                <span className="text-primary text-xl transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[#92949A] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {relatedDramas && relatedDramas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl font-black text-white mb-6">More {typeLabel}s You May Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedDramas.map((rel: any) => {
              const relEpCount = rel.episodes?.length || 0;
              return (
                <Link key={rel.id} href={`/drama/${rel.slug}`} className="group block">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#141519] border border-white/5 group-hover:border-white/20 group-hover:scale-[1.04] transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/50">
                    {rel.backdrop_url || rel.poster_url ? (
                      <Image src={rel.backdrop_url || rel.poster_url} alt={rel.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw" />
                    ) : (
                      <div className="w-full h-full bg-[#1C1D22]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    {relEpCount > 0 && (
                      <div className="absolute top-1.5 right-1.5 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">{relEpCount} EP</div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h3 className="text-white font-bold text-[11px] line-clamp-2 leading-tight">{rel.title}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Private Admin Feedback Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CommentForm dramaSlug={params.slug} />
      </section>
    </main>
  );
}
