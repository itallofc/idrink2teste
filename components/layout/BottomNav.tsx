"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Package, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const navItems = [
  {
    href: "/home",
    label: "Explorar",
    icon: Compass,
  },
  {
    href: "/carrinho",
    label: "Carrinho",
    icon: ShoppingCart,
    showBadge: true,
  },
  {
    href: "/pedidos",
    label: "Pedidos",
    icon: Package,
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: User,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Don't show on onboarding
  if (pathname === "/onboarding" || pathname === "/") {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-lg md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          const showBadge = item.showBadge && totalItems > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors ${
                isActive
                  ? "text-[#ea1d2c]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {showBadge && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-6 rounded-full bg-[#ea1d2c]" />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-background" />
    </nav>
  );
}
