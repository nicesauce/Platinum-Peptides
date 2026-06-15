"use client";

import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default function ProductsPage() {
  const { t } = useLang();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );
  const filtered = cat === "all" ? products : products.filter((p) => p.category === cat);

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-white md:text-4xl">{t("products.title")}</h1>
      <p className="mt-2 text-platinum-400">{t("products.subtitle")}</p>

      <div className="my-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              cat === c
                ? "border-accent-500 bg-accent-500/15 text-accent-400"
                : "border-platinum-700 text-platinum-300 hover:border-platinum-500"
            }`}
          >
            {c === "all" ? t("products.all") : c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-platinum-500">{t("common.loading")}</p>
      ) : filtered.length === 0 ? (
        <p className="text-platinum-500">{t("products.empty")}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
