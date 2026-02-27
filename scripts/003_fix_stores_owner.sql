-- =============================================================================
-- Fix stores table to allow demo stores without owner
-- =============================================================================

-- Make owner_id nullable for demo stores
ALTER TABLE public.stores ALTER COLUMN owner_id DROP NOT NULL;

-- Update the RLS policy to allow public viewing of demo stores (owner_id IS NULL)
DROP POLICY IF EXISTS "stores_select_public" ON public.stores;
CREATE POLICY "stores_select_public" ON public.stores 
  FOR SELECT USING (is_active = true);
