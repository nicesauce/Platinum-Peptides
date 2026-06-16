"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { COINS, getCoin } from "@/lib/crypto";

type RatesCtx = {
  rates: Record<string, number>; // EUR per coin
  ready: boolean;
  format: (eur: number, symbol: string) => string | null;
  symbols: string[]; // coins that currently have a rate
};

const Ctx = createContext<RatesCtx>({
  rates: {},
  ready: false,
  format: () => null,
  symbols: [],
});

export function RatesProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () =>
      fetch("/api/rates")
        .then((r) => r.json())
        .then((d) => {
          if (active && d.rates) {
            setRates(d.rates);
            setReady(true);
          }
        })
        .catch(() => {});
    load();
    // refresh every 60s for live pricing
    const id = setInterval(load, 60000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const format = (eur: number, symbol: string): string | null => {
    const rate = rates[symbol];
    if (!rate || rate <= 0) return null;
    const coin = getCoin(symbol);
    const amount = eur / rate;
    return amount.toFixed(coin?.decimals ?? 4);
  };

  const symbols = COINS.map((c) => c.symbol).filter((s) => rates[s] > 0);

  return (
    <Ctx.Provider value={{ rates, ready, format, symbols }}>{children}</Ctx.Provider>
  );
}

export function useRates() {
  return useContext(Ctx);
}
