"use client";

import { COINS, COIN_COLORS } from "@/lib/crypto";
import { useLang } from "./LanguageProvider";

function CoinChip({ symbol, name }: { symbol: string; name: string }) {
  const color = COIN_COLORS[symbol] ?? "#5eead4";
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-platinum-800 bg-platinum-900/70 px-3.5 py-2">
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {symbol.length > 3 ? symbol.slice(0, 3) : symbol}
      </span>
      <span className="text-sm font-medium text-platinum-200">{symbol}</span>
      <span className="hidden text-xs text-platinum-500 sm:inline">{name}</span>
    </div>
  );
}

export default function CryptoBanner() {
  const { t } = useLang();
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...COINS, ...COINS];

  return (
    <section className="my-8 overflow-hidden rounded-2xl border border-platinum-800 bg-gradient-to-r from-platinum-900/60 via-platinum-950 to-platinum-900/60 py-5">
      <div className="mb-4 flex items-center justify-center gap-2 px-4">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        <span className="text-sm font-semibold uppercase tracking-widest text-platinum-300">{t("pay.accept")}</span>
      </div>
      <div className="marquee-mask relative">
        <div className="marquee flex w-max gap-3">
          {loop.map((c, i) => (
            <CoinChip key={`${c.symbol}-${i}`} symbol={c.symbol} name={c.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
