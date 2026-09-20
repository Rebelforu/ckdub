import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// For client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side admin tasks (bypassing RLS)
export const getServiceSupabase = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
};
