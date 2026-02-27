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
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (storeError || !store) {
      return NextResponse.json(
        { error: "Loja nao encontrada" },
        { status: 404 }
      );
    }

    // Get categories with products
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select(`
        *,
        products (*)
      `)
      .eq("store_id", store.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
    }

    return NextResponse.json({
      ...store,
      categories: categories || [],
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
