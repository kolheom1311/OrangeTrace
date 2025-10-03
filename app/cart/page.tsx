"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Package,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { CartItem } from '@/types';
import { useAuth } from '@/contexts/AuthContext'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCartData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      setError("Please log in to view your cart.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/cart', {
        headers: { 'x-user-id': encodeURIComponent(user.id) }
      });
      if (!response.ok) throw new Error('Failed to fetch your cart. Please try again.');
      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    const item = cartItems.find(i => i.id === itemId);
    if (!item || !user) return;

    const validatedQuantity = Math.max(1, Math.min(newQuantity, item.quantity));

    const originalItems = [...cartItems];
    setCartItems(items =>
      items.map(i => i.id === itemId ? { ...i, selectedQuantity: validatedQuantity } : i)
    );

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': encodeURIComponent(user.id) },
        body: JSON.stringify({ itemId, newQuantity: validatedQuantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity.');
    } catch (err) {
      setCartItems(originalItems);
      toast.error(err instanceof Error ? err.message : 'Could not update quantity.');
    }
  };

  const removeItem = async (itemId: string) => {
    if (!user) return;
    setCartItems((prev) => prev.map((item) =>
      item.id === itemId ? { ...item, isRemoving: true } : item
    ));

    setTimeout(async () => {
      const originalItems = [...cartItems];
      const updatedItems = originalItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);

      try {
        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'x-user-id': encodeURIComponent(user.id) },
          body: JSON.stringify({ itemId }),
        });
        if (!response.ok) throw new Error('Failed to remove item.');
        toast.success('Item removed from cart.');
      } catch (err) {
        setCartItems(originalItems);
        toast.error(err instanceof Error ? err.message : 'Could not remove item.');
      }
    }, 300);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerKg * item.selectedQuantity), 0);
  const deliveryFee = subtotal > 1000 ? 0 : 50;
  const total = subtotal + deliveryFee;
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center bg-background"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
        <p className="mt-4 text-lg text-muted-foreground">Loading Your Cart...</p>
      </motion.div>
    );
  }
  if (error) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center bg-background p-4"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-destructive">{error}</h2>
        <Button onClick={fetchCartData} className="mt-6">Try Again</Button>
      </motion.div>
    );
  }
  if (cartItems.length === 0) {
    return (
      <motion.div 
        className="min-h-screen bg-background flex flex-col items-center justify-center"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ShoppingCart className="h-20 w-20 text-muted-foreground mb-6" />
        </motion.div>
        <motion.h2
          className="text-2xl font-semibold mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your cart is empty
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container py-8">
        <motion.h1 
          className="text-3xl font-bold mb-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          Shopping Cart ({cartItems.length})
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    x: cartItems.length === 1 ? 100 : -100
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-4 flex gap-4">
                      <motion.img 
                        src={item.image || 'https://placehold.co/128x128/f97316/white?text=Orange'} 
                        alt={item.variety} 
                        className="w-32 h-32 object-cover rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg">{item.variety}</h3>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.farmLocation.address}</p>
                          <p className="text-lg font-semibold text-orange-600 mt-2">₹{item.pricePerKg}/kg</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" size="icon" 
                              className="h-8 w-8" 
                              onClick={() => updateQuantity(item.id, item.selectedQuantity - 1)} 
                              disabled={item.selectedQuantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input 
                              type="number" 
                              value={item.selectedQuantity} 
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)} 
                              className="w-16 h-8 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
                            />
                            <Button 
                              variant="outline" size="icon" 
                              className="h-8 w-8" 
                              onClick={() => updateQuantity(item.id, item.selectedQuantity + 1)} 
                              disabled={item.selectedQuantity >= item.quantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <motion.div 
                            className="text-lg font-bold"
                            key={`${item.id}-${item.selectedQuantity}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            ₹{(item.pricePerKg * item.selectedQuantity).toLocaleString()}
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div
            className="space-y-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80 }}
          >
            <Card>
              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span>Subtotal</span>
                  <motion.span 
                    key={`subtotal-${subtotal}`} 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ₹{subtotal.toLocaleString()}
                  </motion.span>
                </motion.div>

                <motion.div 
                  className="flex justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span>Delivery Fee</span>
                  <motion.span 
                    key={`delivery-${deliveryFee}`} 
                    initial={{ opacity: 0, y: -5 }} 
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </motion.span>
                </motion.div>

                <Separator />

                <motion.div 
                  className="flex justify-between font-bold text-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <span>Total</span>
                  <motion.span 
                    className="text-orange-600"
                    key={`total-${total}`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ₹{total.toLocaleString()}
                  </motion.span>
                </motion.div>

                <Button 
                  size="lg" 
                  className="w-full bg-orange-600 hover:bg-orange-700" 
                  asChild 
                  disabled={cartItems.length === 0}
                >
                  <Link href="/checkout">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Button variant="outline" asChild className="w-full">
              <Link href="/marketplace">
                <Package className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
