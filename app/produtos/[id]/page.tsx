import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Store, Tag, ShoppingCart, Package } from "lucide-react";
import { products as staticProducts } from "@/data/products";
import { AddToCartButton } from "./add-to-cart-button";

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
export async function generateStaticParams() {
  // First, add static products
  const staticParams = staticProducts.map((product) => ({
    id: product.id,
  }));

  // Then try to fetch products from database
  try {
    const supabase = await createClient();
    const { data: dbProducts } = await supabase
      .from("products")
      .select("id")
      .eq("is_available", true)
      .limit(100);

    if (dbProducts) {
      const dbParams = dbProducts.map((p: { id: string }) => ({
        id: p.id,
      }));
      return [...staticParams, ...dbParams];
    }
  } catch (error) {
    console.error("Error fetching products for static generation:", error);
  }

  return staticParams;
}

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
    .select(`
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
    `)
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

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Back button */}
        <Link
          href={`/store/${product.storeSlug}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para {product.storeName}
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {product.isFeatured && (
              <div className="absolute left-3 top-3 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Destaque
              </div>
            )}
            {hasDiscount && (
              <div className="absolute right-3 top-3 rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                -{discountPercent}%
              </div>
            )}
            {!product.isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <span className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white">
                  Indisponível
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-4 w-4" />
              {product.category}
            </div>

            {/* Name */}
            <h1 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  R$ {product.originalPrice!.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mb-6 text-muted-foreground">{product.description}</p>
            )}

            {/* Store info */}
            <Link
              href={`/store/${product.storeSlug}`}
              className="mb-6 flex items-center gap-3 rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted"
            >
              {product.storeLogo ? (
                <Image
                  src={product.storeLogo}
                  alt={product.storeName}
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium text-foreground">{product.storeName}</p>
                <p className="text-sm text-muted-foreground">Ver todos os produtos</p>
              </div>
            </Link>

            {/* Stock info */}
            {product.stockQuantity !== null && product.stockQuantity > 0 && (
              <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                {product.stockQuantity} em estoque
              </div>
            )}

            {/* Add to cart button */}
            <AddToCartButton
              product={{
                id: product.id,
                storeId: product.storeSlug,
                name: product.name,
                description: product.description,
                price: product.price,
                image: product.image,
                category: product.category,
              }}
              disabled={!product.isAvailable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
