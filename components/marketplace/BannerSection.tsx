"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, ArrowRight } from "lucide-react";
import type { Store } from "@/data/stores";

interface BannerSectionProps {
  stores: Store[];
}

export function BannerSection({ stores }: BannerSectionProps) {
  // Show featured stores (top 3 by rating)
  const featuredStores = [...stores]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <section className="mb-10">
      <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">
        Lojas em Destaque
      </h2>
      <div className="space-y-6">
        {featuredStores.map((store, index) => (
          <Link
            key={store.id}
            href={`/store/${store.id}`}
            className="group relative block h-[260px] overflow-hidden rounded-3xl transition-transform duration-300 hover:scale-[1.02]"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Background Image */}
            <Image
              src={store.banner}
              alt={store.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority={index === 0}
            />

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Red Glow Effect */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(234,29,44,0.3)]" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              {/* Badges */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-white">
                    {store.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-white/80" />
                  <span className="text-sm text-white/90">
                    {store.deliveryTime}
                  </span>
                </div>
              </div>

              {/* Store Info */}
              <h3 className="text-2xl font-bold text-white md:text-3xl">
                {store.name}
              </h3>
              <p className="mt-1 text-white/80">{store.tagline}</p>

              {/* CTA Button */}
              <button className="mt-4 flex w-fit items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-all group-hover:gap-3 red-glow">
                Explorar Loja
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Store Logo */}
            <div className="absolute right-6 top-6 h-14 w-14 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md md:h-16 md:w-16">
              <Image
                src={store.logo}
                alt={`Logo ${store.name}`}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
