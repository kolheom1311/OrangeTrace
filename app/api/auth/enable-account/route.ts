import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase-admin";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "9b562afc5570c4e4dda067fc7cd7908f883259698998b19040df6a41fa0195deab42f26637e28bd7addc771c6118493bcec7186ee90c0149f909282c4a57db74";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/verify-error", req.url));
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string };

    const auth = getAuth(adminApp);
    
    await auth.updateUser(decoded.uid, { disabled: false });
    
    return NextResponse.json({ success: true });
} catch (error: any) {
  console.error("Error enabling user:", error.message);
  return new NextResponse(JSON.stringify({ success: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
  }
}
