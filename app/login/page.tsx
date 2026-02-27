"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/layout/Logo";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === "Invalid login credentials" 
        ? "Email ou senha incorretos" 
        : error.message);
      setLoading(false);
      return;
    }

    router.push("/home");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <Logo size="large" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
            <p className="mt-1 text-muted-foreground">
              Entre na sua conta para continuar
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
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
                  placeholder="Sua senha"
                  required
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
                Entrar
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-muted-foreground">
          Nao tem uma conta?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
