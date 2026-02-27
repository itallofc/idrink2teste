"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle2,
  MapPin,
  User,
} from "lucide-react";

type PaymentMethod = "pix" | "card" | "cash";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("idrink_user_name");
    if (storedName) {
      setUserName(storedName);
      setFullName(storedName);
    }
  }, []);

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push("/carrinho");
    }
  }, [items, router, isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim()) return;

    setIsSubmitting(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save order to localStorage
    const order = {
      id: `ORD-${Date.now()}`,
      items: items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: totalPrice,
      address,
      paymentMethod,
      status: "preparing",
      createdAt: new Date().toISOString(),
    };

    const existingOrders = JSON.parse(
      localStorage.getItem("idrink_orders") || "[]"
    );
    localStorage.setItem(
      "idrink_orders",
      JSON.stringify([order, ...existingOrders])
    );

    clearCart();
    setIsSuccess(true);
    setIsSubmitting(false);
  };

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
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
          >
            Ver Meus Pedidos
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/50 px-6 py-3 font-medium text-muted-foreground transition-all hover:border-[#ea1d2c]/30 hover:text-[#ea1d2c]"
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
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#ea1d2c]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao carrinho
        </Link>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Finalizar Pedido
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Info */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-[#ea1d2c]/10 p-2">
              <MapPin className="h-5 w-5 text-[#ea1d2c]" />
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
                  className="w-full rounded-xl border border-border/50 bg-secondary/50 py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-[#ea1d2c]/50 focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/20"
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
                  className="w-full resize-none rounded-xl border border-border/50 bg-secondary/50 py-3 pl-11 pr-4 text-foreground placeholder:text-muted-foreground focus:border-[#ea1d2c]/50 focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/20"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-[#ea1d2c]/10 p-2">
              <CreditCard className="h-5 w-5 text-[#ea1d2c]" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">
              Forma de Pagamento
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("pix")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                paymentMethod === "pix"
                  ? "border-[#ea1d2c] bg-[#ea1d2c]/10"
                  : "border-border/50 hover:border-[#ea1d2c]/30"
              }`}
            >
              <QrCode
                className={`h-6 w-6 ${
                  paymentMethod === "pix"
                    ? "text-[#ea1d2c]"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === "pix"
                    ? "text-[#ea1d2c]"
                    : "text-muted-foreground"
                }`}
              >
                PIX
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                paymentMethod === "card"
                  ? "border-[#ea1d2c] bg-[#ea1d2c]/10"
                  : "border-border/50 hover:border-[#ea1d2c]/30"
              }`}
            >
              <CreditCard
                className={`h-6 w-6 ${
                  paymentMethod === "card"
                    ? "text-[#ea1d2c]"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === "card"
                    ? "text-[#ea1d2c]"
                    : "text-muted-foreground"
                }`}
              >
                Cartao
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                paymentMethod === "cash"
                  ? "border-[#ea1d2c] bg-[#ea1d2c]/10"
                  : "border-border/50 hover:border-[#ea1d2c]/30"
              }`}
            >
              <Banknote
                className={`h-6 w-6 ${
                  paymentMethod === "cash"
                    ? "text-[#ea1d2c]"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  paymentMethod === "cash"
                    ? "text-[#ea1d2c]"
                    : "text-muted-foreground"
                }`}
              >
                Dinheiro
              </span>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass rounded-2xl p-6">
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

          <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
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
              <span className="text-[#ea1d2c]">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !fullName.trim() || !address.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 red-glow"
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
