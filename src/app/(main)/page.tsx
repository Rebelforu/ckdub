import Link from "next/link";
import Image from "next/image";
import { getServiceSupabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function Home() {
  const supabase = getServiceSupabase();

  // Fetch featured drama first (admin-pinned), fallback to newest
  const { data: featuredResult } = await supabase
    .from("dramas")
    .select("*, episodes(id, created_at, episode_number)")
    .eq("is_featured", true)
    .limit(1)
    .single();

  const { data: allDramas } = await supabase
    .from("dramas")
    .select("*, episodes(id, episode_number)")
    .order("created_at", { ascending: false })
    .limit(20);

  const hero = featuredResult || (allDramas && allDramas[0]) || null;
  const heroEpCount = hero?.episodes?.length || 0;

  // Grid dramas — exclude the hero to avoid duplicates
  const gridDramas = (allDramas || []).filter((d) => d.id !== hero?.id);

  return (
    <div className="pb-24 bg-[#0D0E10]">

      {/* ═══ HERO ═══ */}
      {hero && (
        <section className="relative w-full h-[88vh] min-h-[560px] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={hero.backdrop_url || hero.poster_url || ""}
              alt={hero.title}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0E10] via-[#0D0E10]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E10] via-transparent to-[#0D0E10]/30" />
          </div>

          {/* Hero content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-12 pt-20">
              <div className="max-w-xl">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    Featured
                  </span>
                  {hero.category && (
                    <span className="bg-white/10 text-white/70 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      {hero.category === "korean" ? "K-Drama" : hero.category === "chinese" ? "C-Drama" : hero.category}
                    </span>
                  )}
                  {heroEpCount > 0 && (
                    <span className="bg-white/10 text-white/70 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      {heroEpCount} Episodes
                    </span>
                  )}
                  {hero.status && (
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                      hero.status === "Ongoing"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-white/10 text-white/50 border-white/10"
                    }`}>
                      {hero.status}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] text-white drop-shadow-2xl mb-4">
                  {hero.title}
                </h1>

                {/* Description */}
                {hero.description && (
                  <p className="text-white/60 text-sm md:text-base leading-relaxed line-clamp-3 mb-8 max-w-lg">
                    {hero.description}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/drama/${hero.slug}#episodes`}
                    className="flex items-center gap-2.5 bg-white text-black hover:bg-white/90 px-7 py-3 rounded-full font-black text-sm transition-all shadow-xl shadow-black/30"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                    </svg>
                    Watch Now
                  </Link>
                  <Link
                    href={`/drama/${hero.slug}`}
                    className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white px-7 py-3 rounded-full font-bold text-sm transition-all border border-white/20 backdrop-blur-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom fade to grid */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0E10] to-transparent" />
        </section>
      )}

      {/* ═══ DRAMA GRID ═══ */}
      <div className="container mx-auto px-6 lg:px-12 mt-4">

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">All Series</h2>
            <p className="text-white/40 text-sm mt-1">New episodes added regularly</p>
          </div>
          <Link
            href="/browse"
            className="text-xs font-bold text-white/50 hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
          >
            Browse All
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        {gridDramas.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <div className="text-5xl mb-4">🎬</div>
            <p>No dramas yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gridDramas.map((drama) => {
              const epCount = drama.episodes?.length || 0;
              return (
                <Link
                  key={drama.id}
                  href={`/drama/${drama.slug}`}
                  className="group relative block"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1b1f] border border-white/5 transition-all duration-300 group-hover:border-white/25 group-hover:scale-[1.04] group-hover:shadow-2xl group-hover:shadow-black/60">
                    {drama.backdrop_url || drama.poster_url ? (
                      <Image
                        src={drama.backdrop_url || drama.poster_url}
                        alt={drama.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                      </div>
                    )}

                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                    {/* EP count badge */}
                    {epCount > 0 && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider shadow-lg">
                        {epCount} EP
                      </div>
                    )}

                    {/* Status badge */}
                    {drama.status === "Ongoing" && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                        Live
                      </div>
                    )}

                    {/* Play button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom title */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <h3 className="text-white font-bold text-xs line-clamp-1 drop-shadow-lg">{drama.title}</h3>
                      <p className="text-white/50 text-[10px] mt-0.5">{drama.release_year || new Date(drama.created_at).getFullYear()} · {drama.status}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View More CTA */}
        {gridDramas.length >= 19 && (
          <div className="text-center mt-12">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-bold text-sm border border-white/10 hover:border-white/20 transition-all"
            >
              View All Dramas
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
