import { Resend } from "resend";
import type { Order } from "./types";

type Locale = "de" | "en" | "es" | "fr";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const T: Record<Locale, Record<string, string>> = {
  de: {
    subject: "Bestellbestätigung",
    hello: "Vielen Dank für deine Bestellung!",
    orderNo: "Bestell- / Transaktionsnummer",
    payNow: "Bitte überweise jetzt per Krypto",
    sendTo: "Sende die Zahlung an diese Adresse",
    amount: "Betrag",
    coin: "Währung",
    network: "Netzwerk",
    afterPay: "Nach der Zahlung gib bitte deine TXID (Transaktions-Hash) auf unserer Tracking-Seite ein, damit wir die Zahlung zuordnen können.",
    track: "Bestellung verfolgen & TXID einreichen",
    items: "Artikel",
    total: "Gesamt",
    shipping: "Versand dauert in der Regel 1–2 Werktage nach Zahlungseingang.",
    research: "Nur zu Forschungszwecken. Nicht für den menschlichen Verzehr.",
    qty: "Menge",
    subtotal: "Zwischensumme",
    discount: "Mengenrabatt (−20%)",
    freeship: "Versand (kostenlos)",
  },
  en: {
    subject: "Order confirmation",
    hello: "Thank you for your order!",
    orderNo: "Order / transaction number",
    payNow: "Please pay now via crypto",
    sendTo: "Send the payment to this address",
    amount: "Amount",
    coin: "Currency",
    network: "Network",
    afterPay: "After paying, please enter your TXID (transaction hash) on our tracking page so we can match your payment.",
    track: "Track order & submit TXID",
    items: "Items",
    total: "Total",
    shipping: "Shipping usually takes 1–2 business days after payment is received.",
    research: "For research purposes only. Not for human consumption.",
    qty: "Qty",
    subtotal: "Subtotal",
    discount: "Bulk discount (−20%)",
    freeship: "Shipping (free)",
  },
  es: {
    subject: "Confirmación de pedido",
    hello: "¡Gracias por tu pedido!",
    orderNo: "Número de pedido / transacción",
    payNow: "Por favor paga ahora con cripto",
    sendTo: "Envía el pago a esta dirección",
    amount: "Importe",
    coin: "Moneda",
    network: "Red",
    afterPay: "Después de pagar, introduce tu TXID (hash de transacción) en nuestra página de seguimiento para que podamos verificar tu pago.",
    track: "Seguir pedido y enviar TXID",
    items: "Artículos",
    total: "Total",
    shipping: "El envío suele tardar 1–2 días hábiles tras recibir el pago.",
    research: "Solo para fines de investigación. No apto para consumo humano.",
    qty: "Cant.",
    subtotal: "Subtotal",
    discount: "Descuento por volumen (−20%)",
    freeship: "Envío (gratis)",
  },
  fr: {
    subject: "Confirmation de commande",
    hello: "Merci pour votre commande !",
    orderNo: "Numéro de commande / transaction",
    payNow: "Veuillez payer maintenant en crypto",
    sendTo: "Envoyez le paiement à cette adresse",
    amount: "Montant",
    coin: "Devise",
    network: "Réseau",
    afterPay: "Après le paiement, saisissez votre TXID (hash de transaction) sur notre page de suivi afin que nous puissions associer votre paiement.",
    track: "Suivre la commande et envoyer le TXID",
    items: "Articles",
    total: "Total",
    shipping: "La livraison prend généralement 1 à 2 jours ouvrés après réception du paiement.",
    research: "À des fins de recherche uniquement. Ne convient pas à la consommation humaine.",
    qty: "Qté",
    subtotal: "Sous-total",
    discount: "Remise quantité (−20%)",
    freeship: "Livraison (gratuite)",
  },
};

function money(n: number) {
  return `€${Number(n).toFixed(2)}`;
}

