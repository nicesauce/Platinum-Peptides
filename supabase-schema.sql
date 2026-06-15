-- ============================================================
--  PlatinPeptides – Database Schema
--  Run this whole file in:  Supabase → SQL Editor → New query → Run
-- ============================================================

-- Needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------- PRODUCTS ----------
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique,
  description text default '',
  category    text default 'Peptides',
  image_url   text default '',
  purity      text default '>= 99%',
  active      boolean not null default true,
  sort        int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- PRODUCT VARIANTS (quantities / dosages) ----------
create table if not exists product_variants (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  label       text not null,            -- e.g. "5 mg", "10 mg", "Kit of 10"
  price       numeric(10,2) not null,   -- price in EUR
  stock       int not null default 0,
  sort        int not null default 0
);
create index if not exists idx_variants_product on product_variants(product_id);

-- ---------- WALLETS (crypto deposit addresses) ----------
create table if not exists wallets (
  id          uuid primary key default gen_random_uuid(),
  coin        text not null,            -- symbol, e.g. BTC, XMR, USDT
  network     text default '',          -- e.g. "TRC20", "ERC20", "Bitcoin"
  address     text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- ORDERS ----------
create table if not exists orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text unique not null,         -- the tracking / transaction number
  email           text not null,
  status          text not null default 'pending_payment',
                  -- pending_payment | paid | processing | shipped | cancelled
  items           jsonb not null default '[]',  -- [{product, variant, qty, price}]
  subtotal        numeric(10,2) not null default 0,
  total           numeric(10,2) not null default 0,
  currency        text not null default 'EUR',

  coin            text,                          -- chosen crypto symbol
  coin_network    text,
  pay_address     text,                          -- wallet address customer pays to
  crypto_amount   text,                          -- approx amount in coin (string)
  txid            text,                          -- transaction hash submitted by customer

  shipping_name   text,
  shipping_address text,
  shipping_city   text,
  shipping_zip    text,
  shipping_country text,
  note            text,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists idx_orders_number on orders(order_number);
create index if not exists idx_orders_status on orders(status);

-- Auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated
before update on orders
for each row execute function set_updated_at();

-- ============================================================
--  Row Level Security
--  The app talks to the DB only via the server using the
--  SERVICE ROLE key, which bypasses RLS. We enable RLS and add
--  NO public policies, so the anon/public key cannot read data.
-- ============================================================
alter table products         enable row level security;
alter table product_variants enable row level security;
alter table wallets          enable row level security;
alter table orders           enable row level security;

-- ============================================================
--  SEED DATA (sample products + variants). Edit later in /admin.
-- ============================================================
insert into products (name, slug, description, category, purity, sort) values
  ('BPC-157', 'bpc-157', 'Body Protection Compound. Stable pentadecapeptide studied for tissue repair research.', 'Healing', '>= 99%', 1),
  ('TB-500 (Thymosin Beta-4)', 'tb-500', 'Synthetic fragment studied for recovery and angiogenesis research.', 'Healing', '>= 99%', 2),
  ('Semaglutide', 'semaglutide', 'GLP-1 receptor agonist peptide for metabolic research.', 'Metabolic', '>= 99%', 3),
  ('Ipamorelin', 'ipamorelin', 'Selective growth hormone secretagogue research peptide.', 'Growth', '>= 99%', 4),
  ('CJC-1295 (no DAC)', 'cjc-1295', 'GHRH analog studied alongside secretagogues.', 'Growth', '>= 99%', 5),
  ('Melanotan II', 'melanotan-2', 'Melanocortin receptor agonist research peptide.', 'Other', '>= 99%', 6)
on conflict (slug) do nothing;

-- Variants for each seeded product
insert into product_variants (product_id, label, price, stock, sort)
select p.id, v.label, v.price, v.stock, v.sort
from products p
cross join (values
  ('5 mg',  44.00, 100, 1),
  ('10 mg', 79.00, 100, 2),
  ('Kit of 10 x 10 mg', 690.00, 25, 3)
) as v(label, price, stock, sort)
where p.slug in ('bpc-157','tb-500','semaglutide','ipamorelin','cjc-1295','melanotan-2')
on conflict do nothing;

-- Example wallets (REPLACE the addresses in /admin/wallets before going live!)
insert into wallets (coin, network, address, active) values
  ('BTC',  'Bitcoin',        'REPLACE_WITH_YOUR_BTC_ADDRESS',  true),
  ('XMR',  'Monero',         'REPLACE_WITH_YOUR_XMR_ADDRESS',  true),
  ('USDT', 'TRC20 (Tron)',   'REPLACE_WITH_YOUR_USDT_ADDRESS', true),
  ('ETH',  'ERC20',          'REPLACE_WITH_YOUR_ETH_ADDRESS',  true),
  ('SOL',  'Solana',         'REPLACE_WITH_YOUR_SOL_ADDRESS',  true),
  ('LTC',  'Litecoin',       'REPLACE_WITH_YOUR_LTC_ADDRESS',  true)
on conflict do nothing;
