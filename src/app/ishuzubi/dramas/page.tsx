import { getServiceSupabase } from '@/lib/supabase';
import AdminAuth from '../AdminAuth';
import { deleteDrama, deleteEpisode } from '@/app/actions';
import { timeAgo } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import DeleteForm from './DeleteForm';
import EditEpisodeModal from '@/components/EditEpisodeModal';

export const dynamic = 'force-dynamic';

export default async function AdminDramasPage() {
  const supabase = getServiceSupabase();
  
  const { data: dramas, error } = await supabase
    .from('dramas')
    .select('*, episodes(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dramas:', error);
  }

  return (
    <AdminAuth>
      <div className="max-w-6xl mx-auto p-6 text-[#F5F5F3]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Manage Dramas</h1>
          <Link 
            href="/ishuzubi/add-drama" 
            className="bg-[#E50914] hover:bg-[#F40612] text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Add New Drama
          </Link>
        </div>

        {(!dramas || dramas.length === 0) ? (
          <div className="bg-[#141519] border border-white/10 rounded-lg p-8 text-center text-[#92949A]">
            No dramas found.
          </div>
        ) : (
          <div className="space-y-6">
            {dramas.map((drama) => (
              <div key={drama.id} className="bg-[#141519] border border-white/10 rounded-lg overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row gap-6">
                  {/* Poster Thumbnail */}
                  <div className="relative w-full sm:w-64 aspect-video flex-shrink-0 rounded-md overflow-hidden bg-[#1C1D22]">
                    <Image
                      src={drama.poster_url || drama.backdrop_url || '/placeholder.jpg'}
                      alt={drama.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Drama Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="text-xl font-bold text-white">{drama.title}</h2>
                        <div className="flex items-center gap-3 mt-1 text-sm text-[#92949A]">
                          <span className="capitalize">{drama.category}</span>
                          <span>•</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${drama.status === 'Ongoing' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                            {drama.status}
                          </span>
                          <span>•</span>
                          <span>Added {timeAgo(drama.created_at)}</span>
                        </div>
                      </div>
                      
                      {/* Delete Drama Form */}
                      <DeleteForm 
                        action={deleteDrama} 
                        idName="drama_id" 
                        idValue={drama.id} 
                        confirmMessage="Are you sure you want to delete this drama and all its episodes?" 
                        buttonText="Delete Drama" 
                        buttonClass="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-md transition-colors text-sm disabled:opacity-50" 
                      />
                    </div>

                    {/* Episodes List */}
                    <div className="mt-4 flex-1">
                      <h3 className="text-sm font-semibold text-[#92949A] mb-3 uppercase tracking-wider">
                        Episodes ({drama.episodes?.length || 0})
                      </h3>
                      
                      <div className="bg-[#0D0E10] rounded-md border border-white/5 overflow-hidden">
                        {(!drama.episodes || drama.episodes.length === 0) ? (
                          <div className="p-4 text-sm text-[#92949A] text-center">
                            No episodes added yet.
                          </div>
                        ) : (
                          <div className="max-h-48 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-[#1C1D22] sticky top-0 text-[#92949A]">
                                <tr>
                                  <th className="px-4 py-2 font-medium">Ep</th>
                                  <th className="px-4 py-2 font-medium">Link</th>
                                  <th className="px-4 py-2 font-medium">Language</th>
                                  <th className="px-4 py-2 font-medium text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {drama.episodes.sort((a: any, b: any) => a.episode_number - b.episode_number).map((episode: any) => (
                                  <tr key={episode.id} className="hover:bg-white/[0.02]">
                                    <td className="px-4 py-2 text-white">
                                      {episode.episode_number}
                                    </td>
                                    <td className="px-4 py-2">
                                      <a 
                                        href={episode.terabox_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline truncate max-w-[200px] block"
                                      >
                                        {episode.terabox_link}
                                      </a>
                                    </td>
                                    <td className="px-4 py-2 text-[#92949A]">
                                      {episode.language || 'Hindi'}
                                    </td>
                                    <td className="px-4 py-2 text-right flex justify-end items-center">
                                      <EditEpisodeModal episode={episode} dramaTitle={drama.title} />
                                      <DeleteForm 
                                        action={deleteEpisode} 
                                        idName="episode_id" 
                                        idValue={episode.id} 
                                        confirmMessage="Delete this episode?" 
                                        buttonText="Delete" 
                                        buttonClass="text-red-500 hover:text-red-400 text-xs hover:underline disabled:opacity-50" 
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminAuth>
  );
}
