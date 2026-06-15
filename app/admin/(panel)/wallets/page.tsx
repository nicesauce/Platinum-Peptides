"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COINS } from "@/lib/crypto";
import type { Wallet } from "@/lib/types";

const input = "w-full rounded-lg border border-platinum-700 bg-platinum-950 px-3 py-2 text-platinum-100 outline-none focus:border-accent-500";

export default function AdminWallets() {
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ coin: "BTC", network: "Bitcoin", address: "" });

  const load = () => {
    fetch("/api/admin/wallets")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((d) => d && setWallets(d.wallets ?? []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onCoin = (sym: string) => {
    const c = COINS.find((x) => x.symbol === sym);
    setForm((f) => ({ ...f, coin: sym, network: c?.defaultNetwork ?? f.network }));
  };

  const add = async () => {
    if (!form.address.trim()) return alert("Adresse eingeben.");
    const res = await fetch("/api/admin/wallets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ coin: "BTC", network: "Bitcoin", address: "" });
      load();
    } else alert("Fehler.");
  };

  const update = async (w: Wallet, patch: Partial<Wallet>) => {
    setWallets((prev) => prev.map((x) => (x.id === w.id ? { ...x, ...patch } : x)));
    await fetch("/api/admin/wallets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: w.id, ...w, ...patch }),
    });
  };

  const del = async (id: string) => {
    if (!confirm("Wallet löschen?")) return;
    await fetch(`/api/admin/wallets?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Wallets</h1>
      <p className="mb-6 text-sm text-platinum-400">Hier fügst du deine Krypto-Wallet-Adressen hinzu. Kunden zahlen an die aktive Adresse der gewählten Währung.</p>

      <div className="mb-6 rounded-2xl border border-accent-600/40 bg-platinum-900/60 p-5">
        <h2 className="mb-4 font-semibold text-white">Wallet hinzufügen</h2>
        <div className="grid gap-3 sm:grid-cols-[140px_180px_1fr_auto]">
          <select className={input} value={form.coin} onChange={(e) => onCoin(e.target.value)}>
            {COINS.map((c) => (
              <option key={c.symbol} value={c.symbol}>{c.symbol} — {c.name}</option>
            ))}
          </select>
          <input className={input} placeholder="Netzwerk" value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })} />
          <input className={input} placeholder="Wallet-Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <button onClick={add} className="rounded-lg bg-accent-500 px-5 py-2 font-semibold text-platinum-950 hover:bg-accent-400">Hinzufügen</button>
        </div>
      </div>

      {loading ? (
        <p className="text-platinum-500">Lädt…</p>
      ) : wallets.length === 0 ? (
        <p className="text-platinum-500">Noch keine Wallets. Füge oben deine Adressen hinzu.</p>
      ) : (
        <div className="space-y-3">
          {wallets.map((w) => (
            <div key={w.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-platinum-800 bg-platinum-900/50 p-4">
              <span className="grid h-10 w-12 place-items-center rounded-lg bg-platinum-800 font-bold text-accent-400">{w.coin}</span>
              <div className="min-w-[200px] flex-1">
                <input
                  className={`${input} mb-2`}
                  value={w.address}
                  onChange={(e) => setWallets((prev) => prev.map((x) => (x.id === w.id ? { ...x, address: e.target.value } : x)))}
                  onBlur={(e) => update(w, { address: e.target.value })}
                />
                <input
                  className={input}
                  value={w.network}
                  placeholder="Netzwerk"
                  onChange={(e) => setWallets((prev) => prev.map((x) => (x.id === w.id ? { ...x, network: e.target.value } : x)))}
                  onBlur={(e) => update(w, { network: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-platinum-300">
                <input type="checkbox" checked={w.active} onChange={(e) => update(w, { active: e.target.checked })} className="accent-accent-500" />
                aktiv
              </label>
              <button onClick={() => del(w.id)} className="rounded-lg border border-platinum-700 px-3 py-1.5 text-sm text-platinum-200 hover:border-red-500/50 hover:text-red-400">Löschen</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
