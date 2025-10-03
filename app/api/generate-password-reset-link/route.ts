import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase-admin";
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const auth = getAuth(adminApp);
    const firebaseLink = await auth.generatePasswordResetLink(email);
    const url = new URL(firebaseLink);
    const oobCode = url.searchParams.get("oobCode");
    if (!oobCode) {
      return NextResponse.json({ error: "Failed to extract oobCode" }, { status: 500 });
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const customResetLink = `${baseUrl}/reset-password?oobCode=${oobCode}`;
    const emailResponse = await fetch(`${baseUrl}/api/send-email/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_EMAIL_SECRET}`,
      },
      body: JSON.stringify({
        to: email,
        subject: "Reset your OrangeTrace password",
        variables: {
          reset_link: customResetLink,
        },
      }),
    });
    if (!emailResponse.ok) {
      console.error("❌ Failed to send reset email");
      return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 });
    }
    return NextResponse.json({ message: "Reset link sent successfully" });
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}