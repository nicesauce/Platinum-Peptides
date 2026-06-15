import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the Service Role key.
// NEVER import this into a client component.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Don't throw at import time during build; throw when actually used.
  console.warn(
    "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
  );
}

export const supabaseAdmin = createClient(url ?? "", serviceKey ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});
