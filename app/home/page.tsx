"use client";

import { useState, useMemo } from "react";
import { useStores, getAllCategories } from "@/hooks/useStores";
import { useAuth } from "@/hooks/useAuth";
import { StoreCard } from "@/components/marketplace/StoreCard";
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { SearchInput } from "@/components/marketplace/SearchInput";
import { BannerSection } from "@/components/marketplace/BannerSection";
import { MapPin, Loader2 } from "lucide-react";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { stores, isLoading } = useStores();
  const { profile } = useAuth();

  const categories = useMemo(() => getAllCategories(stores), [stores]);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch = store.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === null ||
        store.categories?.some((cat) => cat.name === selectedCategory);
      return matchesSearch && matchesCategory && store.is_active;
    });
  }, [stores, search, selectedCategory]);

  // Transform store data for components
  const storesForDisplay = filteredStores.map((store) => ({
    id: store.slug,
    name: store.name,
    tagline: store.tagline || store.description || "",
    rating: store.rating,
    deliveryTime: store.delivery_time,
    categories: store.categories?.map((c) => c.name) || [],
    banner: store.banner_url || "/banners/default-banner.png",
    logo: store.logo_url || "/logos/default-logo.jpeg",
    description: store.description || "",
  }));

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-[#ea1d2c]" />
          <span>Entregando na sua regiao</span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">
          {profile?.full_name ? (
            <>
              Ola, <span className="text-[#ea1d2c]">{profile.full_name.split(" ")[0]}</span>
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
      {storesForDisplay.length > 0 && (
        <BannerSection stores={storesForDisplay.slice(0, 5)} />
      )}

      {/* Search */}
      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} />
      </div>

      {/* All Stores Section */}
      <h2 className="mb-6 text-xl font-bold text-foreground md:text-2xl">
        Todas as Lojas
      </h2>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      )}

      {/* Store Grid */}
      {storesForDisplay.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {storesForDisplay.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-muted-foreground">
            Nenhuma loja encontrada.
          </p>
          {(search || selectedCategory) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory(null);
              }}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
