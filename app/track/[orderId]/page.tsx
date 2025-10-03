"use client";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect, useCallback } from 'react';
import { PackageTracker, type OrderDetails, type TrackingEvent } from '@/components/ui/PackageTracker';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, Warehouse, Truck, Home, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatAddress = (addr: any) => {
    if (!addr) return "Not available";
    return `${addr.fullName}, ${addr.address}, ${addr.city}, ${addr.state}, ${addr.pincode}`;
};

const randomizeTime = (date: Date, startHour: number, endHour: number): Date => {
    const newDate = new Date(date);
    const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
    const minute = Math.floor(Math.random() * 60);
    newDate.setHours(hour, minute);
    return newDate;
};

const generateTrackingHistory = (order: any): TrackingEvent[] => {
    const allPossibleEvents: Omit<TrackingEvent, 'isCompleted' | 'timestamp'>[] = [
        { status: 'Order Confirmed', location: 'Nagpur, Maharashtra', icon: Warehouse },
        { status: 'Shipped', location: 'Nagpur Hub, Maharashtra', icon: Truck },
        { status: 'In Transit', location: 'Mumbai Airport, Maharashtra', icon: Plane },
        { status: 'Out for Delivery', location: `${order.deliveryAddress?.city || 'Destination'}, Maharashtra`, icon: Truck },
        { status: 'Delivered', location: `${order.deliveryAddress?.city || 'Destination'}, Maharashtra`, icon: Home },
    ];

    const history: TrackingEvent[] = [];
    let currentDate = new Date(order.createdAt);

    history.push({
        ...allPossibleEvents[0],
        timestamp: currentDate.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }),
        isCompleted: true,
    });

    if (order.status === 'Pending') {
        const estimatedShipDate = new Date(currentDate);
        estimatedShipDate.setDate(currentDate.getDate() + 1);
        for (let i = 1; i < allPossibleEvents.length; i++) {
            history.push({
                ...allPossibleEvents[i],
                timestamp: `Estimated by ${estimatedShipDate.toLocaleDateString('en-IN', { dateStyle: 'long' })}`,
                isCompleted: false,
            });
        }
        return history;
    }

    currentDate.setDate(currentDate.getDate() + 1);
    currentDate = randomizeTime(currentDate, 9, 12);
    history.push({
        ...allPossibleEvents[1],
        timestamp: currentDate.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }),
        isCompleted: true,
    });

    if (order.status === 'Shipped') {
        const estimatedDeliveryDate = new Date(currentDate);
        estimatedDeliveryDate.setDate(currentDate.getDate() + 1);
        for (let i = 2; i < allPossibleEvents.length; i++) {
            history.push({
                ...allPossibleEvents[i],
                timestamp: `Estimated by ${estimatedDeliveryDate.toLocaleDateString('en-IN', { dateStyle: 'long' })}`,
                isCompleted: false,
            });
        }
        return history;
    }

    currentDate.setHours(currentDate.getHours() + Math.floor(Math.random() * 4) + 4);
    history.push({
        ...allPossibleEvents[2],
        timestamp: currentDate.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }),
        isCompleted: true,
    });

    currentDate.setDate(currentDate.getDate() + 1);
    currentDate = randomizeTime(currentDate, 8, 10);
    history.push({
        ...allPossibleEvents[3],
        timestamp: currentDate.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }),
        isCompleted: true,
    });

    currentDate.setHours(currentDate.getHours() + Math.floor(Math.random() * 4) + 2);
    history.push({
        ...allPossibleEvents[4],
        timestamp: currentDate.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }),
        isCompleted: order.status === 'Delivered',
    });

    return history;
};

export default function TrackOrderPage({ params }: { params: { orderId?: string } }) {
    const { orderId } = params || {};
    const { user } = useAuth();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [trackingHistory, setTrackingHistory] = useState<TrackingEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderData = useCallback(async () => {
        if (!user || !orderId) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                headers: { 'x-user-id': user.id },
                cache: 'no-store', 
            });
            if (!response.ok) throw new Error((await response.json()).error || 'Failed to fetch order details.');
            const order = await response.json();

            const estimatedDeliveryDate = new Date(order.createdAt);
            estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 2);

            setOrderDetails({
                trackingNumber: order.orderId,
                carrier: 'OrangeTrace Express',
                estimatedDelivery: estimatedDeliveryDate.toLocaleDateString('en-IN', { dateStyle: 'long' }),
                shippingAddress: formatAddress(order.deliveryAddress),
                origin: 'Nagpur, MH',
                destination: `${order.deliveryAddress?.city + ', ' + order.deliveryAddress?.state || 'Unknown'}, MH`,
            });
            setTrackingHistory(generateTrackingHistory(order));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [orderId, user]);

    useEffect(() => {
        if (user && orderId) fetchOrderData();
    }, [fetchOrderData, user, orderId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-xl font-semibold text-destructive">{error}</h2>
                <Button onClick={fetchOrderData} className="mt-6">Try Again</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-4xl">
                {orderDetails && trackingHistory.length > 0 ? (
                    <PackageTracker orderDetails={orderDetails} trackingHistory={trackingHistory} />
                ) : (
                    <p>No tracking information available.</p>
                )}
            </div>
        </div>
    );
}
