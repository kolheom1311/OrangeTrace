// "use client"; 

// import { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';
// import { useLanguage } from '@/contexts/LanguageContext';
// import { useNotifications } from '@/contexts/NotificationContext';
// import { ThemeToggle } from '@/components/ui/theme-toggle';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Badge } from '@/components/ui/badge';
// import { Skeleton } from '@/components/ui/skeleton';
// import {
//   Bell,
//   User,
//   LogOut,
//   Menu,
//   Globe,
//   Home,
//   ShoppingCart,
//   ShoppingBag,
//   Shield,
//   BarChart3,
//   Zap,
// } from 'lucide-react';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
// import Image from 'next/image';

// export default function Header() {
//   const { user, logout, isLoading } = useAuth();

//   const { language, setLanguage, t } = useLanguage();
//   const { unreadCount } = useNotifications();
//   const [isOpen, setIsOpen] = useState(false);
//   const router = useRouter();

//   const navItems = user?.role === 'farmer'
//     ? [
//         { href: '/dashboard/farmer', label: t('nav.dashboard'), icon: Home },
//         { href: '/marketplace', label: t('nav.marketplace'), icon: ShoppingCart },
//         { href: '/cart', label: t('nav.cart'), icon: ShoppingBag },
//         { href: '/verify', label: t('nav.verify'), icon: Shield },
//         { href: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
//         { href: '/freshness-checker', label: t('nav.freshness'), icon: Zap },
//       ]
//     : [
//         { href: '/dashboard/buyer', label: t('nav.dashboard'), icon: Home },
//         { href: '/marketplace', label: t('nav.marketplace'), icon: ShoppingCart },
//         { href: '/cart', label: t('nav.cart'), icon: ShoppingBag },
//         { href: '/verify', label: t('nav.verify'), icon: Shield },
//       ];

//   const handleLogout = () => {
//     logout();
//     router.push('/');
//   };

//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center">
//         <div className="flex items-center gap-2">
//           <Link href="/" className="flex items-center gap-2">
//             <div className="h-8 w-8 rounded-full overflow-hidden bg-orange-gradient flex items-center justify-center">
//               <Image src="/logo.png" alt="OrangeTrace Logo" width={32} height={32} className="object-cover" />
//             </div>
//             <span className="hidden sm:inline-block font-bold text-lg">OrangeTrace</span>
//           </Link>
//         </div>
//         <div className="flex flex-1 justify-center">
//           {user && (
//             <nav className="hidden md:flex items-center gap-6">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-all duration-200 whitespace-nowrap"
//                 >
//                   <item.icon className="h-3.5 w-3.5" />
//                   {item.label}
//                 </Link>
//               ))}
//             </nav>
//           )}
//         </div>

//         {/* Right: Controls */}
//         <div className="flex items-center gap-4">
//           <ThemeToggle />

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="sm" className="h-8 px-2">
//                 <Globe className="h-3.5 w-3.5" />
//                 <span className="ml-2 hidden sm:inline">
//                   {language === 'en' ? 'EN' : 'मर'}
//                 </span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setLanguage('en')}>
//                 {t('lang.english')}
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setLanguage('mr')}>
//                 {t('lang.marathi')}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* --- START OF CHANGE: Auth Section with Loading State --- */}
//           {isLoading ? (
//             // While loading, show a placeholder skeleton
//             <div className="flex items-center gap-2">
//                 <Skeleton className="h-8 w-8 rounded-full" />
//                 <Skeleton className="h-8 w-24 hidden sm:block" />
//             </div>
//           ) : user ? (
//             // If loading is finished and user exists, show user controls
//             <>
//               {/* Notifications */}
//               <Link href="/notifications">
//                 <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
//                   <Bell className="h-3.5 w-3.5" />
//                   {unreadCount > 0 && (
//                     <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">
//                       {unreadCount}
//                     </Badge>
//                   )}
//                 </Button>
//               </Link>

//               {/* User Dropdown */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="sm" className="h-8 px-2">
//                     <User className="h-3.5 w-3.5" />
//                     <span className="ml-2 hidden sm:inline">{user.name}</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem asChild>
//                     <Link href={`/dashboard/${user.role}`}>
//                       {t('nav.dashboard')}
//                     </Link>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem asChild>
//                     <Link href="/account">
//                       {t('nav.account')}
//                     </Link>
//                   </DropdownMenuItem>
//                   {user.role !== 'farmer' && (
//                     <>
//                       <DropdownMenuItem asChild>
//                         <Link href="/purchase-history">{t('nav.history')}</Link>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem asChild>
//                         <Link href="/feedback">{t('nav.feedback')}</Link>
//                       </DropdownMenuItem>
//                       <DropdownMenuItem asChild>
//                         <Link href="/orders">{t('nav.orders')}</Link>
//                       </DropdownMenuItem>
//                     </>
//                   )}
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={handleLogout}>
//                     <LogOut className="h-3.5 w-3.5 mr-2" />
//                     {t('nav.logout')}
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>

