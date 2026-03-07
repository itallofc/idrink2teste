"use client";

import { AddToCartButton } from "./add-to-cart-button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Store, Tag, Package } from "lucide-react";

export default function ProdutoView({ product }: { product: any }) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
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
              <p className="mb-6 text-muted-foreground">
                {product.description}
              </p>
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
                <p className="font-medium text-foreground">
                  {product.storeName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ver todos os produtos
                </p>
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
