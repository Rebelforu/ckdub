// Server-side only (used from server actions). Never import in client components.
import ImageKit from "imagekit";

let client: ImageKit | null = null;

export function getImageKit() {
  if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    throw new Error("ImageKit credentials are missing (IMAGEKIT_PUBLIC_KEY / IMAGEKIT_PRIVATE_KEY / IMAGEKIT_URL_ENDPOINT)");
  }
  if (!client) {
    client = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return client;
}

/** Upload a poster/backdrop file and return its public URL (original full quality is kept). */
export async function uploadImage(file: File, fileName: string, folder: "/ckdub/posters" | "/ckdub/backdrops") {
  const ik = getImageKit();
  const buffer = Buffer.from(await file.arrayBuffer());
  const res = await ik.upload({ file: buffer, fileName, folder, useUniqueFileName: true });
  return res.url;
}

/**
 * Permanently delete an image from ImageKit by its URL and purge it from the CDN cache.
 * Never throws — a failed cleanup must not break saving the drama.
 */
export async function deleteImageByUrl(url?: string | null) {
  if (!url || !url.includes("ik.imagekit.io")) return;
  try {
    const ik = getImageKit();
    const endpoint = process.env.IMAGEKIT_URL_ENDPOINT!.replace(/\/$/, "");
    const cleanUrl = url.split("?")[0];
    const filePath = cleanUrl.startsWith(endpoint) ? cleanUrl.slice(endpoint.length) : new URL(cleanUrl).pathname.split("/").slice(2).join("/");
    const normalized = filePath.startsWith("/") ? filePath : `/${filePath}`;
    const lastSlash = normalized.lastIndexOf("/");
    const folder = normalized.slice(0, lastSlash) || "/";
    const name = normalized.slice(lastSlash + 1);

    const files = await ik.listFiles({ path: folder, searchQuery: `name = "${name}"`, limit: 5 });
    for (const f of files as any[]) {
      if (f.type === "folder" || !f.fileId) continue;
      await ik.deleteFile(f.fileId);
    }
    // Remove cached copies (including resized variants) from the CDN
    await ik.purgeCache(cleanUrl).catch(() => {});
  } catch (err) {
    console.error("ImageKit cleanup failed for", url, err);
  }
}
