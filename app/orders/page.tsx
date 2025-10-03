"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Package,
  Search,
  AlertCircle,
  Loader2,
  Home,
  Truck,
  Star,
  RefreshCw,
  CheckCircle,
  XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { CartItem } from '@/types';
import { toast } from 'sonner';

type Order = {
  orderId: string;
  createdAt: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  total: number;
  deliveryAddress: { fullName: string; };
};

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
        let particles: THREE.Points;
        let mouseX = 0, mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
            camera.position.z = 1000;

            const particleCount = 10000;
            const particlesGeometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() * 2000) - 1000; // X
                positions[i3 + 1] = (Math.random() * 2000) - 1000; // Y
                positions[i3 + 2] = (Math.random() * 1500) - 500;  // Z
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const particleMaterial = new THREE.PointsMaterial({
                color: 0xf97316,
                size: 1.5,
                transparent: true,
                opacity: 0.7
            });

            particles = new THREE.Points(particlesGeometry, particleMaterial);
            scene.add(particles);

            renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            document.addEventListener('mousemove', onDocumentMouseMove, false);
            window.addEventListener('resize', onWindowResize, false);
        };

        const onWindowResize = () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onDocumentMouseMove = (event: MouseEvent) => {
            mouseX = event.clientX - windowHalfX;
            mouseY = event.clientY - windowHalfY;
        };

        const animate = () => {
            if (!renderer) return;
            requestAnimationFrame(animate);
            render();
        };

        const render = () => {
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            const positions = particles.geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += 0.5; 
                if (positions[i + 1] > 1000) {
                    positions[i + 1] = -1000; 
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
            
            renderer.render(scene, camera);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', onWindowResize);
            document.removeEventListener('mousemove', onDocumentMouseMove);
            renderer?.dispose();
        };
    }, [theme]);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};