export function buildOrderEmailHtml(order: Order, locale: Locale): string {
  const t = T[locale] ?? T.en;
  const trackUrl = `${SITE}/order/${order.order_number}`;
  const rows = order.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #2a3147;color:#cbd5e1">
          ${it.product_name} <span style="color:#94a3b8">(${it.variant_label})</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #2a3147;color:#94a3b8;text-align:center">${t.qty}: ${it.qty}</td>
        <td style="padding:8px 0;border-bottom:1px solid #2a3147;color:#cbd5e1;text-align:right">${money(it.price * it.qty)}</td>
      </tr>`
    )
    .join("");

  const cryptoLine = order.crypto_amount
    ? `≈ ${order.crypto_amount} ${order.coin}`
    : `${money(order.total)} (${t.coin}: ${order.coin})`;

  return `
  <div style="background:#0d111c;padding:32px 0;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#141a28;border:1px solid #2a3147;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#0d9488,#1a1f2e);padding:24px 28px">
        <h1 style="margin:0;color:#fff;font-size:20px;letter-spacing:1px">PLATIN<span style="color:#5eead4">PEPTIDES</span></h1>
      </div>
      <div style="padding:28px">
        <h2 style="color:#fff;margin:0 0 6px">${t.hello}</h2>
        <p style="color:#94a3b8;margin:0 0 20px">${t.orderNo}:
          <strong style="color:#5eead4;font-size:16px">${order.order_number}</strong>
        </p>

        <div style="background:#0d111c;border:1px solid #2a3147;border-radius:12px;padding:18px;margin-bottom:20px">
          <p style="color:#fff;font-weight:bold;margin:0 0 8px">${t.payNow}</p>
          <p style="color:#94a3b8;margin:0 0 4px">${t.sendTo} (${order.coin} · ${order.coin_network ?? ""}):</p>
          <p style="color:#5eead4;word-break:break-all;font-family:monospace;margin:0 0 10px">${order.pay_address ?? ""}</p>
          <p style="color:#cbd5e1;margin:0">${t.amount}: <strong>${cryptoLine}</strong></p>
        </div>

        <p style="color:#94a3b8;line-height:1.5;margin:0 0 18px">${t.afterPay}</p>

        <a href="${trackUrl}" style="display:inline-block;background:#14b8a6;color:#04211d;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:10px;margin-bottom:24px">${t.track}</a>

        <h3 style="color:#fff;margin:16px 0 8px">${t.items}</h3>
        <table style="width:100%;border-collapse:collapse">${rows}
          ${order.subtotal > order.total ? `
          <tr>
            <td colspan="2" style="padding:8px 0;color:#94a3b8">${t.subtotal}</td>
            <td style="padding:8px 0;color:#94a3b8;text-align:right">${money(order.subtotal)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:4px 0;color:#5eead4">${t.discount}</td>
            <td style="padding:4px 0;color:#5eead4;text-align:right">−${money(order.subtotal - order.total)}</td>
          </tr>` : ""}
          <tr>
            <td colspan="2" style="padding:4px 0;color:#94a3b8">${t.freeship}</td>
            <td style="padding:4px 0;color:#94a3b8;text-align:right">€0.00</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:12px 0;color:#fff;font-weight:bold">${t.total}</td>
            <td style="padding:12px 0;color:#5eead4;font-weight:bold;text-align:right">${money(order.total)}</td>
          </tr>
        </table>

        <p style="color:#94a3b8;margin:20px 0 0;font-size:13px">${t.shipping}</p>
        <p style="color:#64748b;margin:12px 0 0;font-size:12px">${t.research}</p>
      </div>
    </div>
  </div>`;
}

export async function sendOrderConfirmation(order: Order, locale: Locale) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "PlatinPeptides <onboarding@resend.dev>";
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set – skipping confirmation email.");
    return { skipped: true };
  }
  const t = T[locale] ?? T.en;
  const resend = new Resend(apiKey);
  try {
    await resend.emails.send({
      from,
      to: order.email,
      subject: `${t.subject} – ${order.order_number}`,
      html: buildOrderEmailHtml(order, locale),
    });
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed", err);
    return { error: true };
  }
}
