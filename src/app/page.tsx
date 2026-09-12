import Link from "next/link";
import Image from "next/image";

// Mock data for the UI
const featuredDrama = {
  id: "1",
  title: "Queen of Tears",
  slug: "queen-of-tears",
  description: "The miraculous, thrilling and humorous love story of a married couple who manage to survive a crisis and stay together against all odds.",
  poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
  language: "Hindi Dub",
  genres: ["Romance", "Drama"]
};

const sliders = [
  {
    title: "Latest Hindi Dubs",
    dramas: [
      { id: "1", slug: "queen-of-tears", title: "Queen of Tears", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop" },
      { id: "2", slug: "hidden-love", title: "Hidden Love", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop" },
      { id: "3", slug: "my-demon", title: "My Demon", poster: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1974&auto=format&fit=crop" },
      { id: "4", slug: "goblin", title: "Goblin", poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" },
      { id: "5", slug: "true-beauty", title: "True Beauty", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop" },
    ]
  },
  {
    title: "Trending K-Dramas",
    dramas: [
      { id: "6", slug: "squid-game", title: "Squid Game", poster: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1974&auto=format&fit=crop" },
      { id: "7", slug: "vincenzo", title: "Vincenzo", poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop" },
      { id: "8", slug: "itaewon-class", title: "Itaewon Class", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop" },
      { id: "9", slug: "crash-landing", title: "Crash Landing on You", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop" },
      { id: "10", slug: "healer", title: "Healer", poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" },
    ]
  }
];

export default function Home() {
  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] mb-12">
        <div className="absolute inset-0">
          <Image 
            src={featuredDrama.poster} 
            alt={featuredDrama.title} 
            fill 
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16 relative z-10">
          <div className="max-w-2xl">
            <div className="flex gap-2 mb-3">
              {featuredDrama.genres.map(genre => (
                <span key={genre} className="bg-surface/80 text-textMuted px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {genre}
                </span>
              ))}
              <span className="bg-primary/20 text-primary border border-primary/50 px-3 py-1 rounded-full text-sm">
                {featuredDrama.language}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{featuredDrama.title}</h1>
            <p className="text-lg text-textMuted mb-8 line-clamp-3">
              {featuredDrama.description}
            </p>
            <div className="flex gap-4">
              <Link 
                href={`/drama/${featuredDrama.slug}`} 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-semibold transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
                Watch Now
              </Link>
              <button className="bg-surface hover:bg-surface/80 text-white px-8 py-3 rounded-md font-semibold transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                My List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sliders */}
      <div className="container mx-auto px-4 space-y-12">
        {sliders.map((slider, index) => (
          <section key={index}>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-bold">{slider.title}</h2>
              <Link href="#" className="text-primary hover:underline text-sm font-medium">View All</Link>
            </div>
            
            <div className="relative group">
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {slider.dramas.map(drama => (
                  <Link 
                    href={`/drama/${drama.slug}`} 
                    key={drama.id} 
                    className="min-w-[160px] md:min-w-[200px] lg:min-w-[240px] snap-start flex-shrink-0 group/card transition-transform duration-300 hover:scale-105"
                  >
                    <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-surface mb-2 border border-transparent group-hover/card:border-primary/50 transition-colors">
                      <Image 
                        src={drama.poster} 
                        alt={drama.title} 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-primary rounded-full p-3">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="font-medium text-textMain line-clamp-1">{drama.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
