"use client";

import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { FAQ } from "@/lib/i18n";

export default function FaqPage() {
  const { t, locale } = useLang();
  const items = FAQ[locale] ?? FAQ.en;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <h1 className="mb-6 text-3xl font-bold text-white">{t("faq.title")}</h1>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-platinum-800 bg-platinum-900/50">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="font-medium text-white">{it.q}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`shrink-0 text-accent-400 transition ${open === i ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {open === i && <p className="px-5 pb-5 text-sm leading-relaxed text-platinum-400">{it.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
