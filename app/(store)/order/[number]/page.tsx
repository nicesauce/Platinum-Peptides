"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLang } from "@/components/LanguageProvider";
import type { Order, OrderStatus } from "@/lib/types";

const STEPS: OrderStatus[] = ["pending_payment", "paid", "processing", "shipped"];

function StatusBadge({ status, t }: { status: OrderStatus; t: (k: string) => string }) {
  const color: Record<OrderStatus, string> = {
    pending_payment: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    paid: "border-sky-500/40 bg-sky-500/10 text-sky-400",
    processing: "border-violet-500/40 bg-violet-500/10 text-violet-400",
    shipped: "border-accent-500/40 bg-accent-500/10 text-accent-400",
    cancelled: "border-red-500/40 bg-red-500/10 text-red-400",
  };
  return (
    <span className={`rounded-full border px-3 py-1 text-sm font-medium ${color[status]}`}>
      {t(`status.${status}`)}
    </span>
  );
}

export default function OrderPage() {
  const { t } = useLang();
  const params = useParams();
  const number = String(params.number);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [txid, setTxid] = useState("");
  const [copied, setCopied] = useState(false);
  const [txSubmitting, setTxSubmitting] = useState(false);
  const [txDone, setTxDone] = useState(false);

  const load = () => {
    fetch(`/api/orders/${number}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setOrder(d.order))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, [number]);

  const copy = () => {
    if (order?.pay_address) {
      navigator.clipboard.writeText(order.pay_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const submitTxid = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${number}/txid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txid }),
      });
      if (res.ok) {
        setTxDone(true);
        load();
      }
    } finally {
      setTxSubmitting(false);
    }
  };

  if (loading) return <p className="py-16 text-center text-platinum-400">{t("common.loading")}</p>;
  if (notFound || !order)
    return <p className="py-16 text-center text-platinum-400">{t("track.notfound")}</p>;

  const currentStep = STEPS.indexOf(order.status);
  const amount = order.crypto_amount
    ? `≈ ${order.crypto_amount} ${order.coin}`
    : `€${order.total.toFixed(2)} (${order.coin})`;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl py-6">
      <div className="rounded-2xl border border-accent-600/30 bg-gradient-to-b from-accent-600/10 to-transparent p-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-accent-500/20 text-accent-400">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-white">{t("order.thanks")}</h1>
        <p className="mt-3 text-sm text-platinum-400">{t("order.number")}</p>
        <p className="mt-1 select-all font-mono text-xl font-bold text-accent-400">{order.order_number}</p>
        <p className="mt-2 text-xs text-platinum-500">{t("order.save")}</p>
      </div>

      {/* STATUS */}
      <div className="mt-6 rounded-2xl border border-platinum-800 bg-platinum-900/50 p-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-platinum-300">{t("order.status")}</span>
          <StatusBadge status={order.status} t={t} />
        </div>
        {order.status !== "cancelled" && (
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${i <= currentStep ? "bg-accent-500 text-platinum-950" : "bg-platinum-800 text-platinum-500"}`}>{i + 1}</div>
                {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < currentStep ? "bg-accent-500" : "bg-platinum-800"}`} />}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex justify-between text-[11px] text-platinum-500">
          {STEPS.map((s) => <span key={s} className="flex-1 text-center first:text-left last:text-right">{t(`status.${s}`)}</span>)}
        </div>
      </div>

      {/* PAYMENT */}
      {order.status === "pending_payment" && (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
          <h2 className="font-semibold text-white">{t("order.payinstr")}</h2>
          <p className="mt-3 text-sm text-platinum-400">{t("order.sendto")} ({order.coin} · {order.coin_network})</p>
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-platinum-700 bg-platinum-950 p-3">
            <code className="flex-1 break-all text-sm text-accent-400">{order.pay_address}</code>
            <button onClick={copy} className="shrink-0 rounded-lg bg-platinum-800 px-3 py-1.5 text-xs text-platinum-100 hover:bg-platinum-700">
              {copied ? t("order.copied") : t("order.copy")}
            </button>
          </div>
          <p className="mt-4 text-sm text-platinum-300">{t("order.amount")}: <strong className="text-white">{amount}</strong></p>
          <p className="mt-4 text-sm text-platinum-400">{t("order.afterpay")}</p>
        </div>
      )}

      {/* TXID submit */}
      <div className="mt-6 rounded-2xl border border-platinum-800 bg-platinum-900/50 p-6">
        <h2 className="font-semibold text-white">{t("order.txid")}</h2>
        {order.txid ? (
          <div className="mt-3">
            <p className="text-sm text-platinum-400">TXID:</p>
            <code className="break-all text-sm text-accent-400">{order.txid}</code>
            {txDone && <p className="mt-3 rounded-lg bg-accent-500/10 p-3 text-sm text-accent-400">{t("order.txidok")}</p>}
          </div>
        ) : (
          <form onSubmit={submitTxid} className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input value={txid} onChange={(e) => setTxid(e.target.value)} required placeholder={t("order.txidph")} className="flex-1 rounded-lg border border-platinum-700 bg-platinum-950 px-3.5 py-2.5 text-platinum-100 outline-none focus:border-accent-500" />
            <button type="submit" disabled={txSubmitting} className="rounded-lg bg-accent-500 px-5 py-2.5 font-semibold text-platinum-950 hover:bg-accent-400 disabled:opacity-60">{t("order.submit")}</button>
          </form>
        )}
      </div>

      {/* ITEMS */}
      <div className="mt-6 rounded-2xl border border-platinum-800 bg-platinum-900/50 p-6">
        <h2 className="mb-3 font-semibold text-white">{t("order.items")}</h2>
        <div className="space-y-2 text-sm">
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between text-platinum-300">
              <span>{it.qty}× {it.product_name} <span className="text-platinum-500">({it.variant_label})</span></span>
              <span>€{(it.price * it.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-platinum-800 pt-4 font-bold text-white">
          <span>{t("cart.total")}</span>
          <span>€{order.total.toFixed(2)}</span>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-platinum-500">{t("order.shipinfo")}</p>
    </motion.div>
  );
}
