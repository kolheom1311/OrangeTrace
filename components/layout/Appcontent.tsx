'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import IOSLoader from '@/components/ui/IOSLoader';
import { cn } from '@/lib/utils';

// Define the routes where the full-page loader should be active.
const LOADER_PAGES = ['/dashboard/buyer', '/dashboard/farmer', '/account', '/settings'];

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const pathname = usePathname();

  // Show loader only if isLoading is true AND the current page is in the list.
  const showLoader = isLoading && LOADER_PAGES.includes(pathname);

  return (
    <div className="relative min-h-screen">
      {showLoader && (
        <div className="fixed inset-0 z-[9999] backdrop-blur-md bg-black/20 flex items-center justify-center">
          <IOSLoader />
        </div>
      )}

      <div className={cn(showLoader && 'pointer-events-none select-none blur-sm')}>
        {children}
      </div>
    </div>
  );
}