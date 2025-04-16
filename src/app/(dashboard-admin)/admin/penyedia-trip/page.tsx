"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axios";
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
interface Guide {
  id: number;
  nama: string;
  email: string;
  phone_number: string;
  status: string;
  created_at: string;
  suspended_until: string | null;
  suspension_reason: string | null;
  ktp_image: string;
  trips_created?: number;
  total_customers?: number;
  rating?: number;
}

export default function ApprovedProviders() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUnsuspending, setIsUnsuspending] = useState(false);
  
  useEffect(() => {
    fetchGuides();
    const interval = setInterval(fetchGuides, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchGuides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/guides/all', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setGuides(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching guides:', error);
      if ((error as any).response?.status === 401) {
        console.log('Unauthorized: Please login again');
      }
      setIsLoading(false);
    }
  };

  const handleUnsuspendGuide = async (guideId: number) => {
    setIsUnsuspending(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/guides/${guideId}/unsuspend`, {}, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success('Suspend akun penyedia jasa berhasil dicabut', {
        duration: 4000,
        style: {
          background: '#F0FDF4',
          color: '#166534',
          border: '1px solid #BBF7D0'
        }
      });
      await fetchGuides();
    } catch (error) {
      console.error('Error unsuspending guide:', error);
      toast.error('Terjadi kesalahan saat mencabut suspend', {
        duration: 4000,
        style: {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FECACA'
        }
      });
    } finally {
      setIsUnsuspending(false);
    }
  };

  const filteredGuides = searchQuery 
    ? guides.filter(guide =>
        guide.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : guides;

  return (
    <div className="bg-white p-4 md:p-6 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">
      <div className="flex flex-col sm:flex-row justify-between mb-6 w-full pt-3">
        <h1 className="text-lg sm:text-2xl font-semibold text-left sm:text-left">Penyedia Trip</h1>
        <div className="flex xl:gap-2 gap-4 justify-end xl:mt-2 sm:mt-0">
          <Link href={'penyedia-trip'} className="text-sm sm:text-base underline font-semibold">
            Semua
          </Link>
          <Link href={'penyediatrip-req'} className="text-sm sm:text-base">
            Permintaan
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari penyedia trip..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : filteredGuides.length === 0 ? (
          <div className="text-center py-4">
            {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada penyedia jasa yang terdaftar'}
          </div>
        ) : (
          filteredGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-[#F6F6F6] rounded-3xl p-3 md:p-4 flex flex-col gap-2 sm:gap-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="w-full sm:w-auto">
                  <h3 className="font-semibold text-lg sm:text-base">{guide.nama}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Bergabung: {format(new Date(guide.created_at), 'dd MMMM yyyy', { locale: id })}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                  <div className="grid grid-cols-3 gap-8 md:flex md:gap-12">
                    <div className="text-center">
                      <p className="text-xs sm:text-base font-medium">
                        {guide.trips_created || 0} Trip
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-base font-medium">
                        {guide.total_customers || 0} Pendaki
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-base font-medium">
                        {guide.rating?.toFixed(1) || '0.0'}/5.0
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      guide.suspended_until 
                        ? 'bg-yellow-100 text-yellow-800'
                        : guide.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : guide.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                    }`}>
                      {guide.suspended_until 
                        ? 'Disuspend'
                        : guide.status === 'approved'
                          ? 'Aktif'
                          : guide.status === 'rejected'
                            ? 'Ditolak'
                            : 'Pending'}
                    </span>
                    {guide.suspended_until && (
                      <div className="mt-1 text-xs text-yellow-700">
                        Hingga: {format(new Date(guide.suspended_until), 'dd MMM yyyy', { locale: id })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t pt-2">
                <Link
                  href={`/admin/penyedia-trip/${guide.id}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Lihat Detail
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
