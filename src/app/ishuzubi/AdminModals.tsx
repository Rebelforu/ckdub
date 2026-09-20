"use client";

import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createDrama, addEpisode, updateDrama } from '../actions';

export default function AdminModals({ dramas }: { dramas: any[] }) {
  const [activeModal, setActiveModal] = useState<'none' | 'series' | 'episode' | 'edit'>('none');
  const [editDrama, setEditDrama] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <>
      {/* Toast Notification Portal */}
      {mounted && createPortal(
        <div className={`fixed bottom-5 right-5 z-[200] transition-all duration-300 transform ${toast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          {toast && (
            <div className={`px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
              toast.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}>
              {toast.type === 'success' ? (
                <div className="bg-green-500/20 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg></div>
              ) : (
                <div className="bg-red-500/20 p-1 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></div>
              )}
              <span className="text-sm font-bold tracking-wide">{toast.message}</span>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Header Actions */}
      <div className="flex gap-3">
        <button onClick={() => setActiveModal('episode')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Push Episode
        </button>
        <button onClick={() => setActiveModal('series')} className="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.3)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Series
        </button>
      </div>

      {/* Series Modal */}
      {activeModal === 'series' && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a] shrink-0">
              <h2 className="text-lg font-bold text-white">Deploy New Series (SEO Optimized)</h2>
              <button onClick={() => setActiveModal('none')} className="text-textMuted hover:text-white p-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(async () => {
                try {
                  await createDrama(formData);
                  showToast("Series published successfully!", "success");
                  setActiveModal('none');
                } catch (error: any) {
                  showToast(error.message || "An error occurred while publishing.", "error");
                }
              });
            }} className="p-6 space-y-6 overflow-y-auto">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Basic Info</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Series Title</label>
                    <input name="title" required type="text" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">URL Slug</label>
                    <input name="slug" required type="text" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Alternative / Native Titles</label>
                    <input name="alt_titles" type="text" placeholder="e.g. 오징어 게임, Squid Game" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Category</label>
                    <select name="category" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white">
                      <option value="korean">Korean Series</option>
                      <option value="chinese">Chinese Series</option>
                      <option value="english">English Series</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Taxonomy & Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Taxonomy & Details</h3>
                <div className="grid grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Genres (Comma separated)</label>
                    <input name="genres" type="text" placeholder="Romance, Action, Youth" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Status</label>
                    <select name="status" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white">
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Release Year</label>
                    <input name="release_year" type="number" placeholder="2024" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Total Episodes (Planned)</label>
                    <input name="total_episodes" type="number" placeholder="16" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Content Rating</label>
                    <input name="content_rating" type="text" placeholder="e.g. 16+, 18+, PG-13" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Country / Network</label>
                    <input name="country" type="text" placeholder="South Korea / tvN" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                </div>
              </div>

              {/* Media & SEO */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider">Media & Content</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Vertical Poster (Required)</label>
                    <input name="poster_file" required type="file" accept="image/*" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">16:9 Backdrop Image (SEO/Hero)</label>
                    <input name="backdrop_file" type="file" accept="image/*" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-textMuted mb-2">Cast List</label>
                    <input name="cast_list" type="text" placeholder="Song Kang, Han So-hee, Lee Do-hyun" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-textMuted mb-2">Short Description (Displays below title)</label>
                    <textarea name="short_description" maxLength={200} placeholder="A short 1-2 sentence hook for the hero section..." className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none h-16 resize-none text-white"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-textMuted mb-2">Full Synopsis (Detailed story)</label>
                    <textarea name="description" required className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none h-24 resize-none text-white"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-textMuted mb-2">Custom SEO Meta Description (max 160 chars)</label>
                    <textarea name="meta_description" maxLength={160} placeholder="Optimized snippet for Google..." className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none h-16 resize-none text-white"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-[#E50914] mb-2 uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Private Admin Notes
                    </label>
                    <textarea name="admin_notes" placeholder="Notes for staff (e.g., 'Upload season 2 tomorrow'). Only visible to admins." className="w-full bg-[#18191E] border border-[#E50914]/20 rounded-lg px-4 py-3 text-sm focus:border-[#E50914] outline-none h-24 resize-none text-white"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101"></path></svg>
                      Referral / Earning Link
                    </label>
                    <input name="referral_link" type="url" defaultValue="https://dm.terabox.com/referral/4398076333227" placeholder="https://dm.terabox.com/referral/..." className="w-full bg-[#0a0a0a] border border-blue-400/20 rounded-lg px-4 py-2.5 text-sm focus:border-blue-400 outline-none text-white" />
                    <p className="text-[10px] text-textMuted mt-1">Shown below episodes as &apos;Wanna start earning? Join here&apos;. Leave empty to hide.</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-green-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Episode Schedule Note
                    </label>
                    <textarea name="episode_schedule_note" placeholder="e.g., New episodes every Wednesday & Thursday at 9PM KST" className="w-full bg-[#0a0a0a] border border-green-400/20 rounded-lg px-4 py-2.5 text-sm focus:border-green-400 outline-none h-16 resize-none text-white"></textarea>
                    <p className="text-[10px] text-textMuted mt-1">Displayed below the episode list on the drama page. Leave empty to hide.</p>
                  </div>
                </div>
              </div>

              {/* Hidden fields mapped for compatibility */}
              <input type="hidden" name="language" value="Hindi Dub" />
              <input type="hidden" name="audio_languages" value="Hindi, Korean" />
              <input type="hidden" name="subtitle_languages" value="English" />

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5 sticky bottom-0 bg-[#111] pb-2">
                <button type="button" onClick={() => setActiveModal('none')} disabled={isPending} className="px-5 py-2.5 text-sm font-medium text-textMuted hover:text-white disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2">
                  {isPending && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  {isPending ? 'Publishing...' : 'Publish Series'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Episode Modal */}
      {activeModal === 'episode' && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md flex flex-col shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
              <h2 className="text-lg font-bold text-white">Add New Episode</h2>
              <button onClick={() => setActiveModal('none')} className="text-textMuted hover:text-white p-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(async () => {
                try {
                  await addEpisode(formData);
                  showToast("Episode published successfully!", "success");
                  setActiveModal('none');
                } catch (error: any) {
                  showToast(error.message || "An error occurred while publishing the episode.", "error");
                }
              });
            }} className="p-6 space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-textMuted mb-2 uppercase tracking-wider">Select Series</label>
                <select name="drama_id" required className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white appearance-none">
                  <option value="">-- Choose Series --</option>
                  {dramas?.map((drama) => (
                    <option key={drama.id} value={drama.id}>{drama.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-textMuted mb-2 uppercase tracking-wider">Episode Number</label>
                <input name="episode_number" required type="number" min="1" placeholder="e.g. 1" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-textMuted mb-2 uppercase tracking-wider">TeraBox URL (Server 1)</label>
                <input name="terabox_url" required type="url" placeholder="https://terabox.com/s/..." className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
              </div>

              {/* Optional Secondary Providers & Notes - Different Styling */}
              <div className="bg-[#18191E] p-4 rounded-xl border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-[#A3A5AD] uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Optional Configurations
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">Server 2 URL</label>
                    <input name="server_2_url" type="url" placeholder="Alternative link..." className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-blue-500/50 outline-none text-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">Server 3 URL</label>
                    <input name="server_3_url" type="url" placeholder="Backup link..." className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-blue-500/50 outline-none text-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">Note Below Episode</label>
                    <input name="episode_note" type="text" placeholder="e.g. Subtitles out of sync, fixing soon..." className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-purple-500/50 outline-none text-white transition-colors" />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setActiveModal('none')} disabled={isPending} className="px-5 py-2.5 text-sm font-medium text-textMuted hover:text-white disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2">
                  {isPending && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  {isPending ? 'Publishing...' : 'Publish Episode'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
