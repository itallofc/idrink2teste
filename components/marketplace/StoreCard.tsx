import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import type { Store } from "@/data/stores";

interface StoreCardProps {
  store: Store;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link
      href={`/store/${store.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/60 backdrop-blur-sm transition-all hover:border-[#ea1d2c]/50 hover:shadow-[0_0_30px_rgba(234,29,44,0.2)]"
    >
      {/* Banner */}
      <div className="relative h-36 overflow-hidden">
        <Image
          src={store.banner}
          alt={store.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-5 pb-5 pt-4">
        {/* Logo */}
        <div className="absolute -top-6 left-5 h-12 w-12 overflow-hidden rounded-xl border-2 border-slate-900 bg-slate-800">
          <Image
            src={store.logo}
            alt={`Logo ${store.name}`}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-[#ea1d2c]">
            {store.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
            {store.tagline}
          </p>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
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
                className="rounded-lg bg-slate-800 px-2 py-0.5 text-xs text-muted-foreground"
              >
                {cat}
              </span>
            ))}
            {store.categories.length > 3 && (
              <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-xs text-muted-foreground">
                +{store.categories.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
