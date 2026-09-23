import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase URL or Service Role Key in environment variables.');
}

// Create a single supabase client for interacting with your database
// using the service role key to bypass RLS. This is appropriate
// since the backend is the authorization boundary.
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
