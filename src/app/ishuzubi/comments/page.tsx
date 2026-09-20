import { getServiceSupabase } from '@/lib/supabase';
import AdminAuth from '../AdminAuth';
import { updateCommentStatus, deleteComment } from '@/app/actions';
import { timeAgo } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminCommentsPage() {
  const supabase = getServiceSupabase();
  
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <AdminAuth>
      <div className="max-w-6xl mx-auto p-6 text-[#F5F5F3]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">User Feedback</h1>
          <p className="text-[#92949A] mt-2">Private feedback and comments sent by users.</p>
        </div>

        <div className="bg-[#141519] border border-white/10 rounded-lg overflow-hidden">
          {(!comments || comments.length === 0) ? (
            <div className="p-8 text-center text-[#92949A]">
              No feedback received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#1C1D22] text-[#92949A] text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-medium">User & Drama</th>
                    <th className="px-6 py-4 font-medium">Message</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-white/[0.02] group">
                      <td className="px-6 py-4 align-top">
                        <div className="font-medium text-white">{comment.user_name || 'Anonymous'}</div>
                        <div className="text-xs text-[#92949A] mt-1 bg-white/5 inline-block px-2 py-0.5 rounded">/drama/{comment.drama_slug}</div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <p className="text-sm text-white/90 whitespace-pre-wrap">{comment.message}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#92949A] align-top whitespace-nowrap">
                        {timeAgo(comment.created_at)}
                        <div className="mt-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${comment.status === 'Unread' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                            {comment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-right whitespace-nowrap">
                        <div className="flex flex-col items-end gap-2">
                          {comment.status === 'Unread' && (
                            <form action={updateCommentStatus}>
                              <input type="hidden" name="comment_id" value={comment.id} />
                              <input type="hidden" name="status" value="Read" />
                              <button type="submit" className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors">
                                Mark Read
                              </button>
                            </form>
                          )}
                          <form action={deleteComment}>
                            <input type="hidden" name="comment_id" value={comment.id} />
                            <button type="submit" className="text-xs font-semibold text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded transition-colors">
                              Delete
                            </button>
                          </form>
                        </div>
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
