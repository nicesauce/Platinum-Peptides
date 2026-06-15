import { supabaseAdmin } from "./supabase";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars

function randomCode(len: number): string {
  let out = "";
  const bytes = new Uint8Array(len);
  // crypto is available in the Node/Edge runtime
  crypto.getRandomValues(bytes);
  for (let i = 0; i < len; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/**
 * Generate a unique order / transaction number like "PP-7K2M9QXA".
 */
export async function generateOrderNumber(): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate = `PP-${randomCode(8)}`;
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("order_number", candidate)
      .maybeSingle();
    if (!error && !data) return candidate;
  }
  // Extremely unlikely fallback
  return `PP-${randomCode(10)}`;
}
