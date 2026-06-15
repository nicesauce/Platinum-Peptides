"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageProvider";
import ProductCard from "@/components/ProductCard";
import CryptoBanner from "@/components/CryptoBanner";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const { t } = useLang();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .catch(() => {});
  }, []);

  const features = [
    { k: "purity", icon: "M9 12l2 2 4-4" },
    { k: "ship", icon: "M5 12h14M12 5l7 7-7 7" },
    { k: "crypto", icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" },
    { k: "support", icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative py-16 text-center md:py-24">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block rounded-full border border-accent-600/40 bg-accent-600/10 px-4 py-1.5 text-xs font-medium text-accent-400"
        >
          {t("hero.badge")}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-6 max-w-3xl bg-gradient-to-b from-white to-platinum-400 bg-clip-text text-4xl font-extrabold leading-tight text-transparent md:text-6xl"
        >
          {t("hero.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-lg text-platinum-300"
        >
          {t("hero.subtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/products" className="shimmer rounded-xl bg-accent-500 px-6 py-3 font-semibold text-platinum-950 transition hover:bg-accent-400">
            {t("hero.cta")}
          </Link>
          <Link href="/track" className="rounded-xl border border-platinum-700 px-6 py-3 font-semibold text-platinum-100 transition hover:border-accent-500">
            {t("hero.cta2")}
          </Link>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.k}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-platinum-800 bg-platinum-900/40 p-6"
          >
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-accent-600/15 text-accent-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={f.icon} /></svg>
            </div>
            <h3 className="mb-1 font-semibold text-white">{t(`feat.${f.k}.t`)}</h3>
            <p className="text-sm text-platinum-400">{t(`feat.${f.k}.d`)}</p>
          </motion.div>
        ))}
      </section>

      {/* CRYPTO BANNER */}
      <CryptoBanner />

      {/* SHIPPING BANNER */}
      <section className="my-8 overflow-hidden rounded-2xl border border-accent-600/30 bg-gradient-to-r from-accent-600/15 to-transparent p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-500/20 text-accent-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8zM5.5 18.5A1.5 1.5 0 1 0 5.5 21M18.5 18.5A1.5 1.5 0 1 0 18.5 21" /></svg>
          </div>
          <p className="text-platinum-100">{t("feat.ship.d")}</p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{t("products.title")}</h2>
          <Link href="/products" className="text-sm text-accent-400 hover:underline">{t("hero.cta")} →</Link>
        </div>
        {products.length === 0 ? (
          <p className="text-platinum-500">{t("common.loading")}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
