"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/orders", label: "Bestellungen" },
  { href: "/admin/products", label: "Produkte" },
  { href: "/admin/wallets", label: "Wallets" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-platinum-800 bg-platinum-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-white">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-platinum-950">P</span>
              Admin
            </Link>
            <nav className="hidden gap-1 sm:flex">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`rounded-lg px-3 py-1.5 text-sm transition ${
                      active ? "bg-accent-500/15 text-accent-400" : "text-platinum-300 hover:bg-platinum-800"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-platinum-400 hover:text-accent-400">Shop ↗</Link>
            <button onClick={logout} className="rounded-lg border border-platinum-700 px-3 py-1.5 text-sm text-platinum-200 hover:border-red-500/50 hover:text-red-400">
              Abmelden
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-platinum-800 px-4 py-2 sm:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm ${pathname === n.href ? "bg-accent-500/15 text-accent-400" : "text-platinum-300"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
