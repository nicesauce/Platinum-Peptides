import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

// Public: list active products with their variants
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, product_variants(*)")
    .eq("active", true)
    .order("sort", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products: Product[] = (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    category: p.category,
    image_url: p.image_url,
    purity: p.purity,
    active: p.active,
    sort: p.sort,
    variants: (p.product_variants ?? []).sort((a: any, b: any) => a.sort - b.sort),
  }));

  return NextResponse.json({ products });
}
