import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Get order details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Nao autorizado" },
        { status: 401 }
      );
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        store:stores(id, name, logo_url, phone, whatsapp),
        order_items(*)
      `)
      .eq("id", id)
      .eq("customer_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Pedido nao encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PATCH - Update order (cancel)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Nao autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Only allow cancellation by customer
    if (status === "cancelled") {
      // Check if order belongs to user and is cancellable
      const { data: existingOrder, error: fetchError } = await supabase
        .from("orders")
        .select("status")
        .eq("id", id)
        .eq("customer_id", user.id)
        .single();

      if (fetchError || !existingOrder) {
        return NextResponse.json(
          { error: "Pedido nao encontrado" },
          { status: 404 }
        );
      }

      // Only pending orders can be cancelled
      if (existingOrder.status !== "pending") {
        return NextResponse.json(
          { error: "Este pedido nao pode ser cancelado" },
          { status: 400 }
        );
      }

      const { data: order, error } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", id)
        .eq("customer_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error cancelling order:", error);
        return NextResponse.json(
          { error: "Erro ao cancelar pedido" },
          { status: 500 }
        );
      }

      return NextResponse.json(order);
    }

    return NextResponse.json(
      { error: "Operacao nao permitida" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
