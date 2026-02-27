import { Star, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#ea1d2c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Marketplace
      </Link>

      {/* Banner */}
      <div className="relative h-48 overflow-hidden rounded-3xl md:h-64">
        <Image
          src={store.banner}
          alt={store.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
        
        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-end gap-4">
            {/* Logo */}
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-slate-800 bg-slate-900 md:h-20 md:w-20">
              <Image
                src={store.logo}
                alt={`Logo ${store.name}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white md:text-3xl">
                {store.name}
              </h1>
              <p className="mt-0.5 text-white/70">{store.tagline}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">
                    {store.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{store.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-muted-foreground">{store.description}</p>

      {/* Category badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {store.categories.map((cat) => (
          <span
            key={cat}
            className="rounded-xl bg-slate-800 px-3 py-1.5 text-sm text-muted-foreground"
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
}
