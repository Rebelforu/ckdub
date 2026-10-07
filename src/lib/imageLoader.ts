"use client";

/**
 * Custom next/image loader.
 * - ImageKit URLs: ImageKit's CDN resizes & converts (AVIF/WebP) per device width.
 *   This gives sharper images than Vercel's re-compression and doesn't use the
 *   Vercel image-optimization quota.
 * - Anything else: served as-is.
 */
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (!src) return src;

  if (src.includes("ik.imagekit.io")) {
    const q = quality || 85;
    const tr = `tr=w-${width},q-${q},f-auto`;
    // If the URL already has an ImageKit transform, don't stack another
    if (src.includes("tr=") || src.includes("/tr:")) return src;
    return `${src}${src.includes("?") ? "&" : "?"}${tr}`;
  }

  return src;
}
