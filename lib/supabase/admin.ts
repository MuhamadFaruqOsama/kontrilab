import { createClient } from "@supabase/supabase-js";

import { supabaseConfig } from "@/lib/env";

if (!supabaseConfig.url || !supabaseConfig.serviceRoleKey) {
  throw new Error("Supabase admin environment variables are not configured.");
}

export const supabaseAdmin = createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
