"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Zap, Clock, Shield, Star } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-[#ea1d2c]/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-[#00f5ff]/8 blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f5ff]/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#00f5ff]/20 bg-[#00f5ff]/5 px-4 py-2 text-sm text-[#00f5ff]">
          <Zap className="h-3.5 w-3.5" />
          <span>Novo marketplace de bebidas</span>
        </div>

        <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl">
          Bebidas entregues{" "}
          <span className="bg-gradient-to-r from-[#ea1d2c] to-[#ff6b6b] bg-clip-text text-transparent">
            em minutos.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Descubra as melhores adegas e distribuidoras da sua regiao.
          Peca com um toque e receba gelado na sua porta.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/home"
            className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
          >
            Explorar Bebidas
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/comerciante"
            className="inline-flex items-center gap-2 rounded-2xl border border-border/50 px-8 py-4 text-lg font-medium text-muted-foreground transition-all hover:border-[#00f5ff]/30 hover:text-[#00f5ff]"
          >
            Para Comerciantes
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Clock,
      title: "Entrega Rapida",
      description: "Receba suas bebidas em ate 30 minutos. Sem espera, sem complicacao.",
    },
    {
      icon: Shield,
      title: "Pagamento Seguro",
      description: "Seus dados protegidos com criptografia de ponta a ponta.",
    },
    {
      icon: Star,
      title: "Melhores Lojas",
      description: "Adegas e distribuidoras avaliadas pela comunidade.",
    },
  ];

  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Por que escolher a{" "}
            <span className="text-[#00f5ff] neon-text">iDrink</span>?
          </h2>
          <p className="mt-4 text-muted-foreground">
            A experiencia mais moderna de pedir bebidas online.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass group rounded-2xl p-8 transition-all hover:neon-glow"
            >
              <div className="mb-4 inline-flex rounded-xl bg-[#00f5ff]/10 p-3">
                <feature.icon className="h-6 w-6 text-[#00f5ff]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: "5+", label: "Lojas Parceiras" },
    { value: "50+", label: "Produtos" },
    { value: "30min", label: "Entrega Media" },
    { value: "4.7", label: "Avaliacao Media" },
  ];

  return (
    <section className="border-y border-border/50 px-4 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-[#00f5ff] neon-text md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative px-4 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ea1d2c]/8 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-4">
          <Logo size="large" />
        </div>
        <h2 className="text-3xl font-bold md:text-5xl">
          Pronto para pedir?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore as melhores bebidas da sua regiao agora mesmo.
        </p>
        <Link
          href="/home"
          className="group mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground transition-all hover:opacity-90 red-glow"
        >
          Comecar Agora
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("idrink_user_name");
    const storedRole = localStorage.getItem("idrink_user_role");
    if (!storedName || !storedRole) {
      router.push("/onboarding");
    }
  }, [router]);

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </>
  );
}
