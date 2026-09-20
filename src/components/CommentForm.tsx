"use client";

import { useState, useTransition } from "react";
import { submitComment } from "@/app/actions";

export default function CommentForm({ dramaSlug }: { dramaSlug: string }) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="bg-[#141519] border border-white/5 p-6 rounded-2xl shadow-lg mt-8">
      <h3 className="text-xl font-bold text-white mb-2">Leave a Comment / Feedback</h3>
      <p className="text-sm text-[#92949A] mb-6">Your message will be sent directly to the site administrators. It will not be visible publicly.</p>
      
      {submitted ? (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <span className="font-semibold text-sm">Thank you! Your message has been sent to the admin team.</span>
        </div>
      ) : (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            startTransition(async () => {
              try {
                await submitComment(formData);
                setSubmitted(true);
              } catch (error) {
                alert("Failed to submit comment. Please try again.");
              }
            });
          }} 
          className="space-y-4"
        >
          <input type="hidden" name="drama_slug" value={dramaSlug} />
          
          <div>
            <label className="block text-xs font-semibold text-[#92949A] mb-1.5">Name (Optional)</label>
            <input 
              type="text" 
              name="user_name" 
              placeholder="Your name" 
              className="w-full bg-[#0D0E10] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#E50914] outline-none transition-colors" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-[#92949A] mb-1.5">Message</label>
            <textarea 
              name="message" 
              required 
              placeholder="What did you think of this episode or series? Report any issues here..." 
              className="w-full bg-[#0D0E10] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-[#E50914] outline-none h-24 resize-none transition-colors"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={isPending}
            className="px-6 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? "Sending..." : "Send to Admin"}
            {!isPending && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
          </button>
        </form>
      )}
    </div>
  );
}
