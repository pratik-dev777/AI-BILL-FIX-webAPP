import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv, isSupabaseConfigured } from "@/lib/env";

let cachedClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  const env = getServerEnv();

  if (!isSupabaseConfigured(env)) {
    return null;
  }

  const supabaseUrl = env.supabaseUrl;
  const supabaseServiceRoleKey = env.supabaseServiceRoleKey;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      },
    });
  }

  return cachedClient;
}
