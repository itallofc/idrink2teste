-- =============================================================================
-- IDRINK - Seed Data for Stores and Products
-- =============================================================================

-- Insert demo stores without owner_id (null for demo data)
INSERT INTO public.stores (id, owner_id, slug, name, tagline, description, logo_url, banner_url, rating, total_reviews, delivery_fee, min_order_value, delivery_time_min, delivery_time_max, is_open, is_active, city, state)
VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, NULL, 'distribuidora-popular', 'Distribuidora Popular', 'Sua noite comeca aqui.', 'A maior variedade de bebidas com os melhores precos da regiao. Entrega rapida e atendimento de qualidade.', '/logos/distribuidora-popular-logo.jpeg', '/banners/distribuidora-popular-banner.png', 4.8, 156, 5.99, 20.00, 30, 45, true, true, 'Divinopolis', 'MG'),
  ('22222222-2222-2222-2222-222222222222'::uuid, NULL, 'adega-do-moco', 'Adega do Moco', 'Selecao premium, entrega express.', 'Especialistas em destilados premium e cervejas artesanais. A melhor adega da cidade.', '/logos/adega-do-moco-logo.jpeg', '/banners/adega-do-moco-banner.png', 4.9, 243, 7.99, 30.00, 40, 60, true, true, 'Divinopolis', 'MG'),
  ('33333333-3333-3333-3333-333333333333'::uuid, NULL, 'zero-lounge-tabacaria', 'Zero Lounge Tabacaria', 'Experiencia refinada.', 'Bebidas para acompanhar seu momento de descanso. Selecao premium de energeticos e mais.', '/logos/zero-lounge-tabacaria-logo.jpeg', '/banners/zero-lounge-tabacaria-banner.png', 4.7, 89, 6.99, 25.00, 35, 50, true, true, 'Divinopolis', 'MG'),
  ('44444444-4444-4444-4444-444444444444'::uuid, NULL, 'adega-037', 'Adega 037', 'O sabor da comemoracao.', 'Destilados importados, cervejas geladas e entregas ultra-rapidas. A adega que voce merece.', '/logos/adega-037-logo.jpeg', '/banners/adega-037-banner.png', 4.8, 178, 4.99, 15.00, 25, 40, true, true, 'Divinopolis', 'MG'),
  ('55555555-5555-5555-5555-555555555555'::uuid, NULL, 'bebidas-on', 'Bebidas ON', 'Conectando voce ao melhor.', 'Tudo ON para sua festa! Maior variedade, menor preco e entrega garantida.', '/logos/bebidas-on-logo.jpeg', '/banners/bebidas-on-banner.png', 4.9, 312, 3.99, 10.00, 20, 35, true, true, 'Divinopolis', 'MG')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- CATEGORIES
-- =============================================================================

