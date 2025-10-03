"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  XCircle,
  RefreshCw,
  Phone,
  Mail,
  MessageCircle,
  ArrowLeft,
  CreditCard,
  AlertTriangle,
  Home,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailurePage() {
  const failureData = {
    orderId: 'OT2024001234',
    transactionId: 'TXN789456123',
    failureReason: 'Payment declined by bank',
    errorCode: 'ERR_PAYMENT_DECLINED',
    timestamp: new Date().toISOString(),
    amount: 351,
    paymentMethod: 'Credit Card'
  };

  const commonReasons = [
    {
      title: 'Insufficient Balance',
      description: 'Your account may not have sufficient funds',
      solution: 'Check your account balance and try again'
    },
    {
      title: 'Card Expired',
      description: 'Your card may have expired',
      solution: 'Use a different card or update your card details'
    },
    {
      title: 'Network Issue',
      description: 'Temporary network connectivity problem',
      solution: 'Check your internet connection and retry'
    },
    {
      title: 'Bank Decline',
      description: 'Your bank has declined the transaction',
      solution: 'Contact your bank or try a different payment method'
    }
  ];

  const supportOptions = [
    {
      title: 'Call Support',
      description: 'Speak with our customer service team',
      contact: '+91 1800-123-4567',
      icon: Phone,
      available: '24/7 Available'
    },
    {
      title: 'Email Support',
      description: 'Send us your query via email',
      contact: 'support@orangetrace.com',
      icon: Mail,
      available: 'Response within 2 hours'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Start Chat',
      icon: MessageCircle,
      available: 'Online now'
    }
  ];

  return (
    
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-red-800 mb-2">Payment Failed</h1>
              <p className="text-red-700 mb-4">
                We couldn't process your payment. Don't worry, no money has been deducted.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="destructive" className="text-lg px-4 py-2">
                  Order ID: {failureData.orderId}
                </Badge>
                <Badge variant="outline" className="border-red-600 text-red-600 text-lg px-4 py-2">
                  Error: {failureData.errorCode}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Transaction Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Failure Reason:</strong> {failureData.failureReason}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Transaction ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{failureData.transactionId}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-sm text-muted-foreground">{failureData.paymentMethod}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-sm text-muted-foreground">₹{failureData.amount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(failureData.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Common Reasons & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commonReasons.map((reason, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-1">{reason.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{reason.description}</p>
                        <p className="text-sm text-blue-600 font-medium">{reason.solution}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Need Help? Contact Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {supportOptions.map((option, index) => (
                      <div key={index} className="p-4 border rounded-lg text-center hover:bg-accent/50 transition-colors">
                        <option.icon className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                        <h4 className="font-semibold mb-1">{option.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                        <p className="text-sm font-medium text-orange-600 mb-1">{option.contact}</p>
                        <p className="text-xs text-muted-foreground">{option.available}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                    <Link href="/checkout">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry Payment
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/cart">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Cart
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/checkout">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Try Different Payment
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Other Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/marketplace">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Payment Tips</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Ensure sufficient balance in your account</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Check if your card is enabled for online transactions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Try using a different browser or device</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Contact your bank if the issue persists</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <XCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="font-medium text-green-600">No Money Deducted</p>
                    <p className="text-sm text-muted-foreground">
                      Your payment was not processed. No amount has been charged to your account.
                    </p>
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