"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Download,
  Share2,
  Home,
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const orderData = {
    orderId: 'OT2024001234',
    transactionId: 'TXN789456123',
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    totalAmount: 351,
    paymentMethod: 'UPI',
    items: [
      {
        id: 1,
        batchId: 'NG2024001',
        variety: 'Nagpur Orange',
        pricePerKg: 45,
        quantity: 5,
        farmer: 'Ramesh Patil',
        farmLocation: 'Katol Road, Nagpur'
      },
      {
        id: 2,
        batchId: 'NG2024002',
        variety: 'Valencia Orange',
        pricePerKg: 42,
        quantity: 3,
        farmer: 'Sunita Devi',
        farmLocation: 'Wadi, Nagpur'
      }
    ],
    deliveryAddress: {
      name: 'Priya Sharma',
      address: '123, MG Road, Nagpur, Maharashtra - 440001',
      phone: '+91 9876543210'
    }
  };

  const subtotal = orderData.items.reduce((sum, item) => sum + (item.pricePerKg * item.quantity), 0);

  return (
    
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">Order Placed Successfully!</h1>
              <p className="text-green-700 mb-4">
                Thank you for your purchase. Your fresh oranges are on their way!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                  Order ID: {orderData.orderId}
                </Badge>
                <Badge variant="outline" className="border-green-600 text-green-600 text-lg px-4 py-2">
                  Transaction ID: {orderData.transactionId}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{item.variety}</h4>
                          <Badge variant="outline">{item.batchId}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Farmer: {item.farmer}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{item.farmLocation}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(item.pricePerKg * item.quantity).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} kg × ₹{item.pricePerKg}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-semibold">{orderData.deliveryAddress.name}</p>
                    <p className="text-muted-foreground">{orderData.deliveryAddress.address}</p>
                    <p className="text-muted-foreground">{orderData.deliveryAddress.phone}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="font-medium">{orderData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction ID</span>
                      <span className="font-medium">{orderData.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Paid</span>
                    <span className="text-orange-600">₹{orderData.totalAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Delivery Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Order Confirmed</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(orderData.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Being Prepared</p>
                        <p className="text-sm text-muted-foreground">
                          Fresh oranges being packed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium">Out for Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Expected: {new Date(orderData.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Invoice
                </Button>
                <Button className="w-full" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Order Details
                </Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                  <Link href="/marketplace">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <p className="font-medium">Need Help?</p>
                    <p className="text-sm text-muted-foreground">
                      Contact our support team for any queries
                    </p>
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}