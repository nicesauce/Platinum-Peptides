# PlatinPeptides 🧬

Eine moderne Forschungs-Peptide-Website mit animiertem Design, 4 Sprachen (DE/EN/ES/FR),
Krypto-Zahlung, Bestell-Tracking per Transaktionsnummer, TXID-Einreichung,
Bestätigungs-E-Mails und einem vollständigen Admin-Panel.

> ⚠️ **Hinweis:** Alle Produkte werden ausschließlich für die Laborforschung angeboten
> (Disclaimer „Not for human consumption"). Stelle sicher, dass dein Verkauf den Gesetzen
> deines Landes entspricht.

---

## ✨ Funktionen

- **Modernes Design** mit Aurora-Hintergrund, Animationen (Framer Motion), Hover-Effekten
- **4 Sprachen**: Deutsch, English, Español, Français – umschaltbar oben rechts
- **Krypto-Zahlung**: BTC, XMR, USDT, USDC, ETH, SOL, LTC, BCH, DOGE, TRX, XRP, BNB, ADA, DAI
- **Live-Umrechnung** EUR → Krypto (CoinGecko) beim Checkout
- **Jede Bestellung = eigene Transaktionsnummer** (z. B. `PP-7K2M9QXA`)
- **Tracking-Seite**: Nummer eingeben → Status sehen → **TXID nachträglich einreichen**
- **Bestätigungs-E-Mail** (Resend) mit Wallet-Adresse, Betrag und „Bitte Krypto überweisen & TXID einreichen"
- **Versandhinweis** „in der Regel 1–2 Tage" auf der ganzen Seite
- **Admin-Panel** (`/admin`):
  - Wallet-Adressen für alle Coins hinzufügen / bearbeiten / aktiv schalten
  - Produkte mit **Varianten/Mengenangaben** (z. B. 5 mg / 10 mg / Kit) anlegen, bearbeiten, löschen
  - Bestellungen als **bezahlt / in Bearbeitung / versendet / storniert** markieren
  - Übersicht mit Umsatz und offenen Bestellungen

---

## 🧰 Was du brauchst (alles kostenlos)

1. Ein **GitHub**-Konto → https://github.com
2. Ein **Vercel**-Konto → https://vercel.com (mit GitHub anmelden)
3. Ein **Supabase**-Konto (Datenbank) → https://supabase.com
4. Ein **Resend**-Konto (E-Mails) → https://resend.com
5. **Node.js** auf deinem Computer (zum lokalen Testen) → https://nodejs.org (Version 18+)

---

## 🚀 Schritt-für-Schritt Anleitung

### Schritt 1 – Datenbank bei Supabase einrichten

1. Auf https://supabase.com einloggen → **New Project**.
2. Name z. B. `platinpeptides`, ein DB-Passwort vergeben, Region wählen → **Create**.
3. Warte ~1 Minute, bis das Projekt bereit ist.
4. Links im Menü auf **SQL Editor** → **New query**.
5. Öffne die Datei **`supabase-schema.sql`** aus diesem Projekt, kopiere den **gesamten Inhalt**
   in den Editor und klicke **Run**. (Damit werden alle Tabellen + Beispieldaten angelegt.)
6. Gehe zu **Project Settings → API**. Du brauchst gleich zwei Werte:
   - **Project URL** → das ist `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** Secret (unter „Project API keys", auf „reveal" klicken)
     → das ist `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **Geheim halten!**

> 🔐 **Wichtig:** Trage diese Werte NIEMALS in Dateien ein, die zu GitHub hochgeladen werden
> (auch nicht in diese README!). Sie gehören ausschließlich in die Vercel
> *Environment Variables* bzw. lokal in `.env.local` (diese Datei wird von Git ignoriert).


> 🖼️ **Bild-Upload:** Das Schema legt automatisch einen öffentlichen Storage-Bucket
> `product-images` an. Damit kannst du im Admin-Panel Produktbilder per Drag & Drop
> hochladen. Falls du das Schema schon **vor** diesem Update ausgeführt hast, führe
> einfach diesen einen Befehl im SQL-Editor nach:
> ```sql
> insert into storage.buckets (id, name, public)
> values ('product-images', 'product-images', true)
> on conflict (id) do update set public = true;
> ```
> (Alternativ in Supabase → **Storage** → **New bucket** → Name `product-images` → **Public** aktivieren.)

### Schritt 2 – E-Mails bei Resend einrichten

1. Auf https://resend.com einloggen → **API Keys** → **Create API Key** → kopieren.
   Das ist `RESEND_API_KEY`. (Nur in Vercel/`.env.local` eintragen – nicht hier!)
2. Zum Testen kannst du als Absender `onboarding@resend.dev` verwenden.
   Für echte E-Mails: unter **Domains** deine eigene Domain hinzufügen & verifizieren,
   dann z. B. `EMAIL_FROM="PlatinPeptides <orders@deinedomain.de>"`.

### Schritt 3 – Projektdateien zu GitHub hochladen

**Variante A (einfach, über die Website):**
1. Auf https://github.com → **New repository** → Name z. B. `platinpeptides` → **Create**.
2. Auf der nächsten Seite **„uploading an existing file"** klicken und **alle Dateien
   und Ordner** dieses Projekts hineinziehen → **Commit changes**.

**Variante B (über Terminal):**
```bash
cd "Claude Peptide Website"
git init
git add .
git commit -m "PlatinPeptides"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/platinpeptides.git
git push -u origin main
```

### Schritt 4 – Auf Vercel deployen

1. Auf https://vercel.com → **Add New… → Project**.
2. Dein GitHub-Repo `platinpeptides` **importieren**.
3. Vercel erkennt Next.js automatisch – nichts ändern.
4. Klappe **„Environment Variables"** auf und trage diese Schlüssel ein
   (Werte aus Schritt 1 & 2). Siehe auch `.env.example`:

   | Name | Wert |
   |------|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | deine Supabase Project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | dein Supabase service_role Key |
   | `RESEND_API_KEY` | dein Resend API Key |
   | `EMAIL_FROM` | z. B. `PlatinPeptides <onboarding@resend.dev>` |
   | `ADMIN_PASSWORD` | dein gewünschtes Admin-Passwort |
   | `ADMIN_SECRET` | langer Zufallsstring (z. B. `openssl rand -hex 32`) |
   | `NEXT_PUBLIC_SITE_URL` | `https://dein-projekt.vercel.app` |
   | `NEXT_PUBLIC_SUPPORT_EMAIL` | deine Support-E-Mail |

5. **Deploy** klicken. Nach ~1 Minute ist die Seite online! 🎉

> Tipp: Die `NEXT_PUBLIC_SITE_URL` kennst du erst nach dem ersten Deploy.
> Trage sie danach unter **Settings → Environment Variables** ein und klicke
> **Redeploy**, damit die Tracking-Links in E-Mails korrekt sind.

### Schritt 5 – Erste Einrichtung im Admin-Panel

1. Öffne `https://dein-projekt.vercel.app/admin`
2. Mit deinem `ADMIN_PASSWORD` einloggen.
3. **Wallets**: Ersetze die Beispiel-Adressen durch deine echten Wallet-Adressen.
4. **Produkte**: Beispiel-Produkte bearbeiten/löschen und eigene mit Mengenangaben anlegen.
5. Fertig – Kunden können bestellen, du verwaltest alles unter **Bestellungen**.

---

## 💻 Lokal testen (optional)

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen anlegen
cp .env.example .env.local
#   → .env.local öffnen und die echten Werte eintragen

# 3. Entwicklungsserver starten
npm run dev
```
Dann im Browser **http://localhost:3000** öffnen. Admin: **http://localhost:3000/admin**

---

## 🛒 So läuft eine Bestellung ab

1. Kunde legt Produkte (mit Menge) in den Warenkorb → **Kasse**.
2. Er gibt E-Mail + Lieferadresse ein und wählt eine Kryptowährung.
3. Es wird eine Bestellung mit eigener **Transaktionsnummer** erstellt.
4. Kunde sieht sofort die **Wallet-Adresse + Betrag** und bekommt dieselben Infos per E-Mail
   („Bitte Krypto überweisen & TXID einreichen").
5. Nach der Zahlung gibt der Kunde auf **/track** (oder über den Link in der E-Mail)
   seine **TXID** ein.
6. Du siehst die TXID im Admin-Panel und markierst die Bestellung als **bezahlt → in
   Bearbeitung → versendet**. Der Kunde sieht den Status live auf der Tracking-Seite.

---

## 🎨 Anpassen

- **Texte/Übersetzungen**: `lib/i18n.ts`
- **Farben/Design**: `tailwind.config.ts` und `app/globals.css`
- **Unterstützte Coins**: `lib/crypto.ts` (Liste `COINS`)
- **E-Mail-Layout**: `lib/email.ts`
- **Markenname/Logo**: `components/Navbar.tsx`, `components/Footer.tsx`

---

## 🔒 Sicherheit

- Die Datenbank wird nur serverseitig über den **service_role** Key angesprochen.
  Der öffentliche Browser sieht niemals geheime Schlüssel.
- Das Admin-Passwort wird über einen signierten Cookie geprüft (`ADMIN_SECRET`).
- Preise werden serverseitig aus der DB geholt – Manipulation im Browser ist wirkungslos.

---

## 🧩 Tech-Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
Supabase (Postgres) · Resend · Vercel
