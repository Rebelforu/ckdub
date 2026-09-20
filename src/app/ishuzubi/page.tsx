import { getServiceSupabase } from "@/lib/supabase";
import AdminAuth from "./AdminAuth";
import AdminModals from "./AdminModals";
import EditDramaModal from "@/components/EditDramaModal";
import { timeAgo } from "@/lib/utils";
import { redis } from "@/lib/redis";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function AdminDashboard() {
  const supabase = getServiceSupabase();
  
  // Fetch real data
  const { data: dramas } = await supabase
    .from("dramas")
    .select("*, episodes(id, created_at)")
    .order("created_at", { ascending: false });
    
  const { count: totalEpisodes } = await supabase
    .from("episodes")
    .select("*", { count: 'exact', head: true });

  const totalSeries = dramas?.length || 0;

  // Fetch views from Redis
  let totalViews = 0;
  let viewCounts: Record<string, number> = {};
  
  if (dramas && dramas.length > 0) {
    try {
      const keys = dramas.map(d => `views:drama:${d.slug}`);
      const rawViews = await redis.mget(...keys);
      dramas.forEach((d, i) => {
        const v = rawViews[i] ? parseInt(rawViews[i] as string, 10) : 0;
        viewCounts[d.slug] = v;
        totalViews += v;
      });
    } catch (e) {
      console.error("Error fetching admin views", e);
    }
  }

  const stats = [
    { name: 'Total Series', value: totalSeries.toString(), label: 'Active on platform' },
    { name: 'Total Views', value: new Intl.NumberFormat().format(totalViews), label: 'Tracked via Redis' },
    { name: 'Total Episodes', value: (totalEpisodes || 0).toString(), label: 'Synced via TeraBox' },
  ];

  return (
    <AdminAuth>
      <div className="max-w-6xl mx-auto animate-fade-in pb-20">
        
        {/* Page Header & Actions */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Overview</h1>
            <p className="text-textMuted text-sm mt-1">Real-time metrics and system management.</p>
          </div>
          <AdminModals dramas={dramas || []} />
        </div>

        {/* Real-Time Analytics Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#111] p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
               <h3 className="text-textMuted text-xs font-semibold uppercase tracking-widest mb-3">{stat.name}</h3>
               <div className="flex items-baseline gap-3 mb-1">
                 <span className="text-4xl font-bold text-white tracking-tight">{stat.value}</span>
               </div>
               <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Content Registry */}
        <div className="bg-[#111] rounded-xl border border-white/10 shadow-lg overflow-hidden">
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
            <h2 className="text-sm font-semibold text-white">Content Registry</h2>
            <div className="flex gap-2">
              <input type="text" placeholder="Search series..." className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-white/30 outline-none w-48 transition-colors" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-textMuted uppercase bg-[#0a0a0a]/50 tracking-widest font-semibold border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Episodes</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#111]">
                {dramas?.map((drama: any) => {
                  const epCount = drama.episodes?.length || 0;
                  const lastEpDate = drama.episodes?.[0]?.created_at;
                  const views = viewCounts[drama.slug] || 0;
                  return (
                  <tr key={drama.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4 font-semibold text-white flex items-center gap-4">
                        <div className="w-24 aspect-video bg-black rounded border border-white/10 overflow-hidden relative shrink-0">
                          <img src={drama.poster_url || drama.backdrop_url} className="w-full h-full object-contain" alt="poster" />
                        </div>
                          <div className="flex flex-col">
                            <span className="truncate max-w-[200px]">{drama.title}</span>
                            <span className="text-xs text-textMuted font-normal mt-0.5">{drama.category}</span>
                            {drama.admin_notes && (
                              <div className="flex items-start gap-1.5 mt-2 bg-[#E50914]/10 border border-[#E50914]/20 p-2 rounded-md">
                                <svg className="w-3.5 h-3.5 text-[#E50914] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-[10px] text-white/80 leading-snug break-words max-w-[150px] whitespace-pre-wrap">{drama.admin_notes}</span>
                              </div>
                            )}
                          </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-white/5 px-2.5 py-1 rounded text-xs font-semibold border border-white/10 text-white/80">{epCount}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-white/80">
                      {new Intl.NumberFormat().format(views)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm ${drama.status === 'Ongoing' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'}`}>
                        {drama.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-textMuted">
                      {lastEpDate ? timeAgo(lastEpDate) : timeAgo(drama.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <EditDramaModal drama={drama} />
                    </td>
                  </tr>
                )})}
                {(!dramas || dramas.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-textMuted">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                      </div>
                      <p className="text-white font-semibold mb-1">No Series Found</p>
                      <p className="text-textMuted text-xs">Deploy your first series to start building your catalog.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminAuth>
  );
}
