"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center lg:px-8">
        <div className="mb-6 rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Seu carrinho esta vazio</h1>
        <p className="mt-2 text-muted-foreground">
          Adicione produtos ao seu carrinho para continuar
        </p>
        <Link
          href="/home"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
        >
          Explorar Lojas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link
            href="/home"
            className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#ea1d2c]"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Seu Carrinho
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "itens"} no carrinho
          </p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Limpar
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="glass flex overflow-hidden rounded-2xl"
          >
            {/* Product Image Placeholder */}
            <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center bg-gradient-to-br from-muted to-secondary text-3xl font-bold text-muted-foreground/20 sm:h-32 sm:w-32">
              {item.product.name.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <h3 className="font-semibold text-foreground line-clamp-1">
                  {item.product.name}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                  {item.product.description}
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-[#ea1d2c]">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/80"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/80"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remover item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground">Resumo do Pedido</h2>
        
        <div className="mt-4 space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Taxa de entrega</span>
            <span className="text-green-500">Gratis</span>
          </div>
          <div className="border-t border-border/50 pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-[#ea1d2c]">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
        >
          Finalizar Pedido
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
