import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { paymentConfig } from '@/config/payment';
import ClientProviders from '@/components/ClientProviders';
import { poppins } from './font';

export const metadata: Metadata = {
  title: 'Trip Gunung',
  description: 'Aplikasi pendakian gunung',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        <script
          type="text/javascript"
          src={paymentConfig.snapUrl}
          data-client-key={paymentConfig.clientKey}
          async
        />
      </head>
      <body className="bg-white antialiased font-sans">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}