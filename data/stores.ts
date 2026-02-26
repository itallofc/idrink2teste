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
    banner: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80",
    logo: "/logos/distribuidora-popular.svg",
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
    banner: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    logo: "/logos/adega-do-moco.svg",
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
    banner: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80",
    logo: "/logos/zero-lounge.svg",
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
    banner: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    logo: "/logos/adega-037.svg",
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
    banner: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
    logo: "/logos/bebidas-on.svg",
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
