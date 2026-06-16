"use client";

import { motion } from "framer-motion";
import { useLang } from "./LanguageProvider";
import { REVIEWS } from "@/lib/i18n";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= n ? "#fbbf24" : "none"} stroke={i <= n ? "#fbbf24" : "#4e5a78"} strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t, locale } = useLang();
  const reviews = REVIEWS[locale] ?? REVIEWS.en;
  const avg = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1);

  return (
    <section className="py-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{t("reviews.title")}</h2>
        <p className="mt-2 text-platinum-400">{t("reviews.subtitle")}</p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <Stars n={5} />
          <span className="text-sm font-semibold text-white">{avg}/5</span>
          <span className="text-sm text-platinum-500">· {reviews.length * 47}+ reviews</span>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (i % 3) * 0.08 }}
            className="rounded-2xl border border-platinum-800 bg-platinum-900/50 p-5"
          >
            <Stars n={r.stars} />
            <p className="mt-3 text-sm leading-relaxed text-platinum-300">“{r.text}”</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-accent-600/20 text-sm font-semibold text-accent-400">
                {r.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-white">{r.name}</span>
              {r.verified && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-accent-500/10 px-2 py-0.5 text-[10px] font-medium text-accent-400">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5" /></svg>
                  verified
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
