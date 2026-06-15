import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

function guard() {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const g = guard();
  if (g) return g;
  const { data, error } = await supabaseAdmin
    .from("wallets")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ wallets: data ?? [] });
}

export async function POST(req: NextRequest) {
  const g = guard();
  if (g) return g;
  const b = await req.json();
  if (!b.coin || !b.address) {
    return NextResponse.json({ error: "coin and address required" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("wallets").insert({
    coin: String(b.coin).toUpperCase(),
    network: b.network ?? "",
    address: b.address,
    active: b.active ?? true,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const g = guard();
  if (g) return g;
  const b = await req.json();
  if (!b.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await supabaseAdmin
    .from("wallets")
    .update({
      coin: b.coin ? String(b.coin).toUpperCase() : undefined,
      network: b.network,
      address: b.address,
      active: b.active,
    })
    .eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const g = guard();
  if (g) return g;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await supabaseAdmin.from("wallets").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
