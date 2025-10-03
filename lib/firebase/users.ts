import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Farmer } from '@/types';

export async function getFarmerById(id: string): Promise<Farmer | null> {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Farmer;
  } else {
    console.warn(`No farmer found with ID: ${id}`);
    return null;
  }
}