export interface Store {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  categories: string[];
  banner: string;
  logo: string;
  description: string;
}

export const stores: Store[] = [
  {
    id: "distribuidora-popular",
    name: "Distribuidora Popular",
    rating: 4.7,
    deliveryTime: "25-35 min",
    categories: ["Cerveja", "Refrigerante", "Agua", "Energetico"],
    banner: "/banners/store-1.jpg",
    logo: "/logos/store-1.jpg",
    description:
      "A maior variedade de bebidas com os melhores precos da regiao. Entrega rapida e atendimento de qualidade.",
  },
  {
    id: "adega-do-moco",
    name: "Adega do Moco",
    rating: 4.9,
    deliveryTime: "20-30 min",
    categories: ["Whisky", "Vodka", "Gin", "Cerveja", "Skol Beats"],
    banner: "/banners/store-2.jpg",
    logo: "/logos/store-2.jpg",
    description:
      "Especialistas em destilados premium e cervejas artesanais. A melhor adega da cidade.",
  },
  {
    id: "zero-lounge-tabacaria",
    name: "Zero Lounge Tabacaria",
    rating: 4.5,
    deliveryTime: "30-45 min",
    categories: ["Energetico", "Agua", "Refrigerante"],
    banner: "/banners/store-3.jpg",
    logo: "/logos/store-3.jpg",
    description:
      "Bebidas para acompanhar seu momento de descanso. Selecao premium de energeticos e mais.",
  },
  {
    id: "adega-037",
    name: "Adega 037",
    rating: 4.8,
    deliveryTime: "15-25 min",
    categories: ["Whisky", "Vodka", "Gin", "Cerveja", "Skol Beats"],
    banner: "/banners/store-4.jpg",
    logo: "/logos/store-4.jpg",
    description:
      "Destilados importados, cervejas geladas e entregas ultra-rapidas. A adega que voce merece.",
  },
  {
    id: "bebidas-on",
    name: "Bebidas ON",
    rating: 4.6,
    deliveryTime: "20-35 min",
    categories: ["Cerveja", "Refrigerante", "Agua", "Energetico", "Vodka"],
    banner: "/banners/store-5.jpg",
    logo: "/logos/store-5.jpg",
    description:
      "Tudo ON para sua festa! Maior variedade, menor preco e entrega garantida.",
  },
];

export function getStoreById(id: string): Store | undefined {
  return stores.find((store) => store.id === id);
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  stores.forEach((store) => store.categories.forEach((c) => cats.add(c)));
  return Array.from(cats).sort();
}
