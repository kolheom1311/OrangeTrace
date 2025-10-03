import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    const doc = await orderRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = doc.data();

    if (orderData?.userId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const serializedOrder = {
        ...orderData,
        createdAt: orderData?.createdAt.toDate().toISOString(),
    };

    return NextResponse.json(serializedOrder);

  } catch (error) {
    console.error(`Error fetching order ${params.orderId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
