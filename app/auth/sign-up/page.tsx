"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone, Store } from "lucide-react";

type UserRole = "customer" | "merchant";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>("customer");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("As senhas nao coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/home`,
        data: {
          full_name: fullName,
          phone: phone,
          role: role,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/auth/sign-up-success");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <Logo size="large" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Criar sua conta
            </h1>
            <p className="mt-1 text-muted-foreground">
              {step === 1 ? "Escolha seu tipo de conta" : "Preencha seus dados"}
            </p>
          </div>
        </div>

        {/* Step 1: Choose Role */}
        {step === 1 && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setRole("customer");
                setStep(2);
              }}
              className={`w-full rounded-xl border-2 p-6 text-left transition-all ${
                role === "customer"
                  ? "border-[#ea1d2c] bg-[#ea1d2c]/10"
                  : "border-border hover:border-[#ea1d2c]/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ea1d2c]/20">
                  <User className="h-6 w-6 text-[#ea1d2c]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Quero comprar
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Cadastre-se como cliente para fazer pedidos nas melhores lojas
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("merchant");
                setStep(2);
              }}
              className={`w-full rounded-xl border-2 p-6 text-left transition-all ${
                role === "merchant"
                  ? "border-[#ea1d2c] bg-[#ea1d2c]/10"
                  : "border-border hover:border-[#ea1d2c]/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ea1d2c]/20">
                  <Store className="h-6 w-6 text-[#ea1d2c]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Quero vender
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Cadastre sua loja e comece a vender para milhares de clientes
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {step === 2 && (
          <form onSubmit={handleSignUp} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repita sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#ea1d2c] hover:bg-[#c9171f]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
          Ja tem uma conta?{" "}
          <Link href="/auth/login" className="text-[#ea1d2c] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
