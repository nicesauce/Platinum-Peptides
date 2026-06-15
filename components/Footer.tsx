"use client";

import Link from "next/link";
import { useLang } from "./LanguageProvider";
import { LogoMark } from "./Logo";

export default function Footer() {
  const { t } = useLang();
  const support = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@yourdomain.com";
  return (
    <footer className="mt-24 border-t border-platinum-800 bg-platinum-950">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div className="max-w-sm">
            <div className="mb-2 flex items-center gap-2.5 text-lg font-bold text-white">
              <LogoMark size={28} />
              PLATIN<span className="text-accent-400">PEPTIDES</span>
            </div>
            <p className="text-sm text-platinum-400">{t("brand.tag")}</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <Link href="/products" className="block text-platinum-300 hover:text-accent-400">{t("nav.products")}</Link>
              <Link href="/track" className="block text-platinum-300 hover:text-accent-400">{t("nav.track")}</Link>
              <Link href="/faq" className="block text-platinum-300 hover:text-accent-400">{t("nav.faq")}</Link>
            </div>
            <div className="space-y-2 text-platinum-400">
              <p>{t("footer.ship")}</p>
              <a href={`mailto:${support}`} className="block text-platinum-300 hover:text-accent-400">{support}</a>
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-xl border border-platinum-800 bg-platinum-900/40 p-4">
          <p className="text-xs leading-relaxed text-platinum-500">⚠️ {t("footer.disclaimer")}</p>
        </div>
        <p className="mt-6 text-center text-xs text-platinum-600">© {new Date().getFullYear()} PlatinPeptides. {t("footer.rights")}</p>
      </div>
    </footer>
  );
}
