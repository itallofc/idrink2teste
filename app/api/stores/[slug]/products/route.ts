import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    
    // Get store by slug
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id")
      .eq("slug", slug)
      .single();

    if (storeError || !store) {
      return NextResponse.json(
        { error: "Loja nao encontrada" },
        { status: 404 }
      );
    }

    // Get products for this store
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(`
        *,
        category:categories(id, name)
      `)
      .eq("store_id", store.id)
      .eq("is_available", true)
      .order("is_featured", { ascending: false });

    if (productsError) {
      console.error("Error fetching products:", productsError);
      return NextResponse.json(
        { error: "Erro ao buscar produtos" },
        { status: 500 }
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
