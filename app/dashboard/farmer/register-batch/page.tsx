"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateQRCode, generateBatchQRData } from '@/lib/qr-code';
import { HarvestBatch, ORANGE_VARIETIES } from '@/types';
import { 
  Package, 
  Upload, 
  MapPin, 
  Calendar, 
  QrCode, 
  Save, 
  X, 
  Plus,
  Camera,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

function RegisterBatchContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const router = useRouter();

  const [formData, setFormData] = useState({
    variety: '',
    harvestDate: '',
    quantity: '',
    pricePerKg: '',
    farmAddress: '',
    farmLat: '',
    farmLng: '',
    description: ''
  });

  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qrCode, setQrCode] = useState<string>('');
  const [generatedBatchId, setGeneratedBatchId] = useState<string>('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImages(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.variety) newErrors.variety = 'Orange variety is required';
    if (!formData.harvestDate) newErrors.harvestDate = 'Harvest date is required';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }
    if (!formData.pricePerKg || parseFloat(formData.pricePerKg) <= 0) {
      newErrors.pricePerKg = 'Valid price per kg is required';
    }
    if (!formData.farmAddress) newErrors.farmAddress = 'Farm address is required';
    const harvestDate = new Date(formData.harvestDate);
    const today = new Date();
    if (harvestDate > today) {
      newErrors.harvestDate = 'Harvest date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateBatchId = (): string => {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NG${year}${month}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user) return;

    setIsSubmitting(true);

    try {
      const batchId = generateBatchId();
      setGeneratedBatchId(batchId);

      const qrData = generateBatchQRData(batchId);
      const qrCodeImage = await generateQRCode(qrData);
      setQrCode(qrCodeImage);

      const newBatch = {
        farmerId: user.id,
        batchId,
        variety: formData.variety,
        harvestDate: formData.harvestDate,
        quantity: parseFloat(formData.quantity),
        pricePerKg: parseFloat(formData.pricePerKg),
        farmLocation: {
          lat: parseFloat(formData.farmLat) || 21.1458,
          lng: parseFloat(formData.farmLng) || 79.0882,
          address: formData.farmAddress,
        },
        images: images.length > 0 ? images : [
          'https://images.pexels.com/photos/1414651/pexels-photo-1414651.jpeg'
        ],
        status: 'available',
        qrCode: qrCodeImage,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'batches'), newBatch);

      addNotification({
        userId: user.id,
        type: 'system',
        title: 'Batch Registered Successfully',
        message: `Orange batch ${batchId} has been registered and is now available in the marketplace.`,
        read: false
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      router.push('/dashboard/farmer');

    } catch (error) {
      console.error('Error registering batch:', error);
      setErrors({ submit: 'Failed to register batch. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('batch.register')}</h1>
        <p className="text-muted-foreground">
          Register a new orange harvest batch for traceability and marketplace listing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Batch Information
            </CardTitle>
            <CardDescription>
              Enter the basic details about your orange harvest batch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.submit && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="variety">{t('batch.variety')} *</Label>
                <Select value={formData.variety} onValueChange={(value) => handleInputChange('variety', value)}>
                  <SelectTrigger className={errors.variety ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select orange variety" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORANGE_VARIETIES.map((variety) => (
                      <SelectItem key={variety} value={variety}>
                        {variety}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.variety && <p className="text-sm text-red-500">{errors.variety}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="harvestDate">{t('batch.harvest_date')} *</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className={errors.harvestDate ? 'border-red-500' : ''}
                />
                {errors.harvestDate && <p className="text-sm text-red-500">{errors.harvestDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t('batch.quantity')} *</Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="500"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    min="1"
                    step="0.1"
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  <span className="absolute right-3 top-3 text-sm text-muted-foreground">kg</span>
                </div>
                {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerKg">{t('batch.price')} *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm text-muted-foreground">₹</span>
                  <Input
                    id="pricePerKg"
                    type="number"
                    placeholder="45"
                    value={formData.pricePerKg}
                    onChange={(e) => handleInputChange('pricePerKg', e.target.value)}
                    min="1"
                    step="0.01"
                    className={`pl-8 ${errors.pricePerKg ? 'border-red-500' : ''}`}
                  />
                  <span className="absolute right-3 top-3 text-sm text-muted-foreground">/kg</span>
                </div>
                {errors.pricePerKg && <p className="text-sm text-red-500">{errors.pricePerKg}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Additional details about this batch..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-orange-600" />
              {t('batch.farm_location')}
            </CardTitle>
            <CardDescription>
              Provide the location details of your farm for traceability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="farmAddress">Farm Address *</Label>
              <Textarea
                id="farmAddress"
                placeholder="Enter your complete farm address (e.g., Village, Tehsil, District, State)"
                value={formData.farmAddress}
                onChange={(e) => handleInputChange('farmAddress', e.target.value)}
                rows={3}
                className={errors.farmAddress ? 'border-red-500' : ''}
              />
              {errors.farmAddress && <p className="text-sm text-red-500">{errors.farmAddress}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="farmLat">Latitude (Optional)</Label>
                <Input
                  id="farmLat"
                  type="number"
                  placeholder="21.1458"
                  value={formData.farmLat}
                  onChange={(e) => handleInputChange('farmLat', e.target.value)}
                  step="any"
                />
                <p className="text-xs text-muted-foreground">GPS coordinates for precise location</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmLng">Longitude (Optional)</Label>
                <Input
                  id="farmLng"
                  type="number"
                  placeholder="79.0882"
                  value={formData.farmLng}
                  onChange={(e) => handleInputChange('farmLng', e.target.value)}
                  step="any"
                />
                <p className="text-xs text-muted-foreground">GPS coordinates for precise location</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-orange-600" />
              {t('batch.images')}
            </CardTitle>
            <CardDescription>
              Upload high-quality images of your orange batch (optional but recommended)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              <div className="text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Batch Images</h3>
                <p className="text-muted-foreground mb-4">
                  Add photos of your oranges to attract more buyers
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Choose Images
                </Button>
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Batch image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Registration Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.variety && formData.quantity && formData.pricePerKg && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Variety</p>
                  <p className="font-semibold">{formData.variety}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold">{formData.quantity} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="font-semibold text-orange-600">
                    ₹{(parseFloat(formData.quantity || '0') * parseFloat(formData.pricePerKg || '0')).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering Batch...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Register Batch
                  </>
                )}
              </Button>
            </div>

            {generatedBatchId && qrCode && (
              <div className="mt-6 p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800">Batch Registered Successfully!</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Batch ID:</p>
                    <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                      {generatedBatchId}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">QR Code:</p>
                    <img src={qrCode} alt="Batch QR Code" className="mx-auto w-24 h-24" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
    
  );
}

export default function RegisterBatchPage() {
  return (
    <AuthGuard requiredRole="farmer">
      <RegisterBatchContent />
    </AuthGuard>
  );
}