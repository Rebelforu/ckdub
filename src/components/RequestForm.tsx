"use client";

import { useState } from "react";
import { submitRequest } from "@/app/actions";

export default function RequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError("");
    setIsSuccess(false);

    try {
      // The action doesn't return anything, it just throws if error
      await submitRequest(formData);
      setIsSuccess(true);
      // Reset form
      const form = document.getElementById("request-form") as HTMLFormElement;
      if (form) form.reset();
    } catch (err: any) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface p-8 rounded-xl border border-surface/50 shadow-xl">
      {isSuccess && (
        <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Request submitted successfully! We'll review it shortly.
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form id="request-form" action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-2" htmlFor="drama_name">Drama Name *</label>
          <input 
            id="drama_name"
            name="drama_name"
            type="text" 
            className="w-full bg-background border border-surface rounded-lg px-4 py-3 text-textMain focus:outline-none focus:border-primary transition-colors"
            placeholder="e.g. Goblin, Hidden Love"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-2" htmlFor="language">Original Language</label>
          <select 
            id="language"
            name="language"
            className="w-full bg-background border border-surface rounded-lg px-4 py-3 text-textMain focus:outline-none focus:border-primary transition-colors"
            disabled={isSubmitting}
          >
            <option value="Korean">Korean (K-Drama)</option>
            <option value="Chinese">Chinese (C-Drama)</option>
            <option value="Japanese">Japanese (J-Drama)</option>
            <option value="Thai">Thai (Thai-Drama)</option>
            <option value="Other">Other / Don't Know</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-2" htmlFor="dub_requested">Dub Requested *</label>
          <select 
            id="dub_requested"
            name="dub_requested"
            className="w-full bg-background border border-surface rounded-lg px-4 py-3 text-textMain focus:outline-none focus:border-primary transition-colors"
            disabled={isSubmitting}
          >
            <option value="Hindi Dub">Hindi Dub</option>
            <option value="English Dub">English Dub</option>
            <option value="Subtitles Only">Subtitles Only</option>
          </select>
        </div>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-lg transition-all mt-6 text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </button>
      </form>
    </div>
  );
}
