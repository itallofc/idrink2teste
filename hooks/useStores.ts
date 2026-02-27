"use client";

import useSWR from "swr";

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  tagline: string | null;
  banner_url: string | null;
  logo_url: string | null;
  phone: string | null;
  address: string | null;
  city: string;
  state: string;
  delivery_fee: number;
  min_order: number;
  delivery_time: string;
  rating: number;
  total_reviews: number;
  is_active: boolean;
  is_open: boolean;
  owner_id: string | null;
  created_at: string;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  store_id: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category_id: string | null;
  store_id: string;
  is_available: boolean;
  is_featured: boolean;
  stock: number;
  created_at: string;
  category?: Category;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStores() {
  const { data, error, isLoading, mutate } = useSWR<Store[]>(
    "/api/stores",
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    stores: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useStore(slug: string) {
  const { data, error, isLoading, mutate } = useSWR<{
    store: Store;
    categories: Category[];
    products: Product[];
  }>(slug ? `/api/stores/${slug}` : null, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    store: data?.store,
    categories: data?.categories || [],
    products: data?.products || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useStoreProducts(slug: string, categoryId?: string) {
  const url = categoryId
    ? `/api/stores/${slug}/products?category_id=${categoryId}`
    : `/api/stores/${slug}/products`;

  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    slug ? url : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    products: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

// Helper to get all unique categories from stores
export function getAllCategories(stores: Store[]): string[] {
  const categoriesSet = new Set<string>();
  stores.forEach((store) => {
    store.categories?.forEach((cat) => {
      categoriesSet.add(cat.name);
    });
  });
  return Array.from(categoriesSet);
}
