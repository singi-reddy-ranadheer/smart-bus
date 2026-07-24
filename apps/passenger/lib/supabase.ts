import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
}

// Lazy proxy that only initializes the client when accessed
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return getSupabase()[prop as keyof ReturnType<typeof createClient>];
  },
});
