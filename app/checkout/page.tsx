"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/hooks/useOrders";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  MapPin,
  User,
  Loader2,
} from "lucide-react";

type PaymentMethod = "pix" | "credit_card" | "debit_card" | "cash";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, storeId } = useCart();
  const { user, profile, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push("/carrinho");
    }
  }, [items, router, isSuccess]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/checkout");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await createOrder({
        store_id: storeId || items[0]?.product.storeId,
        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
        })),
        delivery_address: address,
        payment_method: paymentMethod,
      });

      clearCart();
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 rounded-full bg-green-500/20 p-6">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Pedido realizado com sucesso!
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Obrigado, <span className="font-semibold text-foreground">{fullName}</span>!
        </p>
        <p className="mt-1 text-muted-foreground">
          Seu pedido esta sendo preparado e chegara em breve.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/pedidos"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Ver Meus Pedidos
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-6 py-3 font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/carrinho"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </Link>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Finalizar Pedido
        </h1>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Info */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Informacoes de Entrega
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
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
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Endereco de Entrega
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, numero, bairro, cidade..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-secondary/50 py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Forma de Pagamento
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setPaymentMethod("pix")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                paymentMethod === "pix"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <QrCode
                className={`h-6 w-6 ${
                  paymentMethod === "pix"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === "pix"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                PIX
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("credit_card")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                paymentMethod === "credit_card"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <CreditCard
                className={`h-6 w-6 ${
                  paymentMethod === "credit_card"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === "credit_card"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Credito
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("debit_card")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                paymentMethod === "debit_card"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <CreditCard
                className={`h-6 w-6 ${
                  paymentMethod === "debit_card"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === "debit_card"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Debito
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                paymentMethod === "cash"
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <Banknote
                className={`h-6 w-6 ${
                  paymentMethod === "cash"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === "cash"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Dinheiro
              </span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Resumo do Pedido
          </h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Taxa de entrega</span>
              <span className="text-green-500">Gratis</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !fullName.trim() || !address.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Confirmar Pedido
            </>
          )}
        </button>
      </form>
    </div>
  );
}
