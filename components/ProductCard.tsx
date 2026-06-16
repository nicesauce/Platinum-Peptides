"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { useLang } from "./LanguageProvider";
import CryptoPrice from "./CryptoPrice";

export default function ProductCard({ product }: { product: Product }) {
  const { t } = useLang();
  const { add } = useCart();
  const variants = [...(product.variants || [])].sort((a, b) => a.sort - b.sort);
  const [vid, setVid] = useState(variants[0]?.id);
  const [added, setAdded] = useState(false);

  const variant = variants.find((v) => v.id === vid) ?? variants[0];
  const minPrice = variants.length ? Math.min(...variants.map((v) => v.price)) : 0;
  const soldOut = variant ? variant.stock <= 0 : true;

  const onAdd = () => {
    if (!variant || soldOut) return;
    add({
      product_id: product.id,
      product_name: product.name,
      variant_id: variant.id,
      variant_label: variant.label,
      price: variant.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="card-glow flex flex-col rounded-2xl border border-platinum-800 bg-platinum-900/50 p-5"
    >
      <div className="mb-4 grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-platinum-800 to-platinum-950">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-platinum-600">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v6.5L4.5 18a2.5 2.5 0 0 0 2.2 3.7h10.6A2.5 2.5 0 0 0 19.5 18L14 8.5V2" /><path d="M8 2h8M7 15h10" /></svg>
            <span className="text-xs uppercase tracking-widest">{product.category}</span>
          </div>
        )}
      </div>

      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{product.name}</h3>
        <span className="shrink-0 rounded-full border border-accent-600/40 bg-accent-600/10 px-2 py-0.5 text-[11px] text-accent-400">{product.purity}</span>
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-platinum-400">{product.description}</p>

      <div className="mt-auto">
        {variants.length > 1 && (
          <select
            value={vid}
            onChange={(e) => setVid(e.target.value)}
            className="mb-3 w-full rounded-lg border border-platinum-700 bg-platinum-950 px-3 py-2 text-sm text-platinum-100 outline-none focus:border-accent-500"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id} disabled={v.stock <= 0}>
                {v.label} — €{v.price.toFixed(2)} {v.stock <= 0 ? `(${t("products.sold")})` : ""}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">
              <span className="text-xs font-normal text-platinum-500">{variants.length > 1 ? "" : t("products.from")} </span>
              €{(variant?.price ?? minPrice).toFixed(2)}
            </div>
            <CryptoPrice eur={variant?.price ?? minPrice} />
          </div>
          <button
            onClick={onAdd}
            disabled={soldOut}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              soldOut
                ? "cursor-not-allowed bg-platinum-800 text-platinum-500"
                : added
                ? "bg-accent-400 text-platinum-950"
                : "bg-accent-500 text-platinum-950 hover:bg-accent-400"
            }`}
          >
            {soldOut ? t("products.sold") : added ? t("products.added") : t("products.add")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
