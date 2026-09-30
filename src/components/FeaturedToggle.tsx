"use client";

import { useState, useTransition } from "react";
import { toggleFeatured } from "@/app/actions";

export default function FeaturedToggle({ dramaId, isFeatured }: { dramaId: string; isFeatured: boolean }) {
  const [featured, setFeatured] = useState(isFeatured);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleFeatured(dramaId, !featured);
      setFeatured(!featured);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      title={featured ? "Currently Hero Featured — click to unfeature" : "Click to set as Hero Feature"}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
        featured
          ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400"
          : "bg-white/5 border-white/10 text-white/40 hover:bg-yellow-500/20 hover:border-yellow-500/40 hover:text-yellow-400"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg className="w-3.5 h-3.5" fill={featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      {isPending ? "..." : featured ? "Hero" : "Set Hero"}
    </button>
  );
}
