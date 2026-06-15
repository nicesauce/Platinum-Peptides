"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Falsches Passwort.");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-platinum-800 bg-platinum-900/60 p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-platinum-950 font-bold">P</div>
          <h1 className="text-xl font-bold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-platinum-400">PlatinPeptides Verwaltung</p>
        </div>
        <input
          type="password"
          autoFocus
          required
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-platinum-700 bg-platinum-950 px-4 py-3 text-platinum-100 outline-none focus:border-accent-500"
        />
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-accent-500 py-3 font-semibold text-platinum-950 hover:bg-accent-400 disabled:opacity-60"
        >
          {loading ? "..." : "Anmelden"}
        </button>
      </form>
    </div>
  );
}
