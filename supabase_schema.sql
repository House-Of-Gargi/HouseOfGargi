-- Drop existing tables if they exist
drop table if exists orders;
drop table if exists products;

-- 1. Create Products Table
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  price_in_rupees integer not null,
  stock integer not null default 0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Orders Table
create table orders (
  id uuid default gen_random_uuid() primary key,
  order_number text not null unique,
  customer_name text not null,
  customer_phone text,
  total_rupees integer not null,
  status text not null default 'Processing',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Disable RLS for now so the app can fetch data without policies (since auth is bypassed)
-- Note: In a real production app, you should enable RLS and add policies!
alter table products disable row level security;
alter table orders disable row level security;

-- 4. Insert Dummy Products
insert into products (name, category, price_in_rupees, stock, image_url) values
  ('Banarasi Silk Saree', 'Sarees', 45000, 4, 'https://images.unsplash.com/photo-1610189012543-8cebcbe64811?auto=format&fit=crop&q=80&w=800'),
  ('Zari Work Lehenga', 'Lehengas', 85000, 2, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'),
  ('Cotton Block Print Kurta', 'Kurta Sets', 12000, 15, 'https://images.unsplash.com/photo-1583391733958-d15a883fa50b?auto=format&fit=crop&q=80&w=800'),
  ('Kundan Necklace Set', 'Accessories', 25000, 6, 'https://images.unsplash.com/photo-1599643477873-10821ec365bc?auto=format&fit=crop&q=80&w=800'),
  ('Kanjeevaram Saree', 'Sarees', 65000, 3, 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?auto=format&fit=crop&q=80&w=800');

-- 5. Insert Dummy Orders
insert into orders (order_number, customer_name, total_rupees, status, created_at) values
  ('#HG-1042', 'Priya Sharma', 45000, 'Processing', '2026-10-12 10:00:00'),
  ('#HG-1041', 'Anjali Desai', 22500, 'Shipped', '2026-10-10 14:30:00'),
  ('#HG-B009', 'Simran Kaur', 85000, 'Bespoke Review', '2026-10-08 09:15:00'),
  ('#HG-1040', 'Neha Gupta', 18000, 'Delivered', '2026-10-05 16:45:00');
