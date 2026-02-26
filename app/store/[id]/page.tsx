import { notFound } from "next/navigation";
import { getStoreById } from "@/data/stores";
import { getProductsByStore, getProductCategories } from "@/data/products";
import { StoreHeader } from "./store-header";
import { StoreProducts } from "./store-products";

interface StorePageProps {
  params: Promise<{ id: string }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { id } = await params;
  const store = getStoreById(id);

  if (!store) {
    notFound();
  }

  const products = getProductsByStore(store.id);
  const categories = getProductCategories(store.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <StoreHeader store={store} />
      <StoreProducts products={products} categories={categories} />
    </div>
  );
}
