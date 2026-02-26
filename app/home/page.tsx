"use client";

import { useState, useMemo } from "react";
import { stores, getAllCategories } from "@/data/stores";
import { StoreCard } from "@/components/marketplace/StoreCard";
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { SearchInput } from "@/components/marketplace/SearchInput";
import { MapPin } from "lucide-react";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = getAllCategories();

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesSearch = store.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === null ||
        store.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-[#00f5ff]" />
          <span>Entregando na sua regiao</span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">
          Explore as{" "}
          <span className="text-[#00f5ff] neon-text">melhores lojas</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encontre suas bebidas favoritas nas melhores adegas e distribuidoras.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} />
      </div>

      {/* Category Filter */}
      <div className="mb-8">
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
          <p className="text-lg text-muted-foreground">
            Nenhuma loja encontrada.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
            className="mt-4 text-sm text-[#00f5ff] hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
