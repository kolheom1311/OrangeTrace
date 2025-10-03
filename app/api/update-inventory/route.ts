import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItems } = await req.json();
    if (!cartItems || !Array.isArray(cartItems)) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    await adminDb.runTransaction(async (transaction) => {
      for (const item of cartItems) {
        // ✅ Target the correct Firestore path
        const batchRef = adminDb.collection("batches").doc(item.id);
        const batchSnap = await transaction.get(batchRef);

        if (!batchSnap.exists) {
          throw new Error(`Batch ${item.variety || item.id} not found`);
        }

        const currentQuantity = batchSnap.data()?.quantity;
        if (typeof currentQuantity !== "number") {
          throw new Error(`Invalid quantity field in batch ${item.id}`);
        }

        if (currentQuantity < item.selectedQuantity) {
          throw new Error(`Insufficient stock for ${item.variety || item.id}`);
        }

        transaction.update(batchRef, {
          quantity: currentQuantity - item.selectedQuantity,
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Inventory update error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update inventory" },
      { status: 500 }
    );
  }
}
