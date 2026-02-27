"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedLogo } from "@/components/onboarding/AnimatedLogo";
import { User, Store, ArrowRight, Sparkles } from "lucide-react";

type UserRole = "user" | "merchant";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user already completed onboarding
  useEffect(() => {
    const storedName = localStorage.getItem("idrink_user_name");
    const storedRole = localStorage.getItem("idrink_user_role");
    if (storedName && storedRole) {
      if (storedRole === "merchant") {
        router.push("/perfil");
      } else {
        router.push("/home");
      }
    }
  }, [router]);

  const handleContinue = () => {
    if (name.trim()) {
      localStorage.setItem("idrink_user_name", name.trim());
      setStep(2);
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setIsLoading(true);
    localStorage.setItem("idrink_user_role", role);

    setTimeout(() => {
      if (role === "merchant") {
        router.push("/perfil");
      } else {
        router.push("/home");
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ea1d2c]/15 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#ea1d2c]/10 blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    </div>
  );
}
