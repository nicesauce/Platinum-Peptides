import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Public: customer submits their TXID (transaction hash) for an order.
export async function POST(
  req: NextRequest,
  { params }: { params: { number: string } }
) {
  const number = decodeURIComponent(params.number).toUpperCase();
  const { txid } = await req.json();
  if (!txid || typeof txid !== "string" || txid.trim().length < 4) {
    return NextResponse.json({ error: "Invalid TXID" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ txid: txid.trim() })
    .eq("order_number", number)
    .select("order_number, txid")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, order: data });
}
