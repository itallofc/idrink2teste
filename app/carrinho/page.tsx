"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/utils/formatCurrency";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  LogIn,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
} from "lucide-react";

function LoginPrompt({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { signIn, signUp, setGuestUser } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email.trim()) {
      setError("Por favor, informe seu email");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Por favor, informe sua senha");
      setIsLoading(false);
      return;
    }

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      onClose();
      router.push("/checkout");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Invalid login credentials")) {
          setError("Email ou senha incorretos");
        } else if (err.message.includes("Email not confirmed")) {
          setError("Por favor, confirme seu email antes de fazer login.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro ao fazer login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!name.trim()) {
      setError("Por favor, informe seu nome");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Por favor, informe seu email");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await signUp(email, password, {
        full_name: name,
        role: "user",
      });

      if (signUpError) throw signUpError;

      setSuccessMessage("Conta criada! Verifique seu email para confirmar o cadastro.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("already registered")) {
          setError("Este email ja esta cadastrado");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro ao criar conta.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    if (!name.trim()) {
      setError("Por favor, informe seu nome para continuar");
      return;
    }
    setGuestUser(name.trim(), "user");
    onClose();
    router.push("/checkout");
  };

  if (successMessage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <div className="glass w-full max-w-md rounded-2xl p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <UserPlus className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Cadastro Realizado!</h2>
            <p className="mt-2 text-muted-foreground">{successMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage(null);
                setMode("login");
              }}
              className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
            >
              Fazer Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="glass w-full max-w-md rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ea1d2c]/10">
            <LogIn className="h-8 w-8 text-[#ea1d2c]" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {mode === "login" ? "Entre para continuar" : "Criar conta"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" 
              ? "Faca login para finalizar seu pedido" 
              : "Cadastre-se para acompanhar seus pedidos"}
          </p>
        </div>

        <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="flex flex-col gap-4">
          {mode === "register" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "login" ? "Sua senha" : "Crie uma senha"}
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
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {mode === "login" ? "Entrando..." : "Cadastrando..."}
              </>
            ) : (
              <>
                {mode === "login" ? "Entrar" : "Criar conta"}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-3 border-t border-border/50 pt-6">
          {mode === "login" ? (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Nao tem uma conta?
              </p>
              <button
                onClick={() => setMode("register")}
                className="rounded-xl border border-border/50 bg-secondary/50 py-3 font-medium text-foreground transition-all hover:bg-secondary"
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              <p className="text-center text-sm text-muted-foreground">
                Ja tem uma conta?
              </p>
              <button
                onClick={() => setMode("login")}
                className="rounded-xl border border-border/50 bg-secondary/50 py-3 font-medium text-foreground transition-all hover:bg-secondary"
              >
                Fazer login
              </button>
            </>
          )}

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="mb-2 w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
            />
            <button
              onClick={handleContinueAsGuest}
              className="w-full rounded-xl border border-border/50 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground"
            >
              Continuar sem cadastro
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, increaseQuantity, decreaseQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { user, guestName, isLoading } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const isAuthenticated = !!user || !!guestName;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center lg:px-8">
        <div className="mb-6 rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Seu carrinho esta vazio</h1>
        <p className="mt-2 text-muted-foreground">
          Adicione produtos ao seu carrinho para continuar
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
    <>
      {showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}

      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/home"
              className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#ea1d2c]"
            >
              <ArrowLeft className="h-4 w-4" />
              Continuar comprando
            </Link>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              Seu Carrinho
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "itens"} no carrinho
            </p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Limpar
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="glass flex overflow-hidden rounded-2xl"
            >
              {/* Product Image Placeholder */}
              <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center bg-gradient-to-br from-muted to-secondary text-3xl font-bold text-muted-foreground/20 sm:h-32 sm:w-32">
                {item.product.name.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                    {item.product.description}
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#ea1d2c]">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/80"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition-colors hover:bg-muted/80"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remover item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">Resumo do Pedido</h2>
          
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Taxa de entrega</span>
              <span className="text-green-500">Gratis</span>
            </div>
            <div className="border-t border-border/50 pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-[#ea1d2c]">{formatCurrency(totalPrice)}</span>
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
            >
              Finalizar Pedido
              <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <button
              onClick={handleCheckout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
            >
              Fazer login para continuar
              <LogIn className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
