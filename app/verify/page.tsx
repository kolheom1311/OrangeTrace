"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getBatchById } from '@/lib/firestore';
import { HarvestBatch } from '@/types';
import { Search, QrCode, Package, MapPin, Calendar, Star, Camera, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { motion } from "framer-motion";

function toDateSafe(input: any): Date {
  if (!input) return new Date(0);
  if (typeof input === 'string') return new Date(input);
  if (typeof input.toDate === 'function') return input.toDate(); 
  return new Date(input);
}

function QrScanner({ onScan, onError }: { onScan: (result: string) => void; onError: (error: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<string>('inactive');

  useEffect(() => {
    let jsQR: any = null;
    let animationId: number;

    const loadQRLibrary = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js';
        script.onload = () => {
          jsQR = (window as any).jsQR;
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load QR library:', error);
      }
    };

    const scanQRCode = () => {
      if (!jsQR || !videoRef.current || !canvasRef.current || !isActive) {
        animationId = requestAnimationFrame(scanQRCode);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          try {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code && code.data) {
              setIsScanning(true);
              onScan(code.data);
              stopCamera();
              return;
            }
          } catch (error) {
            console.error('QR scanning error:', error);
          }
        }
      }

      animationId = requestAnimationFrame(scanQRCode);
    };

    if (isActive) {
      loadQRLibrary();
      animationId = requestAnimationFrame(scanQRCode);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, onScan]);

  const startCamera = async () => {
    try {
      setCameraStatus('requesting');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      setCameraStatus('stream_received');
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraStatus('video_set');
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          setCameraStatus('metadata_loaded');
          setIsActive(true);
          setIsScanning(false);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
          setCameraStatus('can_play');
          setIsActive(true);
          setIsScanning(false);
        };
        
        videoRef.current.play().then(() => {
          console.log('Video playing');
          setCameraStatus('playing');
          setIsActive(true);
          setIsScanning(false);
        }).catch((playError) => {
          console.error('Play error:', playError);
          setCameraStatus('play_error');
          setIsActive(true); 
          setIsScanning(false);
        });
      }
    } catch (error) {
      setCameraStatus('error');
      onError('Camera access denied. Please allow camera permissions and try again.');
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setIsScanning(false);
    setCameraStatus('inactive');
  };

  const simulateQrScan = () => {
    const demoCodes = ['NG2024001', 'NG2024002', 'NG2024003'];
    const randomCode = demoCodes[Math.floor(Math.random() * demoCodes.length)];
    setIsScanning(true);
    setTimeout(() => {
      onScan(randomCode);
      stopCamera();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        {isActive ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 bg-black rounded-lg object-cover"
              style={{ transform: 'scaleX(-1)' }}
              onLoadedData={() => {
                console.log('Video loaded');
                setIsActive(true);
              }}
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-48 h-48 border-2 rounded-lg relative transition-colors duration-300 ${
                isScanning ? 'border-green-400' : 'border-white'
              }`}>
                <div className={`absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 transition-colors duration-300 ${
                  isScanning ? 'border-green-500' : 'border-orange-500'
                }`}></div>
                <div className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 transition-colors duration-300 ${
                  isScanning ? 'border-green-500' : 'border-orange-500'
                }`}></div>
                <div className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 transition-colors duration-300 ${
                  isScanning ? 'border-green-500' : 'border-orange-500'
                }`}></div>
                <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 transition-colors duration-300 ${
                  isScanning ? 'border-green-500' : 'border-orange-500'
                }`}></div>
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-orange-500 opacity-75 animate-pulse"></div>
                  </div>
                )}
                
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-sm font-medium bg-green-500 px-2 py-1 rounded">
                      QR Code Detected!
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={stopCamera}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-black bg-opacity-50 text-white text-sm px-3 py-2 rounded-lg text-center">
                {isScanning ? 'Processing QR Code...' : 'Position QR code within the frame'}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                {stream ? 'Loading camera...' : 'Camera inactive'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {stream ? `Status: ${cameraStatus}` : 'Click "Start Camera" to begin scanning'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isActive ? (
          <Button onClick={startCamera} className="flex-1">
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button 
              onClick={simulateQrScan} 
              variant="outline"
              className="flex-1"
              disabled={isScanning}
            >
              Demo Scan
            </Button>
            <Button 
              onClick={stopCamera}
              variant="secondary"
              className="flex-1"
            >
              Stop Camera
            </Button>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Point your camera at a QR code to scan it automatically</p>
        <p className="text-xs mt-1">
          {isActive ? 
            'Real-time scanning active - QR codes will be detected automatically' : 
            'Camera will scan for QR codes when started'
          }
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [batchId, setBatchId] = useState('');
  const [batch, setBatch] = useState<HarvestBatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    const batchParam = searchParams.get('batch');
    if (batchParam) {
      setBatchId(batchParam);
      handleVerify(batchParam);
    }
  }, [searchParams]);

  const handleVerify = async (id?: string) => {
    const searchId = id || batchId;
    if (!searchId.trim()) {
      setError('Please enter a batch ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundBatch = await getBatchById(searchId.trim());
      if (foundBatch) {
        setBatch(foundBatch);
      } else {
        setError(t('verify.not_found'));
        setBatch(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQrScan = (result: string) => {
    try {
      const url = new URL(result);
      const batchParam = url.searchParams.get('batch');
      if (batchParam) {
        setBatchId(batchParam);
        handleVerify(batchParam);
      } else {
        setError('Invalid QR code format');
      }
    } catch {
      setBatchId(result);
      handleVerify(result);
    }
    setShowScanner(false);
  };

  const getFreshnessScore = (harvestDate: Date): { score: number; label: string; color: string } => {
    const days = differenceInDays(new Date(), harvestDate);
    if (days <= 3) return { score: 95, label: 'Excellent', color: 'bg-green-500' };
    if (days <= 7) return { score: 80, label: 'Good', color: 'bg-yellow-500' };
    if (days <= 14) return { score: 65, label: 'Fair', color: 'bg-orange-500' };
    return { score: 40, label: 'Old', color: 'bg-red-500' };
  };
return (
  <motion.div
    className="container py-8 max-w-4xl mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="text-center mb-8">
      <motion.h1
        className="text-3xl font-bold mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t("verify.title")}
      </motion.h1>
      <motion.p
        className="text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Enter a batch ID or scan a QR code to verify orange batch authenticity
      </motion.p>
    </div>

    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Verification Methods</CardTitle>
          <CardDescription>
            Choose your preferred method to verify the orange batch
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                {t("verify.enter_id")}
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., NG2024001"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                />
                <Button
                  onClick={() => handleVerify()}
                  disabled={loading}
                  className="px-6"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-grey"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">or</p>
            <Button
              variant="outline"
              onClick={() => setShowScanner(!showScanner)}
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              {showScanner ? "Hide QR Scanner" : t("verify.scan_qr")}
            </Button>
          </div>

          {showScanner && (
            <motion.div
              className="border rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <QrScanner onScan={handleQrScan} onError={setError} />
            </motion.div>
          )}

          {error && (
            <motion.div
              className="text-center text-red-600 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {error}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>

    {batch && (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {t("verify.batch_details")}
                </CardTitle>
                <CardDescription>
                  Verified batch information from blockchain records
                </CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 whitespace-nowrap">
                ✓ Verified
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Batch Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch ID:</span>
                      <span className="font-medium">{batch.batchId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Variety:</span>
                      <span className="font-medium">{batch.variety}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{batch.quantity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Price per kg:
                      </span>
                      <span className="font-medium">₹{batch.pricePerKg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant={
                          batch.status === "available" ? "default" : "secondary"
                        }
                      >
                        {batch.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Harvest Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Harvest Date:
                      </span>
                      <span className="font-medium">
                        {format(batch.harvestDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Farm Location:
                      </span>
                      <span className="font-medium">
                        {batch.farmLocation.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(() => {
                  const freshness = getFreshnessScore(batch.harvestDate);
                  const daysAgo = differenceInDays(
                    new Date(),
                    batch.harvestDate
                  );

                  return (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">
                        Quality Assessment
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Freshness Score:
                          </span>
                          <Badge className={`${freshness.color} text-white`}>
                            {freshness.score}% - {freshness.label}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Harvested {daysAgo} day{daysAgo !== 1 ? "s" : ""} ago
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${freshness.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${freshness.score}%` }}
                            transition={{ duration: 0.8 }}
                          ></motion.div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <Separator />

                {batch.images && batch.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Batch Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {batch.images.slice(0, 4).map((image, index) => (
                        <motion.div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <img
                            src={image}
                            alt={`${batch.variety} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Traceability Timeline
              </h3>
              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-4 p-3 border rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Batch Registered</p>
                    <p className="text-sm text-muted-foreground">
                      {format(toDateSafe(batch.createdAt), "MMMM d, yyyy HH:mm")}
                    </p>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4 p-3 border rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <QrCode className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">QR Code Generated</p>
                    <p className="text-sm text-muted-foreground">
                      Unique identifier created for traceability
                    </p>
                  </div>
                  <Badge variant="secondary">Completed</Badge>
                </motion.div>

                {batch.status === "sold" && (
                  <motion.div
                    className="flex items-center gap-4 p-3 border rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Batch Sold</p>
                      <p className="text-sm text-muted-foreground">
                        Purchased by verified buyer
                      </p>
                    </div>
                    <Badge>Completed</Badge>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )}
  </motion.div>
);

  // return (
  //   <div className="container py-8 max-w-4xl mx-auto">
  //     <div className="text-center mb-8">
  //       <h1 className="text-3xl font-bold mb-2">{t('verify.title')}</h1>
  //       <p className="text-muted-foreground">
  //         Enter a batch ID or scan a QR code to verify orange batch authenticity
  //       </p>
  //     </div>
  //     <Card className="mb-8">
  //       <CardHeader>
  //         <CardTitle>Verification Methods</CardTitle>
  //         <CardDescription>
  //           Choose your preferred method to verify the orange batch
  //         </CardDescription>
  //       </CardHeader>
  //       <CardContent className="space-y-4">
  //         <div className="flex gap-4">
  //           <div className="flex-1">
  //             <label className="text-sm font-medium mb-2 block">
  //               {t('verify.enter_id')}
  //             </label>
  //             <div className="flex gap-2">
  //               <Input
  //                 placeholder="e.g., NG2024001"
  //                 value={batchId}
  //                 onChange={(e) => setBatchId(e.target.value)}
  //                 onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
  //               />
  //               <Button 
  //                 onClick={() => handleVerify()}
  //                 disabled={loading}
  //                 className="px-6"
  //               >
  //                 {loading ? (
  //                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-grey"></div>
  //                 ) : (
  //                   <Search className="h-4 w-4" />
  //                 )}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="text-center">
  //           <p className="text-sm text-muted-foreground mb-2">or</p>
  //           <Button
  //             variant="outline"
  //             onClick={() => setShowScanner(!showScanner)}
  //             className="flex items-center gap-2"
  //           >
  //             <QrCode className="h-4 w-4" />
  //             {showScanner ? 'Hide QR Scanner' : t('verify.scan_qr')}
  //           </Button>
  //         </div>

  //         {showScanner && (
  //           <div className="border rounded-lg p-4">
  //             <QrScanner onScan={handleQrScan} onError={setError} />
  //           </div>
  //         )}

  //         {error && (
  //           <div className="text-center text-red-600 text-sm font-medium">
  //             {error}
  //           </div>
  //         )}
  //       </CardContent>
  //     </Card>
  //     {batch && (
  //       <Card>
  //         <CardHeader>
  //           <div className="flex items-center justify-between">
  //             <div>
  //               <CardTitle className="text-2xl">{t('verify.batch_details')}</CardTitle>
  //               <CardDescription>
  //                 Verified batch information from blockchain records
  //               </CardDescription>
  //             </div>
  //             <Badge className="bg-green-100 text-green-800 border-green-200 whitespace-nowrap">
  //               ✓ Verified
  //             </Badge>
  //           </div>
  //         </CardHeader>
  //         <CardContent className="space-y-6">
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //             <div className="space-y-4">
  //               <div>
  //                 <h3 className="font-semibold text-lg mb-3">Batch Information</h3>
  //                 <div className="space-y-3">
  //                   <div className="flex justify-between">
  //                     <span className="text-muted-foreground">Batch ID:</span>
  //                     <span className="font-medium">{batch.batchId}</span>
  //                   </div>
  //                   <div className="flex justify-between">
  //                     <span className="text-muted-foreground">Variety:</span>
  //                     <span className="font-medium">{batch.variety}</span>
  //                   </div>
  //                   <div className="flex justify-between">
  //                     <span className="text-muted-foreground">Quantity:</span>
  //                     <span className="font-medium">{batch.quantity} kg</span>
  //                   </div>
  //                   <div className="flex justify-between">
  //                     <span className="text-muted-foreground">Price per kg:</span>
  //                     <span className="font-medium">₹{batch.pricePerKg}</span>
  //                   </div>
  //                   <div className="flex justify-between">
  //                     <span className="text-muted-foreground">Status:</span>
  //                     <Badge variant={batch.status === 'available' ? 'default' : 'secondary'}>
  //                       {batch.status}
  //                     </Badge>
  //                   </div>
  //                 </div>
  //               </div>

  //               <Separator />

  //               <div>
  //                 <h3 className="font-semibold text-lg mb-3">Harvest Details</h3>
  //                 <div className="space-y-3">
  //                   <div className="flex items-center gap-2">
  //                     <Calendar className="h-4 w-4 text-muted-foreground" />
  //                     <span className="text-muted-foreground">Harvest Date:</span>
  //                     <span className="font-medium">
  //                       {format(batch.harvestDate, 'MMMM d, yyyy')}
  //                     </span>
  //                   </div>
  //                   <div className="flex items-center gap-2">
  //                     <MapPin className="h-4 w-4 text-muted-foreground" />
  //                     <span className="text-muted-foreground">Farm Location:</span>
  //                     <span className="font-medium">{batch.farmLocation.address}</span>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>

  //             <div className="space-y-4">
  //               {(() => {
  //                 const freshness = getFreshnessScore(batch.harvestDate);
  //                 const daysAgo = differenceInDays(new Date(), batch.harvestDate);
                  
  //                 return (
  //                   <div>
  //                     <h3 className="font-semibold text-lg mb-3">Quality Assessment</h3>
  //                     <div className="space-y-3">
  //                       <div className="flex items-center gap-2">
  //                         <Star className="h-4 w-4 text-muted-foreground" />
  //                         <span className="text-muted-foreground">Freshness Score:</span>
  //                         <Badge className={`${freshness.color} text-white`}>
  //                           {freshness.score}% - {freshness.label}
  //                         </Badge>
  //                       </div>
  //                       <div className="text-sm text-muted-foreground">
  //                         Harvested {daysAgo} day{daysAgo !== 1 ? 's' : ''} ago
  //                       </div>

  //                       <div className="w-full bg-gray-200 rounded-full h-2">
  //                         <div 
  //                           className={`h-2 rounded-full ${freshness.color}`}
  //                           style={{ width: `${freshness.score}%` }}
  //                         ></div>
  //                       </div>
  //                     </div>
  //                   </div>
  //                 );
  //               })()}

  //               <Separator />

  //               {batch.images && batch.images.length > 0 && (
  //                 <div>
  //                   <h3 className="font-semibold text-lg mb-3">Batch Images</h3>
  //                   <div className="grid grid-cols-2 gap-2">
  //                     {batch.images.slice(0, 4).map((image, index) => (
  //                       <div key={index} className="aspect-square rounded-lg overflow-hidden">
  //                         <img
  //                           src={image}
  //                           alt={`${batch.variety} - Image ${index + 1}`}
  //                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
  //                         />
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
  //           </div>

  //           <Separator />
  //           <div>
  //             <h3 className="font-semibold text-lg mb-4">Traceability Timeline</h3>
  //             <div className="space-y-4">
  //               <div className="flex items-center gap-4 p-3 border rounded-lg">
  //                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
  //                   <Package className="h-4 w-4 text-green-600" />
  //                 </div>
  //                 <div className="flex-1">
  //                   <p className="font-medium">Batch Registered</p>
  //                   <p className="text-sm text-muted-foreground">
  //                     {format(toDateSafe(batch.createdAt), 'MMMM d, yyyy HH:mm')}
  //                   </p>
  //                 </div>
  //                 <Badge variant="secondary">Completed</Badge>
  //               </div>
                
  //               <div className="flex items-center gap-4 p-3 border rounded-lg">
  //                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
  //                   <QrCode className="h-4 w-4 text-blue-600" />
  //                 </div>
  //                 <div className="flex-1">
  //                   <p className="font-medium">QR Code Generated</p>
  //                   <p className="text-sm text-muted-foreground">
  //                     Unique identifier created for traceability
  //                   </p>
  //                 </div>
  //                 <Badge variant="secondary">Completed</Badge>
  //               </div>

  //               {batch.status === 'sold' && (
  //                 <div className="flex items-center gap-4 p-3 border rounded-lg">
  //                   <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
  //                     <Package className="h-4 w-4 text-orange-600" />
  //                   </div>
  //                   <div className="flex-1">
  //                     <p className="font-medium">Batch Sold</p>
  //                     <p className="text-sm text-muted-foreground">
  //                       Purchased by verified buyer
  //                     </p>
  //                   </div>
  //                   <Badge>Completed</Badge>
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     )}
  //   </div>
  // );
}