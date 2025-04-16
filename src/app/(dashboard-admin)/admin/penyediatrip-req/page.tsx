'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";

interface PendingGuide {
  id: number;
  user: {
    nama_depan: string;
    nama_belakang: string;
  };
  created_at: string;
}

export default function HistoryTrip() {
  const [pendingGuides, setPendingGuides] = useState<PendingGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Add loading states for each guide action
  const [processingGuides, setProcessingGuides] = useState<{[key: number]: {approve: boolean, reject: boolean}}>({});

  const fetchPendingGuides = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/guides/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPendingGuides(response.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingGuides();
  }, []);

  const handleApprove = async (id: number) => {
    // Set loading state for this specific guide's approve action
    setProcessingGuides(prev => ({
      ...prev,
      [id]: { ...prev[id], approve: true }
    }));
    
    // Show loading toast
    const loadingToast = toast.loading('Memproses persetujuan...');
    
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/guides/${id}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.dismiss(loadingToast);
      toast.success('Berhasil menyetujui penyedia jasa');
      fetchPendingGuides();
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss(loadingToast);
      toast.error('Gagal menyetujui penyedia jasa');
    } finally {
      // Clear loading state
      setProcessingGuides(prev => ({
        ...prev,
        [id]: { ...prev[id], approve: false }
      }));
    }
  };

  const handleReject = async (id: number) => {
    // Set loading state for this specific guide's reject action
    setProcessingGuides(prev => ({
      ...prev,
      [id]: { ...prev[id], reject: true }
    }));
    
    // Show loading toast
    const loadingToast = toast.loading('Memproses penolakan...');
    
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/guides/${id}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.dismiss(loadingToast);
      toast.success('Berhasil menolak penyedia jasa');
      fetchPendingGuides();
    } catch (error) {
      console.error('Error:', error);
      toast.dismiss(loadingToast);
      toast.error('Gagal menolak penyedia jasa');
    } finally {
      // Clear loading state
      setProcessingGuides(prev => ({
        ...prev,
        [id]: { ...prev[id], reject: false }
      }));
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">
      <div className="flex justify-between mb-6 w-full pt-3">
        <h1 className="text-xl sm:text-2xl font-semibold -mr-20">Penyedia Trip</h1>
        <Link href={'penyedia-trip'} className="text-sm xl:pl-[72%]">
          Semua
        </Link>
        <Link href={'penyediatrip-req'} className="text-sm xl:pr-3 underline font-semibold">
          Permintaan
        </Link>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : pendingGuides.length === 0 ? (
          <div className="text-center py-4">Tidak ada permintaan pending</div>
        ) : (
          pendingGuides.map((guide) => (
            <div
              key={guide.id}
              className="bg-[#F6F6F6] rounded-2xl p-4 flex items-center"
            >
              <div className="space-y-3 w-full absolute sm:w-auto mb-2 sm:mb-0 pl-2 flex flex-col">
                <h3 className="text-lg leading-relaxed ml-4 sm:ml-8 text-left">
                  <span className="font-bold">{`${guide.user.nama_depan} ${guide.user.nama_belakang}`}</span>
                  {` Ingin Menjadi Penyedia Jasa`}
                </h3>
                <p className="text-sm text-gray-600 leading-3 ml-4 sm:ml-8">
                  {new Date(guide.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:flex gap-4 w-full ml-[70%] mt-4 -mb-2 xl:mt-0 xl:-mb-0 xl:gap-20 mr-7 md:ml-96 sm:w-auto xl:ml-[84%] sm:ml-[70%]">
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button 
                    onClick={() => handleReject(guide.id)}
                    disabled={processingGuides[guide.id]?.reject || processingGuides[guide.id]?.approve}
                    className={`p-1 ${processingGuides[guide.id]?.reject 
                      ? 'text-gray-400' 
                      : 'text-[#FF0000] hover:text-red-700'} transition-colors`}
                  >
                    {processingGuides[guide.id]?.reject ? 'Menolak...' : 'Tolak'}
                  </button>
                  <button 
                    onClick={() => handleApprove(guide.id)}
                    disabled={processingGuides[guide.id]?.approve || processingGuides[guide.id]?.reject}
                    className={`p-1 ${processingGuides[guide.id]?.approve 
                      ? 'text-gray-400' 
                      : 'text-[#4A90E2] hover:text-blue-700'} transition-colors`}
                  >
                    {processingGuides[guide.id]?.approve ? 'Menerima...' : 'Terima'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
  
  