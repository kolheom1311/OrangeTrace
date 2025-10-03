import { NextResponse } from "next/server";
import { getBatchesByFarmer, getPurchasesByFarmer } from "@/lib/firestore/farmer";

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();

    const [batches, purchases] = await Promise.all([
      getBatchesByFarmer(uid),
      getPurchasesByFarmer(uid),
    ]);

    return NextResponse.json({ batches, purchases });
  } catch (err: any) {
    console.error("Farmer Dashboard Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
