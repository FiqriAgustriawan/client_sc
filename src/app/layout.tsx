'use client';

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/NavbarComp";
import { AuthProvider } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { paymentConfig } from '@/config/payment';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Hide navbar on guide registration, login, and register pages
  const hideNavbar = pathname?.includes('/daftar-guide') || 
                    pathname?.includes('/login') || 
                    pathname?.includes('/register') ||
                    pathname?.includes('/gunung/') ||
                    pathname?.includes('/dashboard-user') ||
                    pathname?.includes('/trips/');

  return (
    <html lang="en">
      <head>
        <script 
          type="text/javascript"
          src={paymentConfig.snapUrl}
          data-client-key={paymentConfig.clientKey}
          async
        />
      </head>
      <body className="font-poppins antialiased bg-[#f5f5f5]">
        <Toaster position="top-right" />
        <AuthProvider>
          {!hideNavbar && (
            <div className="w-full absolute z-50">
              <Navbar />
            </div>
          )}
          <main className="">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}