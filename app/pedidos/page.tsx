"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Loader2,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  product_price: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  payment_method: string;
  delivery_address: {
    full_name?: string;
    address?: string;
  } | null;
  order_items?: OrderItem[];
  stores?: {
    name: string;
  } | null;
}

interface LocalOrder {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  address: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  preparing: {
    label: "Em preparo",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  delivering: {
    label: "A caminho",
    icon: Truck,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  delivered: {
    label: "Entregue",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [localOrders, setLocalOrders] = useState<LocalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadOrders();
  }, [user, authLoading]);

  const loadOrders = async () => {
    setIsLoading(true);

    // Load from localStorage for all users (safely)
    if (typeof window !== "undefined") {
      try {
        const storedOrders = localStorage.getItem("idrink_orders");
        if (storedOrders) {
          const parsed = JSON.parse(storedOrders);
          setLocalOrders(parsed);
        }
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }

    // If user is logged in, also load from database
    if (user) {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*),
          stores:store_id (name)
        `)
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (data && !error) {
        setOrders(data);
      }
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Merge and deduplicate orders
  const allOrders = [
    ...orders.map(o => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      total: o.total,
      createdAt: o.created_at,
      items: o.order_items?.map(i => ({
        name: i.product_name,
        quantity: i.quantity,
        price: i.product_price,
      })) || [],
      storeName: o.stores?.name,
      source: "database" as const,
    })),
    ...localOrders
      .filter(lo => !orders.some(o => o.order_number === lo.id))
      .map(lo => ({
        id: lo.id,
        orderNumber: lo.id,
        status: lo.status,
        total: lo.total,
        createdAt: lo.createdAt,
        items: lo.items,
        storeName: undefined,
        source: "local" as const,
      })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (allOrders.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center lg:px-8">
        <div className="mb-6 rounded-full bg-muted p-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Nenhum pedido ainda
        </h1>
        <p className="mt-2 text-muted-foreground">
          Seus pedidos aparecerao aqui depois que voce fizer sua primeira compra
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Meus Pedidos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Acompanhe o status dos seus pedidos
        </p>
      </div>

      <div className="space-y-4">
        {allOrders.map((order) => {
          const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <div key={order.id} className="glass overflow-hidden rounded-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                <div>
                  <p className="font-medium text-foreground">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                  {order.storeName && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.storeName}
                    </p>
                  )}
                </div>
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 ${status.bgColor}`}
                >
                  <StatusIcon className={`h-4 w-4 ${status.color}`} />
                  <span className={`text-sm font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-4">
                <div className="space-y-2">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.items.length - 3} mais itens
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                  <span className="font-medium text-muted-foreground">
                    Total
                  </span>
                  <span className="text-lg font-bold text-[#ea1d2c]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
