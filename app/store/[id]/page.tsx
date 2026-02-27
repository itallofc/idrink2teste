"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useStore } from "@/hooks/useStores";
import { StoreHeader } from "./store-header";
import { StoreProducts } from "./store-products";
import { Loader2 } from "lucide-react";

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export default function StorePage({ params }: StorePageProps) {
  const { id } = use(params);
  const { store, categories, products, isLoading, isError } = useStore(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !store) {
    notFound();
  }

  // Transform store for header component
  const storeForHeader = {
    id: store.slug,
    name: store.name,
    tagline: store.tagline || "",
    rating: store.rating,
    deliveryTime: store.delivery_time,
    categories: categories.map((c) => c.name),
    banner: store.banner_url || "/banners/default-banner.png",
    logo: store.logo_url || "/logos/default-logo.jpeg",
    description: store.description || "",
  };

  // Transform products for products component
  const productsForDisplay = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description || "",
    price: p.price,
    storeId: p.store_id,
    category: p.category?.name || "Outros",
  }));

  const categoryNames = categories.map((c) => c.name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <StoreHeader store={storeForHeader} />
      <StoreProducts products={productsForDisplay} categories={categoryNames} />
    </div>
  );
}
