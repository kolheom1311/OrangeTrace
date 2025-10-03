import { getFirestore } from 'firebase-admin/firestore';
import { CartItem, HarvestBatch } from '@/types';

const db = getFirestore();

export async function addToCart(userId: string, batch: HarvestBatch, quantity: number) {
  const cartRef = db.collection('users').doc(userId).collection('cart').doc(batch.id);

  const cartItem: CartItem = {
    id: batch.id,
    variety: batch.variety,
    pricePerKg: batch.pricePerKg,
    quantity: batch.quantity,
    selectedQuantity: quantity,
    image: batch.images?.[0] ?? '',
    farmLocation: batch.farmLocation,
    addedAt: new Date().toISOString(),
  };

  await cartRef.set(cartItem);
}
