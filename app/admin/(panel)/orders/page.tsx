"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/types";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending_payment", label: "Warte auf Zahlung" },
  { value: "paid", label: "Bezahlt" },
  { value: "processing", label: "In Bearbeitung" },
  { value: "shipped", label: "Versendet" },
  { value: "cancelled", label: "Storniert" },
];

const COLOR: Record<OrderStatus, string> = {
  pending_payment: "bg-amber-500/15 text-amber-400",
  paid: "bg-sky-500/15 text-sky-400",
  processing: "bg-violet-500/15 text-violet-400",
  shipped: "bg-accent-500/15 text-accent-400",
  cancelled: "bg-red-500/15 text-red-400",
};

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<string | null>(null);

  const load = () => {
    const q = filter ? `?status=${filter}` : "";
    fetch(`/api/admin/orders${q}`)
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((d) => d && setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Bestellungen</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`rounded-full px-3 py-1.5 text-sm ${filter === "" ? "bg-accent-500/15 text-accent-400" : "bg-platinum-800 text-platinum-300"}`}>Alle</button>
        {STATUSES.map((s) => (
          <button key={s.value} onClick={() => setFilter(s.value)} className={`rounded-full px-3 py-1.5 text-sm ${filter === s.value ? "bg-accent-500/15 text-accent-400" : "bg-platinum-800 text-platinum-300"}`}>{s.label}</button>
        ))}
      </div>

      {loading ? (
        <p className="text-platinum-500">Lädt…</p>
      ) : orders.length === 0 ? (
        <p className="text-platinum-500">Keine Bestellungen.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-platinum-800 bg-platinum-900/50">
              <button onClick={() => setOpen(open === o.id ? null : o.id)} className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left">
                <div>
                  <div className="font-mono font-semibold text-accent-400">{o.order_number}</div>
                  <div className="text-sm text-platinum-400">{o.email} · {new Date(o.created_at).toLocaleString("de-DE")}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white">€{Number(o.total).toFixed(2)}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${COLOR[o.status]}`}>{STATUSES.find((s) => s.value === o.status)?.label}</span>
                </div>
              </button>

              {open === o.id && (
                <div className="border-t border-platinum-800 p-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-platinum-300">Artikel</h3>
                      <ul className="space-y-1 text-sm text-platinum-400">
                        {o.items.map((it, i) => (
                          <li key={i}>{it.qty}× {it.product_name} ({it.variant_label}) — €{(it.price * it.qty).toFixed(2)}</li>
                        ))}
                      </ul>
                      <h3 className="mb-2 mt-4 text-sm font-semibold text-platinum-300">Zahlung</h3>
                      <p className="text-sm text-platinum-400">Coin: {o.coin} ({o.coin_network})</p>
                      {o.crypto_amount && <p className="text-sm text-platinum-400">Betrag: ≈ {o.crypto_amount} {o.coin}</p>}
                      <p className="break-all text-sm text-platinum-400">Adresse: {o.pay_address}</p>
                      <p className="break-all text-sm">
                        TXID: {o.txid ? <span className="text-accent-400">{o.txid}</span> : <span className="text-amber-400">— noch nicht eingereicht —</span>}
                      </p>
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-platinum-300">Lieferadresse</h3>
                      <p className="text-sm text-platinum-400">{o.shipping_name}</p>
                      <p className="text-sm text-platinum-400">{o.shipping_address}</p>
                      <p className="text-sm text-platinum-400">{o.shipping_zip} {o.shipping_city}</p>
                      <p className="text-sm text-platinum-400">{o.shipping_country}</p>
                      {o.note && <p className="mt-2 text-sm text-platinum-500">Notiz: {o.note}</p>}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold text-platinum-300">Status ändern</h3>
                    <div className="flex flex-wrap gap-2">
                      {STATUSES.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => updateStatus(o.id, s.value)}
                          className={`rounded-lg px-3 py-1.5 text-sm transition ${
                            o.status === s.value
                              ? "bg-accent-500 text-platinum-950"
                              : "border border-platinum-700 text-platinum-200 hover:border-accent-500"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
