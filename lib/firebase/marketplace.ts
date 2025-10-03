import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { HarvestBatch, Review } from '@/types'; // Added Review type

export async function getHarvestBatches(): Promise<HarvestBatch[]> {
  const q = query(
    collection(db, 'batches'),
    where('status', '==', 'available')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as HarvestBatch[];
}

export async function getHarvestBatchById(id: string): Promise<HarvestBatch | null> {
  const docRef = doc(db, 'batches', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as HarvestBatch;
  } else {
    console.warn(`No batch found with ID: ${id}`);
    return null;
  }
}


export async function getProductReviews(productId: string): Promise<Review[]> {
  const reviewsCollectionRef = collection(db, 'batches', productId, 'reviews');
  const snapshot = await getDocs(reviewsCollectionRef);

  if (snapshot.empty) {
    return [];
  }

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Review[];
}