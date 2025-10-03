"use client";

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getHarvestBatches, getPurchasesByFarmer, getFeedbacksByFarmer } from '@/lib/storage';
import { HarvestBatch, Purchase, Feedback, ORANGE_VARIETIES } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Package, Star, MapPin, Calendar, DollarSign } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

function AnalyticsContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [batches, setBatches] = useState<HarvestBatch[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          
          const allBatches = await getHarvestBatches();
          const farmerBatches = allBatches.filter(batch => batch.farmerId === user.id);
          setBatches(farmerBatches);

          
          const farmerPurchases = await getPurchasesByFarmer(user.id);
          setPurchases(farmerPurchases);

          
          const farmerFeedbacks = await getFeedbacksByFarmer(user.id);
          setFeedbacks(farmerFeedbacks);
        } catch (error) {
          console.error('Error fetching analytics data:', error);
        }
      };

      fetchData();
    }
  }, [user]);
  
  const totalRevenue = purchases.reduce((sum, p) => sum + p.totalPrice, 0);
  const totalSold = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length 
    : 0;
  const totalBatches = batches.length;

  
  const varietyData = ORANGE_VARIETIES.map(variety => {
    const varietyBatches = batches.filter(b => b.variety === variety);
    const varietyPurchases = purchases.filter(p => {
      const batch = batches.find(b => b.id === p.batchId);
      return batch?.variety === variety;
    });
    const revenue = varietyPurchases.reduce((sum, p) => sum + p.totalPrice, 0);
    const quantity = varietyPurchases.reduce((sum, p) => sum + p.quantity, 0);

    return {
      variety,
      batches: varietyBatches.length,
      revenue,
      quantity,
      avgPrice: quantity > 0 ? revenue / quantity : 0
    };
  }).filter(item => item.batches > 0);

  
  const last6Months = eachDayOfInterval({
    start: subDays(new Date(), 180),
    end: new Date()
  }).reduce((acc, date) => {
    const monthKey = format(date, 'MMM yyyy');
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, revenue: 0, quantity: 0 };
    }
    return acc;
  }, {} as Record<string, { month: string; revenue: number; quantity: number }>);

  purchases.forEach(purchase => {
    const monthKey = format(new Date(purchase.purchaseDate), 'MMM yyyy');
    if (last6Months[monthKey]) {
      last6Months[monthKey].revenue += purchase.totalPrice;
      last6Months[monthKey].quantity += purchase.quantity;
    }
  });

  const monthlyData = Object.values(last6Months).slice(-6);

  
  const statusData = [
    { name: 'Available', value: batches.filter(b => b.status === 'available').length, color: '#22c55e' },
    { name: 'Sold', value: batches.filter(b => b.status === 'sold').length, color: '#f59e0b' },
    { name: 'Reserved', value: batches.filter(b => b.status === 'reserved').length, color: '#3b82f6' }
  ].filter(item => item.value > 0);

  const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  return (
    
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into your orange farming business
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">All time earnings</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sold</p>
                <p className="text-2xl font-bold">{totalSold} kg</p>
                <p className="text-xs text-muted-foreground">Quantity sold</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
                <p className="text-xs text-muted-foreground">{feedbacks.length} reviews</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold">{totalBatches}</p>
                <p className="text-xs text-muted-foreground">Registered batches</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="varieties">Varieties</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {}
            <Card>
              <CardHeader>
                <CardTitle>Batch Status Distribution</CardTitle>
                <CardDescription>Current status of all your batches</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="varieties" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Variety Performance Analysis</CardTitle>
              <CardDescription>Compare performance across different orange varieties</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={varietyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="variety" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#f97316" name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {varietyData.map((variety, index) => (
              <Card key={variety.variety}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{variety.variety}</h3>
                    <Badge style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                      {variety.batches} batches
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">₹{variety.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{variety.quantity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Price:</span>
                      <span className="font-medium">₹{variety.avgPrice.toFixed(2)}/kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Quantity Trend</CardTitle>
              <CardDescription>Quantity sold over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kg`, 'Quantity']} />
                  <Line type="monotone" dataKey="quantity" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Performing Month</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyData.length > 0 ? (
                  (() => {
                    const bestMonth = monthlyData.reduce((best, current) => 
                      current.revenue > best.revenue ? current : best
                    );
                    return (
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">{bestMonth.month}</p>
                        <p className="text-muted-foreground">
                          ₹{bestMonth.revenue.toLocaleString()} revenue
                        </p>
                        <p className="text-muted-foreground">
                          {bestMonth.quantity} kg sold
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-muted-foreground">No sales data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {varietyData.length > 0 && `${varietyData[0]?.variety} is your top performer`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">
                      Average customer rating: {averageRating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">
                      {batches.filter(b => b.status === 'available').length} batches ready for sale
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback Overview</CardTitle>
              <CardDescription>Recent reviews and ratings from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              {feedbacks.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No customer feedback yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.slice(0, 5).map((feedback) => {
                    const batch = batches.find(b => b.id === feedback.batchId);
                    return (
                      <div key={feedback.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= feedback.rating 
                                    ? 'text-yellow-500 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(feedback.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        
                        <p className="text-sm font-medium mb-1">
                          {batch?.batchId} - {batch?.variety}
                        </p>
                        
                        {feedback.comment && (
                          <p className="text-sm text-muted-foreground">
                            "{feedback.comment}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    
  );
}

export default function AnalyticsPage() {
  return (
    <AuthGuard requiredRole="farmer">
      <AnalyticsContent />
    </AuthGuard>
  );
}