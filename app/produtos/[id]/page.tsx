import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { products as staticProducts } from "@/data/products";
import ProdutoView from "./Produto-view";

export const revalidate = 60;
export const dynamicParams = true;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  stock_quantity: number | null;
  store_id: string;
  category_id: string | null;
}

interface DbStore {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
}

interface DbCategory {
  id: string;
  name: string;
}

// Generate static params for existing products
// export async function generateStaticParams() {
//   // First, add static products
//   const staticParams = staticProducts.map((product) => ({
//     id: product.id,
//   }));

//   // Then try to fetch products from database
//   try {
//     const supabase = await createClient();
//     const { data: dbProducts } = await supabase
//       .from("products")
//       .select("id")
//       .eq("is_available", true)
//       .limit(100);

//     if (dbProducts) {
//       const dbParams = dbProducts.map((p: { id: string }) => ({
//         id: p.id,
//       }));
//       return [...staticParams, ...dbParams];
//     }
//   } catch (error) {
//     console.error("Error fetching products for static generation:", error);
//   }

//   return staticParams;
// }

async function getProduct(id: string) {
  // First check static products
  const staticProduct = staticProducts.find((p) => p.id === id);
  if (staticProduct) {
    return {
      id: staticProduct.id,
      name: staticProduct.name,
      description: staticProduct.description,
      price: staticProduct.price,
      originalPrice: null,
      image: staticProduct.image,
      isAvailable: true,
      isFeatured: false,
      stockQuantity: staticProduct.stock,
      storeName: staticProduct.storeId,
      storeSlug: staticProduct.storeId,
      storeLogo: null,
      category: staticProduct.category,
      source: "static" as const,
    };
  }
  // If not found in static, fetch from database
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      original_price,
      image_url,
      is_available,
      is_featured,
      stock_quantity,
      store_id,
      category_id
    `,
    )
    .eq("id", id)
    .single();

  if (error || !product) {
    return null;
  }

  const dbProduct = product as DbProduct;

  // Fetch store info
  const { data: store } = await supabase
    .from("stores")
    .select("id, name, slug, logo_url, is_active")
    .eq("id", dbProduct.store_id)
    .single();

  const dbStore = store as DbStore | null;

  // Fetch category info if exists
  let categoryName = "Outros";
  if (dbProduct.category_id) {
    const { data: category } = await supabase
      .from("categories")
      .select("id, name")
      .eq("id", dbProduct.category_id)
      .single();

    if (category) {
      categoryName = (category as DbCategory).name;
    }
  }

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || "",
    price: dbProduct.price,
    originalPrice: dbProduct.original_price,
    image: dbProduct.image_url || "/placeholder.svg?height=400&width=400",
    isAvailable: dbProduct.is_available,
    isFeatured: dbProduct.is_featured,
    stockQuantity: dbProduct.stock_quantity,
    storeName: dbStore?.name || "Loja",
    storeSlug: dbStore?.slug || dbProduct.store_id,
    storeLogo: dbStore?.logo_url,
    category: categoryName,
    source: "database" as const,
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Produto não encontrado | I Drink",
      description: "O produto que você está procurando não foi encontrado.",
    };
  }

  return {
    title: `${product.name} | I Drink`,
    description: product.description || `Compre ${product.name} no I Drink`,
    openGraph: {
      title: product.name,
      description: product.description || `Compre ${product.name} no I Drink`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProdutoView product={product} />;
}
