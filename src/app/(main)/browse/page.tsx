import Image from 'next/image';
import Link from 'next/link';
import { getServiceSupabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse All Dramas | CKDub',
  description: 'Browse our complete collection of dubbed Chinese and Korean dramas.',
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const q = searchParams.q?.trim() || '';
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = getServiceSupabase();
  let dbQuery = supabase.from('dramas').select('*, episodes(id)', { count: 'exact' });

  if (q) {
    dbQuery = dbQuery.ilike('title', `%${q}%`);
  }

  const { data: dramas, count } = await dbQuery
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header + Search */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Browse All Dramas</h1>
          <form method="GET" action="/browse" className="flex gap-3 w-full max-w-lg">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by drama title…"
              className="flex-1 bg-[#1C1D22] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#6B6D77] focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Search
            </button>
            {q && (
              <Link
                href="/browse"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Clear
              </Link>
            )}
          </form>
          {q && (
            <p className="text-textMuted text-sm">
              {count ?? 0} result{count !== 1 ? 's' : ''} for{' '}
              <span className="text-white font-semibold">&ldquo;{q}&rdquo;</span>
            </p>
          )}
        </div>

        {/* Grid */}
        {!dramas || dramas.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-xl font-bold text-white mb-2">
              {q ? `No dramas found for "${q}"` : 'No dramas yet'}
            </h2>
            <p className="text-textMuted text-sm">
              {q
                ? 'Try a different search term or browse all dramas.'
                : 'Check back soon — new dramas are being added!'}
            </p>
            {q && (
              <Link
                href="/browse"
                className="inline-block mt-6 bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Browse All
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {dramas.map((drama) => {
              const episodeCount = drama.episodes?.length || 0;
              return (
                <Link
                  key={drama.id}
                  href={`/drama/${drama.slug}`}
                  className="group relative block"
                >
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-[#141519] border border-white/5 group-hover:border-white/20 transition-all duration-300 group-hover:scale-[1.03]">
                    {drama.backdrop_url || drama.poster_url ? (
                      <Image
                        src={drama.backdrop_url || drama.poster_url}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#444]">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                      </div>
                    )}
                    {/* EP badge — only if episodes exist */}
                    {episodeCount > 0 && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md uppercase tracking-wide">
                        {episodeCount} {episodeCount === 1 ? 'EP' : 'EPs'}
                      </div>
                    )}
                    {/* Bottom title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent">
                      <h3 className="font-bold text-white text-sm line-clamp-1">{drama.title}</h3>
                      <div className="text-[11px] text-gray-400 mt-0.5 flex items-center justify-between">
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
                href={`/browse?${q ? `q=${encodeURIComponent(q)}&` : ''}page=${page - 1}`}
                className="px-4 py-2 rounded-lg bg-[#1C1D22] border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
              >
                ← Prev
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .map((p, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`ellipsis-${p}`} className="text-textMuted px-1">…</span>
                  )}
                  <Link
                    key={p}
                    href={`/browse?${q ? `q=${encodeURIComponent(q)}&` : ''}page=${p}`}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      p === page
                        ? 'bg-primary text-white'
                        : 'bg-[#1C1D22] border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {p}
                  </Link>
                </>
              ))}
            {page < totalPages && (
              <Link
                href={`/browse?${q ? `q=${encodeURIComponent(q)}&` : ''}page=${page + 1}`}
                className="px-4 py-2 rounded-lg bg-[#1C1D22] border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
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
