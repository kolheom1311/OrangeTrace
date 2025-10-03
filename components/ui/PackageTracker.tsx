"use client";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import {
  Truck,
  Package,
  ClipboardCopy,
  MapPin,
  ArrowLeft,
  Warehouse,
  Home
} from 'lucide-react';
import { toast } from 'sonner';

// --- Helper Types ---
export type TrackingEvent = {
  status: string;
  location: string;
  timestamp: string;
  icon: React.ElementType;
  isCompleted: boolean;
};

export type OrderDetails = {
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
    shippingAddress: string;
    origin: string;
    destination: string;
};

type PackageTrackerProps = {
    orderDetails: OrderDetails;
    trackingHistory: TrackingEvent[];
};

// --- Main Component ---
export function PackageTracker({ orderDetails, trackingHistory }: PackageTrackerProps) {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderDetails.trackingNumber);
    toast.success('Tracking number copied to clipboard!');
  };

  const completedSteps = trackingHistory.filter(event => event.isCompleted).length;
  const totalSteps = trackingHistory.length;
  const progressPercentage = totalSteps > 1 ? (completedSteps / (totalSteps - 1)) * 100 : 0;
  const currentStatus = trackingHistory.find(event => !event.isCompleted) || trackingHistory[totalSteps - 1];

  return (
    <Card className="bg-white/80 dark:bg-black/50 backdrop-blur-lg border border-gray-200/80 dark:border-white/20 shadow-lg">
      <CardHeader>
          <div className="flex items-center gap-4 mb-8">
                  <Button variant="ghost" size="sm" asChild>
                      <Link href="/orders"><ArrowLeft className="h-4 w-4 mr-2" />Back to Orders</Link>
                  </Button>
          </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    Package Tracking
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                    Estimated Delivery: {orderDetails.estimatedDelivery}
                </CardDescription>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <Badge variant="outline" className="text-sm">{orderDetails.carrier}</Badge>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md p-2">
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{orderDetails.trackingNumber}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={copyToClipboard}>
                        <ClipboardCopy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="my-6">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center font-semibold text-orange-600">
                    <Package className="h-5 w-5 mr-2" />
                    <span>{currentStatus.status}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                    {completedSteps} of {totalSteps > 1 ? totalSteps - 1 : totalSteps} steps completed
                </div>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Order Confirmed</span>
                <span>Delivered</span>
            </div>
        </div>

        <Separator className="my-6" />

        {/* Tracking History Timeline */}
        <div>
          {trackingHistory.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${event.isCompleted ? 'bg-orange-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                  <event.icon className="h-5 w-5" />
                </div>
                {index < trackingHistory.length - 1 && (
                  <div className={`w-0.5 flex-1 ${event.isCompleted ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
              {/* --- START OF CHANGE --- */}
              {/* Added padding-bottom to create space for the line to connect */}
              <div className={`pt-1.5 ${index < trackingHistory.length - 1 ? 'pb-8' : ''} ${!event.isCompleted && index !== completedSteps ? 'opacity-50' : ''}`}>
              {/* --- END OF CHANGE --- */}
                <p className="font-semibold text-gray-800 dark:text-gray-200">{event.status}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.location}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{event.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Shipping Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Shipping Address</h3>
                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span>{orderDetails.shippingAddress}</span>
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Package Journey</h3>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Warehouse className="h-4 w-4 flex-shrink-0" />
                    <span><span className="font-medium">From:</span> {orderDetails.origin}</span>
                </div>
                 <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                    <Home className="h-4 w-4 flex-shrink-0" />
                    <span><span className="font-medium">To:</span> {orderDetails.destination}</span>
                </div>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
