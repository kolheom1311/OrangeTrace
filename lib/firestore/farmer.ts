import { adminDb } from "@/lib/firebase-admin";

export async function getBatchesByFarmer(farmerId: string) {
  const snapshot = await adminDb
    .collection("batches")
    .where("farmerId", "==", farmerId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getPurchasesByFarmer(farmerId: string) {
  const snapshot = await adminDb
    .collection("purchases")
    .where("farmerId", "==", farmerId)
    .orderBy("purchaseDate", "desc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
