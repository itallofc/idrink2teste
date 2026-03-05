"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const existingItem = items.find((item) => item.product.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        ...product,
        stock: 999, // Default stock for products
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleGoToCart = () => {
    router.push("/carrinho");
  };

  if (disabled) {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-muted py-4 font-semibold text-muted-foreground"
      >
        <ShoppingCart className="h-5 w-5" />
        Produto indisponível
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
        <span className="font-medium text-foreground">Quantidade</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-foreground transition-colors hover:bg-muted"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-background text-foreground transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-primary-foreground transition-all ${
          added
            ? "bg-green-500"
            : "bg-primary hover:opacity-90 red-glow"
        }`}
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            Adicionado ao carrinho!
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            Adicionar R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
          </>
        )}
      </button>

      {/* Go to cart if has items */}
      {existingItem && !added && (
        <button
          onClick={handleGoToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-transparent py-4 font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Ver carrinho ({existingItem.quantity} {existingItem.quantity === 1 ? "item" : "itens"})
        </button>
      )}
    </div>
  );
}
