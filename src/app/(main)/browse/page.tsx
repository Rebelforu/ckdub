import Image from 'next/image';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse All Dramas | CKDub',
  description: 'Browse our complete collection of Korean and Chinese dramas dubbed in Hindi and English.',
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; cat?: string; status?: string };
}) {
  const q = searchParams.q?.trim() || '';
  const cat = searchParams.cat || '';
  const statusFilter = searchParams.status || '';
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const limit = 18;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = getServiceSupabase();
  let dbQuery = supabase.from('dramas').select('*, episodes(id)', { count: 'exact' });

  if (q) dbQuery = dbQuery.ilike('title', `%${q}%`);
  if (cat) dbQuery = dbQuery.eq('category', cat);
  if (statusFilter) dbQuery = dbQuery.eq('status', statusFilter);

  const { data: dramas, count } = await dbQuery
    .order('updated_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  const buildHref = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat) params.set('cat', cat);
    if (statusFilter) params.set('status', statusFilter);
    Object.entries(overrides).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    const str = params.toString();
    return `/browse${str ? `?${str}` : ''}`;
  };

  const categoryFilters = [
    { label: 'All', value: '' },
    { label: 'K-Drama', value: 'korean' },
    { label: 'C-Drama', value: 'chinese' },
    { label: 'AI Originals ✨', value: 'ai_series' },
  ];

  const statusFilters = [
    { label: 'Any Status', value: '' },
    { label: 'Ongoing', value: 'Ongoing' },
    { label: 'Completed', value: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0E10] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-white">Browse Dramas</h1>
          <p className="text-white/40 text-sm mt-1">{count ?? 0} dramas available</p>
        </div>

        {/* Search */}
        <form method="GET" action="/browse" className="flex gap-2 w-full max-w-xl">
          {cat && <input type="hidden" name="cat" value={cat} />}
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by drama title..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors"
          >
            Search
          </button>
          {q && (
            <Link
              href={buildHref({ q: '', page: '1' })}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
            >
              ✕
            </Link>
          )}
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((f) => (
            <Link
              key={f.value}
              href={buildHref({ cat: f.value, page: '1' })}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                cat === f.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </Link>
          ))}
          <div className="w-px bg-white/10 mx-1 self-stretch" />
          {statusFilters.map((f) => (
            <Link
              key={f.value}
              href={buildHref({ status: f.value, page: '1' })}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                statusFilter === f.value
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {!dramas || dramas.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">ðŸŽ¬</div>
            <h2 className="text-xl font-bold text-white mb-2">
              {q ? `No results for "${q}"` : 'No dramas found'}
            </h2>
            <p className="text-white/40 text-sm">
              {q ? 'Try a different search term.' : 'Check back soon!'}
            </p>
            {(q || cat || statusFilter) && (
              <Link
                href="/browse"
                className="inline-block mt-6 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
              >
                Clear All Filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {dramas.map((drama) => {
              const episodeCount = drama.episodes?.length || 0;
              return (
                <Link
                  key={drama.id}
                  href={`/drama/${drama.slug}`}
                  className="group relative block"
                >
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-[#141519] border border-white/5 group-hover:border-white/20 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-2xl group-hover:shadow-black/50">
                    {drama.backdrop_url || drama.poster_url ? (
                      <Image
                        src={drama.backdrop_url || drama.poster_url}
                        alt={drama.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* EP badge */}
                    {episodeCount > 0 && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider shadow-lg">
                        {episodeCount} EP
                      </div>
                    )}

                    {/* Ongoing live badge */}
                    {drama.status === 'Ongoing' && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                        Live
                      </div>
                    )}

                    {/* Play icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white ml-0.5">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom title */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-white text-sm line-clamp-1 drop-shadow-lg">{drama.title}</h3>
                      <div className="text-[11px] text-white/50 mt-0.5 flex items-center justify-between">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            {page > 1 && (
              <Link
                href={buildHref({ page: String(page - 1) })}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
              >
                â† Prev
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center gap-2">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-white/30 px-1">...</span>
                  )}
                  <Link
                    href={buildHref({ page: String(p) })}
                    className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                      p === page
                        ? 'bg-primary text-white'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </Link>
                </span>
              ))}
            {page < totalPages && (
              <Link
                href={buildHref({ page: String(page + 1) })}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


