import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PlatinumPeptides – Premium Research Peptides",
  description:
    "Premium research peptides. Lab tested, purity ≥ 99%. Anonymous crypto payment, fast 1–2 day shipping.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <div className="aurora" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
