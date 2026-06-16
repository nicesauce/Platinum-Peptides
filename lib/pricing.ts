// Bulk discount: 20% off when the cart contains 3 or more items (total quantity).
export const BULK_QTY = 3;
export const BULK_RATE = 0.2;

export type Totals = {
  qty: number;
  subtotal: number;
  discount: number;
  total: number;
  eligible: boolean;
};

export function computeTotals(lines: { qty: number; price: number }[]): Totals {
  const qty = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const eligible = qty >= BULK_QTY;
  const discount = eligible ? Math.round(subtotal * BULK_RATE * 100) / 100 : 0;
  const total = Math.round((subtotal - discount) * 100) / 100;
  return { qty, subtotal, discount, total, eligible };
}
