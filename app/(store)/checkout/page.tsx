"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useLang } from "@/components/LanguageProvider";
import { COINS } from "@/lib/crypto";

type CoinOpt = { coin: string; network: string };

export default function CheckoutPage() {
  const { t, locale } = useLang();
  const { lines, subtotal, discount, total, clear } = useCart();
  const router = useRouter();

  const [coins, setCoins] = useState<CoinOpt[]>([]);
  const [coin, setCoin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    zip: "",
    country: "",
    note: "",
    research: false,
  });

  useEffect(() => {
    fetch("/api/wallets")
      .then((r) => r.json())
      .then((d) => {
        setCoins(d.coins ?? []);
        if (d.coins?.[0]) setCoin(d.coins[0].coin);
      });
  }, []);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  const coinName = (sym: string) => COINS.find((c) => c.symbol === sym)?.name ?? sym;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.research) {
      setError(t("checkout.research"));
      return;
    }
    if (lines.length === 0) {
      router.push("/products");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          coin,
          locale,
          shipping: {
            name: form.name,
            address: form.address,
            city: form.city,
            zip: form.zip,
            country: form.country,
          },
          note: form.note,
          items: lines.map((l) => ({
            product_id: l.product_id,
            variant_id: l.variant_id,
            qty: l.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      clear();
      router.push(`/order/${data.order_number}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center text-platinum-400">
        {t("cart.empty")}
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-platinum-700 bg-platinum-950 px-3.5 py-2.5 text-platinum-100 outline-none transition focus:border-accent-500";

  return (
    <div className="py-6">
      <h1 className="mb-6 text-3xl font-bold text-white">{t("checkout.title")}</h1>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-7">
          <section>
            <h2 className="mb-3 font-semibold text-white">{t("checkout.contact")}</h2>
            <input type="email" required placeholder={t("checkout.email")} value={form.email} onChange={(e) => set("email", e.target.value)} className={input} />
          </section>

          <section>
            <h2 className="mb-3 font-semibold text-white">{t("checkout.shipping")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder={t("checkout.name")} value={form.name} onChange={(e) => set("name", e.target.value)} className={`${input} sm:col-span-2`} />
              <input required placeholder={t("checkout.address")} value={form.address} onChange={(e) => set("address", e.target.value)} className={`${input} sm:col-span-2`} />
              <input required placeholder={t("checkout.city")} value={form.city} onChange={(e) => set("city", e.target.value)} className={input} />
              <input required placeholder={t("checkout.zip")} value={form.zip} onChange={(e) => set("zip", e.target.value)} className={input} />
              <input required placeholder={t("checkout.country")} value={form.country} onChange={(e) => set("country", e.target.value)} className={`${input} sm:col-span-2`} />
              <textarea placeholder={t("checkout.note")} value={form.note} onChange={(e) => set("note", e.target.value)} className={`${input} sm:col-span-2`} rows={2} />
            </div>
          </section>

          <section>
            <h2 className="mb-1 font-semibold text-white">{t("checkout.payment")}</h2>
            <p className="mb-3 text-sm text-platinum-400">{t("checkout.choosecoin")}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {coins.map((c) => (
                <button
                  type="button"
                  key={c.coin}
                  onClick={() => setCoin(c.coin)}
                  className={`rounded-xl border px-3 py-3 text-left transition ${
                    coin === c.coin
                      ? "border-accent-500 bg-accent-500/10"
                      : "border-platinum-700 hover:border-platinum-500"
                  }`}
                >
                  <div className="font-semibold text-white">{c.coin}</div>
                  <div className="text-xs text-platinum-400">{coinName(c.coin)} · {c.network}</div>
                </button>
              ))}
            </div>
            {coins.length === 0 && (
              <p className="text-sm text-platinum-500">{t("common.loading")}</p>
            )}
          </section>
        </div>

        {/* SUMMARY */}
        <div className="h-fit rounded-2xl border border-platinum-800 bg-platinum-900/50 p-6">
          <h2 className="mb-4 font-semibold text-white">{t("checkout.summary")}</h2>
          <div className="space-y-2 text-sm">
            {lines.map((l) => (
              <div key={l.variant_id} className="flex justify-between text-platinum-300">
                <span>{l.qty}× {l.product_name} <span className="text-platinum-500">({l.variant_label})</span></span>
                <span>€{(l.qty * l.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          {discount > 0 && (
            <div className="mt-2 flex justify-between text-sm text-accent-400">
              <span>{t("cart.discount")}</span>
              <span>−€{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between text-sm text-platinum-400">
            <span>{t("promo.freeship")}</span>
            <span>€0.00</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-platinum-800 pt-3 text-lg font-bold text-white">
            <span>{t("cart.total")}</span>
            <span>€{total.toFixed(2)}</span>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-2 text-xs text-platinum-400">
            <input type="checkbox" checked={form.research} onChange={(e) => set("research", e.target.checked)} className="mt-0.5 accent-accent-500" />
            <span>{t("checkout.research")}</span>
          </label>

          {error && <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !coin}
            className="mt-5 w-full rounded-xl bg-accent-500 py-3 font-semibold text-platinum-950 transition hover:bg-accent-400 disabled:opacity-60"
          >
            {submitting ? t("checkout.placing") : t("checkout.place")}
          </button>
          <p className="mt-3 text-center text-xs text-platinum-500">{t("order.shipinfo")}</p>
        </div>
      </form>
    </div>
  );
}
