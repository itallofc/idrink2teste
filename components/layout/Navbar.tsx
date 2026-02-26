"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { User, Store, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/home", label: "Marketplace" },
  { href: "/usuario", label: "Minha Conta" },
  { href: "/comerciante", label: "Comerciante" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
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
          <Link
            href="/usuario"
            className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-[#00f5ff]/30 hover:text-[#00f5ff]"
          >
            <User className="h-4 w-4" />
            <span>Entrar</span>
          </Link>
          <Link
            href="/comerciante"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 red-glow"
          >
            <Store className="h-4 w-4" />
            <span>Seja Parceiro</span>
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
            {navLinks.map((link) => (
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
                href="/usuario"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-3 text-sm text-muted-foreground"
              >
                <User className="h-4 w-4" />
                Entrar
              </Link>
              <Link
                href="/comerciante"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
              >
                <Store className="h-4 w-4" />
                Seja Parceiro
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
