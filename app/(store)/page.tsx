"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageProvider";
import ProductCard from "@/components/ProductCard";
import CryptoBanner from "@/components/CryptoBanner";
import Testimonials from "@/components/Testimonials";
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
      <section className="my-8 grid gap-4 md:grid-cols-2">
        {/* Free shipping */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="shimmer relative overflow-hidden rounded-2xl border border-accent-500/40 bg-gradient-to-br from-accent-600/25 to-platinum-900 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-accent-500/25 text-accent-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 3v5h-7V8zM5.5 18.5A1.5 1.5 0 1 0 5.5 21M18.5 18.5A1.5 1.5 0 1 0 18.5 21" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">{t("promo.freeship")} 🚚</h3>
              <p className="mt-1 text-sm text-platinum-200">{t("promo.freeshipDesc")}</p>
            </div>
          </div>
        </motion.div>

        {/* 20% bulk discount */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-platinum-900 p-6"
        >
          <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-sm font-extrabold text-platinum-950">{t("promo.bulkBadge")}</span>
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-amber-400/20 text-amber-300">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 0 0 0 4h4v-4z" /></svg>
            </div>
            <div className="pr-16">
              <h3 className="text-xl font-extrabold text-white">{t("promo.bulkTitle")}</h3>
              <p className="mt-1 text-sm text-platinum-200">{t("promo.bulkDesc")}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300">
              🔥 {t("products.popularNote")}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">{t("products.bestseller")}</h2>
          </div>
          <Link href="/products" className="shrink-0 text-sm text-accent-400 hover:underline">{t("hero.cta")} →</Link>
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

      {/* REVIEWS */}
      <Testimonials />
    </div>
  );
}
