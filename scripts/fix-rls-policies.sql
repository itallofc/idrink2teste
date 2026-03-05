-- Fix RLS policies to allow public read access to stores, products, and categories
-- while maintaining proper write protection

-- Drop existing policies for stores (if they exist)
DROP POLICY IF EXISTS "stores_select_public" ON public.stores;
DROP POLICY IF EXISTS "stores_insert_owner" ON public.stores;
DROP POLICY IF EXISTS "stores_update_owner" ON public.stores;
DROP POLICY IF EXISTS "stores_delete_owner" ON public.stores;

-- Create new policies for stores
-- Allow anyone to read active stores (including anonymous users)
CREATE POLICY "stores_select_public" ON public.stores
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert their own stores
CREATE POLICY "stores_insert_owner" ON public.stores
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Allow owners to update their own stores
CREATE POLICY "stores_update_owner" ON public.stores
  FOR UPDATE USING (auth.uid() = owner_id);

-- Allow owners to delete their own stores
CREATE POLICY "stores_delete_owner" ON public.stores
  FOR DELETE USING (auth.uid() = owner_id);

-- Drop existing policies for products (if they exist)
DROP POLICY IF EXISTS "products_select_public" ON public.products;
DROP POLICY IF EXISTS "products_insert_owner" ON public.products;
DROP POLICY IF EXISTS "products_update_owner" ON public.products;
DROP POLICY IF EXISTS "products_delete_owner" ON public.products;

-- Create new policies for products
-- Allow anyone to read available products from active stores
CREATE POLICY "products_select_public" ON public.products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = products.store_id 
      AND stores.is_active = true
    )
  );

-- Allow store owners to insert products for their stores
CREATE POLICY "products_insert_owner" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = products.store_id 
      AND stores.owner_id = auth.uid()
    )
  );

-- Allow store owners to update products for their stores
CREATE POLICY "products_update_owner" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = products.store_id 
      AND stores.owner_id = auth.uid()
    )
  );

-- Allow store owners to delete products for their stores
CREATE POLICY "products_delete_owner" ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = products.store_id 
      AND stores.owner_id = auth.uid()
    )
  );

-- Drop existing policies for categories (if they exist)
DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_owner" ON public.categories;
DROP POLICY IF EXISTS "categories_update_owner" ON public.categories;
DROP POLICY IF EXISTS "categories_delete_owner" ON public.categories;

-- Create new policies for categories
-- Allow anyone to read active categories from active stores
CREATE POLICY "categories_select_public" ON public.categories
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = categories.store_id 
      AND stores.is_active = true
    )
  );

-- Allow store owners to insert categories for their stores
CREATE POLICY "categories_insert_owner" ON public.categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = categories.store_id 
      AND stores.owner_id = auth.uid()
    )
  );

-- Allow store owners to update categories for their stores
CREATE POLICY "categories_update_owner" ON public.categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = categories.store_id 
      AND stores.owner_id = auth.uid()
    )
  );

-- Allow store owners to delete categories for their stores
CREATE POLICY "categories_delete_owner" ON public.categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stores 
      WHERE stores.id = categories.store_id 
      AND stores.owner_id = auth.uid()
    )
  );
