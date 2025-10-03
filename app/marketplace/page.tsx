"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddToCartDialog } from '@/components/dialogs/AddToCartDialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { getHarvestBatches } from '@/lib/firebase/marketplace';
import { HarvestBatch, ORANGE_VARIETIES } from '@/types';
import { Search, MapPin, Calendar, Package, Star, Filter, ShoppingCart, Check } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketplacePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const router = useRouter();

  const [batches, setBatches] = useState<HarvestBatch[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<HarvestBatch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [varietyFilter, setVarietyFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('newest');
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const allBatches = await getHarvestBatches();
      setBatches(allBatches);
      setFilteredBatches(allBatches);
      if (allBatches.length > 0) {
        const prices = allBatches.map(b => b.pricePerKg);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!batches.length) return;
    let filtered = batches.filter(batch => {
      const matchesSearch =
        batch.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.farmLocation.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesVariety = varietyFilter === 'all' || batch.variety === varietyFilter;
      const matchesLocation = !locationFilter || batch.farmLocation.address.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesPrice = batch.pricePerKg >= priceRange[0] && batch.pricePerKg <= priceRange[1];

      return matchesSearch && matchesVariety && matchesLocation && matchesPrice;
    });

    switch (sortBy) {
      case 'newest': filtered.sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime()); break;
      case 'oldest': filtered.sort((a, b) => new Date(a.harvestDate).getTime() - new Date(b.harvestDate).getTime()); break;
      case 'price-low': filtered.sort((a, b) => a.pricePerKg - b.pricePerKg); break;
      case 'price-high': filtered.sort((a, b) => b.pricePerKg - a.pricePerKg); break;
      case 'quantity': filtered.sort((a, b) => b.quantity - a.quantity); break;
    }
    setFilteredBatches(filtered);
  }, [batches, searchTerm, varietyFilter, locationFilter, priceRange, sortBy]);

  const getFreshnessScore = (harvestDate: Date): { score: number; label: string; color: string } => {
    const days = differenceInDays(new Date(), harvestDate);
    if (days <= 3) return { score: 95, label: 'Excellent', color: 'bg-green-500' };
    if (days <= 7) return { score: 80, label: 'Good', color: 'bg-yellow-500' };
    if (days <= 14) return { score: 65, label: 'Fair', color: 'bg-orange-500' };
    return { score: 40, label: 'Old', color: 'bg-red-500' };
  };

  const handleBuyNow = (batch: HarvestBatch) => {
    if (!user) return router.push('/login');
    router.push(`/product/${batch.id}`);
  };

  const handleAddToCart = async (batch: HarvestBatch, quantity: number) => {
    if (!user) return router.push('/login');
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, batch, quantity }),
      });
      toast.success('Added to cart');
      setIsAddedToCart(true);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div className="container py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold mb-2">{t('marketplace.title')}</h1>
        <p className="text-muted-foreground">Discover fresh oranges directly from Nagpur farmers</p>
      </motion.div>
      <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
        <Card className="mb-8 mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('common.filter')} & {t('common.search')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } }
              }}
            >
              {[
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search batches, variety, location..."
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                </div>,
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('marketplace.variety')}</label>
                  <Select value={varietyFilter} onValueChange={setVarietyFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Varieties</SelectItem>
                      {ORANGE_VARIETIES.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>,
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="Filter by location..." value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} />
                </div>,
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ].map((el, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {el}
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <label className="text-sm font-medium">Price Range: ₹{priceRange[0]} - ₹{priceRange[1]} per kg</label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={100} min={0} step={5} className="w-full" />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div className="mb-4 flex items-center justify-between"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <p className="text-muted-foreground">
          {loading ? "Loading batches..." : `Found ${filteredBatches.length} batch${filteredBatches.length !== 1 ? 'es' : ''}`}
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[360px]">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <motion.div key={i} className="rounded-lg border bg-gray-800/40 h-[480px] w-full"
              initial={{ opacity: 0.4 }} animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }} />
          ))
        ) : (
          <AnimatePresence>
            {filteredBatches.length === 0 ? (
              <motion.div key="empty" className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">No batches found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </motion.div>
            ) : (
              filteredBatches.map((batch) => {
                const freshness = getFreshnessScore(batch.harvestDate);
                const daysAgo = differenceInDays(new Date(), new Date(batch.harvestDate));
                return (
                  <motion.div key={batch.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader onClick={() => router.push(`/product/${batch.id}`)}>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{batch.variety}</CardTitle>
                            <CardDescription>Batch ID: {batch.batchId}</CardDescription>
                          </div>
                          <Badge className={`${freshness.color} text-white`}>{freshness.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div onClick={() => router.push(`/product/${batch.id}`)}>
                          {batch.images && batch.images.length > 0 && (
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <img src={batch.images[0]} alt={batch.variety} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-orange-600">₹{batch.pricePerKg}/kg</span>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Available</p>
                              <p className="font-semibold">{Number(batch.quantity.toFixed(1))} kg</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Harvested {daysAgo} day{daysAgo !== 1 ? 's' : ''} ago</span></div>
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span className="truncate">{batch.farmLocation.address}</span></div>
                            <div className="flex items-center gap-2"><Star className="h-4 w-4" /><span>Freshness Score: {freshness.score}%</span></div>
                          </div>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={() => handleBuyNow(batch)}>
                          <ShoppingCart className="mr-2 h-4 w-4" /> {t('marketplace.buy_now')}
                        </Button>
                        <div className="w-full">
                          <AnimatePresence mode="wait">
                            {isAddedToCart ? (
                              <motion.div
                                key="go-to-cart"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.25 }}
                              >
                                <Button 
                                  onClick={() => router.push('/cart')} 
                                  size="lg" 
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                                >
                                  <Check className="mr-2 h-5 w-5" /> Go to Cart
                                </Button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="add-to-cart"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                              >
                                <AddToCartDialog
                                  onConfirm={(q) => handleAddToCart(batch, q)}
                                  availableQuantity={batch.quantity}
                                  trigger={
                                    <Button 
                                      variant="outline" 
                                      size="lg" 
                                      className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                                    >
                                      <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                                    </Button>
                                  }
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}