import { NextResponse } from "next/server";
import { COINS } from "@/lib/crypto";

export const dynamic = "force-dynamic";

// Public: returns EUR price per coin (eurPerCoin) for live conversion.
export async function GET() {
  const ids = COINS.map((c) => c.coingeckoId).join(",");
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return NextResponse.json({ rates: {} });
    const data = await res.json();
    const rates: Record<string, number> = {};
    for (const c of COINS) {
      const r = data?.[c.coingeckoId]?.eur;
      if (typeof r === "number" && r > 0) rates[c.symbol] = r;
    }
    return NextResponse.json({ rates });
  } catch {
    return NextResponse.json({ rates: {} });
  }
}
