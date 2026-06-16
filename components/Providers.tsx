"use client";

import { LanguageProvider } from "./LanguageProvider";
import { CartProvider } from "./CartProvider";
import { RatesProvider } from "./RatesProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <RatesProvider>
        <CartProvider>{children}</CartProvider>
      </RatesProvider>
    </LanguageProvider>
  );
}
