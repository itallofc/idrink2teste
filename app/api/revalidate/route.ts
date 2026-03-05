import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, storeSlug } = body;

    switch (type) {
      case "product":
        // Revalidate specific product page
        if (id) {
          revalidatePath(`/produtos/${id}`);
        }
        // Revalidate store page if provided
        if (storeSlug) {
          revalidatePath(`/store/${storeSlug}`);
        }
        // Revalidate home page to show new products
        revalidatePath("/home");
        break;

      case "store":
        // Revalidate store page
        if (storeSlug) {
          revalidatePath(`/store/${storeSlug}`);
        }
        // Revalidate home page to show new store
        revalidatePath("/home");
        break;

      case "all":
        // Revalidate everything
        revalidatePath("/", "layout");
        break;

      default:
        return NextResponse.json(
          { error: "Invalid type. Use 'product', 'store', or 'all'" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${type}${id ? ` (${id})` : ""}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
