import { getServiceSupabase } from '@/lib/supabase';
import AdminAuth from '../AdminAuth';
import { updateRequestStatus } from '@/app/actions';
import { timeAgo } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminRequestsPage() {
  const supabase = getServiceSupabase();
  
  const { data: requests, error } = await supabase
    .from('requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching requests:', error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'In Progress': return 'text-blue-400 bg-blue-400/10';
      case 'Added': return 'text-green-400 bg-green-400/10';
      case 'Rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <AdminAuth>
      <div className="max-w-6xl mx-auto p-6 text-[#F5F5F3]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">User Requests</h1>
          <p className="text-[#92949A] mt-2">Manage drama and dub requests from users.</p>
        </div>

        <div className="bg-[#141519] border border-white/10 rounded-lg overflow-hidden">
          {(!requests || requests.length === 0) ? (
            <div className="p-8 text-center text-[#92949A]">
              No requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1C1D22] text-[#92949A] text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">Drama Name</th>
                    <th className="px-6 py-4 font-medium">Language</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{req.drama_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#92949A]">{req.language}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-[#1C1D22] text-[#92949A]">
                          {req.dub_requested ? 'Dub' : 'Sub'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#92949A]">
                        {timeAgo(req.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <form action={updateRequestStatus} className="flex items-center gap-3">
                          <input type="hidden" name="request_id" value={req.id} />
                          <select 
                            name="status"
                            defaultValue={req.status || 'Pending'}
                            className={`px-3 py-1.5 rounded-md text-sm border-none outline-none appearance-none cursor-pointer ${getStatusColor(req.status || 'Pending')}`}
                          >
                            <option value="Pending" className="bg-[#141519] text-white">Pending</option>
                            <option value="In Progress" className="bg-[#141519] text-white">In Progress</option>
                            <option value="Added" className="bg-[#141519] text-white">Added</option>
                            <option value="Rejected" className="bg-[#141519] text-white">Rejected</option>
                          </select>
                          <button 
                            type="submit"
                            className="bg-[#1C1D22] hover:bg-white/10 text-[#92949A] hover:text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                          >
                            Update
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminAuth>
  );
}
