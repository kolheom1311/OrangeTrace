import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function getHarvestBatches() {
  const snapshot = await getDocs(collection(db, 'batches'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
