"use client";

import { Plus, Check } from "lucide-react";
import type { Product } from "@/data/products";
import { formatCurrency } from "@/utils/formatCurrency";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="glass group flex overflow-hidden rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(234,29,44,0.15)]">
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
          <span className="text-lg font-bold text-[#ea1d2c]">
            {formatCurrency(product.price)}
          </span>
          <button
            onClick={handleAddToCart}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 ${
              added
                ? "bg-green-500 text-white"
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
