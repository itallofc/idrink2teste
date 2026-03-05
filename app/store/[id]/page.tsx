"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getStoreById } from "@/data/stores";
import { getProductsByStore, getProductCategories } from "@/data/products";
import { StoreHeader } from "./store-header";
import { StoreProducts } from "./store-products";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import type { Store } from "@/data/stores";
import type { Product } from "@/data/products";

interface DbStore {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_open: boolean;
  is_active: boolean;
  rating: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
}

interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
}

export default function StorePage() {
  const params = useParams();
  const id = params.id as string;
  
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadStoreData() {
      setIsLoading(true);
      
      // First try to find in static data
      const staticStore = getStoreById(id);
      
      if (staticStore) {
        setStore(staticStore);
        setProducts(getProductsByStore(id));
        setCategories(getProductCategories(id));
        setIsLoading(false);
        return;
      }
      
      // If not found in static, try database
      try {
        const { data: dbStore, error: storeError } = await supabase
          .from("stores")
          .select("*")
          .eq("slug", id)
          .eq("is_active", true)
          .single();
        
        if (storeError || !dbStore) {
          setNotFoundState(true);
          setIsLoading(false);
          return;
        }
        
        // Map DB store to frontend Store type
        const mappedStore: Store = {
          id: dbStore.slug,
          name: dbStore.name,
          tagline: dbStore.tagline || "Loja no I Drink",
          rating: dbStore.rating || 4.5,
          deliveryTime: dbStore.delivery_time_min && dbStore.delivery_time_max
            ? `${dbStore.delivery_time_min}-${dbStore.delivery_time_max} min`
            : "30-60 min",
          categories: [],
          banner: dbStore.banner_url || "/banners/default-banner.png",
          logo: dbStore.logo_url || "/logos/default-logo.png",
          description: dbStore.description || "Loja cadastrada no I Drink",
        };
        
        setStore(mappedStore);
        
        // Load products from database
        const { data: dbProducts } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", dbStore.id)
          .eq("is_available", true)
          .order("name");
        
        if (dbProducts && dbProducts.length > 0) {
          const mappedProducts: Product[] = dbProducts.map((p: DbProduct) => ({
            id: p.id,
            storeId: id,
            name: p.name,
            description: p.description || "",
            price: p.price,
            image: p.image_url || "/placeholder.svg?height=200&width=200",
            category: p.category || "Outros",
          }));
          
          setProducts(mappedProducts);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(mappedProducts.map(p => p.category))];
          setCategories(uniqueCategories);
        } else {
          setProducts([]);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error loading store:", error);
        setNotFoundState(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadStoreData();
  }, [id, supabase]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFoundState || !store) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <StoreHeader store={store} />
      <StoreProducts products={products} categories={categories} />
    </div>
  );
}
