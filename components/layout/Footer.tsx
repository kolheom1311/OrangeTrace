"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};


export default function Footer() {
  return (
    <motion.footer 
      className="border-t bg-background"
      initial="initial"
      whileInView="animate"
      variants={staggerContainer}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Column 1: Brand Info */}
        <motion.div variants={fadeInUp}>
            <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Image 
                src="/logo.png" 
                alt="OrangeTrace Logo" 
                width={32} 
                height={32} 
                className="object-cover"
            />
            </div>
            <span className="font-bold">OrangeTrace</span>
            </Link>
            <p className="text-sm text-muted-foreground">
            Digital traceability platform for Nagpur orange farming ecosystem.
            </p>
          </motion.div>

          {/* Column 2: Platform Links */}
          <motion.div variants={fadeInUp}>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard/farmer" className="hover:text-primary">For Farmers</Link></li>
                <li><Link href="/dashboard/buyer" className="hover:text-primary">For Buyers</Link></li>
                <li><Link href="/marketplace" className="hover:text-primary">Marketplace</Link></li>
                <li><Link href="/verify" className="hover:text-primary">Verification</Link></li>
              </ul>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>QR Traceability</li>
              <li>Batch Analytics</li>
              <li><Link href="/freshness-checker" className="hover:text-primary">Freshness Checker</Link></li>
              <li>Location Mapping</li>
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help Center</li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li>Documentation</li>
              <li>API Access</li>
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </motion.div>
      </div>
        <motion.div 
          className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground"
          variants={fadeInUp}
        >
          <p>&copy; 2025 OrangeTrace. All rights reserved. Empowering Nagpur farmers with digital traceability.</p>
          </motion.div>
          </div>
          </motion.footer>
     );
}

