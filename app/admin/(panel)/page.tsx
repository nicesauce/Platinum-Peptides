"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/types";

const LABEL: Record<string, string> = {
  pending_payment: "Warte auf Zahlung",
  paid: "Bezahlt",
  processing: "In Bearbeitung",
  shipped: "Versendet",
  cancelled: "Storniert",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((d) => d && setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, [router]);

  const revenue = orders
    .filter((o) => ["paid", "processing", "shipped"].includes(o.status))
    .reduce((s, o) => s + Number(o.total), 0);

  const stats = [
    { label: "Bestellungen", value: orders.length },
    { label: "Warte auf Zahlung", value: orders.filter((o) => o.status === "pending_payment").length },
    { label: "Zu versenden", value: orders.filter((o) => ["paid", "processing"].includes(o.status)).length },
    { label: "Umsatz (bezahlt)", value: `€${revenue.toFixed(2)}` },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Übersicht</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-platinum-800 bg-platinum-900/50 p-5">
            <div className="text-sm text-platinum-400">{s.label}</div>
            <div className="mt-1 text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Neueste Bestellungen</h2>
        <Link href="/admin/orders" className="text-sm text-accent-400 hover:underline">Alle ansehen →</Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-platinum-800">
        {loading ? (
          <p className="p-6 text-platinum-500">Lädt…</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-platinum-500">Noch keine Bestellungen.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-platinum-900 text-left text-platinum-400">
              <tr>
                <th className="p-3">Nummer</th>
                <th className="p-3">E-Mail</th>
                <th className="p-3">Coin</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-t border-platinum-800 hover:bg-platinum-900/50">
                  <td className="p-3"><Link href="/admin/orders" className="font-mono text-accent-400">{o.order_number}</Link></td>
                  <td className="p-3 text-platinum-300">{o.email}</td>
                  <td className="p-3 text-platinum-300">{o.coin}</td>
                  <td className="p-3 text-platinum-300">€{Number(o.total).toFixed(2)}</td>
                  <td className="p-3 text-platinum-300">{LABEL[o.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
