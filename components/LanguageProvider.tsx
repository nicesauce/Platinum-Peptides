"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<Ctx>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      localStorage.getItem("pp_locale")) as Locale | null;
    if (saved && dict[saved]) {
      setLocaleState(saved);
    } else if (typeof navigator !== "undefined") {
      const nav = navigator.language.slice(0, 2) as Locale;
      if (dict[nav]) setLocaleState(nav);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem("pp_locale", l);
    document.documentElement.lang = l;
  };

  const t = (key: string) => dict[locale]?.[key] ?? dict[DEFAULT_LOCALE][key] ?? key;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-platinum-700 bg-platinum-900/60 px-3 py-1.5 text-sm text-platinum-100 transition hover:border-accent-500"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-platinum-700 bg-platinum-900 shadow-xl">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-platinum-800 ${
                  l.code === locale ? "text-accent-400" : "text-platinum-200"
                }`}
              >
                <span>{l.flag}</span> {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
