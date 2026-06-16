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
  const [query, setQuery] = useState("");

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
  const q = query.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const matchesCat = cat === "all" || p.category === cat;
    const matchesQuery =
      q === "" ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-white md:text-4xl">{t("products.title")}</h1>
      <p className="mt-2 text-platinum-400">{t("products.subtitle")}</p>

      {/* Search */}
      <div className="relative mt-6">
        <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-platinum-500" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("products.search")}
          className="w-full rounded-xl border border-platinum-700 bg-platinum-950 py-3 pl-11 pr-10 text-platinum-100 outline-none transition focus:border-accent-500"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-platinum-500 hover:text-white" aria-label="clear">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>

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
