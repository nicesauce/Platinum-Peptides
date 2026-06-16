"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { computeTotals } from "@/lib/pricing";

export type CartLine = {
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_label: string;
  price: number;
  qty: number;
};

type Ctx = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (variant_id: string) => void;
  setQty: (variant_id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  eligible: boolean;
};

const CartContext = createContext<Ctx>({
  lines: [],
  add: () => {},
  remove: () => {},
  setQty: () => {},
  clear: () => {},
  count: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  eligible: false,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("pp_cart");
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("pp_cart", JSON.stringify(lines));
  }, [lines, loaded]);

  const add: Ctx["add"] = (line, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.variant_id === line.variant_id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...prev, { ...line, qty }];
    });
  };

  const remove: Ctx["remove"] = (variant_id) =>
    setLines((prev) => prev.filter((l) => l.variant_id !== variant_id));

  const setQty: Ctx["setQty"] = (variant_id, qty) =>
    setLines((prev) =>
      prev
        .map((l) => (l.variant_id === variant_id ? { ...l, qty } : l))
        .filter((l) => l.qty > 0)
    );

  const clear = () => setLines([]);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const { subtotal, discount, total, eligible } = computeTotals(lines);

  return (
    <CartContext.Provider value={{ lines, add, remove, setQty, clear, count, subtotal, discount, total, eligible }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
