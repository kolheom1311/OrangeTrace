"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton'; 
import {
  Star, MapPin, Calendar, Package, Shield, Truck, Heart,
  Share2, ChevronLeft, ChevronRight, Play, Minus, Plus,
  ShoppingCart, Zap, User, ThumbsUp, ThumbsDown
} from 'lucide-react';
import Link from 'next/link';
import { getHarvestBatchById, getProductReviews } from '@/lib/firebase/marketplace'; 
import { HarvestBatch, Review, Farmer } from '@/types'; 

import { getFarmerById } from '@/lib/firebase/users'; 

function ProductDetailSkeleton() {
  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="grid grid-cols-5 gap-2">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="aspect-square rounded-lg" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-1/3" />
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 gap-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}


export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<HarvestBatch | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [farmer, setFarmer] = useState<Farmer | null>(null);

  useEffect(() => {
    if (product?.farmerId) {
      const fetchFarmer = async () => {
        const farmerData = await getFarmerById(product.farmerId);
        setFarmer(farmerData);
      };
      fetchFarmer();
    }
  }, [product?.farmerId]); 

  useEffect(() => {
    const fetchProductData = async () => {
      const productId = params.id as string;
      if (!productId) return;

      setLoading(true);
      try {
        const [productData, reviewsData] = await Promise.all([
          getHarvestBatchById(productId),
          getProductReviews(productId)
        ]);
        
        if (productData) {
          setProduct(productData);
          setReviews(reviewsData);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <div className="container py-12 text-center">Product not found.</div>;
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;
  const totalPrice = quantity * product.pricePerKg;
  const productImages = product.images || [];

  const nextImage = () => {
    if (productImages.length === 0) return;
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    if (productImages.length === 0) return;
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-4">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/marketplace" className="hover:text-foreground">Marketplace</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.variety}</span>
        </nav>
      </div>

      <div className="container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              {showVideo ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="h-16 w-16 mx-auto mb-4" />
                    <p>Video Preview</p>
                    <p className="text-sm text-gray-400">Farm tour and harvest process</p>
                  </div>
                </div>
              ) : (
                productImages.length > 0 ? (
                  <img
                    src={productImages[selectedImageIndex]}
                    alt={`${product.variety} - Image ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image Available</div>
                )
              )}
              
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
                disabled={productImages.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
                disabled={productImages.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setShowVideo(false);
                  }}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index && !showVideo
                      ? 'border-orange-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors bg-black flex items-center justify-center ${
                    showVideo
                      ? 'border-orange-500'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Play className="h-6 w-6 text-white" />
                </button>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.batchId}</Badge>
                <Badge className="bg-green-100 text-green-800">Fresh</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{product.variety}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span>({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{product.quantity} kg available</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-orange-600">₹{product.pricePerKg}</span>
                <span className="text-muted-foreground">per kg</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Total: ₹{totalPrice.toLocaleString()} for {quantity} kg
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={farmer?.avatar} />
                    <AvatarFallback>{farmer?.name?.charAt(0) || 'F'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{farmer?.name || 'Loading farmer...'}</h3>
                    <p className="text-sm text-muted-foreground">{farmer?.farmName || ''}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{product.farmLocation.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{farmer?.rating || 'N/A'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{farmer?.totalReviews || 0} reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Harvest Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(product.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quantity (kg)</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                  className="w-20 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  min="1"
                  max={product.quantity}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(quantity + 1)}
                  disabled={quantity >= product.quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Max: {product.quantity} kg
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700">
                <Zap className="mr-2 h-5 w-5" />
                Buy Now - ₹{totalPrice.toLocaleString()}
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Organic certified</Badge>
                <Badge variant="secondary">Fresh harvest</Badge>
                <Badge variant="secondary">Premium quality</Badge>
                <Badge variant="secondary">Rich in Vitamin C</Badge>
                <Badge variant="secondary">Sweet and juicy</Badge>
              </div>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">Free Delivery</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Delivered within 2-3 days in Nagpur region
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
         <Tabs defaultValue="description" className="w-full">
           <TabsList className="grid w-full grid-cols-3">
             <TabsTrigger value="description">Description</TabsTrigger>
             <TabsTrigger value="specifications">Specifications</TabsTrigger>
             <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
           </TabsList>
           <TabsContent value="description" className="mt-6">
             <Card>
               <CardHeader>
                 <CardTitle>Product Description</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground leading-relaxed">
                   Premium quality Nagpur oranges harvested from organic farms. These oranges are known for their sweet taste, juicy texture, and rich vitamin C content. Grown using traditional farming methods without harmful pesticides.
                 </p>
               </CardContent>
             </Card>
           </TabsContent>

           <TabsContent value="specifications" className="mt-6">
             <Card>
               <CardHeader>
                 <CardTitle>Specifications</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-3">
                  <h3 className="text-lg font-semibold">No Specification Provided by the Farmer.</h3>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= averageRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {reviews.length} reviews
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = (count / reviews.length) * 100;
                        return (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={review.avatar} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.user}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-3">{review.comment}</p>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Helpful ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Not Helpful
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}