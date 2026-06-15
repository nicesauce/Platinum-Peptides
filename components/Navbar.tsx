"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang, LanguageSwitcher } from "./LanguageProvider";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const { t } = useLang();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/products", label: t("nav.products") },
    { href: "/track", label: t("nav.track") },
    { href: "/faq", label: t("nav.faq") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-platinum-800/80 bg-platinum-950/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-wide text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-platinum-950 shadow-lg shadow-accent-500/30">P</span>
          PLATINUM<span className="text-accent-400">PEPTIDES</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-platinum-200 transition hover:text-accent-400">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/cart" className="relative grid h-9 w-9 place-items-center rounded-lg border border-platinum-700 text-platinum-100 transition hover:border-accent-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-xs font-bold text-platinum-950">{count}</span>
            )}
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="grid h-9 w-9 place-items-center rounded-lg border border-platinum-700 text-platinum-100 md:hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-platinum-800 px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-platinum-200">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
