import Link from "next/link";

export default function WatchPage({ params }: { params: { slug: string, episode: string } }) {
  // Mock finding episode
  const dramaTitle = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const episodeNumber = parseInt(params.episode, 10);
  
  return (
    <div className="bg-black min-h-screen text-textMain flex flex-col">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <Link href={`/drama/${params.slug}`} className="flex items-center gap-2 hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Details
        </Link>
        <h1 className="font-semibold">{dramaTitle} - Episode {episodeNumber}</h1>
        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      {/* Video Player Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl aspect-video bg-surface rounded-xl border border-surface shadow-2xl relative overflow-hidden flex flex-col items-center justify-center group">
          {/* Mock Player UI */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
              <div className="w-1/3 h-full bg-primary"></div>
            </div>
          </div>
          
          <p className="text-textMuted mt-4 absolute top-1/2 translate-y-12">
            Video Player Wrapper (Mock)
          </p>
          <p className="text-xs text-textMuted mt-2 absolute top-1/2 translate-y-20 max-w-md text-center">
            This will consume the direct .mp4/.m3u8 stream extracted via the Node.js middleware from the TeraBox URL.
          </p>
        </div>

        {/* Controls */}
        <div className="w-full max-w-5xl mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-surface hover:bg-surface/80 px-4 py-2 rounded text-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Server: Auto (Fastest)
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <Link 
              href={`/drama/${params.slug}/watch/${episodeNumber > 1 ? episodeNumber - 1 : 1}`}
              className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${episodeNumber <= 1 ? 'bg-surface/50 text-textMuted cursor-not-allowed' : 'bg-surface hover:bg-surface/80 text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Prev
            </Link>
            <Link 
              href={`/drama/${params.slug}/watch/${episodeNumber + 1}`}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
