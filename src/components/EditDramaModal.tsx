"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateDrama } from "@/app/actions";

export default function EditDramaModal({ drama }: { drama: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-textMuted hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-md"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
              <h2 className="text-xl font-bold text-white">Edit Series: {drama.title}</h2>
              <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-white p-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(async () => {
                try {
                  await updateDrama(formData);
                  alert("Series updated successfully!");
                  setIsOpen(false);
                } catch (error: any) {
                  alert(error.message || "An error occurred while updating.");
                }
              });
            }} className="p-6 space-y-6 overflow-y-auto">
              
              <input type="hidden" name="id" value={drama.id} />
              <input type="hidden" name="existing_poster" value={drama.poster_url || ""} />
              <input type="hidden" name="existing_backdrop" value={drama.backdrop_url || ""} />

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Basic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Series Title</label>
                    <input name="title" defaultValue={drama.title} required type="text" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">URL Slug</label>
                    <input name="slug" defaultValue={drama.slug} required type="text" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Alternative / Native Titles</label>
                    <input name="alt_titles" defaultValue={drama.alt_titles} type="text" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Category</label>
                    <select name="category" defaultValue={drama.category} required className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white">
                      <option value="Korean Series">Korean Series</option>
                      <option value="Chinese Series">Chinese Series</option>
                      <option value="Japanese Series">Japanese Series</option>
                      <option value="Thai Series">Thai Series</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Taxonomy & Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Genres (Comma separated)</label>
                    <input name="genres" defaultValue={Array.isArray(drama.genres) ? drama.genres.join(", ") : drama.genres} type="text" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Status</label>
                    <select name="status" defaultValue={drama.status} required className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white">
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Release Year</label>
                    <input name="release_year" defaultValue={drama.release_year} type="number" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Total Episodes (Planned)</label>
                    <input name="total_episodes" defaultValue={drama.total_episodes} type="number" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Content Rating</label>
                    <input name="content_rating" defaultValue={drama.content_rating} type="text" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">Country / Network</label>
                    <div className="flex gap-2">
                      <input name="country" defaultValue={drama.country} placeholder="South Korea" type="text" className="w-1/2 bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                      <input name="network" defaultValue={drama.network} placeholder="tvN" type="text" className="w-1/2 bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Media & Content</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">2:3 Poster Image (Leave empty to keep existing)</label>
                    <input name="poster_file" type="file" accept="image/*" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textMuted mb-2">16:9 Backdrop Image (Leave empty to keep existing)</label>
                    <input name="backdrop_file" type="file" accept="image/*" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-textMuted mb-2">Cast List</label>
                    <input name="cast_list" defaultValue={drama.cast_list} type="text" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-textMuted mb-2">Short Description (Displays below title)</label>
                    <textarea name="short_description" defaultValue={drama.short_description} maxLength={200} className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none h-16 resize-none text-white"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-textMuted mb-2">Full Synopsis (Detailed story)</label>
                    <textarea name="description" defaultValue={drama.description} required className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none h-24 resize-none text-white"></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-textMuted mb-2">Custom SEO Meta Description (max 160 chars)</label>
                    <textarea name="meta_description" defaultValue={drama.meta_description} maxLength={160} className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none h-16 resize-none text-white"></textarea>
                  </div>
                  <div className="col-span-2 mt-2">
                    <label className="block text-xs font-bold text-[#E50914] mb-2 uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Private Admin Notes
                    </label>
                    <textarea name="admin_notes" defaultValue={drama.admin_notes} placeholder="Notes for staff (e.g., 'Upload season 2 tomorrow'). Only visible to admins." className="w-full bg-[#18191E] border border-[#E50914]/20 rounded-lg px-4 py-3 text-sm focus:border-[#E50914] outline-none h-24 resize-none text-white"></textarea>
                  </div>
                  <div className="col-span-2 mt-2">
                    <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101"></path></svg>
                      Referral / Earning Link
                    </label>
                    <input name="referral_link" defaultValue={drama.referral_link || "https://dm.terabox.com/referral/4398076333227"} type="url" placeholder="https://dm.terabox.com/referral/..." className="w-full bg-[#0a0a0a] border border-blue-400/20 rounded-lg px-4 py-2.5 text-sm focus:border-blue-400 outline-none text-white" />
                    <p className="text-[10px] text-textMuted mt-1">Shown below episodes as 'Wanna start earning? Join here'. Leave empty to hide.</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-green-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Episode Schedule Note
                    </label>
                    <textarea name="episode_schedule_note" defaultValue={drama.episode_schedule_note} placeholder="e.g., New episodes every Wednesday & Thursday at 9PM KST" className="w-full bg-[#0a0a0a] border border-green-400/20 rounded-lg px-4 py-2.5 text-sm focus:border-green-400 outline-none h-16 resize-none text-white"></textarea>
                    <p className="text-[10px] text-textMuted mt-1">Displayed below the episode list on the drama page. Leave empty to hide.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/5 sticky bottom-0 bg-[#111] pb-2">
                <button type="button" onClick={() => setIsOpen(false)} disabled={isPending} className="px-5 py-2.5 text-sm font-medium text-textMuted hover:text-white disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-primary hover:bg-primaryHover text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2">
                  {isPending ? "Saving..." : "Save Changes"}
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

