"use client";

import { useRef, useState } from "react";

export default function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Bitte eine Bilddatei wählen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Datei zu groß (max. 5 MB).");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen");
      onChange(data.url);
    } catch (e: any) {
      setError(e.message || "Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition ${
          dragging ? "border-accent-500 bg-accent-500/10" : "border-platinum-700 bg-platinum-950 hover:border-platinum-500"
        }`}
      >
        {value ? (
          <div className="flex w-full items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Vorschau" className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1 text-left">
              <p className="text-sm text-platinum-200">Bild hochgeladen ✓</p>
              <p className="text-xs text-platinum-500">Klicken oder neues Bild hierher ziehen, um zu ersetzen</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="rounded-lg border border-platinum-700 px-2.5 py-1 text-xs text-platinum-300 hover:border-red-500/50 hover:text-red-400"
            >
              Entfernen
            </button>
          </div>
        ) : (
          <>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
            <p className="text-sm text-platinum-200">{uploading ? "Lädt hoch…" : "Bild hierher ziehen oder klicken zum Auswählen"}</p>
            <p className="text-xs text-platinum-500">JPG, PNG, WEBP · max. 5 MB</p>
          </>
        )}
        {uploading && <div className="absolute inset-0 grid place-items-center rounded-xl bg-platinum-950/60 text-sm text-accent-400">Lädt hoch…</div>}
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…oder Bild-URL einfügen (optional)"
          className="w-full rounded-lg border border-platinum-700 bg-platinum-950 px-3 py-2 text-xs text-platinum-300 outline-none focus:border-accent-500"
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
