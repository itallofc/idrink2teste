"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  User as UserIcon,
  Store,
  LogOut,
  ShoppingCart,
  Package,
  Trash2,
  ChevronRight,
  LogIn,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";

function LoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Check user role
        const role = data.user.user_metadata?.role;
        
        // Save to localStorage as backup
        localStorage.setItem("idrink_user_name", data.user.user_metadata?.full_name || email.split("@")[0]);
        localStorage.setItem("idrink_user_role", role || "user");

        if (role === "merchant") {
          router.push("/comerciante");
        } else {
          onLoginSuccess();
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ea1d2c]/10">
            <LogIn className="h-8 w-8 text-[#ea1d2c]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Entrar no I Drink
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 red-glow"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                Entrar
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 border-t border-border/50 pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Nao tem uma conta?
          </p>
          <Link
            href="/onboarding"
            className="flex items-center justify-center gap-2 rounded-xl border border-border/50 bg-secondary/50 py-3 font-medium text-foreground transition-all hover:bg-secondary"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProfileContent({ user, userName, userRole }: { user: User | null; userName: string; userRole: string }) {
  const router = useRouter();
  const { clearCart, totalItems } = useCart();

  const handleLogout = async () => {
    if (user) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    localStorage.removeItem("idrink_user_name");
    localStorage.removeItem("idrink_user_role");
    localStorage.removeItem("idrink_cart");
    localStorage.removeItem("idrink_orders");
    router.push("/onboarding");
  };

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 lg:px-8">
      {/* Profile Header */}
      <div className="glass mb-6 rounded-2xl p-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ea1d2c]/10">
          {userRole === "merchant" ? (
            <Store className="h-10 w-10 text-[#ea1d2c]" />
          ) : (
            <UserIcon className="h-10 w-10 text-[#ea1d2c]" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
        <p className="mt-1 text-muted-foreground">
          {userRole === "merchant" ? "Comerciante" : "Usuario"}
        </p>
        {user && (
          <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
        )}
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
          <Link
            href="/comerciante"
            className="glass block rounded-2xl p-6 text-center transition-all hover:border-[#ea1d2c]/30"
          >
            <Store className="mx-auto mb-4 h-12 w-12 text-[#ea1d2c]" />
            <h3 className="text-lg font-semibold text-foreground">
              Painel do Comerciante
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Gerencie sua loja, produtos e pedidos.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Acessar Painel
              <ChevronRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser(authUser);
        setUserName(authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Usuario");
        setUserRole(authUser.user_metadata?.role || "user");
        setIsAuthenticated(true);
      } else {
        // Check localStorage for legacy users
        const name = localStorage.getItem("idrink_user_name");
        const role = localStorage.getItem("idrink_user_role");
        
        if (name && role) {
          setUserName(name);
          setUserRole(role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    // Refresh the page to get updated auth state
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <ProfileContent
      user={user}
      userName={userName || "Usuario"}
      userRole={userRole || "user"}
    />
  );
}
