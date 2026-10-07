"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getServiceSupabase } from "@/lib/supabase";
import { uploadImage, deleteImageByUrl } from "@/lib/imagekit";

/** Refresh every public page (home, browse, drama, watch, sitemap, llms.txt) after content changes. */
function refreshPublicSite() {
  revalidatePath("/", "layout");
}

/** Mark a drama as recently updated so it jumps to the top of the homepage. */
async function touchDrama(supabase: any, dramaId: string, episodeNumber?: number) {
  const { data: drama } = await supabase.from("dramas").select("total_episodes").eq("id", dramaId).single();
  const update: Record<string, any> = { updated_at: new Date().toISOString() };
  if (episodeNumber && (!drama?.total_episodes || drama.total_episodes < episodeNumber)) {
    update.total_episodes = episodeNumber;
  }
  await supabase.from("dramas").update(update).eq("id", dramaId);
}

export async function createDrama(formData: FormData) {
  const supabase = createClient();
  
  // 1. Secure Authentication Check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error("Unauthorized: Only the Master Admin can perform this action.");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const language = formData.get("language") as string;
  const description = formData.get("description") as string;
  
  // New SEO Fields
  const alt_titles = formData.get("alt_titles") as string;
  const cast_list = formData.get("cast_list") as string;
  const release_year = parseInt(formData.get("release_year") as string) || null;
  const total_episodes = parseInt(formData.get("total_episodes") as string) || null;
  const audio_languages = formData.get("audio_languages") as string;
  const subtitle_languages = formData.get("subtitle_languages") as string;
  const meta_description = formData.get("meta_description") as string;
  const short_description = formData.get("short_description") as string;
  const network = formData.get("network") as string;
  const content_rating = formData.get("content_rating") as string;
  const country = formData.get("country") as string;
  const trailer_url = formData.get("trailer_url") as string;
  const admin_notes = formData.get("admin_notes") as string;
  const referral_link = formData.get("referral_link") as string;
  const episode_schedule_note = formData.get("episode_schedule_note") as string;
  const genres = formData.get("genres") as string; // Will be stored as comma separated in array
  const genresArray = genres ? genres.split(',').map(g => g.trim()) : null;

  let poster_url = "";
  let backdrop_url = "";
  const posterFile = formData.get("poster_file") as File;
  const backdropFile = formData.get("backdrop_file") as File;

  // 2. Upload to ImageKit (original quality kept; CDN resizes per device)
  if (posterFile && posterFile.size > 0) {
    poster_url = await uploadImage(posterFile, `${slug}-poster`, "/ckdub/posters");
  }
  if (backdropFile && backdropFile.size > 0) {
    backdrop_url = await uploadImage(backdropFile, `${slug}-backdrop`, "/ckdub/backdrops");
  }

  // 3. Save to Supabase
  const { error } = await supabase
    .from("dramas")
    .insert([{ 
      title, slug, category, poster_url, status, language, description, 
      alt_titles, cast_list, release_year, total_episodes, audio_languages,
      subtitle_languages, backdrop_url, meta_description, short_description, network, content_rating,
      country, trailer_url, genres: genresArray, admin_notes,
      referral_link: referral_link || null, episode_schedule_note: episode_schedule_note || null
    }]);

  if (error) {
    console.error("Error creating drama:", error);
    throw new Error("Failed to create drama: " + error.message);
  }

  refreshPublicSite();
}

export async function addEpisode(formData: FormData) {
  const supabase = createClient();
  
  // 1. Secure Authentication Check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error("Unauthorized: Only the Master Admin can perform this action.");
  }

  const drama_id = formData.get("drama_id") as string;
  const episode_number = parseInt(formData.get("episode_number") as string);
  const terabox_url = formData.get("terabox_url") as string;
  const server_2_url = formData.get("server_2_url") as string;
  const server_3_url = formData.get("server_3_url") as string;
  const episode_note = formData.get("episode_note") as string;

  const { error } = await supabase
    .from("episodes")
    .insert([{ 
      drama_id, 
      episode_number, 
      terabox_url,
      server_2_url: server_2_url || null,
      server_3_url: server_3_url || null,
      episode_note: episode_note || null
    }]);

  if (error) {
    console.error("Error adding episode:", error);
    throw new Error("Failed to add episode");
  }

  await touchDrama(supabase, drama_id, episode_number);
  refreshPublicSite();
}

export async function updateEpisode(formData: FormData) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const episode_number = parseInt(formData.get("episode_number") as string);
  const terabox_url = formData.get("terabox_url") as string;
  const server_2_url = formData.get("server_2_url") as string;
  const server_3_url = formData.get("server_3_url") as string;
  const episode_note = formData.get("episode_note") as string;

  const { error } = await supabase
    .from("episodes")
    .update({ 
      episode_number, 
      terabox_url,
      server_2_url: server_2_url || null,
      server_3_url: server_3_url || null,
      episode_note: episode_note || null
    })
    .eq("id", id);

  if (error) throw new Error("Failed to update episode: " + error.message);

  refreshPublicSite();
}

export async function submitRequest(formData: FormData) {
  const supabase = createClient();
  
  const drama_name = formData.get('drama_name') as string;
  const language = formData.get('language') as string;
  const dub_requested = formData.get('dub_requested') as string;

  if (!drama_name) throw new Error('Drama name is required');

  const { error } = await supabase
    .from('requests')
    .insert([{ 
      drama_title: drama_name, 
      language_requested: `${language} - ${dub_requested}` 
    }]);

  if (error) throw new Error('Failed to submit request');
  
  revalidatePath('/request');
  revalidatePath('/ishuzubi/requests');
}

