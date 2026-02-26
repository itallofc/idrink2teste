"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/data/products";
import { CategoryFilter } from "@/components/marketplace/CategoryFilter";
import { SearchInput } from "@/components/marketplace/SearchInput";
import { ProductCard } from "@/components/marketplace/ProductCard";

interface StoreProductsProps {
  products: Product[];
  categories: string[];
}

export function StoreProducts({ products, categories }: StoreProductsProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCat =
        selectedCategory === null || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, search, selectedCategory]);

  return (
    <div>
      {/* Separator */}
      <div className="mb-6 border-t border-border/50" />

      <h2 className="mb-4 text-xl font-bold text-foreground">Produtos</h2>

      {/* Search */}
      <div className="mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar produtos nesta loja..."
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Products */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-16 text-center">
          <p className="text-muted-foreground">Nenhum produto encontrado.</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory(null);
            }}
            className="mt-3 text-sm text-[#00f5ff] hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
