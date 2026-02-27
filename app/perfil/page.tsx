"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  User,
  Store,
  LogOut,
  ShoppingCart,
  Package,
  Trash2,
  ChevronRight,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { clearCart, totalItems } = useCart();
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("idrink_user_name");
    const role = localStorage.getItem("idrink_user_role");
    if (!name || !role) {
      router.push("/onboarding");
      return;
    }
    setUserName(name);
    setUserRole(role);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("idrink_user_name");
    localStorage.removeItem("idrink_user_role");
    localStorage.removeItem("idrink_cart");
    localStorage.removeItem("idrink_orders");
    router.push("/onboarding");
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (!userName || !userRole) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 lg:px-8">
      {/* Profile Header */}
      <div className="glass mb-6 rounded-2xl p-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ea1d2c]/10">
          {userRole === "merchant" ? (
            <Store className="h-10 w-10 text-[#ea1d2c]" />
          ) : (
            <User className="h-10 w-10 text-[#ea1d2c]" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
        <p className="mt-1 text-muted-foreground">
          {userRole === "merchant" ? "Comerciante" : "Usuario"}
        </p>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        <Link
          href="/carrinho"
          className="glass flex items-center justify-between rounded-xl p-4 transition-all hover:border-[#ea1d2c]/30"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Meu Carrinho</p>
              <p className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <Link
          href="/pedidos"
          className="glass flex items-center justify-between rounded-xl p-4 transition-all hover:border-[#ea1d2c]/30"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Meus Pedidos</p>
              <p className="text-sm text-muted-foreground">
                Acompanhe suas entregas
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>

        <button
          onClick={handleClearCart}
          className="glass flex w-full items-center justify-between rounded-xl p-4 transition-all hover:border-destructive/30"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Limpar Carrinho</p>
              <p className="text-sm text-muted-foreground">
                Remover todos os itens
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="glass flex w-full items-center justify-between rounded-xl p-4 transition-all hover:border-destructive/30"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <LogOut className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Sair</p>
              <p className="text-sm text-muted-foreground">
                Encerrar sessao
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Merchant Section */}
      {userRole === "merchant" && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Area do Comerciante
          </h2>
          <div className="glass rounded-2xl p-6 text-center">
            <Store className="mx-auto mb-4 h-12 w-12 text-[#ea1d2c]" />
            <h3 className="text-lg font-semibold text-foreground">
              Painel do Comerciante
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Em breve voce podera gerenciar sua loja, produtos e pedidos por
              aqui.
            </p>
            <button
              disabled
              className="mt-4 w-full rounded-xl bg-muted py-3 text-sm font-medium text-muted-foreground"
            >
              Em breve
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
