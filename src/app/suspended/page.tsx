'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';

export default function SuspendedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [suspendedUntil, setSuspendedUntil] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    const until = searchParams.get('until');
    const suspensionReason = searchParams.get('reason');
    
    if (!until) {
      router.push('/login');
      return;
    }
    
    setSuspendedUntil(until);
    setReason(suspensionReason);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }, [searchParams, router]);

  const handleBackToLogin = () => {
    router.push('/login');
  };

  if (!suspendedUntil) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-yellow-100 p-3 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Akun Anda Disuspend
            </h2>
          </div>
          
          <div className="space-y-4 text-sm text-gray-600">
            <p className="text-center">
              Akun Anda telah disuspend hingga:
            </p>
            <p className="text-center font-semibold text-lg">
              {format(new Date(suspendedUntil), 'dd MMMM yyyy', { locale: id })}
            </p>
            
            {reason && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium mb-1">Alasan:</p>
                <p>{reason}</p>
              </div>
            )}
            
            <div className="mt-8 space-y-4">
              <p className="text-center">
                Jika Anda memiliki pertanyaan, silakan hubungi admin melalui:
              </p>
              <div className="flex justify-center space-x-4">
                <a href="mailto:admin@tripgunung.com" className="text-blue-600 hover:text-blue-800">
                  admin@tripgunung.com
                </a>
                <a href="tel:+6281234567890" className="text-blue-600 hover:text-blue-800">
                  0812-3456-7890
                </a>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 mt-6">
              <button
                onClick={handleBackToLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Kembali ke Halaman Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}