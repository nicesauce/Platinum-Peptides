"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LanguageProvider";

export default function TrackPage() {
  const { t } = useLang();
  const router = useRouter();
  const [num, setNum] = useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const n = num.trim().toUpperCase();
    if (n) router.push(`/order/${encodeURIComponent(n)}`);
  };

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-accent-600/15 text-accent-400">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      </div>
      <h1 className="text-3xl font-bold text-white">{t("track.title")}</h1>
      <p className="mt-2 text-platinum-400">{t("track.subtitle")}</p>
      <form onSubmit={go} className="mt-7 flex flex-col gap-3 sm:flex-row">
        <input value={num} onChange={(e) => setNum(e.target.value)} placeholder={t("track.placeholder")} className="flex-1 rounded-xl border border-platinum-700 bg-platinum-950 px-4 py-3 text-center font-mono text-platinum-100 outline-none focus:border-accent-500 sm:text-left" />
        <button type="submit" className="rounded-xl bg-accent-500 px-6 py-3 font-semibold text-platinum-950 hover:bg-accent-400">{t("track.search")}</button>
      </form>
    </div>
  );
}
