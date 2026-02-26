"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  address: string;
  paymentMethod: string;
  status: "preparing" | "delivering" | "delivered";
  createdAt: string;
}

const statusConfig = {
  preparing: {
    label: "Em preparo",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  delivering: {
    label: "A caminho",
    icon: Truck,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  delivered: {
    label: "Entregue",
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("idrink_orders");
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders);
        // Simulate order status changes for demo
        const updatedOrders = parsed.map((order: Order, index: number) => {
          if (index === 0) return { ...order, status: "preparing" };
          if (index === 1) return { ...order, status: "delivering" };
          return { ...order, status: "delivered" };
        });
        setOrders(updatedOrders);
      } catch (e) {
        console.error("Failed to parse orders", e);
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center lg:px-8">
        <div className="mb-6 rounded-full bg-muted p-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Nenhum pedido ainda
        </h1>
        <p className="mt-2 text-muted-foreground">
          Seus pedidos aparecerão aqui depois que você fizer sua primeira compra
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
        {orders.map((order) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;

          return (
            <div key={order.id} className="glass overflow-hidden rounded-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground/60">
                    {formatDate(order.createdAt)}
                  </p>
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