export async function deleteDrama(formData: FormData) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
  
  const drama_id = formData.get('drama_id') as string;
  const { data: existing } = await supabase.from('dramas').select('poster_url, backdrop_url').eq('id', drama_id).single();
  
  // Delete episodes first
  await supabase.from('episodes').delete().eq('drama_id', drama_id);
  const { error } = await supabase.from('dramas').delete().eq('id', drama_id);
  
  if (error) throw new Error('Failed to delete drama');

  // Clean up the drama's images from ImageKit
  await deleteImageByUrl(existing?.poster_url);
  await deleteImageByUrl(existing?.backdrop_url);

  refreshPublicSite();
}

export async function deleteEpisode(formData: FormData) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
  
  const episode_id = formData.get('episode_id') as string;
  const { error } = await supabase.from('episodes').delete().eq('id', episode_id);
  
  if (error) throw new Error('Failed to delete episode');
  refreshPublicSite();
}

export async function updateRequestStatus(formData: FormData) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
  
  const request_id = formData.get('request_id') as string;
  const status = formData.get('status') as string;
  
  const { error } = await supabase.from('requests').update({ status }).eq('id', request_id);
  if (error) throw new Error('Failed to update request');
  revalidatePath('/ishuzubi/requests');
}

export async function updateDrama(formData: FormData) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error("Unauthorized: Only the Master Admin can perform this action.");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const language = formData.get("language") as string;
  const description = formData.get("description") as string;
  
  const alt_titles = formData.get("alt_titles") as string;
  const cast_list = formData.get("cast_list") as string;
  const release_year = parseInt(formData.get("release_year") as string) || null;
  const total_episodes = parseInt(formData.get("total_episodes") as string) || null;
  const audio_languages = formData.get("audio_languages") as string;
  const subtitle_languages = formData.get("subtitle_languages") as string;
  const meta_description = formData.get("meta_description") as string;
  const short_description = formData.get("short_description") as string;
  const network = formData.get("network") as string;
  const content_rating = formData.get("content_rating") as string;
  const country = formData.get("country") as string;
  const trailer_url = formData.get("trailer_url") as string;
  const admin_notes = formData.get("admin_notes") as string;
  const referral_link = formData.get("referral_link") as string;
  const episode_schedule_note = formData.get("episode_schedule_note") as string;
  const genres = formData.get("genres") as string;
  const genresArray = genres ? genres.split(",").map(g => g.trim()) : null;

  const old_poster = formData.get("existing_poster") as string;
  const old_backdrop = formData.get("existing_backdrop") as string;
  let poster_url = old_poster;
  let backdrop_url = old_backdrop;

  const posterFile = formData.get("poster_file") as File;
  const backdropFile = formData.get("backdrop_file") as File;

  if (posterFile && posterFile.size > 0) {
    poster_url = await uploadImage(posterFile, `${slug}-poster`, "/ckdub/posters");
  }
  if (backdropFile && backdropFile.size > 0) {
    backdrop_url = await uploadImage(backdropFile, `${slug}-backdrop`, "/ckdub/backdrops");
  }

  const { error } = await supabase
    .from("dramas")
    .update({ 
      title, slug, category, poster_url, status, language, description,
      alt_titles, cast_list, release_year, total_episodes, audio_languages,
      subtitle_languages, backdrop_url, meta_description, short_description, network, content_rating,
      country, trailer_url, genres: genresArray, admin_notes,
      referral_link: referral_link || null, episode_schedule_note: episode_schedule_note || null
    })
    .eq("id", id);

  if (error) {
    // Save failed: remove the freshly uploaded files so nothing is orphaned
    if (poster_url !== old_poster) await deleteImageByUrl(poster_url);
    if (backdrop_url !== old_backdrop) await deleteImageByUrl(backdrop_url);
    throw new Error("Failed to update drama: " + error.message);
  }

  // Save succeeded: permanently delete the replaced images from ImageKit
  if (poster_url !== old_poster) await deleteImageByUrl(old_poster);
  if (backdrop_url !== old_backdrop) await deleteImageByUrl(old_backdrop);

  refreshPublicSite();
}

export async function submitComment(formData: FormData) {
  const supabase = createClient();
  const drama_slug = formData.get('drama_slug') as string;
  const user_name = formData.get('user_name') as string || 'Anonymous';
  const message = formData.get('message') as string;

  if (!message) throw new Error('Message is required');

  const { error } = await supabase
    .from('comments')
    .insert([{ drama_slug, user_name, message }]);

  if (error) throw new Error('Failed to submit comment');
}

export async function updateCommentStatus(formData: FormData) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) throw new Error('Unauthorized');

  const comment_id = formData.get('comment_id') as string;
  const status = formData.get('status') as string;

  const { error } = await supabase.from('comments').update({ status }).eq('id', comment_id);
  if (error) throw new Error('Failed to update comment');
  revalidatePath('/ishuzubi/comments');
}

export async function deleteComment(formData: FormData) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) throw new Error('Unauthorized');

  const comment_id = formData.get('comment_id') as string;
  const { error } = await supabase.from('comments').delete().eq('id', comment_id);
  if (error) throw new Error('Failed to delete comment');
  revalidatePath('/ishuzubi/comments');
}

export async function toggleFeatured(dramaId: string, featured: boolean) {
  // Server-side admin auth guard — never trust client
  const authClient = createClient();
  const { data: { user }, error: authError } = await authClient.auth.getUser();
  if (authError || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    throw new Error('Unauthorized');
  }
  const supabase = getServiceSupabase();
  // If setting featured=true, first clear any existing featured drama
  if (featured) {
    await supabase.from('dramas').update({ is_featured: false }).eq('is_featured', true);
  }
  const { error } = await supabase.from('dramas').update({ is_featured: featured }).eq('id', dramaId);
  if (error) throw new Error('Failed to update featured status');
  refreshPublicSite();
}