//               {/* Mobile Menu */}
//               <Sheet open={isOpen} onOpenChange={setIsOpen}>
//                 <SheetTrigger asChild>
//                   <Button variant="ghost" size="sm" className="md:hidden h-8 w-8 p-0">
//                     <Menu className="h-3.5 w-3.5" />
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="top" className="max-w-[600px]">
//                   <div className="flex flex-col gap-4 mt-8">
//                     {navItems.map((item) => (
//                       <Link
//                         key={item.href}
//                         href={item.href}
//                         className="flex items-center gap-3 text-sm font-medium p-3 rounded-lg hover:bg-accent transition-colors"
//                         onClick={() => setIsOpen(false)}
//                       >
//                         <item.icon className="h-4 w-4 text-orange-600" />
//                         {item.label}
//                       </Link>
//                     ))}
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </>
//           ) : (
//             // If loading is finished and user does NOT exist, show login/register buttons
//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="sm" className="h-8 px-3" asChild>
//                 <Link href="/login">{t('auth.login')}</Link>
//               </Button>
//               <Button size="sm" className="h-8 px-3 bg-orange-600 hover:bg-orange-700" asChild>
//                 <Link href="/register">{t('auth.register')}</Link>
//               </Button>
//             </div>
//           )}
//           {/* --- END OF CHANGE --- */}

//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  User,
  LogOut,
  Menu,
  Globe,
  Home,
  ShoppingCart,
  ShoppingBag,
  Shield,
  BarChart3,
  Zap,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion'; // Import Variants type

// --- Animation Variants with explicit TypeScript type ---
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' } 
  },
};

const navContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2, // Delay after header slides in
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

export default function Header() {
  const { user, logout, isLoading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = user?.role === 'farmer'
    ? [
        { href: '/dashboard/farmer', label: t('nav.dashboard'), icon: Home },
        { href: '/marketplace', label: t('nav.marketplace'), icon: ShoppingCart },
        { href: '/cart', label: t('nav.cart'), icon: ShoppingBag },
        { href: '/verify', label: t('nav.verify'), icon: Shield },
        { href: '/analytics', label: t('nav.analytics'), icon: BarChart3 },
        { href: '/freshness-checker', label: t('nav.freshness'), icon: Zap },
      ]
    : [
        { href: '/dashboard/buyer', label: t('nav.dashboard'), icon: Home },
        { href: '/marketplace', label: t('nav.marketplace'), icon: ShoppingCart },
        { href: '/cart', label: t('nav.cart'), icon: ShoppingBag },
        { href: '/verify', label: t('nav.verify'), icon: Shield },
      ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-orange-gradient flex items-center justify-center">
              <Image src="/logo.png" alt="OrangeTrace Logo" width={32} height={32} className="object-cover" />
            </div>
            <span className="hidden sm:inline-block font-bold text-lg">OrangeTrace</span>
          </Link>
        </div>
        <div className="flex flex-1 justify-center">
          {user && (
            <motion.nav 
              className="hidden md:flex items-center gap-6"
              variants={navContainerVariants}
            >
              {navItems.map((item) => (
                <motion.div key={item.href} variants={navItemVariants}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-all duration-200 whitespace-nowrap"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          )}
        </div>

        {/* Right: Controls */}
        <motion.div 
          className="flex items-center gap-4"
          variants={navContainerVariants}
        >
          <motion.div variants={navItemVariants}><ThemeToggle /></motion.div>

          <motion.div variants={navItemVariants}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="ml-2 hidden sm:inline">
                    {language === 'en' ? 'EN' : 'मर'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  {t('lang.english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('mr')}>
                  {t('lang.marathi')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-24 hidden sm:block" />
            </div>
          ) : user ? (
            <>
              {/* <motion.div variants={navItemVariants}>
                <Link href="/notifications">
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                    <Bell className="h-3.5 w-3.5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </motion.div> */}

              <motion.div variants={navItemVariants}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <User className="h-3.5 w-3.5" />
                      <span className="ml-2 hidden sm:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${user.role}`}>
                        {t('nav.dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account">
                        {t('nav.account')}
                      </Link>
                    </DropdownMenuItem>
                    {user.role !== 'farmer' && (
                      <>
                        {/* <DropdownMenuItem asChild>
                          <Link href="/purchase-history">{t('nav.history')}</Link>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem asChild>
                          <Link href="/feedback">{t('nav.feedback')}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/orders">{t('nav.orders')}</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-3.5 w-3.5 mr-2" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              
              <motion.div variants={navItemVariants} className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Menu className="h-3.5 w-3.5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="max-w-[600px]">
                    <div className="flex flex-col gap-4 mt-8">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 text-sm font-medium p-3 rounded-lg hover:bg-accent transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon className="h-4 w-4 text-orange-600" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="flex items-center gap-2" 
              variants={navContainerVariants}
            >
              <motion.div variants={navItemVariants}>
                <Button variant="ghost" size="sm" className="h-8 px-3" asChild>
                  <Link href="/login">{t('auth.login')}</Link>
                </Button>
              </motion.div>
              <motion.div variants={navItemVariants}>
                <Button size="sm" className="h-8 px-3 bg-orange-600 hover:bg-orange-700" asChild>
                  <Link href="/register">{t('auth.register')}</Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.header>
  );
}
