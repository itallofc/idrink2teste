import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - List user's orders
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Nao autorizado" },
        { status: 401 }
      );
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        store:stores(id, name, logo_url),
        order_items(*)
      `)
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { error: "Erro ao buscar pedidos" },
        { status: 500 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Nao autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      store_id,
      items,
      delivery_address,
      delivery_city,
      delivery_state,
      delivery_zip,
      payment_method,
      customer_notes,
    } = body;

    // Validate required fields
    if (!store_id || !items || items.length === 0 || !delivery_address) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    // Get store info for delivery fee
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("delivery_fee, min_order_value")
      .eq("id", store_id)
      .single();

    if (storeError || !store) {
      return NextResponse.json(
        { error: "Loja nao encontrada" },
        { status: 404 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((acc: number, item: { quantity: number; unit_price: number }) => 
      acc + (item.quantity * item.unit_price), 0
    );
    
    if (subtotal < store.min_order_value) {
      return NextResponse.json(
        { error: `Pedido minimo: R$ ${store.min_order_value.toFixed(2)}` },
        { status: 400 }
      );
    }

    const delivery_fee = store.delivery_fee;
    const total = subtotal + delivery_fee;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        store_id,
        subtotal,
        delivery_fee,
        total,
        payment_method,
        delivery_address,
        delivery_city,
        delivery_state,
        delivery_zip,
        customer_notes,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Erro ao criar pedido" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: { product_id: string; product_name: string; quantity: number; unit_price: number; notes?: string }) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.quantity * item.unit_price,
      notes: item.notes,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Still return order, items error is not critical
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
