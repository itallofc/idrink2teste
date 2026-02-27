import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  
  const storeId = searchParams.get("store_id");
  const categoryId = searchParams.get("category_id");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  let query = supabase
    .from("products")
    .select(`
      *,
      store:stores(id, name, slug),
      category:categories(id, name, slug)
    `)
    .eq("is_available", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (storeId) {
    query = query.eq("store_id", storeId);
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, original_price, image_url, category_id, store_id, is_featured } = body;

  if (!name || !price || !store_id) {
    return NextResponse.json(
      { error: "name, price, and store_id are required" },
      { status: 400 }
    );
  }

  // Verify user owns the store
  const { data: store } = await supabase
    .from("stores")
    .select("owner_id")
    .eq("id", store_id)
    .single();

  if (!store || store.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Unauthorized - you do not own this store" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      description,
      price,
      original_price,
      image_url,
      category_id,
      store_id,
      is_featured: is_featured || false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
