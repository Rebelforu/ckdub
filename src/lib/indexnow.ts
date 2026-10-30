import { SITE_URL } from '@/lib/site';

export const INDEXNOW_KEY = 'd8adda28104e47d3a856f54fbe2cf0dd';
export const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_HOST = 'www.ckdub.com';

/**
 * Pings IndexNow (Bing, Yandex, Seznam, Naver) with updated or newly published URLs.
 * Never throws — failures log silently so user actions remain unaffected.
 */
export async function submitToIndexNow(urls: string[]) {
  if (!urls || urls.length === 0) return;

  const validUrls = urls
    .map((u) => (u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? u : `/${u}`}`))
    .slice(0, 10000);

  try {
    const payload = {
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: validUrls,
    };

    // IndexNow standard endpoint pings Bing and all partner search engines
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok && res.status !== 202 && res.status !== 200) {
      console.warn(`IndexNow submission response status: ${res.status}`);
    } else {
      console.log(`Successfully submitted ${validUrls.length} URLs to IndexNow.`);
    }
  } catch (err) {
    console.error('Error submitting to IndexNow:', err);
  }
}
