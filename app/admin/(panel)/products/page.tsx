"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

type VariantForm = { label: string; price: string; stock: string };
type ProductForm = {
  id?: string;
  name: string;
  category: string;
  purity: string;
  description: string;
  image_url: string;
  active: boolean;
  sort: number;
  variants: VariantForm[];
};

const empty: ProductForm = {
  name: "",
  category: "Peptides",
  purity: ">= 99%",
  description: "",
  image_url: "",
  active: true,
  sort: 0,
  variants: [{ label: "5 mg", price: "44.00", stock: "100" }],
};

const input = "w-full rounded-lg border border-platinum-700 bg-platinum-950 px-3 py-2 text-platinum-100 outline-none focus:border-accent-500";

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProductForm | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((d) => d && setProducts(d.products ?? []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const edit = (p: any) =>
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      purity: p.purity,
      description: p.description,
      image_url: p.image_url,
      active: p.active,
      sort: p.sort,
      variants: (p.variants ?? []).map((v: any) => ({
        label: v.label,
        price: String(v.price),
        stock: String(v.stock),
      })),
    });

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setForm(null);
      load();
    } else {
      alert("Fehler beim Speichern.");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Produkt wirklich löschen?")) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    load();
  };

  const setV = (i: number, k: keyof VariantForm, v: string) =>
    setForm((f) => f && { ...f, variants: f.variants.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Produkte</h1>
        <button onClick={() => setForm({ ...empty })} className="rounded-lg bg-accent-500 px-4 py-2 font-semibold text-platinum-950 hover:bg-accent-400">+ Neues Produkt</button>
      </div>

      {form && (
        <div className="mb-6 rounded-2xl border border-accent-600/40 bg-platinum-900/60 p-5">
          <h2 className="mb-4 font-semibold text-white">{form.id ? "Produkt bearbeiten" : "Neues Produkt"}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={input} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={input} placeholder="Kategorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className={input} placeholder="Reinheit (z. B. >= 99%)" value={form.purity} onChange={(e) => setForm({ ...form, purity: e.target.value })} />
            <textarea className={`${input} sm:col-span-2`} rows={2} placeholder="Beschreibung" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-platinum-300">Produktbild</h3>
            <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-platinum-300">Varianten / Mengen</h3>
              <button onClick={() => setForm({ ...form, variants: [...form.variants, { label: "", price: "", stock: "0" }] })} className="text-sm text-accent-400 hover:underline">+ Variante</button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_110px_90px_36px] gap-2 text-xs text-platinum-500">
                <span>Bezeichnung (z. B. 10 mg)</span><span>Preis €</span><span>Lager</span><span></span>
              </div>
              {form.variants.map((v, i) => (
                <div key={i} className="grid grid-cols-[1fr_110px_90px_36px] gap-2">
                  <input className={input} placeholder="10 mg" value={v.label} onChange={(e) => setV(i, "label", e.target.value)} />
                  <input className={input} type="number" step="0.01" placeholder="79.00" value={v.price} onChange={(e) => setV(i, "price", e.target.value)} />
                  <input className={input} type="number" placeholder="100" value={v.stock} onChange={(e) => setV(i, "stock", e.target.value)} />
                  <button onClick={() => setForm({ ...form, variants: form.variants.filter((_, j) => j !== i) })} className="grid place-items-center rounded-lg border border-platinum-700 text-platinum-400 hover:text-red-400">✕</button>
                </div>
              ))}
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-platinum-300">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-accent-500" />
            Im Shop sichtbar
          </label>

          <div className="mt-5 flex gap-3">
            <button onClick={save} disabled={saving} className="rounded-lg bg-accent-500 px-5 py-2 font-semibold text-platinum-950 hover:bg-accent-400 disabled:opacity-60">{saving ? "Speichert…" : "Speichern"}</button>
            <button onClick={() => setForm(null)} className="rounded-lg border border-platinum-700 px-5 py-2 text-platinum-200">Abbrechen</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-platinum-500">Lädt…</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-platinum-800 bg-platinum-900/50 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{p.name}</span>
                  {!p.active && <span className="rounded-full bg-platinum-800 px-2 py-0.5 text-xs text-platinum-400">versteckt</span>}
                </div>
                <div className="text-sm text-platinum-400">
                  {p.category} · {(p.variants ?? []).map((v: any) => `${v.label} (€${Number(v.price).toFixed(2)}, Lager ${v.stock})`).join(" · ")}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(p)} className="rounded-lg border border-platinum-700 px-3 py-1.5 text-sm text-platinum-200 hover:border-accent-500">Bearbeiten</button>
                <button onClick={() => del(p.id)} className="rounded-lg border border-platinum-700 px-3 py-1.5 text-sm text-platinum-200 hover:border-red-500/50 hover:text-red-400">Löschen</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
