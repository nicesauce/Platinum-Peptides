"use client";

import { LanguageProvider } from "./LanguageProvider";
import { CartProvider } from "./CartProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <CartProvider>{children}</CartProvider>
    </LanguageProvider>
  );
}
