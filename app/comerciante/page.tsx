"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type Store as StoreType } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  Store,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  LogOut,
  Loader2,
  Plus,
  Settings,
  ShoppingBag,
  Edit,
  Trash2,
  Save,
  X,
  ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";

interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category_id: string | null;
  is_available: boolean;
  stock_quantity: number;
}

interface Category {
  id: string;
  store_id: string;
  name: string;
  is_active: boolean;
}

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: string;
  total: number;
  created_at: string;
  profiles?: {
    full_name: string | null;
  };
}

type TabType = "dashboard" | "loja" | "produtos" | "pedidos";

export default function ComerciantePage() {
  const router = useRouter();
  const { user, profile, store, isLoading: authLoading, signOut, refreshStore } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Store form state
  const [storeForm, setStoreForm] = useState({
    name: "",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zip_code: "",
    delivery_fee: "",
    min_order_value: "",
    delivery_time_min: "",
    delivery_time_max: "",
    is_open: false,
  });
  const [isSavingStore, setIsSavingStore] = useState(false);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    image_url: "",
    category_id: "",
    is_available: true,
    stock_quantity: "",
  });
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      const role = localStorage.getItem("idrink_user_role");
      if (role !== "merchant") {
        router.push("/onboarding");
        return;
      }
    } else if (profile && profile.role !== "merchant") {
      router.push("/home");
      return;
    }

    loadData();
  }, [authLoading, user, profile, router]);

  useEffect(() => {
    if (store) {
      setStoreForm({
        name: store.name || "",
        tagline: store.tagline || "",
        description: store.description || "",
        phone: store.phone || "",
        email: store.email || "",
        street: store.street || "",
        number: store.number || "",
        neighborhood: store.neighborhood || "",
        city: store.city || "",
        state: store.state || "",
        zip_code: store.zip_code || "",
        delivery_fee: store.delivery_fee?.toString() || "",
        min_order_value: store.min_order_value?.toString() || "",
        delivery_time_min: store.delivery_time_min?.toString() || "",
        delivery_time_max: store.delivery_time_max?.toString() || "",
        is_open: store.is_open || false,
      });
    }
  }, [store]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (store?.id) {
        // Load products
        const { data: productsData } = await supabase
          .from("products")
          .select("*")
          .eq("store_id", store.id)
          .order("created_at", { ascending: false });

        if (productsData) setProducts(productsData);

        // Load categories
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("*")
          .eq("store_id", store.id)
          .order("sort_order", { ascending: true });

        if (categoriesData) setCategories(categoriesData);

        // Load orders
        const { data: ordersData } = await supabase
          .from("orders")
          .select(`
            *,
            profiles:customer_id (
              full_name
            )
          `)
          .eq("store_id", store.id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (ordersData) setOrders(ordersData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStore = async () => {
    if (!user) return;
    setIsSavingStore(true);

    try {
      const slug = storeForm.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const storeData = {
        owner_id: user.id,
        name: storeForm.name,
        slug,
        tagline: storeForm.tagline || null,
        description: storeForm.description || null,
        phone: storeForm.phone || null,
        email: storeForm.email || null,
        street: storeForm.street || null,
        number: storeForm.number || null,
        neighborhood: storeForm.neighborhood || null,
        city: storeForm.city || null,
        state: storeForm.state || null,
        zip_code: storeForm.zip_code || null,
        delivery_fee: storeForm.delivery_fee ? parseFloat(storeForm.delivery_fee) : null,
        min_order_value: storeForm.min_order_value ? parseFloat(storeForm.min_order_value) : null,
        delivery_time_min: storeForm.delivery_time_min ? parseInt(storeForm.delivery_time_min) : null,
        delivery_time_max: storeForm.delivery_time_max ? parseInt(storeForm.delivery_time_max) : null,
        is_open: storeForm.is_open,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      if (store?.id) {
        await supabase
          .from("stores")
          .update(storeData)
          .eq("id", store.id);
      } else {
        await supabase
          .from("stores")
          .insert(storeData);
      }

      await refreshStore();
    } catch (error) {
      console.error("Error saving store:", error);
    } finally {
      setIsSavingStore(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!store?.id) return;
    setIsSavingProduct(true);

    try {
      const productData = {
        store_id: store.id,
        name: productForm.name,
        description: productForm.description || null,
        price: parseFloat(productForm.price),
        original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
        image_url: productForm.image_url || null,
        category_id: productForm.category_id || null,
        is_available: productForm.is_available,
        stock_quantity: productForm.stock_quantity ? parseInt(productForm.stock_quantity) : 0,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct) {
        await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
      } else {
        await supabase
          .from("products")
          .insert(productData);
      }

      // Reset form and reload
      setProductForm({
        name: "",
        description: "",
        price: "",
        original_price: "",
        image_url: "",
        category_id: "",
        is_available: true,
        stock_quantity: "",
      });
      setEditingProduct(null);
      setShowProductForm(false);
      await loadData();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      await loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      image_url: product.image_url || "",
      category_id: product.category_id || "",
      is_available: product.is_available,
      stock_quantity: product.stock_quantity.toString(),
    });
    setShowProductForm(true);
  };

  const handleAddCategory = async () => {
    if (!store?.id || !newCategoryName.trim()) return;

    try {
      await supabase
        .from("categories")
        .insert({
          store_id: store.id,
          name: newCategoryName.trim(),
          is_active: true,
          sort_order: categories.length,
        });

      setNewCategoryName("");
      setShowCategoryForm(false);
      await loadData();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await supabase
        .from("orders")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      await loadData();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("idrink_user_name");
    localStorage.removeItem("idrink_user_role");
    router.push("/onboarding");
  };

  const merchantName = profile?.full_name || user?.user_metadata?.full_name || localStorage.getItem("idrink_user_name") || "Comerciante";

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: typeof Store }[] = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "loja", label: "Minha Loja", icon: Settings },
    { id: "produtos", label: "Produtos", icon: ShoppingBag },
    { id: "pedidos", label: "Pedidos", icon: Package },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-2xl font-bold text-primary">
            {store?.name?.charAt(0).toUpperCase() || merchantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {store?.name || `Ola, ${merchantName}!`}
            </h1>
            <p className="text-muted-foreground">
              {store ? "Painel da sua loja" : "Configure sua loja para comecar a vender"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/20"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <DashboardTab
          store={store}
          products={products}
          orders={orders}
          merchantName={merchantName}
        />
      )}

      {/* Store Settings Tab */}
      {activeTab === "loja" && (
        <StoreSettingsTab
          storeForm={storeForm}
          setStoreForm={setStoreForm}
          isSaving={isSavingStore}
          onSave={handleSaveStore}
          hasStore={!!store}
        />
      )}

      {/* Products Tab */}
      {activeTab === "produtos" && (
        <ProductsTab
          products={products}
          categories={categories}
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          productForm={productForm}
          setProductForm={setProductForm}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          isSaving={isSavingProduct}
          onSaveProduct={handleSaveProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          showCategoryForm={showCategoryForm}
          setShowCategoryForm={setShowCategoryForm}
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          onAddCategory={handleAddCategory}
          hasStore={!!store}
        />
      )}

      {/* Orders Tab */}
      {activeTab === "pedidos" && (
        <OrdersTab
          orders={orders}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}
    </div>
  );
}

// Dashboard Tab Component
function DashboardTab({ 
  store, 
  products, 
  orders,
  merchantName 
}: { 
  store: StoreType | null; 
  products: Product[];
  orders: Order[];
  merchantName: string;
}) {
  const todayOrders = orders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.created_at).toDateString() === today;
  });

  const totalRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      icon: DollarSign,
      label: "Faturamento Total",
      value: formatCurrency(totalRevenue),
      change: "+18%",
    },
    {
      icon: Package,
      label: "Pedidos Hoje",
      value: todayOrders.length.toString(),
      change: "+5%",
    },
    {
      icon: ShoppingBag,
      label: "Produtos Cadastrados",
      value: products.length.toString(),
      change: "",
    },
    {
      icon: Users,
      label: "Loja Aberta",
      value: store?.is_open ? "Sim" : "Nao",
      change: "",
    },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-500",
    confirmed: "bg-blue-500/15 text-blue-500",
    preparing: "bg-orange-500/15 text-orange-500",
    delivering: "bg-cyan-500/15 text-cyan-500",
    delivered: "bg-green-500/15 text-green-400",
    cancelled: "bg-destructive/15 text-destructive",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    delivering: "A caminho",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };

  return (
    <div>
      {!store && (
        <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <p className="text-sm text-yellow-500">
            <strong>Atencao:</strong> Configure sua loja na aba &quot;Minha Loja&quot; para comecar a receber pedidos.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              {stat.change && (
                <span className="flex items-center gap-1 text-sm font-medium text-green-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-foreground">Pedidos Recentes</h2>
        {orders.length > 0 ? (
          <div className="flex flex-col gap-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="glass flex items-center justify-between rounded-2xl p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {order.profiles?.full_name || "Cliente"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.order_number}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-lg px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(order.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-8 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum pedido ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Store Settings Tab Component
function StoreSettingsTab({
  storeForm,
  setStoreForm,
  isSaving,
  onSave,
  hasStore,
}: {
  storeForm: typeof import("./page").default extends () => unknown ? never : {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    email: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    delivery_fee: string;
    min_order_value: string;
    delivery_time_min: string;
    delivery_time_max: string;
    is_open: boolean;
  };
  setStoreForm: (form: typeof storeForm) => void;
  isSaving: boolean;
  onSave: () => void;
  hasStore: boolean;
}) {
  return (
    <div className="space-y-6">
      {!hasStore && (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm text-primary">
            <strong>Bem-vindo!</strong> Preencha os dados abaixo para criar sua loja e comecar a vender.
          </p>
        </div>
      )}

      {/* Basic Info */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Informacoes Basicas</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Nome da Loja *</label>
            <input
              type="text"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              placeholder="Ex: Adega do Joao"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Slogan</label>
            <input
              type="text"
              value={storeForm.tagline}
              onChange={(e) => setStoreForm({ ...storeForm, tagline: e.target.value })}
              placeholder="Ex: As melhores bebidas da cidade"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Descricao</label>
            <textarea
              value={storeForm.description}
              onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
              placeholder="Descreva sua loja..."
              rows={3}
              className="w-full resize-none rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Contato</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Telefone/WhatsApp</label>
            <input
              type="tel"
              value={storeForm.phone}
              onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
              placeholder="(00) 00000-0000"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
            <input
              type="email"
              value={storeForm.email}
              onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              placeholder="loja@email.com"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Endereco</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Rua</label>
            <input
              type="text"
              value={storeForm.street}
              onChange={(e) => setStoreForm({ ...storeForm, street: e.target.value })}
              placeholder="Rua Example"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Numero</label>
            <input
              type="text"
              value={storeForm.number}
              onChange={(e) => setStoreForm({ ...storeForm, number: e.target.value })}
              placeholder="123"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Bairro</label>
            <input
              type="text"
              value={storeForm.neighborhood}
              onChange={(e) => setStoreForm({ ...storeForm, neighborhood: e.target.value })}
              placeholder="Centro"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Cidade</label>
            <input
              type="text"
              value={storeForm.city}
              onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
              placeholder="Sao Paulo"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Estado</label>
            <input
              type="text"
              value={storeForm.state}
              onChange={(e) => setStoreForm({ ...storeForm, state: e.target.value })}
              placeholder="SP"
              maxLength={2}
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">CEP</label>
            <input
              type="text"
              value={storeForm.zip_code}
              onChange={(e) => setStoreForm({ ...storeForm, zip_code: e.target.value })}
              placeholder="00000-000"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Entrega</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Taxa de Entrega (R$)</label>
            <input
              type="number"
              step="0.01"
              value={storeForm.delivery_fee}
              onChange={(e) => setStoreForm({ ...storeForm, delivery_fee: e.target.value })}
              placeholder="5.00"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Pedido Minimo (R$)</label>
            <input
              type="number"
              step="0.01"
              value={storeForm.min_order_value}
              onChange={(e) => setStoreForm({ ...storeForm, min_order_value: e.target.value })}
              placeholder="20.00"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Tempo Min (min)</label>
            <input
              type="number"
              value={storeForm.delivery_time_min}
              onChange={(e) => setStoreForm({ ...storeForm, delivery_time_min: e.target.value })}
              placeholder="30"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Tempo Max (min)</label>
            <input
              type="number"
              value={storeForm.delivery_time_max}
              onChange={(e) => setStoreForm({ ...storeForm, delivery_time_max: e.target.value })}
              placeholder="60"
              className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Status da Loja</h3>
            <p className="text-sm text-muted-foreground">
              {storeForm.is_open ? "Sua loja esta aberta e recebendo pedidos" : "Sua loja esta fechada"}
            </p>
          </div>
          <button
            onClick={() => setStoreForm({ ...storeForm, is_open: !storeForm.is_open })}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all ${
              storeForm.is_open
                ? "bg-green-500/15 text-green-500"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {storeForm.is_open ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            {storeForm.is_open ? "Aberta" : "Fechada"}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={isSaving || !storeForm.name.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            {hasStore ? "Salvar Alteracoes" : "Criar Loja"}
          </>
        )}
      </button>
    </div>
  );
}

// Products Tab Component
function ProductsTab({
  products,
  categories,
  showProductForm,
  setShowProductForm,
  productForm,
  setProductForm,
  editingProduct,
  setEditingProduct,
  isSaving,
  onSaveProduct,
  onEditProduct,
  onDeleteProduct,
  showCategoryForm,
  setShowCategoryForm,
  newCategoryName,
  setNewCategoryName,
  onAddCategory,
  hasStore,
}: {
  products: Product[];
  categories: Category[];
  showProductForm: boolean;
  setShowProductForm: (show: boolean) => void;
  productForm: {
    name: string;
    description: string;
    price: string;
    original_price: string;
    image_url: string;
    category_id: string;
    is_available: boolean;
    stock_quantity: string;
  };
  setProductForm: (form: typeof productForm) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  isSaving: boolean;
  onSaveProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  showCategoryForm: boolean;
  setShowCategoryForm: (show: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
  onAddCategory: () => void;
  hasStore: boolean;
}) {
  if (!hasStore) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <Store className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">Configure sua loja primeiro</p>
        <p className="mt-2 text-muted-foreground">
          Voce precisa criar sua loja antes de adicionar produtos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            setEditingProduct(null);
            setProductForm({
              name: "",
              description: "",
              price: "",
              original_price: "",
              image_url: "",
              category_id: "",
              is_available: true,
              stock_quantity: "",
            });
            setShowProductForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-all hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Adicionar Produto
        </button>
        <button
          onClick={() => setShowCategoryForm(true)}
          className="flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2.5 font-medium text-foreground transition-all hover:bg-secondary"
        >
          <Plus className="h-4 w-4" />
          Nova Categoria
        </button>
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da categoria"
              className="flex-1 rounded-xl border border-border/50 bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={onAddCategory}
              disabled={!newCategoryName.trim()}
              className="rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-foreground disabled:opacity-50"
            >
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowCategoryForm(false);
                setNewCategoryName("");
              }}
              className="rounded-xl p-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Product Form */}
      {showProductForm && (
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </h3>
            <button
              onClick={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nome *</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                placeholder="Nome do produto"
                className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Categoria</label>
              <select
                value={productForm.category_id}
                onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">Descricao</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                placeholder="Descricao do produto"
                rows={2}
                className="w-full resize-none rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Preco (R$) *</label>
              <input
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                placeholder="0.00"
                className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Preco Original (promocao)</label>
              <input
                type="number"
                step="0.01"
                value={productForm.original_price}
                onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                placeholder="0.00"
                className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Estoque</label>
              <input
                type="number"
                value={productForm.stock_quantity}
                onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                placeholder="0"
                className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">URL da Imagem</label>
              <input
                type="url"
                value={productForm.image_url}
                onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_available"
                checked={productForm.is_available}
                onChange={(e) => setProductForm({ ...productForm, is_available: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <label htmlFor="is_available" className="text-sm font-medium text-foreground">
                Produto disponivel
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onSaveProduct}
              disabled={isSaving || !productForm.name.trim() || !productForm.price}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {editingProduct ? "Salvar Alteracoes" : "Criar Produto"}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      {products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="glass overflow-hidden rounded-2xl">
              <div className="aspect-video bg-muted/50 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
                      product.is_available
                        ? "bg-green-500/15 text-green-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.is_available ? "Disponivel" : "Indisponivel"}
                  </span>
                </div>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {product.description || "Sem descricao"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-secondary py-2 text-sm font-medium text-foreground transition-all hover:bg-secondary/80"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="flex items-center justify-center rounded-lg bg-destructive/10 px-3 py-2 text-destructive transition-all hover:bg-destructive/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">Nenhum produto cadastrado</p>
          <p className="mt-2 text-muted-foreground">
            Clique em &quot;Adicionar Produto&quot; para comecar.
          </p>
        </div>
      )}
    </div>
  );
}

// Orders Tab Component
function OrdersTab({
  orders,
  onUpdateStatus,
}: {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: string) => void;
}) {
  const statusOptions = [
    { value: "pending", label: "Pendente" },
    { value: "confirmed", label: "Confirmado" },
    { value: "preparing", label: "Preparando" },
    { value: "delivering", label: "A caminho" },
    { value: "delivered", label: "Entregue" },
    { value: "cancelled", label: "Cancelado" },
  ];

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-500",
    confirmed: "bg-blue-500/15 text-blue-500",
    preparing: "bg-orange-500/15 text-orange-500",
    delivering: "bg-cyan-500/15 text-cyan-500",
    delivered: "bg-green-500/15 text-green-400",
    cancelled: "bg-destructive/15 text-destructive",
  };

  if (orders.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">Nenhum pedido ainda</p>
        <p className="mt-2 text-muted-foreground">
          Os pedidos dos clientes aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="glass rounded-2xl p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-foreground">
                  {order.order_number}
                </p>
                <span className={`rounded-lg px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>
                  {statusOptions.find(s => s.value === order.status)?.label || order.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Cliente: {order.profiles?.full_name || "Nao identificado"}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="text-lg font-bold text-primary">
                {formatCurrency(order.total)}
              </p>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="rounded-lg border border-border/50 bg-input px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
