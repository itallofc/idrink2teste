import Link from "next/link";
import { Star, Clock } from "lucide-react";
import type { Store } from "@/data/stores";

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/store/${store.id}`}
      className="glass group block overflow-hidden rounded-2xl transition-all hover:neon-glow"
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 to-transparent" />
        {/* Store Initial as visual placeholder */}
        <div className="flex h-full items-center justify-center text-5xl font-bold text-muted-foreground/20">
          {store.name.charAt(0)}
        </div>
      </div>

      {/* Content */}
      <div className="relative px-5 pb-5 pt-4">
        {/* Logo circle */}
        <div className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-background bg-secondary text-lg font-bold text-[#00f5ff]">
          {store.name.charAt(0)}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-[#00f5ff]">
            {store.name}
          </h3>

          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#fbbf24] text-[#fbbf24]" />
              <span className="text-sm font-medium text-foreground">
                {store.rating}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-sm">{store.deliveryTime}</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {store.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="rounded-lg bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {cat}
              </span>
            ))}
            {store.categories.length > 3 && (
              <span className="rounded-lg bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{store.categories.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
