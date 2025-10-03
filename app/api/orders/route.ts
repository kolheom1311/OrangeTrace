import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    if (ordersSnapshot.empty) {
      return NextResponse.json([]);
    }

    const orders = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        orderId: data.id,
        createdAt: data.createdAt
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
        status: data.orderStatus,
        items: data.items,
        total: data.totalAmount,
        deliveryAddress: data.deliveryAddress,
      };
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  try {
    const {
      deliveryAddress,
      cartItems,
      total,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = await req.json();

    if (!deliveryAddress || !cartItems || !total || !razorpay_payment_id) {
      return NextResponse.json(
        { error: "Missing required order information" },
        { status: 400 }
      );
    }

    const orderId = await adminDb.runTransaction(async (transaction) => {
      const newOrderRef = adminDb.collection("orders").doc();
      const userCartRef = adminDb.collection("users").doc(userId).collection("cart");
      const cartSnapshot = await transaction.get(userCartRef);

      const orderData = {
        id: newOrderRef.id,
        userId,
        createdAt: FieldValue.serverTimestamp(),

        orderStatus: "Placed",
        deliveryAddress,
        items: cartItems,
        totalAmount: total,
        paymentDetails: {
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          signature: razorpay_signature,
          method: "Razorpay",
          status: "Paid",
        },
      };
      transaction.set(newOrderRef, orderData);

      if (!cartSnapshot.empty) {
        cartSnapshot.docs.forEach((doc) => {
          transaction.delete(doc.ref);
        });
      }

      return newOrderRef.id;
    });

    console.log(
      `Successfully created order ${orderId} and cleared cart for user ${userId}.`
    );
    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    console.error("Error creating order in transaction:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
