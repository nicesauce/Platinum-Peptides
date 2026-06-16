import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generateOrderNumber } from "@/lib/orders";
import { eurToCrypto, getCoin } from "@/lib/crypto";
import { sendOrderConfirmation } from "@/lib/email";
import { computeTotals } from "@/lib/pricing";
import type { Order, OrderItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, coin, locale, shipping, note, items } = body;

    if (!email || !coin || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 1. Look up real prices server-side (never trust client prices)
    const variantIds = items.map((i: any) => i.variant_id);
    const { data: variants, error: vErr } = await supabaseAdmin
      .from("product_variants")
      .select("id, label, price, stock, product_id, products(name)")
      .in("id", variantIds);
    if (vErr) throw new Error(vErr.message);
    if (!variants || variants.length === 0) {
      return NextResponse.json({ error: "Invalid items." }, { status: 400 });
    }

    const orderItems: OrderItem[] = [];
    for (const i of items) {
      const v: any = variants.find((x: any) => x.id === i.variant_id);
      if (!v) continue;
      const qty = Math.max(1, Math.min(999, parseInt(i.qty, 10) || 1));
      orderItems.push({
        product_id: v.product_id,
        product_name: v.products?.name ?? "Product",
        variant_id: v.id,
        variant_label: v.label,
        qty,
        price: Number(v.price),
      });
    }
    if (orderItems.length === 0) {
      return NextResponse.json({ error: "Invalid items." }, { status: 400 });
    }
    // Apply the bulk discount (20% from 3 items) server-side.
    const { subtotal, total } = computeTotals(orderItems);

    // 2. Pick an active wallet for the chosen coin
    const { data: wallet } = await supabaseAdmin
      .from("wallets")
      .select("*")
      .eq("coin", coin)
      .eq("active", true)
      .limit(1)
      .maybeSingle();
    if (!wallet) {
      return NextResponse.json({ error: "Selected coin is not available." }, { status: 400 });
    }

    // 3. Live crypto amount (best effort)
    const cryptoAmount = await eurToCrypto(total, coin);

    // 4. Create order
    const order_number = await generateOrderNumber();
    const coinMeta = getCoin(coin);

    const insert = {
      order_number,
      email,
      status: "pending_payment",
      items: orderItems,
      subtotal,
      total,
      currency: "EUR",
      coin,
      coin_network: wallet.network || coinMeta?.defaultNetwork || "",
      pay_address: wallet.address,
      crypto_amount: cryptoAmount,
      shipping_name: shipping?.name ?? null,
      shipping_address: shipping?.address ?? null,
      shipping_city: shipping?.city ?? null,
      shipping_zip: shipping?.zip ?? null,
      shipping_country: shipping?.country ?? null,
      note: note ?? null,
    };

    const { data: created, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert(insert)
      .select("*")
      .single();
    if (oErr) throw new Error(oErr.message);

    // 5. Send confirmation email (don't block order on failure)
    const loc = ["de", "en", "es", "fr"].includes(locale) ? locale : "en";
    sendOrderConfirmation(created as Order, loc).catch(() => {});

    return NextResponse.json({ order_number, order: created });
  } catch (err: any) {
    console.error("[orders] create failed", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
