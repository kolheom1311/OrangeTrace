import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin'; 
import { CartItem } from '@/types';


export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const cartSnapshot = await adminDb.collection('users').doc(userId).collection('cart').get();
    if (cartSnapshot.empty) {
      return NextResponse.json([]);
    }

    const cartItems: CartItem[] = cartSnapshot.docs.map(doc => doc.data() as CartItem);
    return NextResponse.json(cartItems);

  } catch (error) {
    console.error('Error in cart GET:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { batch, userId, quantity } = body;

    if (!batch || !userId || !quantity) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const cartItemRef = adminDb.collection('users').doc(userId).collection('cart').doc(batch.id);
    const doc = await cartItemRef.get();

    if (doc.exists) {
        
        await cartItemRef.update({
            selectedQuantity: doc.data()?.selectedQuantity + quantity,
        });
        return NextResponse.json({ success: true, message: "Quantity updated" });
    } else {
        
        const newCartItem: CartItem = {
          id: batch.id,
          variety: batch.variety,
          pricePerKg: batch.pricePerKg,
          quantity: batch.quantity, 
          selectedQuantity: quantity, 
          image: batch.images?.[0] ?? '',
          farmLocation: batch.farmLocation,
          addedAt: new Date().toISOString(),
        };
        await cartItemRef.set(newCartItem);
        return NextResponse.json({ success: true, message: "Item added" });
    }
  } catch (error) {
    console.error('Error in cart POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
          return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const { itemId, newQuantity } = await req.json();
        if (!itemId || newQuantity === undefined) {
            return NextResponse.json({ error: 'Missing itemId or newQuantity' }, { status: 400 });
        }

        const itemRef = adminDb.collection('users').doc(userId).collection('cart').doc(itemId);
        await itemRef.update({ selectedQuantity: newQuantity });

        return NextResponse.json({ success: true, message: 'Quantity updated' });
    } catch (error) {
        console.error('Error in cart PUT:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const userId = req.headers.get('x-user-id');
        if (!userId) {
          return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }

        const { itemId } = await req.json();
        if (!itemId) {
            return NextResponse.json({ error: 'Missing itemId' }, { status: 400 });
        }

        await adminDb.collection('users').doc(userId).collection('cart').doc(itemId).delete();

        return NextResponse.json({ success: true, message: 'Item removed' });
    } catch (error) {
        console.error('Error in cart DELETE:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
