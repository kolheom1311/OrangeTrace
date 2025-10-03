"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Package, Home } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="flex flex-col items-center text-center">
      <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Thank you for your purchase. Your fresh oranges are on their way.
      </p>

      {orderId && (
        <Card className="w-full max-w-md mb-8 bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-center">Your Order ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-mono tracking-wider text-center bg-background p-3 rounded-md">
              {orderId}
            </p>
            <CardDescription className="text-center mt-3">
              You can use this ID to track your order status.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
          <Link href="/marketplace">
            <Home className="mr-2 h-5 w-5" />
            Continue Shopping
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/orders">
            <Package className="mr-2 h-5 w-5" />
            View My Orders
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
