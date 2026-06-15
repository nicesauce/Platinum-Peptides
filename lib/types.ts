export type Variant = {
  id: string;
  product_id?: string;
  label: string;
  price: number;
  stock: number;
  sort: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  image_url: string;
  purity: string;
  active: boolean;
  sort: number;
  variants: Variant[];
};

export type Wallet = {
  id: string;
  coin: string;
  network: string;
  address: string;
  active: boolean;
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "cancelled";

export type OrderItem = {
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_label: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  order_number: string;
  email: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  total: number;
  currency: string;
  coin: string | null;
  coin_network: string | null;
  pay_address: string | null;
  crypto_amount: string | null;
  txid: string | null;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
};
