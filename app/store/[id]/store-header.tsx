import { Star, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Store } from "@/data/stores";

interface StoreHeaderProps {
  store: Store;
}

export function StoreHeader({ store }: StoreHeaderProps) {
  return (
    <div className="mb-8">
      {/* Back button */}
      <Link
        href="/home"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#00f5ff]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Marketplace
      </Link>

      {/* Banner */}
      <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] md:h-64">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/90 to-transparent" />
        <div className="flex h-full items-center justify-center text-8xl font-bold text-muted-foreground/10">
          {store.name.charAt(0)}
        </div>
      </div>

      {/* Store Info */}
      <div className="relative -mt-8 flex items-end gap-4 px-4">
        {/* Logo */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-secondary text-2xl font-bold text-[#00f5ff]">
          {store.name.charAt(0)}
        </div>

        <div className="mb-1 flex-1">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            {store.name}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
              <span className="text-sm font-medium text-foreground">
                {store.rating}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{store.deliveryTime}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 px-4 text-muted-foreground">{store.description}</p>

      {/* Category badges */}
      <div className="mt-4 flex flex-wrap gap-2 px-4">
        {store.categories.map((cat) => (
          <span
            key={cat}
            className="rounded-xl bg-muted px-3 py-1 text-sm text-muted-foreground"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