-- Categories for Distribuidora Popular
INSERT INTO public.categories (id, store_id, name, sort_order) VALUES
('c1111111-1111-1111-1111-111111111111'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Cervejas', 1),
('c1111111-1111-1111-1111-111111111112'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Refrigerantes', 2),
('c1111111-1111-1111-1111-111111111113'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Aguas', 3),
('c1111111-1111-1111-1111-111111111114'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Energeticos', 4)
ON CONFLICT (id) DO NOTHING;

-- Categories for Adega do Moco
INSERT INTO public.categories (id, store_id, name, sort_order) VALUES
('c2222222-2222-2222-2222-222222222221'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'Whiskys', 1),
('c2222222-2222-2222-2222-222222222222'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'Vodkas', 2),
('c2222222-2222-2222-2222-222222222223'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'Gins', 3),
('c2222222-2222-2222-2222-222222222224'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'Cervejas Premium', 4)
ON CONFLICT (id) DO NOTHING;

-- Categories for Zero Lounge
INSERT INTO public.categories (id, store_id, name, sort_order) VALUES
('c3333333-3333-3333-3333-333333333331'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'Energeticos', 1),
('c3333333-3333-3333-3333-333333333332'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'Aguas Premium', 2),
('c3333333-3333-3333-3333-333333333333'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'Sucos', 3)
ON CONFLICT (id) DO NOTHING;

-- Categories for Adega 037
INSERT INTO public.categories (id, store_id, name, sort_order) VALUES
('c4444444-4444-4444-4444-444444444441'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'Destilados Importados', 1),
('c4444444-4444-4444-4444-444444444442'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'Cervejas Artesanais', 2),
('c4444444-4444-4444-4444-444444444443'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'Vinhos', 3)
ON CONFLICT (id) DO NOTHING;

-- Categories for Bebidas ON
INSERT INTO public.categories (id, store_id, name, sort_order) VALUES
('c5555555-5555-5555-5555-555555555551'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'Cervejas', 1),
('c5555555-5555-5555-5555-555555555552'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'Destilados', 2),
('c5555555-5555-5555-5555-555555555553'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'Refrigerantes', 3),
('c5555555-5555-5555-5555-555555555554'::uuid, '55555555-5555-5555-5555-555555555555'::uuid, 'Combos', 4)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- PRODUCTS
-- =============================================================================

-- Products for Distribuidora Popular
INSERT INTO public.products (store_id, category_id, name, description, price, original_price, is_available, is_featured) VALUES
('11111111-1111-1111-1111-111111111111'::uuid, 'c1111111-1111-1111-1111-111111111111'::uuid, 'Skol Lata 350ml', 'Cerveja Skol Pilsen gelada', 3.99, 4.50, true, true),
('11111111-1111-1111-1111-111111111111'::uuid, 'c1111111-1111-1111-1111-111111111111'::uuid, 'Brahma Lata 350ml', 'Cerveja Brahma Chopp gelada', 4.29, NULL, true, true),
('11111111-1111-1111-1111-111111111111'::uuid, 'c1111111-1111-1111-1111-111111111111'::uuid, 'Heineken Long Neck 330ml', 'Cerveja premium importada', 7.99, 8.99, true, true),
('11111111-1111-1111-1111-111111111111'::uuid, 'c1111111-1111-1111-1111-111111111111'::uuid, 'Budweiser Lata 350ml', 'Cerveja americana premium', 5.49, NULL, true, false),
('11111111-1111-1111-1111-111111111111'::uuid, 'c1111111-1111-1111-1111-111111111112'::uuid, 'Coca-Cola 2L', 'Refrigerante Coca-Cola', 9.99, 11.99, true, true),
('11111111-1111-1111-1111-111111111111'::uuid, 'c1111111-1111-1111-1111-111111111112'::uuid, 'Guarana Antarctica 2L', 'Refrigerante Guarana', 7.99, NULL, true, false),
('11111111-1111-1111-1111-111111111111'::uuid, 'c1111111-1111-1111-1111-111111111113'::uuid, 'Agua Mineral 500ml', 'Agua mineral sem gas', 2.50, NULL, true, false),
('11111111-1111-1111-1111-111111111111'::uuid, 'c1111111-1111-1111-1111-111111111114'::uuid, 'Red Bull 250ml', 'Energetico Red Bull', 12.99, 14.99, true, true);

-- Products for Adega do Moco
INSERT INTO public.products (store_id, category_id, name, description, price, original_price, is_available, is_featured) VALUES
('22222222-2222-2222-2222-222222222222'::uuid, 'c2222222-2222-2222-2222-222222222221'::uuid, 'Johnnie Walker Red Label 1L', 'Whisky escoces blend', 89.90, 99.90, true, true),
('22222222-2222-2222-2222-222222222222'::uuid, 'c2222222-2222-2222-2222-222222222221'::uuid, 'Jack Daniels 1L', 'Tennessee Whiskey', 149.90, NULL, true, true),
('22222222-2222-2222-2222-222222222222'::uuid, 'c2222222-2222-2222-2222-222222222221'::uuid, 'Chivas Regal 12 anos 1L', 'Whisky escoces premium', 189.90, 219.90, true, false),
('22222222-2222-2222-2222-222222222222'::uuid, 'c2222222-2222-2222-2222-222222222222'::uuid, 'Absolut Vodka 1L', 'Vodka sueca premium', 79.90, NULL, true, true),
('22222222-2222-2222-2222-222222222222'::uuid, 'c2222222-2222-2222-2222-222222222222'::uuid, 'Grey Goose 750ml', 'Vodka francesa ultra premium', 199.90, 229.90, true, false),
('22222222-2222-2222-2222-222222222222'::uuid, 'c2222222-2222-2222-2222-222222222223'::uuid, 'Tanqueray London Dry 750ml', 'Gin ingles classico', 119.90, NULL, true, true),
('22222222-2222-2222-2222-222222222222'::uuid, 'c2222222-2222-2222-2222-222222222223'::uuid, 'Bombay Sapphire 750ml', 'Gin premium com botanicos', 129.90, NULL, true, false),
('22222222-2222-2222-2222-222222222222'::uuid, 'c2222222-2222-2222-2222-222222222224'::uuid, 'Corona Extra 330ml', 'Cerveja mexicana premium', 8.99, NULL, true, true);

-- Products for Zero Lounge
INSERT INTO public.products (store_id, category_id, name, description, price, original_price, is_available, is_featured) VALUES
('33333333-3333-3333-3333-333333333333'::uuid, 'c3333333-3333-3333-3333-333333333331'::uuid, 'Monster Energy 473ml', 'Energetico Monster classico', 9.99, 11.99, true, true),
('33333333-3333-3333-3333-333333333333'::uuid, 'c3333333-3333-3333-3333-333333333331'::uuid, 'Red Bull 355ml', 'Energetico Red Bull lata grande', 15.99, NULL, true, true),
('33333333-3333-3333-3333-333333333333'::uuid, 'c3333333-3333-3333-3333-333333333331'::uuid, 'Monster Ultra 473ml', 'Energetico Monster sem acucar', 9.99, NULL, true, false),
('33333333-3333-3333-3333-333333333333'::uuid, 'c3333333-3333-3333-3333-333333333332'::uuid, 'Agua Voss 375ml', 'Agua mineral premium norueguesa', 14.99, NULL, true, true),
('33333333-3333-3333-3333-333333333333'::uuid, 'c3333333-3333-3333-3333-333333333332'::uuid, 'Agua San Pellegrino 500ml', 'Agua mineral italiana com gas', 12.99, NULL, true, false),
('33333333-3333-3333-3333-333333333333'::uuid, 'c3333333-3333-3333-3333-333333333333'::uuid, 'Suco Del Valle 1L', 'Suco de uva integral', 8.99, NULL, true, false);

-- Products for Adega 037
INSERT INTO public.products (store_id, category_id, name, description, price, original_price, is_available, is_featured) VALUES
('44444444-4444-4444-4444-444444444444'::uuid, 'c4444444-4444-4444-4444-444444444441'::uuid, 'Macallan 12 anos 750ml', 'Single malt escoces premium', 599.90, 699.90, true, true),
('44444444-4444-4444-4444-444444444444'::uuid, 'c4444444-4444-4444-4444-444444444441'::uuid, 'Glenfiddich 15 anos 750ml', 'Single malt Speyside', 449.90, NULL, true, true),
('44444444-4444-4444-4444-444444444444'::uuid, 'c4444444-4444-4444-4444-444444444441'::uuid, 'Hennessy VS 700ml', 'Cognac frances', 279.90, 319.90, true, false),
('44444444-4444-4444-4444-444444444444'::uuid, 'c4444444-4444-4444-4444-444444444442'::uuid, 'Colorado Appia 600ml', 'Cerveja artesanal de mel', 24.90, NULL, true, true),
('44444444-4444-4444-4444-444444444444'::uuid, 'c4444444-4444-4444-4444-444444444442'::uuid, 'Wals Quadruppel 375ml', 'Cerveja artesanal belgian style', 32.90, NULL, true, false),
('44444444-4444-4444-4444-444444444444'::uuid, 'c4444444-4444-4444-4444-444444444443'::uuid, 'Casillero del Diablo Cabernet 750ml', 'Vinho tinto chileno', 49.90, 59.90, true, true);

-- Products for Bebidas ON
INSERT INTO public.products (store_id, category_id, name, description, price, original_price, is_available, is_featured) VALUES
('55555555-5555-5555-5555-555555555555'::uuid, 'c5555555-5555-5555-5555-555555555551'::uuid, 'Skol Caixa 12un Lata 350ml', 'Caixa de cerveja Skol', 42.90, 49.90, true, true),
('55555555-5555-5555-5555-555555555555'::uuid, 'c5555555-5555-5555-5555-555555555551'::uuid, 'Brahma Caixa 12un Lata 350ml', 'Caixa de cerveja Brahma', 45.90, NULL, true, true),
('55555555-5555-5555-5555-555555555555'::uuid, 'c5555555-5555-5555-5555-555555555551'::uuid, 'Heineken Caixa 12un Long Neck', 'Caixa de cerveja Heineken', 89.90, 99.90, true, false),
('55555555-5555-5555-5555-555555555555'::uuid, 'c5555555-5555-5555-5555-555555555552'::uuid, 'Smirnoff Vodka 998ml', 'Vodka russa classica', 34.90, 39.90, true, true),
('55555555-5555-5555-5555-555555555555'::uuid, 'c5555555-5555-5555-5555-555555555552'::uuid, 'Bacardi Carta Branca 980ml', 'Rum caribenho branco', 44.90, NULL, true, false),
('55555555-5555-5555-5555-555555555555'::uuid, 'c5555555-5555-5555-5555-555555555553'::uuid, 'Coca-Cola Pack 6un 350ml', 'Pack refrigerante Coca-Cola', 19.90, 24.90, true, true),
('55555555-5555-5555-5555-555555555555'::uuid, 'c5555555-5555-5555-5555-555555555554'::uuid, 'Combo Festa - 24 cervejas + gelo', 'Skol 24un + 5kg gelo', 89.90, 109.90, true, true),
('55555555-5555-5555-5555-555555555555'::uuid, 'c5555555-5555-5555-5555-555555555554'::uuid, 'Combo Churrasco - Cervejas + Refri', '12 cervejas + 2L Coca', 69.90, 79.90, true, true);