export default function OrdersPage() {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  if (user === undefined) {
    setIsLoading(true);
    return null;
  }

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setError("Please log in to view your orders.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/orders', { headers: { 'x-user-id': user.id } });
      if (!response.ok) throw new Error('Failed to fetch your orders.');
      const data = await response.json();
      setAllOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  
  const filteredOrders = useMemo(() => {
    let orders = [...allOrders];
    if (filterPeriod !== 'all') {
      const now = new Date();
      let startDate = new Date();
      if (filterPeriod === 'last-30-days') startDate.setDate(now.getDate() - 30);
      else if (filterPeriod === 'last-3-months') startDate.setMonth(now.getMonth() - 3);
      else if (filterPeriod.startsWith('year-')) {
        const year = parseInt(filterPeriod.split('-')[1]);
        startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        orders = orders.filter(order => new Date(order.createdAt) <= endDate);
      }
       orders = orders.filter(order => new Date(order.createdAt) >= startDate);
    }
    if (searchQuery) {
      orders = orders.filter(order =>
        order.items.some(item => item.variety.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return orders;
  }, [allOrders, searchQuery, filterPeriod]);
  
  const getStatusProps = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return { color: 'text-green-600 dark:text-green-400', icon: <CheckCircle className="h-5 w-5 mr-2" /> };
      case 'Shipped': return { color: 'text-blue-600 dark:text-blue-400', icon: <Truck className="h-5 w-5 mr-2" /> };
      case 'Pending': return { color: 'text-yellow-600 dark:text-yellow-400', icon: <Loader2 className="h-5 w-5 mr-2 animate-spin" /> };
      case 'Cancelled': return { color: 'text-red-600 dark:text-red-400', icon: <XCircle className="h-5 w-5 mr-2" /> };
      default: return { color: 'text-gray-600 dark:text-gray-400', icon: <Package className="h-5 w-5 mr-2" /> };
    }
  };

  const handleBuyAgain = (item: CartItem) => {
    toast.success(`"${item.variety}" has been added to your cart!`);
  };

  const mainContent = (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">My Orders</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search all orders"
              className="pl-9 bg-white/30 dark:bg-black/30 border-gray-300/50 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[180px] bg-white/30 dark:bg-black/30 border-gray-300/50 dark:border-white/20 text-gray-900 dark:text-white">
              <SelectValue placeholder="Filter orders" />
            </SelectTrigger>
            <SelectContent className="bg-white/80 dark:bg-gray-900/80 border-gray-300/50 dark:border-white/20 text-gray-900 dark:text-white">
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-3-months">Last 3 months</SelectItem>
              <SelectItem value="year-2024">2024</SelectItem>
              <SelectItem value="year-2023">2023</SelectItem>
              <SelectItem value="all">All orders</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-orange-600" /></div>
      ) : error ? (
        <Card className="text-center py-16 bg-white/80 dark:bg-black/50 border-red-200 dark:border-red-800/50">
          <CardContent><AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" /><h2 className="mt-4 text-xl font-semibold text-red-600 dark:text-red-400">{error}</h2><Button onClick={fetchOrders} className="mt-6"><RefreshCw className="mr-2 h-4 w-4" />Try Again</Button></CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="text-center py-16 bg-white/80 dark:bg-black/50 border-gray-200 dark:border-white/20">
          <CardContent><Package className="h-16 w-16 text-gray-400 mx-auto mb-4" /><h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Orders Found</h2><p className="text-gray-600 dark:text-gray-400 mb-6">{searchQuery ? "We couldn't find any orders matching your search." : "You haven't placed any orders in this period."}</p><Button asChild className="bg-orange-600 hover:bg-orange-700"><Link href="/marketplace"><Home className="mr-2 h-4 w-4" />Shop Now</Link></Button></CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.orderId} className="overflow-hidden bg-white/80 dark:bg-black/50 border border-gray-200/80 dark:border-white/20 shadow-lg text-gray-900 dark:text-white">
              <CardHeader className="bg-gray-100/50 dark:bg-white/10 p-4 flex flex-col sm:flex-row justify-between">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-gray-600 dark:text-gray-400">ORDER PLACED</p><p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">TOTAL</p><p className="font-medium">{order.total ? `₹${order.total.toLocaleString()}` : 'N/A'}</p></div>
                  <div><p className="text-gray-600 dark:text-gray-400">SHIP TO</p><p className="font-medium truncate">{order.deliveryAddress.fullName}</p></div>
                  <div className="text-center"><p className="text-gray-600 dark:text-gray-400">ORDER #</p><p className="font-mono text-xs">{order.orderId}</p></div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-4">
                    <h3 className={`font-bold text-lg flex items-center ${getStatusProps(order.status).color}`}>{getStatusProps(order.status).icon}{order.status}</h3>
                    
                    {order.items.length > 0 && (() => {
                        const MAX_ITEMS_TO_SHOW = 2; 
                        const itemNames = order.items.map(item => item.variety);
                        const displayNames = itemNames.slice(0, MAX_ITEMS_TO_SHOW).join(', ');
                        const moreItemsCount = itemNames.length - MAX_ITEMS_TO_SHOW;

                        return (
                            <div className="flex gap-4 items-start">
                                <img
                                    src={order.items[0].image || 'https://placehold.co/80x80/f97316/white?text=O'}
                                    alt={order.items[0].variety}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                                <div className="pt-1">
                                    <p className="font-semibold text-orange-600 dark:text-orange-400">
                                        {displayNames}
                                        {moreItemsCount > 0 && `, and ${moreItemsCount} more item${moreItemsCount > 1 ? 's' : ''}`}
                                    </p>
                                    <div className="mt-3">
                                         <Button onClick={() => handleBuyAgain(order.items[0])} size="sm" variant="outline">
                                            <RefreshCw className="mr-2 h-4 w-4" />Buy "{order.items[0].variety}" again
                                         </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                  </div>
                  <div className="w-full md:w-48 flex flex-col gap-2">
                    <Button asChild variant="secondary">
                      <Link href={`/track/${order.orderId}`}>
                        <Truck className="mr-2 h-4 w-4" />
                        Track Package
                      </Link>
                    </Button>
                    <Button variant="outline">View order details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black">
      <ParticleBackground />
      <main className="relative z-10 min-h-screen w-full backdrop-blur-md">
        {mainContent}
      </main>
    </div>
  );
}