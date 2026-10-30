import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { SITE_URL } from '@/lib/site';
import { submitToIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  return handleIndexNowSubmission();
}

export async function GET() {
  return handleIndexNowSubmission();
}

async function handleIndexNowSubmission() {
  try {
    const supabase = getServiceSupabase();

    // Fetch all dramas with episodes
    const { data: dramas } = await supabase
      .from('dramas')
      .select('slug, category, episodes(episode_number)')
      .order('updated_at', { ascending: false });

    const list = dramas || [];

    const urls: string[] = [
      `${SITE_URL}/`,
      `${SITE_URL}/browse`,
      `${SITE_URL}/category/korean`,
      `${SITE_URL}/category/chinese`,
      `${SITE_URL}/category/ai_series`,
      `${SITE_URL}/blog`,
    ];

    list.forEach((drama: any) => {
      urls.push(`${SITE_URL}/drama/${drama.slug}`);
      (drama.episodes || []).forEach((ep: any) => {
        urls.push(`${SITE_URL}/drama/${drama.slug}/watch/${ep.episode_number}`);
      });
    });

    // Submit all URLs in batches of 1,000
    for (let i = 0; i < urls.length; i += 1000) {
      const batch = urls.slice(i, i + 1000);
      await submitToIndexNow(batch);
    }

    return NextResponse.json({
      success: true,
      message: `Submitted ${urls.length} URLs to IndexNow (Bing & Search Engines)`,
      totalSubmitted: urls.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
