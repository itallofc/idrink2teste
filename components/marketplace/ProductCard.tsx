"use client";

import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/utils/formatCurrency";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="glass group flex overflow-hidden rounded-2xl transition-all hover:neon-glow">
      {/* Image placeholder */}
      <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center bg-gradient-to-br from-muted to-secondary text-3xl font-bold text-muted-foreground/20 sm:h-32 sm:w-32">
        {product.name.charAt(0)}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h4 className="font-semibold text-foreground line-clamp-1">
            {product.name}
          </h4>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
            {product.description}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-[#00f5ff]">
            {formatCurrency(product.price)}
          </span>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95"
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
