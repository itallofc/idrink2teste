"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
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

type PaymentMethod = "pix" | "card" | "cash";

interface Address {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  complement: string | null;
  is_default: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile, guestName } = useAuth();
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Set user name from profile or guest name
    const name = profile?.full_name || user?.user_metadata?.full_name || guestName;
    if (name) {
      setUserName(name);
      setFullName(name);
    }

    // Load saved addresses if user is logged in
    if (user) {
      loadAddresses();
    }
  }, [user, profile, guestName]);

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      router.push("/carrinho");
    }
  }, [items, router, isSuccess]);

  const loadAddresses = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    if (data) {
      setSavedAddresses(data);
      const defaultAddress = data.find(a => a.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setAddress(formatAddress(defaultAddress));
      }
    }
  };

  const formatAddress = (addr: Address) => {
    return `${addr.street}, ${addr.number}${addr.complement ? ` - ${addr.complement}` : ""}, ${addr.neighborhood}, ${addr.city} - ${addr.state}, ${addr.zip_code}`;
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selected = savedAddresses.find(a => a.id === addressId);
    if (selected) {
      setAddress(formatAddress(selected));
    }
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim()) return;

    setIsSubmitting(true);

    try {
      const newOrderNumber = generateOrderNumber();
      
      // Get store ID from first item (assuming all items are from same store)
      // In a real app, you'd handle multi-store orders differently
      const storeId = items[0]?.product.storeId;

      // Calculate totals
      const subtotal = totalPrice;
      const deliveryFee = 0; // Free delivery for now
      const total = subtotal + deliveryFee;

      // Create order in database if user is logged in
      if (user) {
        // First, try to find the store in the database
        let dbStoreId = null;
        if (storeId) {
          const { data: storeData } = await supabase
            .from("stores")
            .select("id")
            .eq("slug", storeId)
            .single();
          
          if (storeData) {
            dbStoreId = storeData.id;
          }
        }

        // Create the order
        const orderData = {
          customer_id: user.id,
          store_id: dbStoreId,
          order_number: newOrderNumber,
          status: "pending",
          payment_method: paymentMethod,
          payment_status: "pending",
          subtotal,
          delivery_fee: deliveryFee,
          discount: 0,
          total,
          delivery_address: {
            full_name: fullName,
            address: address,
            address_id: selectedAddressId,
          },
          notes: null,
        };

        const { data: orderResult, error: orderError } = await supabase
          .from("orders")
          .insert(orderData)
          .select()
          .single();

        if (orderError) {
          console.error("Error creating order:", orderError);
          // Fall back to localStorage
        } else if (orderResult) {
          // Create order items
          const orderItems = items.map(item => ({
            order_id: orderResult.id,
            product_id: null, // Would need to map to actual product IDs
            product_name: item.product.name,
            product_price: item.product.price,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
            notes: null,
          }));

          await supabase
            .from("order_items")
            .insert(orderItems);
        }
      }

      // Also save to localStorage as backup/for non-logged-in users
      const order = {
        id: newOrderNumber,
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

      if (typeof window !== "undefined") {
        try {
          const existingOrders = JSON.parse(
            localStorage.getItem("idrink_orders") || "[]"
          );
          localStorage.setItem(
            "idrink_orders",
            JSON.stringify([order, ...existingOrders])
          );
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }

      setOrderNumber(newOrderNumber);
      clearCart();
      setIsSuccess(true);
    } catch (error) {
      console.error("Error processing order:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          Seu pedido <span className="font-medium text-primary">{orderNumber}</span> esta sendo preparado.
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

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Enderecos Salvos
                </label>
                <div className="space-y-2">
                  {savedAddresses.map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => handleSelectAddress(addr.id)}
                      className={`w-full rounded-xl border p-3 text-left text-sm transition-all ${
                        selectedAddressId === addr.id
                          ? "border-[#ea1d2c] bg-[#ea1d2c]/10"
                          : "border-border/50 hover:border-[#ea1d2c]/30"
                      }`}
                    >
                      <p className="font-medium text-foreground">
                        {addr.street}, {addr.number}
                        {addr.is_default && (
                          <span className="ml-2 text-xs text-[#ea1d2c]">(Padrao)</span>
                        )}
                      </p>
                      <p className="text-muted-foreground">
                        {addr.neighborhood}, {addr.city} - {addr.state}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setSelectedAddressId(null);
                  }}
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
