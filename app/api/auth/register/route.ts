import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp, adminDb } from "@/lib/firebase-admin";
import { generateEnableUserLink } from "@/lib/auth/utils";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name , phone , location , role } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const auth = getAuth(adminApp);

    
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
      disabled: true,
    });

    
    await adminDb.collection("users").doc(user.uid).set({
      uid: user.uid,
      name,
      email,
      phone,
      location,
      role,
      createdAt: new Date().toISOString(),
    });

    

    const enableLink = generateEnableUserLink(user.uid);

    
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email/verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_EMAIL_SECRET}`,
      },
      body: JSON.stringify({
        to: email,
        subject: "Welcome to OrangeTrace! Please Verify Your Email",
        variables: {
          name,
          verify_link: enableLink,
        },
      }),
    });

    if (!emailResponse.ok) {
      console.error("❌ Failed to send verification email");
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "User created and verification email sent." });

  } catch (error: any) {
    console.error("❌ Registration error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
