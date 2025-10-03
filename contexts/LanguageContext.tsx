"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'root.tagline': 'Digital Traceability for Orange Farming',
    'root.description': 'Connect farmers, buyers, and consumers through transparent, traceable, and trusted orange marketplace ecosystem.',

    'nav.dashboard': 'Dashboard',
    'nav.account' : 'Account',
    'nav.marketplace': 'Marketplace',
    'nav.verify': 'Verify Harvest',
    'nav.analytics': 'Analytics',
    'nav.history': 'Purchase History',
    'nav.freshness': 'Freshness Checker',
    'nav.cart': 'Cart',
    'nav.orders': 'Orders',
    'nav.notifications': 'Notifications',
    'nav.feedback': 'Feedback',
    'nav.logout': 'Logout',
    
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.location': 'Location',
    'auth.role': 'Role',
    'auth.farmer': 'Farmer',
    'auth.buyer': 'Buyer',
    
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',

    'marketplace.title': 'Orange Marketplace',
    'marketplace.variety': 'Variety',
    'marketplace.price': 'Price per Kg',
    'marketplace.quantity': 'Quantity Available',
    'marketplace.location': 'Farm Location',
    'marketplace.harvest_date': 'Harvest Date',
    'marketplace.buy_now': 'Buy Now',
    
    'dashboard.welcome': 'Welcome',
    'dashboard.recent_activity': 'Recent Activity',
    'dashboard.total_batches': 'Total Batches',
    'dashboard.total_sales': 'Total Sales',
    'dashboard.revenue': 'Revenue',
    'dashboard.purchases': 'Purchases',
    
    'batch.register': 'Register New Batch',
    'batch.variety': 'Orange Variety',
    'batch.harvest_date': 'Harvest Date',
    'batch.quantity': 'Quantity (kg)',
    'batch.price': 'Price per Kg (₹)',
    'batch.farm_location': 'Farm Location',
    'batch.images': 'Upload Images',
    
    'verify.title': 'Verify Orange Batch',
    'verify.enter_id': 'Enter Batch ID',
    'verify.scan_qr': 'Scan QR Code',
    'verify.batch_details': 'Batch Details',
    'verify.not_found': 'Batch not found',
    
    'lang.english': 'English',
    'lang.marathi': 'मराठी',
  },
  mr: {

    'root.tagline': 'संत्रा शेतीमध्ये डिजिटल पारदर्शकता',
    'root.description': 'एका पारदर्शक, मागोवाक्षम आणि विश्वसनीय संत्रा बाजारपेठ परिसंस्थेद्वारे शेतकरी, खरेदीदार आणि ग्राहक यांना एकत्र आणा.',

    'nav.dashboard': 'डॅशबोर्ड',
    'nav.marketplace': 'बाजारपेठ',
    'nav.account': 'खाता',
    'nav.verify': 'कापणी सत्यापित करा',
    'nav.analytics': 'विश्लेषण',
    'nav.cart': 'खरेदीसामान',
    'nav.orders': 'ऑर्डर',
    'nav.history': 'खरेदी इतिहास',
    'nav.freshness': 'ताजेपणा तपासक',
    'nav.notifications': 'सूचना',
    'nav.feedback': 'प्रतिक्रिया',
    'nav.logout': 'लॉग आउट',
    
    'auth.login': 'लॉगिन',
    'auth.register': 'नोंदणी',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.name': 'पूर्ण नाव',
    'auth.phone': 'फोन नंबर',
    'auth.location': 'स्थान',
    'auth.role': 'भूमिका',
    'auth.farmer': 'शेतकरी',
    'auth.buyer': 'खरेदीदार',
    
    'common.submit': 'सबमिट करा',
    'common.cancel': 'रद्द करा',
    'common.save': 'जतन करा',
    'common.delete': 'हटवा',
    'common.edit': 'संपादित करा',
    'common.view': 'पहा',
    'common.loading': 'लोड होत आहे...',
    'common.search': 'शोधा',
    'common.filter': 'फिल्टर',
    'common.sort': 'क्रमवारी',
    
    'marketplace.title': 'संत्रा बाजारपेठ',
    'marketplace.variety': 'प्रकार',
    'marketplace.price': 'प्रति किलो दर',
    'marketplace.quantity': 'उपलब्ध प्रमाण',
    'marketplace.location': 'शेतीचे स्थान',
    'marketplace.harvest_date': 'कापणी दिनांक',
    'marketplace.buy_now': 'आता खरेदी करा',
    
    'dashboard.welcome': 'स्वागत',
    'dashboard.recent_activity': 'अलीकडची गतिविधी',
    'dashboard.total_batches': 'एकूण बॅचेस',
    'dashboard.total_sales': 'एकूण विक्री',
    'dashboard.revenue': 'उत्पन्न',
    'dashboard.purchases': 'खरेदी',
    
    'batch.register': 'नवीन बॅच नोंदवा',
    'batch.variety': 'संत्रा प्रकार',
    'batch.harvest_date': 'कापणी दिनांक',
    'batch.quantity': 'प्रमाण (किलो)',
    'batch.price': 'प्रति किलो दर (₹)',
    'batch.farm_location': 'शेतीचे स्थान',
    'batch.images': 'छायाचित्रे अपलोड करा',
    
    'verify.title': 'संत्रा बॅच सत्यापित करा',
    'verify.enter_id': 'बॅच आयडी टाका',
    'verify.scan_qr': 'QR कोड स्कॅन करा',
    'verify.batch_details': 'बॅच तपशील',
    'verify.not_found': 'बॅच सापडला नाही',
    
    'lang.english': 'English',
    'lang.marathi': 'मराठी',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('orangetrace_language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('orangetrace_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}