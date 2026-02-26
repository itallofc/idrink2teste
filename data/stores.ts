export interface Store {
  id: string;
  name: string;
  tagline: string;
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
    tagline: "Sua noite comeca aqui.",
    rating: 4.8,
    deliveryTime: "30-45 min",
    categories: ["Cerveja", "Refrigerante", "Agua", "Energetico"],
    banner: "/banners/distribuidora-popular-banner.png",
    logo: "/logos/distribuidora-popular-logo.jpeg",
    description:
      "A maior variedade de bebidas com os melhores precos da regiao. Entrega rapida e atendimento de qualidade.",
  },
  {
    id: "adega-do-moco",
    name: "Adega do Moco",
    tagline: "Selecao premium, entrega express.",
    rating: 4.9,
    deliveryTime: "40-60 min",
    categories: ["Whisky", "Vodka", "Gin", "Cerveja", "Skol Beats"],
    banner: "/banners/adega-do-moco-banner.png",
    logo: "/logos/adega-do-moco-logo.jpeg",
    description:
      "Especialistas em destilados premium e cervejas artesanais. A melhor adega da cidade.",
  },
  {
    id: "zero-lounge-tabacaria",
    name: "Zero Lounge Tabacaria",
    tagline: "Experiencia refinada.",
    rating: 4.7,
    deliveryTime: "35-50 min",
    categories: ["Energetico", "Agua", "Refrigerante"],
    banner: "/banners/zero-lounge-tabacaria-banner.png",
    logo: "/logos/zero-lounge-tabacaria-logo.jpeg",
    description:
      "Bebidas para acompanhar seu momento de descanso. Selecao premium de energeticos e mais.",
  },
  {
    id: "adega-037",
    name: "Adega 037",
    tagline: "O sabor da comemoracao.",
    rating: 4.8,
    deliveryTime: "25-40 min",
    categories: ["Whisky", "Vodka", "Gin", "Cerveja", "Skol Beats"],
    banner: "/banners/adega-037-banner.png",
    logo: "/logos/adega-037-logo.jpeg",
    description:
      "Destilados importados, cervejas geladas e entregas ultra-rapidas. A adega que voce merece.",
  },
  {
    id: "bebidas-on",
    name: "Bebidas ON",
    tagline: "Conectando voce ao melhor.",
    rating: 4.9,
    deliveryTime: "20-35 min",
    categories: ["Cerveja", "Refrigerante", "Agua", "Energetico", "Vodka"],
    banner: "/banners/bebidas-on-banner.png",
    logo: "/logos/bebidas-on-logo.jpeg",
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
