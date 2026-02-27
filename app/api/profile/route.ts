import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Get current user profile
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

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      // Profile might not exist yet, return user data
      return NextResponse.json({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        phone: user.user_metadata?.phone || null,
        role: user.user_metadata?.role || "customer",
      });
    }

    return NextResponse.json({
      ...profile,
      email: user.email,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PATCH - Update profile
export async function PATCH(request: Request) {
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
    const { full_name, phone, avatar_url } = body;

    const { data: profile, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name,
        phone,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar perfil" },
        { status: 500 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
