import { stores, type Store, getStoreById } from "@/data/stores";
import { products, type Product, getProductsByStore } from "@/data/products";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// These functions currently use local mock data.
// When the FastAPI backend is ready, replace with real fetch calls.

export async function getStores(): Promise<Store[]> {
  // Future: return fetch(`${API_BASE}/stores`).then(r => r.json());
  void API_BASE;
  return stores;
}

export async function getStore(id: string): Promise<Store | undefined> {
  // Future: return fetch(`${API_BASE}/stores/${id}`).then(r => r.json());
  return getStoreById(id);
}

export async function getProducts(storeId: string): Promise<Product[]> {
  // Future: return fetch(`${API_BASE}/stores/${storeId}/products`).then(r => r.json());
  return getProductsByStore(storeId);
}

export async function getAllProducts(): Promise<Product[]> {
  // Future: return fetch(`${API_BASE}/products`).then(r => r.json());
  return products;
}

export async function loginUser(
  _email: string,
  _password: string
): Promise<{ success: boolean; token?: string }> {
  // Future: return fetch(`${API_BASE}/auth/login`, { method: 'POST', body: ... }).then(r => r.json());
  return { success: true, token: "mock-user-token" };
}

export async function loginMerchant(
  _email: string,
  _password: string
): Promise<{ success: boolean; token?: string }> {
  // Future: return fetch(`${API_BASE}/auth/merchant/login`, { method: 'POST', body: ... }).then(r => r.json());
  return { success: true, token: "mock-merchant-token" };
}
