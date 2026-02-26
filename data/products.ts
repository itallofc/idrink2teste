export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export const products: Product[] = [
  // Distribuidora Popular
  { id: "p1", storeId: "distribuidora-popular", name: "Brahma Duplo Malte 350ml", description: "Cerveja Brahma Duplo Malte lata 350ml gelada", price: 4.99, image: "/products/cerveja-1.jpg", category: "Cerveja", stock: 120 },
  { id: "p2", storeId: "distribuidora-popular", name: "Skol Lata 350ml", description: "A cerveja que desce redondo", price: 3.49, image: "/products/cerveja-2.jpg", category: "Cerveja", stock: 200 },
  { id: "p3", storeId: "distribuidora-popular", name: "Coca-Cola 2L", description: "Refrigerante Coca-Cola garrafa 2 litros", price: 9.99, image: "/products/refri-1.jpg", category: "Refrigerante", stock: 80 },
  { id: "p4", storeId: "distribuidora-popular", name: "Crystal 500ml", description: "Agua mineral Crystal sem gas 500ml", price: 2.49, image: "/products/agua-1.jpg", category: "Agua", stock: 300 },
  { id: "p5", storeId: "distribuidora-popular", name: "Red Bull 250ml", description: "Energetico Red Bull lata 250ml", price: 12.99, image: "/products/energetico-1.jpg", category: "Energetico", stock: 60 },
  { id: "p6", storeId: "distribuidora-popular", name: "Guarana Antarctica 350ml", description: "Refrigerante Guarana Antarctica lata", price: 3.99, image: "/products/refri-2.jpg", category: "Refrigerante", stock: 150 },

  // Adega do Moco
  { id: "p7", storeId: "adega-do-moco", name: "Johnnie Walker Black Label", description: "Whisky Johnnie Walker Black Label 1L", price: 189.90, image: "/products/whisky-1.jpg", category: "Whisky", stock: 15 },
  { id: "p8", storeId: "adega-do-moco", name: "Jack Daniel's Old No.7", description: "Tennessee Whisky Jack Daniel's 1L", price: 169.90, image: "/products/whisky-2.jpg", category: "Whisky", stock: 20 },
  { id: "p9", storeId: "adega-do-moco", name: "Absolut Vodka 1L", description: "Vodka Absolut Original 1 litro", price: 89.90, image: "/products/vodka-1.jpg", category: "Vodka", stock: 30 },
  { id: "p10", storeId: "adega-do-moco", name: "Tanqueray London Dry", description: "Gin Tanqueray London Dry 750ml", price: 119.90, image: "/products/gin-1.jpg", category: "Gin", stock: 25 },
  { id: "p11", storeId: "adega-do-moco", name: "Heineken Long Neck", description: "Cerveja Heineken long neck 330ml", price: 6.99, image: "/products/cerveja-3.jpg", category: "Cerveja", stock: 100 },
  { id: "p12", storeId: "adega-do-moco", name: "Skol Beats GT 313ml", description: "Skol Beats GT lata 313ml", price: 5.49, image: "/products/skolbeats-1.jpg", category: "Skol Beats", stock: 80 },

  // Zero Lounge Tabacaria
  { id: "p13", storeId: "zero-lounge-tabacaria", name: "Monster Energy 473ml", description: "Energetico Monster Energy lata 473ml", price: 10.99, image: "/products/energetico-2.jpg", category: "Energetico", stock: 45 },
  { id: "p14", storeId: "zero-lounge-tabacaria", name: "Red Bull Tropical 250ml", description: "Energetico Red Bull edicao Tropical", price: 13.99, image: "/products/energetico-3.jpg", category: "Energetico", stock: 35 },
  { id: "p15", storeId: "zero-lounge-tabacaria", name: "Agua Voss 800ml", description: "Agua artesiana Voss garrafa premium", price: 15.90, image: "/products/agua-2.jpg", category: "Agua", stock: 40 },
  { id: "p16", storeId: "zero-lounge-tabacaria", name: "Sprite 350ml", description: "Refrigerante Sprite lata 350ml", price: 3.99, image: "/products/refri-3.jpg", category: "Refrigerante", stock: 90 },

  // Adega 037
  { id: "p17", storeId: "adega-037", name: "Chivas Regal 12 Anos", description: "Whisky Chivas Regal 12 anos 1L", price: 219.90, image: "/products/whisky-3.jpg", category: "Whisky", stock: 10 },
  { id: "p18", storeId: "adega-037", name: "Grey Goose Vodka 750ml", description: "Vodka premium Grey Goose 750ml", price: 199.90, image: "/products/vodka-2.jpg", category: "Vodka", stock: 12 },
  { id: "p19", storeId: "adega-037", name: "Hendrick's Gin 750ml", description: "Gin Hendrick's premium 750ml", price: 179.90, image: "/products/gin-2.jpg", category: "Gin", stock: 18 },
  { id: "p20", storeId: "adega-037", name: "Stella Artois 550ml", description: "Cerveja Stella Artois garrafa 550ml", price: 7.99, image: "/products/cerveja-4.jpg", category: "Cerveja", stock: 70 },
  { id: "p21", storeId: "adega-037", name: "Skol Beats Senses 313ml", description: "Skol Beats Senses lata 313ml", price: 5.99, image: "/products/skolbeats-2.jpg", category: "Skol Beats", stock: 60 },

  // Bebidas ON
  { id: "p22", storeId: "bebidas-on", name: "Corona Extra 330ml", description: "Cerveja Corona Extra long neck 330ml", price: 8.49, image: "/products/cerveja-5.jpg", category: "Cerveja", stock: 90 },
  { id: "p23", storeId: "bebidas-on", name: "Smirnoff Ice 275ml", description: "Vodka Smirnoff Ice Original 275ml", price: 7.99, image: "/products/vodka-3.jpg", category: "Vodka", stock: 50 },
  { id: "p24", storeId: "bebidas-on", name: "Fanta Laranja 2L", description: "Refrigerante Fanta Laranja garrafa 2L", price: 8.49, image: "/products/refri-4.jpg", category: "Refrigerante", stock: 60 },
  { id: "p25", storeId: "bebidas-on", name: "Agua Bonafont 1.5L", description: "Agua mineral Bonafont sem gas 1.5L", price: 3.99, image: "/products/agua-3.jpg", category: "Agua", stock: 180 },
  { id: "p26", storeId: "bebidas-on", name: "TNT Energy 473ml", description: "Energetico TNT lata 473ml", price: 7.99, image: "/products/energetico-4.jpg", category: "Energetico", stock: 55 },
  { id: "p27", storeId: "bebidas-on", name: "Budweiser 350ml", description: "Cerveja Budweiser lata 350ml", price: 4.49, image: "/products/cerveja-6.jpg", category: "Cerveja", stock: 110 },
];

export function getProductsByStore(storeId: string): Product[] {
  return products.filter((p) => p.storeId === storeId);
}

export function getProductCategories(storeId: string): string[] {
  const cats = new Set<string>();
  products
    .filter((p) => p.storeId === storeId)
    .forEach((p) => cats.add(p.category));
  return Array.from(cats).sort();
}
