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
import { getPurchasesByBuyer, getHarvestBatches } from '@/lib/storage';
import { HarvestBatch, Purchase } from '@/types';
import { ShoppingCart, Package, TrendingUp, Eye, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';
import AnimatedPageWrapper from '@/components/ui/AnimatedPageWrapper';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const StatCardSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </CardContent>
  </Card>
);

const RecommendedBatchSkeleton = () => (
  <Card className="group">
    <CardContent className="p-4">
      <Skeleton className="aspect-video rounded-lg mb-3 w-full" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    </CardContent>
  </Card>
);

const PurchaseItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border-b last:border-b-0">
    <Skeleton className="h-12 w-12 rounded-md" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  </div>
);

function BuyerDashboardContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [batches, setBatches] = useState<HarvestBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user!.id));
        const snapshot = await getDocs(q);

        const userOrders: any[] = [];
        snapshot.forEach((doc) => {
          userOrders.push({ id: doc.id, ...doc.data() });
        });
        setOrders(userOrders);
        const allBatches = await getHarvestBatches();
        setBatches(allBatches);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalQuantity = orders.reduce((sum, order) => {
    const orderQuantity = (order.items || []).reduce(
      (itemSum: number, item: any) => itemSum + (item.quantity || 0),
      0
    );
    return sum + orderQuantity;
  }, 0);
  const avgPricePerKg = totalQuantity > 0 ? totalSpent / totalQuantity : 0;
  const availableBatches = batches.filter(batch => batch.status === "available").length;

  const stats = [
    {
      title: "Total Purchases",
      value: orders.length.toString(),
      icon: ShoppingCart,
      description: `${orders.length} confirmed`,
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent % 1 === 0 ? totalSpent.toLocaleString() : totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      description: `${totalQuantity.toFixed(1)}kg purchased`,
    },
    {
      title: "Avg Price/kg",
      value: `₹${avgPricePerKg.toFixed(2)}`,
      icon: Package,
      description: "Average rate paid",
    },
    {
      title: "Available Batches",
      value: availableBatches.toString(),
      icon: Package,
      description: "Ready to purchase",
    },
  ];

  const recentPurchases = orders.slice(0, 5);
  const recommendedBatches = batches
    .filter(batch => batch.status === 'available')
    .sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime())
    .slice(0, 3);
  const getFreshnessScore = (harvestDate: Date): { score: number; label: string; color: string } => {
    const days = differenceInDays(new Date(), harvestDate);
    if (days <= 3) return { score: 95, label: 'Excellent', color: 'bg-green-500' };
    if (days <= 7) return { score: 80, label: 'Good', color: 'bg-yellow-500' };
    if (days <= 14) return { score: 65, label: 'Fair', color: 'bg-orange-500' };
    return { score: 40, label: 'Old', color: 'bg-red-500' };
  };

  return (
    <AnimatedPageWrapper>
      <div className="container py-8">
        <div className="flex flex-col [@media(min-width:700px)]:flex-row justify-between items-center mb-8 text-center [@media(min-width:700px)]:text-left gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {t('dashboard.welcome')}, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Discover and purchase fresh oranges from Nagpur farmers
            </p>
          </div>
          <Button
            asChild
            className="bg-orange-600 hover:bg-orange-700 w-fit"
          >
            <Link href="/marketplace">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Browse Marketplace
            </Link>
          </Button>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                }}
              >
                <StatCardSkeleton />
              </motion.div>
            ))
          ) : (
            stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
            ))
          )}
        </motion.div>

        <Tabs defaultValue="purchases" className="space-y-6">
          <motion.div
            className="flex justify-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <TabsList asChild>
              <motion.div className="flex gap-2">
                {[
                  { value: "purchases", label: "Recent Purchases" },
                  { value: "recommended", label: "Recommended" },
                  { value: "activity", label: "Activity" },
                ].map((tab) => (
                  <motion.div
                    key={tab.value}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
                    }}
                  >
                    <TabsTrigger value={tab.value}>{tab.label}</TabsTrigger>
                  </motion.div>
                ))}
              </motion.div>
            </TabsList>
          </motion.div>
          <TabsContent value="purchases">
            <motion.div
              key="purchases-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recent Purchases</CardTitle>
                  <CardDescription>
                    Your latest orange batch purchases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-0">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <PurchaseItemSkeleton key={`purchase-skeleton-${index}`} />
                      ))}
                    </div>
                  ) : recentPurchases.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No purchases yet</p>
                      <Button asChild>
                        <Link href="/marketplace">
                          Start Shopping
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {/* {recentPurchases.map((purchase) => (
                        <div key={purchase.id} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                          <Package className="h-10 w-10 text-orange-600" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{purchase.id}</p>
                              <Badge variant="secondary">{purchase.orderStatus}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{purchase.quantity || 0}kg</span>
                              <span className="font-medium text-foreground">₹{purchase.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      ))} */}
                      {recentPurchases.map((purchase) => (
                        <div key={purchase.id} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                          <Package className="h-10 w-10 text-orange-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium truncate">
                                {purchase.items?.map((item: { variety: string; }) => item.variety).join(', ') || 'N/A'}
                              </p>
                              <Badge variant="secondary" className="flex-shrink-0">{purchase.orderStatus}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>
                                {(purchase.items?.reduce((total: any, item: { selectedQuantity: any; }) => total + (item.selectedQuantity || 0), 0) || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}kg
                              </span>
                              <span className="font-medium text-foreground">₹{purchase.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="recommended">
            <motion.div
              key="recommended-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>
                    Fresh orange batches based on your preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <RecommendedBatchSkeleton key={`recommended-skeleton-${index}`} />
                      ))}
                    </div>
                  ) : recommendedBatches.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recommendations available</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedBatches.map((batch) => {
                        const freshness = getFreshnessScore(batch.harvestDate);
                        const daysAgo = differenceInDays(new Date(), batch.harvestDate);

                        return (
                          <Card key={batch.id} className="group hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              {batch.images && batch.images.length > 0 && (
                                <div className="aspect-video rounded-lg overflow-hidden mb-3">
                                  <img
                                    src={batch.images[0]}
                                    alt={batch.variety}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              )}

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold">{batch.variety}</h3>
                                  <Badge className={`${freshness.color} text-white text-xs`}>
                                    {freshness.label}
                                  </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground">{batch.batchId}</p>

                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-orange-600">
                                    ₹{batch.pricePerKg}/kg
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {batch.quantity}kg
                                  </span>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Harvested {daysAgo} day{daysAgo !== 1 ? 's' : ''} ago</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{batch.farmLocation.address}</span>
                                  </div>
                                </div>

                                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                                  <Link href="/marketplace">
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          <TabsContent value="activity">
            <motion.div
              key="activity-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
                  <CardDescription>
                    Your recent activities on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div key={`activity-skeleton-${index}`} className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Activity tracking coming soon</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPageWrapper>
  );
}


export default function BuyerDashboard() {
  return (
    <AuthGuard requiredRole="buyer">
      <BuyerDashboardContent />
    </AuthGuard>
  );
}