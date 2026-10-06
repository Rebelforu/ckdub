require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
async function run() {
  const { data: drama, error } = await supabase.from('dramas').select('*, episodes(*)').eq('slug', 'idol-i-hindi-dubbed').single();
  if (error) console.error(error);
  console.log("Episodes length:", drama?.episodes?.length);
  console.log("Episodes numbers:", drama?.episodes?.map(e => e.episode_number).sort((a,b) => a-b));
}
run();
