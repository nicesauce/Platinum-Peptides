import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy, server-only Supabase client using the Service Role key.
// The client is created on first use (at request time), NOT at import time,
// so a missing env var can never crash the build ("Collecting page data").
// NEVER import this into a client component.

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment variables (Vercel → Settings → Environment Variables)."
    );
  }
  _client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

// Proxy so existing `supabaseAdmin.from(...)` calls keep working unchanged,
// while initialization is deferred until a property is actually accessed.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as any)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
