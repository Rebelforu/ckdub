import Image from "next/image";
import Link from "next/link";

// Mock fetching data based on slug
const getDrama = (slug: string) => {
  return {
    id: "1",
    title: "Queen of Tears",
    slug: slug,
    description: "The miraculous, thrilling and humorous love story of a married couple who manage to survive a crisis and stay together against all odds.",
    poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop",
    releaseYear: 2024,
    status: "Ongoing",
    language: "Hindi Dub",
    genres: ["Romance", "Drama", "Comedy"],
    episodes: Array.from({ length: 16 }, (_, i) => ({
      id: `ep-${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}`,
      terabox_url: `https://terabox.com/s/sample_link_${i + 1}`
    }))
  };
};

export default function DramaDetail({ params }: { params: { slug: string } }) {
  const drama = getDrama(params.slug);

  return (
    <div className="pb-16">
      {/* Hero / Header Section */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image 
            src={drama.poster} 
            alt={drama.title} 
            fill 
            className="object-cover opacity-30 blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-end md:items-stretch">
            {/* Poster */}
            <div className="w-48 md:w-64 flex-shrink-0 rounded-lg overflow-hidden border-2 border-surface shadow-2xl relative aspect-[2/3] -mb-16 md:mb-0">
              <Image 
                src={drama.poster} 
                alt={drama.title} 
                fill 
                className="object-cover"
              />
            </div>
            
            {/* Info */}
            <div className="flex-1 pt-16 md:pt-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{drama.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-textMuted mb-4 items-center">
                <span className="text-white font-medium">{drama.releaseYear}</span>
                <span>&bull;</span>
                <span className={drama.status === "Ongoing" ? "text-primary" : "text-green-500"}>
                  {drama.status}
                </span>
                <span>&bull;</span>
                <span className="bg-surface px-2 py-1 rounded text-xs">{drama.language}</span>
              </div>
              
              <div className="flex gap-2 mb-6">
                {drama.genres.map(genre => (
                  <span key={genre} className="text-xs border border-surface px-3 py-1 rounded-full text-textMuted">
                    {genre}
                  </span>
                ))}
              </div>
              
              <p className="text-textMuted max-w-3xl leading-relaxed">
                {drama.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="container mx-auto px-4 mt-24 md:mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Episodes</h2>
          <span className="text-textMuted text-sm">{drama.episodes.length} Episodes</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {drama.episodes.map((ep) => (
            <Link 
              href={`/drama/${drama.slug}/watch/${ep.number}`}
              key={ep.id}
              className="bg-surface hover:bg-primary/20 border border-transparent hover:border-primary/50 transition-all rounded-md p-4 flex flex-col items-center justify-center gap-2 group text-center"
            >
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:bg-primary transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium text-sm">Episode {ep.number}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
