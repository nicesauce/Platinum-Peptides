"use client";

import { useEffect, useState } from "react";
import { useRates } from "./RatesProvider";
import { COIN_COLORS } from "@/lib/crypto";

// Shows a live crypto equivalent of an EUR amount, cycling through coins.
export default function CryptoPrice({ eur }: { eur: number }) {
  const { symbols, format } = useRates();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (symbols.length === 0) return;
    const id = setInterval(() => setI((p) => (p + 1) % symbols.length), 2600);
    return () => clearInterval(id);
  }, [symbols.length]);

  if (symbols.length === 0) return null;
  const symbol = symbols[i % symbols.length];
  const amount = format(eur, symbol);
  if (!amount) return null;
  const color = COIN_COLORS[symbol] ?? "#5eead4";

  return (
    <div className="flex items-center gap-1.5 text-xs text-platinum-400">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-400" />
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-400">live</span>
      <span key={symbol} className="tabular-nums transition-opacity">
        ≈ {amount}{" "}
        <span className="font-semibold" style={{ color }}>
          {symbol}
        </span>
      </span>
    </div>
  );
}
