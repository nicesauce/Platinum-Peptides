import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

const BUCKET = "product-images";
const ALLOWED = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

export async function POST(req: NextRequest) {
  if (!isAdminRequest()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei erhalten." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Datei zu groß (max. 5 MB)." }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  if (!ALLOWED.includes(ext)) {
    return NextResponse.json({ error: "Ungültiges Bildformat." }, { status: 400 });
  }

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: file.type || `image/${ext}`,
      upsert: false,
    });

  if (error) {
    // Most common cause: the storage bucket does not exist yet.
    return NextResponse.json(
      {
        error:
          "Upload fehlgeschlagen: " +
          error.message +
          ' — Lege in Supabase einen öffentlichen Bucket namens "product-images" an (siehe README).',
      },
      { status: 500 }
    );
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
