"use client";

import Link from "next/link";
import Image from "next/image";
import { useOrders, type Order } from "@/hooks/useOrders";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Loader2,
  ChefHat,
  XCircle,
  PackageCheck,
} from "lucide-react";

const statusConfig: Record<
  Order["status"],
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
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
    icon: ChefHat,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  ready: {
    label: "Pronto",
    icon: PackageCheck,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
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
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
};

export default function OrdersPage() {
  const { orders, isLoading, isError } = useOrders();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center lg:px-8">
        <div className="mb-6 rounded-full bg-red-500/10 p-6">
          <XCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Erro ao carregar pedidos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Faca login para ver seus pedidos
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
        >
          Fazer Login
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

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
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
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
          const status = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <div
              key={order.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  {order.store?.logo_url && (
                    <div className="h-10 w-10 overflow-hidden rounded-lg">
                      <Image
                        src={order.store.logo_url}
                        alt={order.store.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {order.store?.name || "Loja"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
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
                  {order.items?.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(item.total_price)}
                      </span>
                    </div>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.items.length - 3} mais itens
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-medium text-muted-foreground">
                    Total
                  </span>
                  <span className="text-lg font-bold text-[#ea1d2c]">
                    {formatCurrency(order.total_amount)}
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
