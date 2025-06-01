'use client';

import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Navbar from "./NavbarComp";

export default function ClientProviders({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Create QueryClient instance once and reuse
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  }));

  const pathname = usePathname();
  
  // Hide navbar on guide registration, login, and register pages
  const hideNavbar = pathname?.includes('/daftar-guide') ||
    pathname?.includes('/login') ||
    pathname?.includes('/register') ||
    pathname?.includes('/gunung') ||
    pathname?.includes('/dashboard-user') ||
    pathname?.includes('/index-jasa') ||
    pathname?.includes('/admin') ||
    pathname?.includes('/dashboard/invoice') ||
    pathname?.includes('/trips/');

  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {!hideNavbar && (
            <div className="w-full absolute z-50">
              <Navbar />
            </div>
          )}
          <main>{children}</main>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}