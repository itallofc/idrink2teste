-- Idrink Database Schema
-- Production-ready Supabase schema with RLS

-- ============================================
-- PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'merchant', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);

-- ============================================
-- STORES TABLE
-- ============================================
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  tagline text,
  banner_url text,
  logo_url text,
  phone text,
  address text,
  city text default 'Divinopolis',
  state text default 'MG',
  delivery_fee numeric(10,2) default 5.00,
  min_order numeric(10,2) default 20.00,
  delivery_time text default '30-45 min',
  rating numeric(2,1) default 0,
  total_reviews integer default 0,
  is_active boolean default true,
  is_open boolean default true,
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.stores enable row level security;

-- Stores policies
create policy "stores_public_read" on public.stores 
  for select using (true);

create policy "stores_owner_insert" on public.stores 
  for insert with check (auth.uid() = owner_id);

create policy "stores_owner_update" on public.stores 
  for update using (auth.uid() = owner_id);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  store_id uuid not null references public.stores(id) on delete cascade,
  sort_order integer default 0,
  created_at timestamptz default now(),
  unique(store_id, slug)
);

alter table public.categories enable row level security;

create policy "categories_public_read" on public.categories 
  for select using (true);

create policy "categories_owner_insert" on public.categories 
  for insert with check (
    exists (select 1 from public.stores where id = store_id and owner_id = auth.uid())
  );

create policy "categories_owner_update" on public.categories 
  for update using (
    exists (select 1 from public.stores where id = store_id and owner_id = auth.uid())
  );

-- ============================================
-- PRODUCTS TABLE
-- ============================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  store_id uuid not null references public.stores(id) on delete cascade,
  is_available boolean default true,
  is_featured boolean default false,
  stock integer default 999,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

create policy "products_public_read" on public.products 
  for select using (true);

create policy "products_owner_insert" on public.products 
  for insert with check (
    exists (select 1 from public.stores where id = store_id and owner_id = auth.uid())
  );

create policy "products_owner_update" on public.products 
  for update using (
    exists (select 1 from public.stores where id = store_id and owner_id = auth.uid())
  );

-- ============================================
-- ORDERS TABLE
-- ============================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')),
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) default 0,
  total_amount numeric(10,2) not null,
  payment_method text check (payment_method in ('pix', 'credit_card', 'debit_card', 'cash')),
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  delivery_address text,
  delivery_notes text,
  estimated_delivery timestamptz,
  delivered_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;

create policy "orders_user_select" on public.orders 
  for select using (auth.uid() = user_id);

create policy "orders_user_insert" on public.orders 
  for insert with check (auth.uid() = user_id);

create policy "orders_store_owner_select" on public.orders 
  for select using (
    exists (select 1 from public.stores where id = store_id and owner_id = auth.uid())
  );

create policy "orders_store_owner_update" on public.orders 
  for update using (
    exists (select 1 from public.stores where id = store_id and owner_id = auth.uid())
  );

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null,
  notes text,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "order_items_user_select" on public.order_items 
  for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "order_items_user_insert" on public.order_items 
  for insert with check (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );

create policy "order_items_store_owner_select" on public.order_items 
  for select using (
    exists (
      select 1 from public.orders o 
      join public.stores s on o.store_id = s.id 
      where o.id = order_id and s.owner_id = auth.uid()
    )
  );

-- ============================================
-- REVIEWS TABLE
-- ============================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  reply text,
  replied_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, order_id)
);

alter table public.reviews enable row level security;

create policy "reviews_public_read" on public.reviews 
  for select using (true);

create policy "reviews_user_insert" on public.reviews 
  for insert with check (auth.uid() = user_id);

create policy "reviews_user_update" on public.reviews 
  for update using (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Auto-create profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================
-- TRIGGER: Update store rating on new review
-- ============================================
create or replace function public.update_store_rating()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.stores
  set 
    rating = (select avg(rating)::numeric(2,1) from public.reviews where store_id = new.store_id),
    total_reviews = (select count(*) from public.reviews where store_id = new.store_id)
  where id = new.store_id;
  return new;
end;
$$;

drop trigger if exists on_review_created on public.reviews;

create trigger on_review_created
  after insert on public.reviews
  for each row
  execute function public.update_store_rating();

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_stores_slug on public.stores(slug);
create index if not exists idx_stores_owner on public.stores(owner_id);
create index if not exists idx_stores_active on public.stores(is_active, is_open);
create index if not exists idx_products_store on public.products(store_id);
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_store on public.orders(store_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_reviews_store on public.reviews(store_id);
