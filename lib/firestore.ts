import { db } from './firebase';
import {
  collection,
  query,
  where,
  limit,
  getDocs
} from 'firebase/firestore';
import { HarvestBatch } from '@/types';

export async function getBatchById(batchId: string): Promise<HarvestBatch | null> {
  try {
    const batchesRef = collection(db, 'batches');
    const q = query(batchesRef, where('batchId', '==', batchId), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as HarvestBatch;
  } catch (error) {
    console.error('Error fetching batch by ID:', error);
    return null;
  }
}