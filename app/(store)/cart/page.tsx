"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useLang } from "@/components/LanguageProvider";

export default function CartPage() {
  const { t } = useLang();
  const { lines, setQty, remove, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="mb-3 text-3xl font-bold text-white">{t("cart.title")}</h1>
        <p className="mb-6 text-platinum-400">{t("cart.empty")}</p>
        <Link href="/products" className="rounded-xl bg-accent-500 px-6 py-3 font-semibold text-platinum-950 hover:bg-accent-400">
          {t("cart.continue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="mb-6 text-3xl font-bold text-white">{t("cart.title")}</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {lines.map((l) => (
            <div key={l.variant_id} className="flex items-center gap-4 rounded-2xl border border-platinum-800 bg-platinum-900/50 p-4">
              <div className="flex-1">
                <div className="font-medium text-white">{l.product_name}</div>
                <div className="text-sm text-platinum-400">{l.variant_label} · €{l.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center rounded-lg border border-platinum-700">
                <button onClick={() => setQty(l.variant_id, l.qty - 1)} className="px-3 py-1.5 text-platinum-300 hover:text-white">−</button>
                <span className="w-8 text-center text-white">{l.qty}</span>
                <button onClick={() => setQty(l.variant_id, l.qty + 1)} className="px-3 py-1.5 text-platinum-300 hover:text-white">+</button>
              </div>
              <div className="w-20 text-right font-semibold text-white">€{(l.qty * l.price).toFixed(2)}</div>
              <button onClick={() => remove(l.variant_id)} className="text-platinum-500 hover:text-red-400" aria-label={t("cart.remove")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-platinum-800 bg-platinum-900/50 p-6">
          <div className="flex justify-between text-platinum-300">
            <span>{t("cart.subtotal")}</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-platinum-800 pt-4 text-lg font-bold text-white">
            <span>{t("cart.total")}</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <Link href="/checkout" className="mt-6 block rounded-xl bg-accent-500 py-3 text-center font-semibold text-platinum-950 hover:bg-accent-400">
            {t("cart.checkout")}
          </Link>
          <Link href="/products" className="mt-3 block text-center text-sm text-platinum-400 hover:text-accent-400">
            {t("cart.continue")}
          </Link>
        </div>
      </div>
    </div>
  );
}
