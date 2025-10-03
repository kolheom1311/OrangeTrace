import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  orderBy 
} from "firebase/firestore";
import { HarvestBatch, Purchase, Feedback } from "@/types";

export async function getHarvestBatches(): Promise<HarvestBatch[]> {
  try {
    const q = query(collection(db, "batches"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt || data.createdAt)
      } as HarvestBatch;
    });
  } catch (error) {
    console.error("Error fetching harvest batches:", error);
    return [];
  }
}

export async function getPurchasesByBuyer(buyerId: string): Promise<Purchase[]> {
  try {
    const q = query(
      collection(db, "orders"), 
      where("buyerId", "==", buyerId),
      orderBy("purchaseDate", "desc")
    );
    const snapshot = await getDocs(q);

    const purchases: Purchase[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const batchRef = doc(db, "batches", data.batchId);
      const batchSnap = await getDoc(batchRef);

      let pricePerKg = 0;
      if (batchSnap.exists()) {
        pricePerKg = Number(batchSnap.data().pricePerKg) || 0;
      }

      const quantity = Number(data.quantity) || 0;
      const totalPrice = quantity * pricePerKg;

      purchases.push({
        id: docSnap.id,
        buyerId: data.buyerId,
        batchId: data.batchId,
        status: data.status,
        purchaseDate: data.purchaseDate?.toDate?.() || new Date(data.purchaseDate),
        quantity,
        totalPrice,
        pricePerKg,
      } as Purchase);
    }

    return purchases;
  } catch (error) {
    console.error("Error fetching purchases by buyer:", error);
    return [];
  }
}

export async function getPurchasesByFarmer(farmerId: string): Promise<Purchase[]> {
  try {
    const batchesQuery = query(
      collection(db, "batches"), 
      where("farmerId", "==", farmerId)
    );
    const batchesSnapshot = await getDocs(batchesQuery);
    const farmerBatchIds = batchesSnapshot.docs.map(doc => doc.id);

    if (farmerBatchIds.length === 0) {
      return [];
    }

    const purchases: Purchase[] = [];
    
    for (let i = 0; i < farmerBatchIds.length; i += 10) {
      const batchChunk = farmerBatchIds.slice(i, i + 10);
      const ordersQuery = query(
        collection(db, "orders"),
        where("batchId", "in", batchChunk),
        orderBy("purchaseDate", "desc")
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      for (const docSnap of ordersSnapshot.docs) {
        const data = docSnap.data();

        const batchRef = doc(db, "batches", data.batchId);
        const batchSnap = await getDoc(batchRef);

        let pricePerKg = 0;
        if (batchSnap.exists()) {
          pricePerKg = Number(batchSnap.data().pricePerKg) || 0;
        }

        const quantity = Number(data.quantity) || 0;
        const totalPrice = quantity * pricePerKg;

        purchases.push({
          id: docSnap.id,
          buyerId: data.buyerId,
          batchId: data.batchId,
          status: data.status,
          purchaseDate: data.purchaseDate?.toDate?.() || new Date(data.purchaseDate),
          quantity,
          totalPrice,
          pricePerKg,
        } as Purchase);
      }
    }

    return purchases;
  } catch (error) {
    console.error("Error fetching purchases by farmer:", error);
    return [];
  }
}

export async function getFeedbacks(): Promise<Feedback[]> {
  try {
    const q = query(
      collection(db, "feedbacks"), 
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt || data.createdAt)
      } as Feedback;
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
}

export async function getFeedbacksByFarmer(farmerId: string): Promise<Feedback[]> {
  try {
    const batchesQuery = query(
      collection(db, "batches"), 
      where("farmerId", "==", farmerId)
    );
    const batchesSnapshot = await getDocs(batchesQuery);
    const farmerBatchIds = batchesSnapshot.docs.map(doc => doc.id);

    if (farmerBatchIds.length === 0) {
      return [];
    }

    const feedbacks: Feedback[] = [];
    
    for (let i = 0; i < farmerBatchIds.length; i += 10) {
      const batchChunk = farmerBatchIds.slice(i, i + 10);
      const feedbacksQuery = query(
        collection(db, "feedbacks"),
        where("batchId", "in", batchChunk),
        orderBy("createdAt", "desc")
      );
      const feedbacksSnapshot = await getDocs(feedbacksQuery);

      feedbacksSnapshot.docs.forEach(doc => {
        const data = doc.data();
        feedbacks.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt || data.createdAt)
        } as Feedback);
      });
    }

    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedbacks by farmer:", error);
    return [];
  }
}

export async function getBatchById(batchId: string): Promise<HarvestBatch | null> {
  try {
    const docRef = doc(db, "batches", batchId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt || data.createdAt)
      } as HarvestBatch;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching batch by ID:", error);
    return null;
  }
}