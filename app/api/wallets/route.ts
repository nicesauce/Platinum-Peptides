import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Public: returns the list of coins that have an active wallet
// (addresses are NOT exposed here; the address is attached to the order).
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("wallets")
    .select("coin, network")
    .eq("active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // De-duplicate by coin (keep first network)
  const seen = new Set<string>();
  const coins = (data ?? []).filter((w) => {
    if (seen.has(w.coin)) return false;
    seen.add(w.coin);
    return true;
  });

  return NextResponse.json({ coins });
}
