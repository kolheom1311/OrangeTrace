"use client";
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2, Shield, MapPin, QrCode, BarChart3, Users, Leaf, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  if (user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  }

  const features = [
    { icon: QrCode, title: 'QR Code Traceability', description: 'Every batch gets a unique QR code for complete traceability from farm to consumer.' },
    { icon: Shield, title: 'Harvest Verification', description: 'Verify authenticity and quality of orange batches with instant scanning.' },
    { icon: MapPin, title: 'Location Mapping', description: 'View exact farm locations and track your oranges journey.' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Comprehensive insights for farmers to optimize their harvest strategies.' },
    { icon: Users, title: 'Digital Marketplace', description: 'Direct connection between farmers and buyers with transparent pricing.' },
    { icon: Leaf, title: 'Freshness Tracking', description: 'AI-powered freshness assessment to ensure quality standards.' },
  ];

  const stats = [
    { label: 'Registered Farmers', value: '500+' },
    { label: 'Verified Batches', value: '2,500+' },
    { label: 'Successful Trades', value: '1,200+' },
    { label: 'Quality Score', value: '98%' },
  ];
  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container py-8"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome back, {user.name}!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Continue managing your orange {user.role === 'farmer' ? 'harvests' : 'purchases'} with OrangeTrace
          </p>
          <Button size="lg" onClick={() => router.push(`/dashboard/${user.role}`)}>
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </motion.div>
    );
  }

  
  return (
    <div className="flex flex-col">
      {}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative py-20 lg:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Empowering Nagpur Farmers
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-orange-gradient">
              {t('root.tagline')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('root.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700" onClick={() => router.push('/register')}>
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push('/verify')}>
                Verify Harvest <Shield className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose OrangeTrace?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the Nagpur orange ecosystem with cutting-edge technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <feature.icon className="h-12 w-12 text-orange-600 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
            
      {}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 bg-muted/50 dark:bg-muted/20"
      >
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Trusted by the Community</h2>
          <p className="text-xl text-muted-foreground mb-16">
            Join thousands of farmers and buyers already using OrangeTrace
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="container">
          <Card className="bg-orange-gradient text-white dark:from-orange-600 dark:to-orange-700">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Orange Business?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join the digital revolution in orange farming and connect with buyers worldwide
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" onClick={() => router.push('/register')}>
                  Start as Farmer <Leaf className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-orange-700 dark:hover:text-orange-800"
                  onClick={() => router.push('/marketplace')}>
                  Browse Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
}
