"use client";

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { HarvestBatch, Purchase } from '@/types';
import { Plus, Package, TrendingUp, MapPin, Calendar, Eye, NotepadTextIcon } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BatchesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}

function SalesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-40 mb-1" />
            <Skeleton className="h-3 w-36" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function FarmerDashboardContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [batches, setBatches] = useState<HarvestBatch[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeTab, setActiveTab] = useState('batches');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch("/api/farmer/overview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        });

        const { batches, purchases } = await res.json();
        setBatches(batches || []);
        setPurchases(purchases || []);
      } catch (err) {
        console.error("Failed to fetch farmer data", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
  const totalSold = purchases.reduce((sum, purchase) => sum + purchase.quantity, 0);
  const availableQuantity = batches
    .filter(batch => batch.status === 'available')
    .reduce((sum, batch) => sum + batch.quantity, 0);

  const formatPrice = (price: number): string => {
    return price.toFixed(2).replace(/\.?0+$/, '');
  };

  const stats = [
    {
      title: t('dashboard.total_batches'),
      value: batches.length.toString(),
      icon: Package,
      description: `${batches.filter(b => b.status === 'available').length} available`
    },
    {
      title: 'Total Sold (kg)',
      value: totalSold.toLocaleString(),
      icon: TrendingUp,
      description: `₹${totalRevenue.toLocaleString()} revenue`
    },
    {
      title: 'Available (kg)',
      value: availableQuantity.toLocaleString(),
      icon: Package,
      description: `Ready for sale`
    },
    {
      title: 'Avg Price/kg',
      value: `₹${batches.length > 0 ? formatPrice(batches.reduce((sum, b) => sum + b.pricePerKg, 0) / batches.length) : 0}`,
      icon: TrendingUp,
      description: 'Current average'
    }
  ];

  const recentBatches = batches.slice(0, 5);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('dashboard.welcome')}, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your orange harvests and track sales</p>
        </div>
        <Button asChild className="bg-orange-600 hover:bg-orange-700">
          <Link href="/dashboard/farmer/register-batch">
            <Plus className="mr-2 h-4 w-4" />
            {t('batch.register')}
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <motion.div 
          className="flex justify-center"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <TabsList>
            {['batches', 'sales', 'activity'].map(tab => (
              <motion.div
                key={tab}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                <TabsTrigger value={tab} className="capitalize">
                  {tab === 'batches' ? 'My Batches' : tab === 'sales' ? 'Recent Sales' : 'Activity'}
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
          >
            <TabsContent value="batches">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Harvest Batches</CardTitle>
                  <CardDescription>
                    Your latest registered orange batches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <BatchesSkeleton />
                  ) : recentBatches.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No batches registered yet</p>
                      <Button asChild>
                        <Link href="/dashboard/farmer/register-batch">
                          Register Your First Batch
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBatches.map((batch) => (
                        <div key={batch.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {batch.variety}
                              </div>
                              <Badge variant={batch.status === 'available' ? 'default' : 'secondary'}>
                                {batch.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <NotepadTextIcon className="h-3 w-3" />
                                {batch.batchId}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(batch.harvestDate), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {batch.quantity}kg @ ₹{batch.pricePerKg}/kg
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/farmer/batch/${batch.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    Latest purchases of your orange batches
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <SalesSkeleton />
                  ) : purchases.length === 0 ? (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No sales yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {purchases.slice(0, 5).map((purchase) => {
                        const batch = batches.find(b => b.id === purchase.batchId);
                        return (
                          <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold">{batch?.batchId || 'Unknown Batch'}</h3>
                              <p className="text-sm text-muted-foreground">
                                {purchase.quantity}kg × ₹{batch?.pricePerKg || 0} = ₹{purchase.totalPrice}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(purchase.purchaseDate), 'MMM d, yyyy HH:mm')}
                              </p>
                            </div>
                            <Badge variant={purchase.status === 'confirmed' ? 'default' : 'secondary'}>
                              {purchase.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
                  <CardDescription>
                    Your recent activities on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Activity tracking coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}

export default function FarmerDashboard() {
  return (
    <AuthGuard requiredRole="farmer">
      <FarmerDashboardContent />
    </AuthGuard>
  );
}