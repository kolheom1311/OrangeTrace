"use client";
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useRef } from 'react';
import nextDynamic from "next/dynamic";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, Zap, Star, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const Progress = nextDynamic(() => import('@/components/ui/progress').then(mod => mod.Progress), { ssr: false });

interface AnalysisResult {
  freshnessScore: number;
  quality: string;
  color: string;
  ripeness: string;
  shelfLife: string;
  recommendations: string[];
  defects: string[];
  confidence: number;
}

export default function FreshnessChecker() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockResults = [
      {
        freshnessScore: 92,
        quality: 'Excellent',
        color: 'bg-green-500',
        ripeness: 'Perfect',
        shelfLife: '7-10 days',
        recommendations: [
          'Oranges are at peak freshness',
          'Ideal for immediate consumption',
          'Store in cool, dry place',
          'Perfect for premium pricing'
        ],
        defects: [],
        confidence: 95
      },
      {
        freshnessScore: 78,
        quality: 'Good',
        color: 'bg-yellow-500',
        ripeness: 'Ripe',
        shelfLife: '4-6 days',
        recommendations: [
          'Good quality for sale',
          'Consume within a week',
          'Slight color variation detected',
          'Suitable for local markets'
        ],
        defects: ['Minor surface blemishes'],
        confidence: 88
      },
      {
        freshnessScore: 65,
        quality: 'Fair',
        color: 'bg-orange-500',
        ripeness: 'Overripe',
        shelfLife: '2-3 days',
        recommendations: [
          'Quick sale recommended',
          'Consider juice processing',
          'Reduce pricing for faster turnover',
          'Monitor for further deterioration'
        ],
        defects: ['Soft spots detected', 'Color inconsistency'],
        confidence: 82
      }
    ];

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setAnalysisResult(randomResult);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Freshness Checker</h1>
        <p className="text-muted-foreground">
          Advanced AI-powered analysis to determine orange freshness and quality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Upload & Analyze
            </CardTitle>
            <CardDescription>
              Upload an image of your oranges for AI-powered freshness analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected orange"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Button onClick={resetAnalysis} variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New
                    </Button>
                    <Button 
                      onClick={analyzeImage} 
                      disabled={isAnalyzing}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Analyze Freshness
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Orange Image</h3>
                  <p className="text-muted-foreground mb-4">
                    Take a clear photo of your oranges for analysis
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Image
                  </Button>
                </div>
              )}
            </div>
            {isAnalyzing && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">AI Analysis in Progress</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our AI is analyzing color, texture, and surface quality...
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Color Analysis</span>
                    <span>100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Texture Detection</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Defect Identification</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Analysis Results
            </CardTitle>
            <CardDescription>
              AI-powered freshness assessment and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!analysisResult ? (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Upload an image to see AI analysis results
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white mb-4">
                    <span className="text-2xl font-bold">{analysisResult.freshnessScore}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Freshness Score: {analysisResult.freshnessScore}/100
                  </h3>
                  <Badge className={`${analysisResult.color} text-white`}>
                    {analysisResult.quality}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Ripeness</p>
                    <p className="font-semibold">{analysisResult.ripeness}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Shelf Life</p>
                    <p className="font-semibold">{analysisResult.shelfLife}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Confidence Level</span>
                    <span>{analysisResult?.confidence || 0}%</span>
                  </div>
                  <Progress value={analysisResult?.confidence || 0} className="h-2" />
                </div>
                {analysisResult.defects.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Detected Issues
                    </h4>
                    <ul className="space-y-1">
                      {analysisResult.defects.map((defect: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                          {defect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Freshness Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scoring" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scoring">Scoring System</TabsTrigger>
              <TabsTrigger value="factors">Quality Factors</TabsTrigger>
              <TabsTrigger value="tips">Storage Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scoring" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="font-semibold">Excellent (90-100)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Peak freshness, vibrant color, firm texture, premium quality
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="font-semibold">Good (70-89)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Good quality, slight variations, suitable for most markets
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      <span className="font-semibold">Fair (50-69)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Acceptable quality, quick sale recommended, processing suitable
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="factors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Visual Indicators</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Vibrant orange color
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Smooth, unblemished skin
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Firm texture
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Natural shine
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Quality Defects</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Soft spots or bruises
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Discoloration
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Wrinkled skin
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Mold or dark spots
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Optimal Storage</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Temperature: 4-10°C (39-50°F)</li>
                    <li>• Humidity: 85-90%</li>
                    <li>• Good air circulation</li>
                    <li>• Away from direct sunlight</li>
                    <li>• Separate from ethylene producers</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Handling Best Practices</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Handle gently to avoid bruising</li>
                    <li>• Sort by ripeness level</li>
                    <li>• Remove damaged fruits immediately</li>
                    <li>• Use FIFO (First In, First Out) method</li>
                    <li>• Regular quality inspections</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
    
  );
}