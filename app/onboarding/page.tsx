"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedLogo } from "@/components/onboarding/AnimatedLogo";
import { useAuth } from "@/contexts/AuthContext";
import { User, Store, ArrowRight, Sparkles, ArrowLeft, Eye, EyeOff, Loader2, Mail } from "lucide-react";

type UserRole = "user" | "merchant";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading, signUp } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Registration fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Check if user already completed onboarding or is logged in
  useEffect(() => {
    if (authLoading) return;

    if (user && profile) {
      if (profile.role === "merchant") {
        router.push("/comerciante");
      } else {
        router.push("/home");
      }
      return;
    }

    if (user && !profile) {
      // User exists but no profile - check metadata
      const role = user.user_metadata?.role;
      if (role === "merchant") {
        router.push("/comerciante");
      } else {
        router.push("/home");
      }
      return;
    }

    // Check localStorage for legacy users
    const storedName = localStorage.getItem("idrink_user_name");
    const storedRole = localStorage.getItem("idrink_user_role");
    if (storedName && storedRole) {
      if (storedRole === "merchant") {
        router.push("/comerciante");
      } else {
        router.push("/home");
      }
      return;
    }

    setIsCheckingAuth(false);
  }, [authLoading, user, profile, router]);

  const handleContinue = () => {
    if (name.trim()) {
      localStorage.setItem("idrink_user_name", name.trim());
      setStep(2);
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "merchant") {
      setStep(3); // Go to merchant registration
    } else {
      setStep(4); // Go to user registration
    }
  };

  const handleUserContinueWithoutAccount = () => {
    setIsLoading(true);
    localStorage.setItem("idrink_user_role", "user");
    setTimeout(() => {
      router.push("/home");
    }, 500);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validations
    if (password !== confirmPassword) {
      setError("As senhas nao coincidem");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const metadata: Record<string, unknown> = {
        full_name: name,
        phone: phone || null,
        role: selectedRole,
      };

      if (selectedRole === "merchant" && storeName) {
        metadata.store_name = storeName;
      }

      const { error: signUpError, data } = await signUp(email, password, metadata);

      if (signUpError) throw signUpError;

      if (data?.user) {
        // Save to localStorage as backup
        localStorage.setItem("idrink_user_name", name.trim());
        localStorage.setItem("idrink_user_role", selectedRole || "user");
        
        // Move to success step
        setStep(5);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("already registered")) {
          setError("Este email ja esta cadastrado. Tente fazer login.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Erro ao criar conta");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth || authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ea1d2c]/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#ea1d2c]/10 blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Name input */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center"
          >
            <AnimatedLogo />

            <motion.h1
              className="mt-8 text-balance text-2xl font-bold text-foreground md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
            >
              O futuro das bebidas comeca aqui.
            </motion.h1>

            <motion.p
              className="mt-3 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              Rapido. Gelado. Inteligente.
            </motion.p>

            <motion.div
              className="mt-10 w-full space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                  placeholder="Qual o seu nome?"
                  className="w-full rounded-2xl border border-border/50 bg-secondary/50 px-5 py-4 text-center text-lg text-foreground placeholder:text-muted-foreground focus:border-[#ea1d2c]/50 focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/20"
                  autoFocus
                />
              </div>

              <button
                onClick={handleContinue}
                disabled={!name.trim()}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 red-glow"
              >
                Continuar
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Role selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center"
          >
            <motion.div
              className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#ea1d2c]/30 bg-[#ea1d2c]/10 px-4 py-2 text-sm text-[#ea1d2c]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4" />
              Bem-vindo, {name}!
            </motion.div>

            <motion.h2
              className="mt-4 text-balance text-2xl font-bold text-foreground md:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Voce e usuario ou comerciante?
            </motion.h2>

            <motion.p
              className="mt-2 text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Escolha como deseja usar o Idrink
            </motion.p>

            <motion.div
              className="mt-10 grid w-full gap-4 sm:grid-cols-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* User Card */}
              <button
                onClick={() => handleSelectRole("user")}
                disabled={isLoading}
                className="glass group relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:border-[#ea1d2c]/50 hover:shadow-[0_0_30px_rgba(234,29,44,0.2)] disabled:pointer-events-none disabled:opacity-50"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[#ea1d2c]/10 p-3">
                  <User className="h-6 w-6 text-[#ea1d2c]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Usuario
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quero pedir bebidas
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#ea1d2c] to-[#ff6b6b] transition-all duration-300 group-hover:w-full" />
              </button>

              {/* Merchant Card */}
              <button
                onClick={() => handleSelectRole("merchant")}
                disabled={isLoading}
                className="glass group relative overflow-hidden rounded-2xl p-6 text-left transition-all hover:border-[#ea1d2c]/50 hover:shadow-[0_0_30px_rgba(234,29,44,0.2)] disabled:pointer-events-none disabled:opacity-50"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[#ea1d2c]/10 p-3">
                  <Store className="h-6 w-6 text-[#ea1d2c]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Comerciante
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quero vender minhas bebidas
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#ea1d2c] to-[#ff6b6b] transition-all duration-300 group-hover:w-full" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: Merchant Registration */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center px-6"
          >
            <button
              onClick={() => setStep(2)}
              className="mb-6 flex items-center gap-2 self-start text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>

            <div className="glass w-full rounded-2xl p-6 sm:p-8">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ea1d2c]/10">
                  <Store className="h-8 w-8 text-[#ea1d2c]" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Cadastro de Comerciante
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Crie sua conta para comecar a vender
                </p>
              </div>

              <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="store-name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Nome da Loja
                  </label>
                  <input
                    id="store-name"
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Ex: Adega do Joao"
                    required
                    className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
                    Telefone/WhatsApp
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                    className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
                  />
                </div>

                <div>
                  <label htmlFor="merchant-email" className="mb-1.5 block text-sm font-medium text-foreground">
                    E-mail
                  </label>
                  <input
                    id="merchant-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
                  />
                </div>

                <div>
                  <label htmlFor="merchant-password" className="mb-1.5 block text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="merchant-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimo 6 caracteres"
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

                <div>
                  <label htmlFor="merchant-confirm-password" className="mb-1.5 block text-sm font-medium text-foreground">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      id="merchant-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita sua senha"
                      required
                      className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Ja tem conta?{" "}
                <button
                  onClick={() => router.push("/perfil")}
                  className="text-[#ea1d2c] hover:underline"
                >
                  Faca login
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 4: User Registration */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center px-6"
          >
            <button
              onClick={() => setStep(2)}
              className="mb-6 flex items-center gap-2 self-start text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>

            <div className="glass w-full rounded-2xl p-6 sm:p-8">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ea1d2c]/10">
                  <User className="h-8 w-8 text-[#ea1d2c]" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Cadastro de Usuario
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Crie sua conta para acompanhar seus pedidos
                </p>
              </div>

              <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="user-phone" className="mb-1.5 block text-sm font-medium text-foreground">
                    Telefone/WhatsApp (opcional)
                  </label>
                  <input
                    id="user-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
                  />
                </div>

                <div>
                  <label htmlFor="user-email" className="mb-1.5 block text-sm font-medium text-foreground">
                    E-mail
                  </label>
                  <input
                    id="user-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
                  />
                </div>

                <div>
                  <label htmlFor="user-password" className="mb-1.5 block text-sm font-medium text-foreground">
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="user-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimo 6 caracteres"
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

                <div>
                  <label htmlFor="user-confirm-password" className="mb-1.5 block text-sm font-medium text-foreground">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      id="user-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita sua senha"
                      required
                      className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#ea1d2c]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta"
                  )}
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">ou</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUserContinueWithoutAccount}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border/50 py-3 font-medium text-muted-foreground transition-all hover:border-[#ea1d2c]/30 hover:text-foreground disabled:opacity-50"
                >
                  Continuar sem conta
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Ja tem conta?{" "}
                <button
                  onClick={() => router.push("/perfil")}
                  className="text-[#ea1d2c] hover:underline"
                >
                  Faca login
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 5: Success */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center"
          >
            <div className="glass rounded-2xl p-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                <Mail className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Verifique seu e-mail
              </h2>
              <p className="mt-3 text-muted-foreground">
                Enviamos um link de confirmacao para <strong className="text-foreground">{email}</strong>. 
                Clique no link para ativar sua conta.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Verifique tambem a pasta de spam se nao encontrar o e-mail.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => router.push("/perfil")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  Ja confirmei, fazer login
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (selectedRole === "merchant") {
                      router.push("/comerciante");
                    } else {
                      router.push("/home");
                    }
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border/50 px-6 py-3 font-medium text-muted-foreground transition-all hover:border-[#ea1d2c]/30 hover:text-foreground"
                >
                  Continuar navegando
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
