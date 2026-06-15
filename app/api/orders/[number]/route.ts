import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Public: fetch a single order by its order_number (for tracking).
export async function GET(
  _req: NextRequest,
  { params }: { params: { number: string } }
) {
  const number = decodeURIComponent(params.number).toUpperCase();
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_number", number)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ order: data });
}
