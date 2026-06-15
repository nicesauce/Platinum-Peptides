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

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Math.random().toString(36).slice(2, 6);
}

// GET all products (including inactive) with variants
export async function GET() {
  const g = guard();
  if (g) return g;
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, product_variants(*)")
    .order("sort", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const products = (data ?? []).map((p: any) => ({
    ...p,
    variants: (p.product_variants ?? []).sort((a: any, b: any) => a.sort - b.sort),
  }));
  return NextResponse.json({ products });
}

// CREATE product (+variants)
export async function POST(req: NextRequest) {
  const g = guard();
  if (g) return g;
  const b = await req.json();
  const { data: product, error } = await supabaseAdmin
    .from("products")
    .insert({
      name: b.name,
      slug: slugify(b.name || "product"),
      description: b.description ?? "",
      category: b.category ?? "Peptides",
      purity: b.purity ?? ">= 99%",
      image_url: b.image_url ?? "",
      active: b.active ?? true,
      sort: b.sort ?? 0,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const variants = (b.variants ?? []).map((v: any, i: number) => ({
    product_id: product.id,
    label: v.label,
    price: Number(v.price) || 0,
    stock: parseInt(v.stock, 10) || 0,
    sort: i,
  }));
  if (variants.length) {
    await supabaseAdmin.from("product_variants").insert(variants);
  }
  return NextResponse.json({ ok: true, id: product.id });
}

// UPDATE product (+replace variants)
export async function PUT(req: NextRequest) {
  const g = guard();
  if (g) return g;
  const b = await req.json();
  if (!b.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("products")
    .update({
      name: b.name,
      description: b.description ?? "",
      category: b.category ?? "Peptides",
      purity: b.purity ?? ">= 99%",
      image_url: b.image_url ?? "",
      active: b.active ?? true,
      sort: b.sort ?? 0,
    })
    .eq("id", b.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (Array.isArray(b.variants)) {
    await supabaseAdmin.from("product_variants").delete().eq("product_id", b.id);
    const variants = b.variants.map((v: any, i: number) => ({
      product_id: b.id,
      label: v.label,
      price: Number(v.price) || 0,
      stock: parseInt(v.stock, 10) || 0,
      sort: i,
    }));
    if (variants.length) await supabaseAdmin.from("product_variants").insert(variants);
  }
  return NextResponse.json({ ok: true });
}

// DELETE product
export async function DELETE(req: NextRequest) {
  const g = guard();
  if (g) return g;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
