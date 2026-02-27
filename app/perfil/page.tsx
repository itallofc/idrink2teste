"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Store,
  LogOut,
  ShoppingCart,
  Package,
  Trash2,
  ChevronRight,
  Save,
  Loader2,
  Check,
  Phone,
  Mail,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const { clearCart, totalItems } = useCart();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/perfil");
    }
  }, [loading, user, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (!error) {
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleSignOut = async () => {
    clearCart();
    await signOut();
    router.push("/");
  };

  const handleClearCart = () => {
    clearCart();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isMerchant = profile?.role === "merchant";

  return (
    <div className="mx-auto max-w-lg px-4 py-8 lg:px-8">
      {/* Profile Header */}
      <div className="mb-6 rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          {isMerchant ? (
            <Store className="h-10 w-10 text-primary" />
          ) : (
            <User className="h-10 w-10 text-primary" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {profile?.full_name || "Usuario"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">
          {isMerchant ? "Comerciante" : "Cliente"}
        </span>
      </div>

      {/* Edit Profile Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="mb-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Editar Perfil
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-foreground">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 rounded-xl border border-border py-3 font-medium text-muted-foreground transition-all hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : saved ? (
                <>
                  <Check className="h-5 w-5" />
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="mb-6 flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Editar Perfil</p>
              <p className="text-sm text-muted-foreground">
                Alterar nome e telefone
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      )}

      {/* Menu Items */}
      <div className="space-y-3">
        <Link
          href="/carrinho"
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
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
          className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
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
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-destructive/30"
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
          onClick={handleSignOut}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-destructive/30"
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
      {isMerchant && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Area do Comerciante
          </h2>
          <Link
            href="/dashboard"
            className="block rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30"
          >
            <Store className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Painel do Comerciante
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Gerencie sua loja, produtos e pedidos
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
              Acessar painel
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
