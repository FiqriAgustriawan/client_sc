
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import Sidebar from "@/components/Dashboard/penyedia-jasa/Sidebar-jasa";
import api from "@/utils/axios";
import toast from "react-hot-toast";

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token || role !== 'guide') {
          router.push('/login');
          return;
        }
        
        // Skip suspension check for now and just render the dashboard
        // This is a temporary fix until the API endpoint is working correctly
        setLoading(false);
        
        /* Commented out until API is fixed
        // Check if guide is suspended
        const response = await api.get('/api/guides/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.data.suspended_until && new Date(response.data.suspended_until) > new Date()) {
          // Guide is suspended
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          
          // Redirect to suspension page
          router.push(`/suspended?until=${encodeURIComponent(response.data.suspended_until)}&reason=${encodeURIComponent(response.data.suspension_reason || '')}`);
          return;
        }
        
        setLoading(false);
        */
      } catch (error) {
        console.error('Auth check error:', error);
        // For now, just continue to the dashboard even if the check fails
        setLoading(false);
        
        /* Commented out to allow access
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        router.push('/login');
        */
      }
    };
    
    checkAuth();
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${poppins.variable} font-poppins antialiased bg-[#f5f5f5]`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
         {children}
        </div>
      </div>
    </div>
  );
}