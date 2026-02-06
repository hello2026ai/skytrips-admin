import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create a dummy client for build time if env vars are missing
const isBuildTime = process.env.NODE_ENV === 'production' && !supabaseUrl;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  if (!isBuildTime) {
    console.warn("Supabase Admin environment variables missing");
  }
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseServiceRoleKey || 'placeholder', 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
