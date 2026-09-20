"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import ImageKit from "imagekit";

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

  // 2. Upload to ImageKit
  if ((posterFile && posterFile.size > 0) || (backdropFile && backdropFile.size > 0)) {
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      throw new Error("ImageKit credentials are missing in .env.local");
    }
    
    const imagekit = new ImageKit({
        publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
    });

    if (posterFile && posterFile.size > 0) {
      const buffer = Buffer.from(await posterFile.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${slug}-poster`,
        folder: "/ckdub/posters"
      });
      poster_url = uploadResponse.url;
    }

    if (backdropFile && backdropFile.size > 0) {
      const buffer = Buffer.from(await backdropFile.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${slug}-backdrop`,
        folder: "/ckdub/backdrops"
      });
      backdrop_url = uploadResponse.url;
    }
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

  revalidatePath("/");
  revalidatePath("/ishuzubi");
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

  revalidatePath("/");
  revalidatePath("/ishuzubi");
  revalidatePath("/ishuzubi/dramas");
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

  revalidatePath("/");
  revalidatePath("/ishuzubi");
  revalidatePath("/ishuzubi/dramas");
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
  
  // Delete episodes first
  await supabase.from('episodes').delete().eq('drama_id', drama_id);
  const { error } = await supabase.from('dramas').delete().eq('id', drama_id);
  
  if (error) throw new Error('Failed to delete drama');
  revalidatePath('/');
  revalidatePath('/ishuzubi');
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
  revalidatePath('/');
  revalidatePath('/ishuzubi');
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

  let poster_url = formData.get("existing_poster") as string;
  let backdrop_url = formData.get("existing_backdrop") as string;

  const posterFile = formData.get("poster_file") as File;
  const backdropFile = formData.get("backdrop_file") as File;

  if ((posterFile && posterFile.size > 0) || (backdropFile && backdropFile.size > 0)) {
    const ImageKit = (await import("imagekit")).default;
    const imagekit = new ImageKit({
        publicKey : process.env.IMAGEKIT_PUBLIC_KEY!,
        privateKey : process.env.IMAGEKIT_PRIVATE_KEY!,
        urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT!
    });

    if (posterFile && posterFile.size > 0) {
      const buffer = Buffer.from(await posterFile.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${slug}-poster`,
        folder: "/ckdub/posters"
      });
      poster_url = uploadResponse.url;
    }

    if (backdropFile && backdropFile.size > 0) {
      const buffer = Buffer.from(await backdropFile.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `${slug}-backdrop`,
        folder: "/ckdub/backdrops"
      });
      backdrop_url = uploadResponse.url;
    }
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

  if (error) throw new Error("Failed to update drama: " + error.message);

  revalidatePath("/");
  revalidatePath("/ishuzubi");
  revalidatePath("/ishuzubi/dramas");
  revalidatePath(`/drama/${slug}`);
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
