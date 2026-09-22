import Link from "next/link";
import Image from "next/image";
import { timeAgo } from "@/lib/utils";
import { getServiceSupabase } from "@/lib/supabase";

export const revalidate = 3600; // Cache for 1 hour, revalidatePath will clear it early when updated

export default async function Home() {
  const supabase = getServiceSupabase();
  
  const { data: dramas } = await supabase
    .from("dramas")
    .select("*, episodes(id, created_at, episode_number)")
    .order("created_at", { ascending: false })
    .limit(15);

  const featuredDrama = dramas && dramas.length > 0 ? {
    ...dramas[0],
    lastUpdated: dramas[0].episodes?.[0]?.created_at || dramas[0].created_at,
    epCount: dramas[0].episodes?.length || 0
  } : {
    id: "1",
    title: "Queen of Tears",
    slug: "queen-of-tears",
    description: "The miraculous, thrilling and humorous love story of a married couple who manage to survive a crisis and stay together against all odds.",
    poster_url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
    language: "Hindi Dub",
    genres: ["Romance", "Drama"],
    lastUpdated: new Date(Date.now() - 86400000 * 2).toISOString(),
    epCount: 16
  };

  const sliders = [
    {
      title: "Tonight's Picks",
      description: "A few stories worth watching tonight.",
      dramas: dramas && dramas.length > 0 ? dramas.slice(0, 10).map(d => ({
        ...d,
        lastUpdated: d.episodes?.[0]?.created_at || d.created_at,
        epCount: d.episodes?.length || 0
      })) : []
    },
    {
      title: "Popular Series",
      description: "",
      dramas: dramas && dramas.length > 1 ? dramas.slice(1, 10).map(d => ({
        ...d,
        lastUpdated: d.episodes?.[0]?.created_at || d.created_at,
        epCount: d.episodes?.length || 0
      })) : []
    }
  ];

  return (
    <div className="pb-24">
      {/* CINEMATIC HERO */}
      <section className="relative w-full h-[80vh] min-h-[600px] mb-12 overflow-hidden bg-background">
        
        {/* Background Artwork */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src={featuredDrama.poster_url || featuredDrama.poster} 
            alt={featuredDrama.title} 
            fill 
            className="object-cover opacity-60 object-top pointer-events-none select-none"
            priority
            draggable={false}
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent pointer-events-none" />
          
          {/* Film Grain Texture */}
          <div className="film-grain"></div>
        </div>
        
        {/* Content Container */}
        <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center relative z-10 pt-16">
          <div className="max-w-2xl animate-fade-in">
            
            <div className="flex gap-4 mb-4 items-center flex-wrap">
              <span className="text-primary font-bold tracking-widest text-[10px] uppercase border border-primary/30 px-2 py-0.5 rounded-sm bg-primary/5">
                Featured
              </span>
              <span className="text-textMuted text-xs font-semibold uppercase tracking-widest">
                {featuredDrama.genres?.[0] || 'Drama'}
              </span>
              <span className="text-textMuted text-xs font-semibold uppercase tracking-widest">
                {new Date(featuredDrama.created_at || Date.now()).getFullYear()}
              </span>
              <span className="text-textMuted text-xs font-semibold uppercase tracking-widest">
                {featuredDrama.epCount} Episodes
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1] text-textMain drop-shadow-lg font-serif">
              {featuredDrama.title}
            </h1>
            
            <p className="text-base md:text-lg text-textMuted mb-8 line-clamp-3 max-w-xl font-medium leading-relaxed">
              {featuredDrama.description}
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <Link 
                href={`/drama/${featuredDrama.slug}`} 
                className="bg-textMain text-background hover:bg-white/90 px-8 py-3 rounded-md font-bold transition-all flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                Watch Now
              </Link>
              <button className="bg-surface/60 backdrop-blur-sm hover:bg-surface border border-white/10 text-textMain px-8 py-3 rounded-md font-bold transition-all flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-textMuted">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add to List
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* CINEMATIC SLIDERS */}
      <div className="container mx-auto px-6 lg:px-12 space-y-16">
        {sliders.map((slider, index) => (
          slider.dramas.length > 0 && (
          <section key={index} className="relative group">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-textMain tracking-tight">{slider.title}</h2>
              {slider.description && <p className="text-textMuted text-sm mt-1">{slider.description}</p>}
            </div>
            
            <div className="relative">
              <div className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {slider.dramas.map((drama: any) => (
                  <Link 
                    href={`/drama/${drama.slug}`} 
                    key={drama.id} 
                    className="w-[280px] md:w-[320px] lg:w-[360px] snap-start flex-shrink-0 group/card transition-all duration-300 relative"
                  >
                    <div className="relative aspect-video rounded-sm overflow-hidden bg-black mb-3 border border-white/5 group-hover/card:border-white/20 group-hover/card:-translate-y-1 transition-all duration-300 flex items-center justify-center">
                      <Image 
                        src={drama.backdrop_url || drama.poster_url || drama.poster} 
                        alt={drama.title} 
                        fill 
                        sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
                        className="object-contain pointer-events-none select-none transition-transform duration-500 group-hover/card:scale-[1.02]"
                        draggable={false}
                      />
                      
                      {/* Subtle hover glow / light effect */}
                      <div className="absolute inset-0 bg-primary/0 group-hover/card:bg-primary/10 transition-colors duration-500 pointer-events-none mix-blend-overlay"></div>
                      
                      {/* NEW Badge */}
                      <div className="absolute top-2 right-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-[2px] tracking-wider shadow-sm z-10">
                        EP {drama.epCount || 1}
                      </div>

                      {/* Play Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-90 group-hover/card:scale-100 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium text-textMain text-sm line-clamp-1">{drama.title}</h3>
                    <p className="text-textMuted text-[11px] mt-0.5">{new Date(drama.created_at).getFullYear()} • {drama.status || 'Drama'}</p>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Subtle Film Strip Divider */}
            {index < sliders.length - 1 && (
              <div className="w-full text-center text-textMuted/10 text-xs tracking-[1em] mt-12 mb-4 pointer-events-none select-none">
                ▣ ▣ ▣ ▣ ▣ ▣ ▣
              </div>
            )}
          </section>
          )
        ))}
      </div>
      
    </div>
  );
}
