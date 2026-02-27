"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/layout/Logo";
import { Mail, Lock, Eye, EyeOff, User, Store, ArrowRight, Loader2, Check } from "lucide-react";

type UserRole = "customer" | "merchant";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/home`,
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Este email ja esta cadastrado");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Cadastro realizado!</h1>
          <p className="text-muted-foreground">
            Enviamos um email de confirmacao para <strong className="text-foreground">{email}</strong>. 
            Clique no link para ativar sua conta.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Ir para o Login
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Logo size="large" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Crie sua conta</h1>
            <p className="mt-1 text-muted-foreground">
              Junte-se ao Idrink e aproveite as melhores ofertas
            </p>
          </div>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
              role === "customer"
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary/50 hover:border-muted-foreground"
            }`}
          >
            <User className={`h-6 w-6 ${role === "customer" ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${role === "customer" ? "text-primary" : "text-foreground"}`}>
              Sou Cliente
            </span>
          </button>
          <button
            type="button"
            onClick={() => setRole("merchant")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
              role === "merchant"
                ? "border-primary bg-primary/10"
                : "border-border bg-secondary/50 hover:border-muted-foreground"
            }`}
          >
            <Store className={`h-6 w-6 ${role === "merchant" ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${role === "merchant" ? "text-primary" : "text-foreground"}`}>
              Sou Comerciante
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                  className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Criar conta
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-muted-foreground">
          Ja tem uma conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
