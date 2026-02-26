"use client";

import { useState } from "react";
import {
  User,
  ShoppingBag,
  MapPin,
  CreditCard,
  LogIn,
  Package,
  Clock,
} from "lucide-react";

function LoginForm({
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
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00f5ff]/10">
            <LogIn className="h-8 w-8 text-[#00f5ff]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Entrar</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse sua conta iDrink
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/30"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/30"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Nao tem conta?{" "}
          <span className="cursor-pointer text-[#00f5ff] hover:underline">
            Cadastre-se
          </span>
        </p>
      </div>
    </div>
  );
}

function UserDashboard({ userName }: { userName: string }) {
  const mockOrders = [
    {
      id: "ORD-001",
      store: "Adega do Moco",
      items: 3,
      total: 289.7,
      status: "Entregue",
      date: "15/02/2026",
    },
    {
      id: "ORD-002",
      store: "Distribuidora Popular",
      items: 5,
      total: 45.94,
      status: "A caminho",
      date: "25/02/2026",
    },
    {
      id: "ORD-003",
      store: "Bebidas ON",
      items: 2,
      total: 16.48,
      status: "Preparando",
      date: "26/02/2026",
    },
  ];

  const statusColor: Record<string, string> = {
    Entregue: "bg-green-500/15 text-green-400",
    "A caminho": "bg-[#00f5ff]/15 text-[#00f5ff]",
    Preparando: "bg-[#fbbf24]/15 text-[#fbbf24]",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00f5ff]/10 text-2xl font-bold text-[#00f5ff]">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Ola, {userName}!
          </h1>
          <p className="text-muted-foreground">Bem-vindo de volta ao iDrink.</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: ShoppingBag, label: "Pedidos", value: "3" },
          { icon: MapPin, label: "Enderecos", value: "1" },
          { icon: CreditCard, label: "Formas de Pagamento", value: "2" },
        ].map((stat) => (
          <div key={stat.label} className="glass flex items-center gap-4 rounded-2xl p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00f5ff]/10">
              <stat.icon className="h-5 w-5 text-[#00f5ff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="mb-4 text-xl font-bold text-foreground">
        Pedidos Recentes
      </h2>
      <div className="flex flex-col gap-3">
        {mockOrders.map((order) => (
          <div
            key={order.id}
            className="glass flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{order.store}</p>
                <p className="text-sm text-muted-foreground">
                  {order.items} itens - {order.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {order.date}
              </div>
              <span
                className={`rounded-lg px-3 py-1 text-xs font-medium ${
                  statusColor[order.status] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {order.status}
              </span>
              <span className="font-semibold text-foreground">
                R$ {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UsuarioPage() {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <div className="mb-8 flex items-center gap-2">
        <User className="h-5 w-5 text-[#00f5ff]" />
        <h1 className="text-sm font-medium text-muted-foreground">
          Minha Conta
        </h1>
      </div>

      {userName ? (
        <UserDashboard userName={userName} />
      ) : (
        <LoginForm onLogin={setUserName} />
      )}
    </div>
  );
}
