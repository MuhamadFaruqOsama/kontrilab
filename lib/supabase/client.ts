import { createClient } from "@supabase/supabase-js";

import { supabaseConfig } from "@/lib/env";

if (!supabaseConfig.url || !supabaseConfig.publishableKey) {
  throw new Error("Supabase public environment variables are not configured.");
}

export const supabase = createClient(supabaseConfig.url, supabaseConfig.publishableKey);
