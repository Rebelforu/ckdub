"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateEpisode } from "@/app/actions";

export default function EditEpisodeModal({ episode, dramaTitle }: { episode: any, dramaTitle: string }) {
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
        className="text-blue-500 hover:text-blue-400 text-xs hover:underline mr-3"
      >
        Edit
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl animate-fade-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
              <h2 className="text-lg font-bold text-white">Edit Episode {episode.episode_number}</h2>
              <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-white p-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              startTransition(async () => {
                try {
                  await updateEpisode(formData);
                  alert("Episode updated successfully!");
                  setIsOpen(false);
                } catch (error: any) {
                  alert(error.message || "An error occurred while updating.");
                }
              });
            }} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">

              <input type="hidden" name="id" value={episode.id} />
              <p className="text-xs text-textMuted">Series: {dramaTitle}</p>

              <div>
                <label className="block text-xs font-semibold text-textMuted mb-2 uppercase tracking-wider">Episode Number</label>
                <input name="episode_number" defaultValue={episode.episode_number} required type="number" min="1" className="w-full bg-[#0a0a0a] border border-white/5 rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none text-white" />
              </div>

              {/* Server 1 */}
              <div className="bg-[#18191E] p-4 rounded-xl border border-orange-500/20 space-y-3">
                <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  Server 1 — External Link
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">Button Name</label>
                    <input name="server_1_name" type="text" defaultValue={episode.server_1_name || "TeraBox"} className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-orange-500/50 outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">URL <span className="text-primary">*</span></label>
                    <input name="terabox_url" defaultValue={episode.terabox_url} required type="url" className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-orange-500/50 outline-none text-white" />
                  </div>
                </div>
              </div>

              {/* Server 2 — DoodStream */}
              <div className="bg-[#18191E] p-4 rounded-xl border border-blue-500/20 space-y-3">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                  Server 2 — DoodStream (embeds inline)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">Button Name</label>
                    <input name="server_2_name" type="text" defaultValue={episode.server_2_name || "DoodStream"} className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-blue-500/50 outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">DoodStream URL</label>
                    <input name="server_2_url" defaultValue={episode.server_2_url} type="url" placeholder="https://dood.to/e/..." className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-blue-500/50 outline-none text-white" />
                  </div>
                </div>
              </div>

              {/* Server 3 + Note */}
              <div className="bg-[#18191E] p-4 rounded-xl border border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-[#A3A5AD] uppercase tracking-widest">Extra Server &amp; Notes</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">Server 3 Name</label>
                    <input name="server_3_name" type="text" defaultValue={episode.server_3_name || "Server 3"} className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-white/30 outline-none text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">Server 3 URL</label>
                    <input name="server_3_url" defaultValue={episode.server_3_url} type="url" placeholder="Backup link..." className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-white/30 outline-none text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-textMuted mb-1 uppercase">Episode Note (shown to viewers)</label>
                  <input name="episode_note" defaultValue={episode.episode_note} type="text" placeholder="e.g. Subtitles out of sync..." className="w-full bg-[#0D0E10] border border-white/10 rounded-md px-3 py-2 text-sm focus:border-purple-500/50 outline-none text-white" />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
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
