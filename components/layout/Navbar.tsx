"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { User, Store, Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/home", label: "Marketplace" },
  { href: "/perfil", label: "Minha Conta" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { profile, user, guestName, isMerchant } = useAuth();

  const userName = profile?.full_name || user?.user_metadata?.full_name || guestName;

  // Add merchant link if user is a merchant
  const links = isMerchant 
    ? [...navLinks, { href: "/comerciante", label: "Painel" }]
    : navLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-[#00f5ff] ${
                pathname === link.href
                  ? "text-[#00f5ff]"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[#00f5ff] neon-glow" />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {userName && (
            <span className="text-sm text-muted-foreground">
              Ola, <span className="font-medium text-foreground">{userName}</span>
            </span>
          )}
          <Link
            href="/carrinho"
            className="relative flex items-center justify-center rounded-xl border border-border/50 p-2.5 text-muted-foreground transition-all hover:border-[#ea1d2c]/30 hover:text-[#ea1d2c]"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Link>
          <Link
            href="/perfil"
            className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-[#ea1d2c]/30 hover:text-[#ea1d2c]"
          >
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="glass border-t border-border/50 md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-[#00f5ff]/10 text-[#00f5ff]"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border/50 pt-3">
              <Link
                href="/perfil"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-3 text-sm text-muted-foreground"
              >
                <User className="h-4 w-4" />
                {userName || "Entrar"}
              </Link>
              {!isMerchant && (
                <Link
                  href="/onboarding"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                >
                  <Store className="h-4 w-4" />
                  Seja Parceiro
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
