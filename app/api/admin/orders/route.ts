import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID = ["pending_payment", "paid", "processing", "shipped", "cancelled"];

function guard() {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// List orders (newest first), optional ?status= filter
export async function GET(req: NextRequest) {
  const g = guard();
  if (g) return g;
  const status = new URL(req.url).searchParams.get("status");
  let q = supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false });
  if (status && VALID.includes(status)) q = q.eq("status", status);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

// Update order status
export async function PATCH(req: NextRequest) {
  const g = guard();
  if (g) return g;
  const { id, status } = await req.json();
  if (!id || !VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid id/status" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
