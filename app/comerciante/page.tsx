"use client";

import { useState } from "react";
import {
  Store,
  LogIn,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  BarChart3,
  Clock,
} from "lucide-react";

function MerchantLoginForm({
  onLogin,
}: {
  onLogin: (name: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email && password) {
      onLogin(email.split("@")[0]);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="glass rounded-2xl p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Painel do Comerciante
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse o painel de gerenciamento da sua loja
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="merchant-email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              E-mail do Comerciante
            </label>
            <input
              id="merchant-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="comerciante@loja.com"
              required
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label
              htmlFor="merchant-password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Senha
            </label>
            <input
              id="merchant-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
          >
            Acessar Painel
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Quer ser parceiro?{" "}
          <span className="cursor-pointer text-primary hover:underline">
            Cadastre sua loja
          </span>
        </p>
      </div>
    </div>
  );
}

function MerchantDashboard({ merchantName }: { merchantName: string }) {
  const stats = [
    {
      icon: DollarSign,
      label: "Faturamento Mensal",
      value: "R$ 12.450,00",
      change: "+18%",
    },
    {
      icon: Package,
      label: "Pedidos Hoje",
      value: "34",
      change: "+5%",
    },
    {
      icon: Users,
      label: "Clientes Ativos",
      value: "287",
      change: "+12%",
    },
    {
      icon: BarChart3,
      label: "Taxa de Conversao",
      value: "8.4%",
      change: "+2.1%",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-201",
      customer: "Lucas M.",
      items: 4,
      total: 89.6,
      status: "Preparando",
      time: "5 min atras",
    },
    {
      id: "ORD-202",
      customer: "Ana P.",
      items: 2,
      total: 35.98,
      status: "A caminho",
      time: "12 min atras",
    },
    {
      id: "ORD-203",
      customer: "Carlos S.",
      items: 6,
      total: 156.4,
      status: "Entregue",
      time: "28 min atras",
    },
    {
      id: "ORD-204",
      customer: "Julia R.",
      items: 1,
      total: 12.99,
      status: "Novo",
      time: "1 min atras",
    },
  ];

  const statusColor: Record<string, string> = {
    Novo: "bg-primary/15 text-primary",
    Preparando: "bg-[#fbbf24]/15 text-[#fbbf24]",
    "A caminho": "bg-[#00f5ff]/15 text-[#00f5ff]",
    Entregue: "bg-green-500/15 text-green-400",
  };

  const topProducts = [
    { name: "Heineken Long Neck", sold: 48, revenue: "R$ 335,52" },
    { name: "Johnnie Walker Black", sold: 12, revenue: "R$ 2.278,80" },
    { name: "Red Bull 250ml", sold: 36, revenue: "R$ 467,64" },
    { name: "Absolut Vodka 1L", sold: 18, revenue: "R$ 1.618,20" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-2xl font-bold text-primary">
          {merchantName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Ola, {merchantName}!
          </h1>
          <p className="text-muted-foreground">
            Painel da sua loja no iDrink.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00f5ff]/10">
                <stat.icon className="h-5 w-5 text-[#00f5ff]" />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-green-400">
                <TrendingUp className="h-3.5 w-3.5" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Pedidos Recentes
          </h2>
          <div className="flex flex-col gap-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="glass flex items-center justify-between rounded-2xl p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {order.customer}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items} itens - {order.id}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-lg px-2.5 py-0.5 text-xs font-medium ${
                        statusColor[order.status] ??
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold text-foreground">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {order.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Produtos Mais Vendidos
          </h2>
          <div className="glass overflow-hidden rounded-2xl">
            <div className="grid grid-cols-3 gap-4 border-b border-border/50 px-5 py-3 text-sm font-medium text-muted-foreground">
              <span>Produto</span>
              <span className="text-center">Vendas</span>
              <span className="text-right">Receita</span>
            </div>
            {topProducts.map((product, idx) => (
              <div
                key={product.name}
                className={`grid grid-cols-3 gap-4 px-5 py-4 ${
                  idx !== topProducts.length - 1
                    ? "border-b border-border/30"
                    : ""
                }`}
              >
                <span className="truncate font-medium text-foreground">
                  {product.name}
                </span>
                <span className="text-center text-muted-foreground">
                  {product.sold}
                </span>
                <span className="text-right font-medium text-[#00f5ff]">
                  {product.revenue}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComerciantePage() {
  const [merchantName, setMerchantName] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center gap-2">
        <Store className="h-5 w-5 text-primary" />
        <h1 className="text-sm font-medium text-muted-foreground">
          Painel do Comerciante
        </h1>
      </div>

      {merchantName ? (
        <MerchantDashboard merchantName={merchantName} />
      ) : (
        <MerchantLoginForm onLogin={setMerchantName} />
      )}
    </div>
  );
}
