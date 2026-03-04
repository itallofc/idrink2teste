"use client";

import { useState, useMemo, useEffect } from "react";
import { stores, getAllCategories } from "@/data/stores";
import { StoreCard } from "@/components/marketplace/StoreCard";
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { SearchInput } from "@/components/marketplace/SearchInput";
import { BannerSection } from "@/components/marketplace/BannerSection";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Store } from "lucide-react";

interface DbStore {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_open: boolean;
  is_active: boolean;
  rating: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const [dbStores, setDbStores] = useState<DbStore[]>([]);
  const categories = getAllCategories();

  const userName = profile?.full_name || user?.user_metadata?.full_name || localStorage.getItem("idrink_user_name");

  const supabase = createClient();

  useEffect(() => {
    // Load stores from database
    async function loadStores() {
      const { data } = await supabase
        .from("stores")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (data) {
        setDbStores(data);
      }
    }
    loadStores();
  }, []);

  // Combine static stores with database stores
  const allStores = useMemo(() => {
    const staticStores = stores.map(s => ({
      ...s,
      source: "static" as const,
    }));

    const dynamicStores = dbStores.map(s => ({
      id: s.slug,
      name: s.name,
      tagline: s.tagline || "Loja no I Drink",
      rating: s.rating || 4.5,
      deliveryTime: s.delivery_time_min && s.delivery_time_max 
        ? `${s.delivery_time_min}-${s.delivery_time_max} min` 
        : "30-60 min",
      categories: [] as string[],
      banner: s.banner_url || "/banners/default-banner.png",
      logo: s.logo_url || "/logos/default-logo.png",
      description: s.description || "Loja cadastrada no I Drink",
      isOpen: s.is_open,
      source: "database" as const,
    }));

    // Filter out duplicates (prefer database version)
    const staticIds = new Set(staticStores.map(s => s.id));
    const filteredDynamic = dynamicStores.filter(s => !staticIds.has(s.id));

    return [...staticStores, ...filteredDynamic];
  }, [dbStores]);

  const filteredStores = useMemo(() => {
    return allStores.filter((store) => {
      const matchesSearch = store.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === null ||
        ("categories" in store && store.categories.includes(selectedCategory));
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, allStores]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-[#ea1d2c]" />
          <span>Entregando na sua regiao</span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">
          {userName ? (
            <>
              Ola, <span className="text-[#ea1d2c]">{userName}</span>
            </>
          ) : (
            <>
              Explore as{" "}
              <span className="text-[#ea1d2c]">melhores lojas</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encontre suas bebidas favoritas nas melhores adegas e distribuidoras.
        </p>
      </div>

      {/* Featured Banners */}
      <BannerSection stores={stores} />

      {/* Search */}
      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} />
      </div>

      {/* All Stores Section */}
      <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">
        Todas as Lojas
      </h2>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Store Grid */}
      {filteredStores.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Store className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Nenhuma loja encontrada.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
            className="mt-4 text-sm text-[#ea1d2c] hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
