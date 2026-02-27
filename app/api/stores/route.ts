import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: stores, error } = await supabase
      .from("stores")
      .select("*")
      .eq("is_active", true)
      .order("rating", { ascending: false });

    if (error) {
      console.error("Error fetching stores:", error);
      return NextResponse.json(
        { error: "Erro ao buscar lojas" },
        { status: 500 }
      );
    }

    return NextResponse.json(stores);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
