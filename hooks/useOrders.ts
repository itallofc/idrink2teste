"use client";

import useSWR from "swr";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  store_id: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivering" | "delivered" | "cancelled";
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  payment_method: "pix" | "credit_card" | "debit_card" | "cash" | null;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  delivery_address: string | null;
  delivery_notes: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  store?: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
  items?: OrderItem[];
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
});

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR<Order[]>(
    "/api/orders",
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  return {
    orders: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useOrder(id: string) {
  const { data, error, isLoading, mutate } = useSWR<Order>(
    id ? `/api/orders/${id}` : null,
    fetcher
  );

  return {
    order: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export async function createOrder(orderData: {
  store_id: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
  }[];
  delivery_address: string;
  delivery_notes?: string;
  payment_method: string;
}) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create order");
  }

  return response.json();
}
