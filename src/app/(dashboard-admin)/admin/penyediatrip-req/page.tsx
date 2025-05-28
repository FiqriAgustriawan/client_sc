'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";
import { motion } from 'framer-motion';
import { Search, Calendar, AlertTriangle, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface PendingGuide {
  id: number;
  user: {
    nama_depan: string;
    nama_belakang: string;
  };
  created_at: string;
}

export default function PendingGuideRequests() {
  const [pendingGuides, setPendingGuides] = useState<PendingGuide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingGuides, setProcessingGuides] = useState<{[key: number]: {approve: boolean, reject: boolean}}>({});
  const [searchQuery, setSearchQuery] = useState('');

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
    setProcessingGuides(prev => ({
      ...prev,
      [id]: { ...prev[id], approve: true }
    }));
    
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
      setProcessingGuides(prev => ({
        ...prev,
        [id]: { ...prev[id], approve: false }
      }));
    }
  };

  const handleReject = async (id: number) => {
    setProcessingGuides(prev => ({
      ...prev,
      [id]: { ...prev[id], reject: true }
    }));
    
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
      setProcessingGuides(prev => ({
        ...prev,
        [id]: { ...prev[id], reject: false }
      }));
    }
  };

  // Animasi untuk elemen-elemen UI
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const filteredGuides = searchQuery 
    ? pendingGuides.filter(guide => 
        `${guide.user.nama_depan} ${guide.user.nama_belakang}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pendingGuides;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white p-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-blue-900 mb-4 sm:mb-0">Penyedia Trip</h1>
          <div className="flex gap-4 bg-white p-2 rounded-full shadow-sm">
            <Link 
              href={'penyedia-trip'} 
              className="px-4 py-2 rounded-full text-blue-600 hover:bg-blue-50 transition-all"
            >
              Semua
            </Link>
            <Link 
              href={'penyediatrip-req'} 
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium transition-all hover:bg-blue-700"
            >
              Permintaan
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari permintaan berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-12 border-b focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredGuides.length === 0 ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <AlertTriangle className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchQuery ? 'Tidak ada hasil pencarian' : 'Tidak ada permintaan pending'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery 
                    ? 'Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda' 
                    : 'Permintaan penyedia jasa akan muncul di sini setelah mereka mendaftar'}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6"
              >
                {filteredGuides.map((guide, index) => (
                  <motion.div
                    key={guide.id}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {`${guide.user.nama_depan} ${guide.user.nama_belakang}`}
                          </h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar size={14} className="mr-1" />
                            <span>Permintaan: {format(new Date(guide.created_at), 'dd MMMM yyyy', { locale: id })}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleReject(guide.id)}
                            disabled={processingGuides[guide.id]?.reject || processingGuides[guide.id]?.approve}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                              processingGuides[guide.id]?.reject
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            } transition-colors`}
                          >
                            <X size={16} />
                            {processingGuides[guide.id]?.reject ? 'Menolak...' : 'Tolak'}
                          </button>
                          
                          <button
                            onClick={() => handleApprove(guide.id)}
                            disabled={processingGuides[guide.id]?.approve || processingGuides[guide.id]?.reject}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                              processingGuides[guide.id]?.approve
                                ? 'bg-gray-100 text-gray-400'
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            } transition-colors`}
                          >
                            <Check size={16} />
                            {processingGuides[guide.id]?.approve ? 'Menerima...' : 'Terima'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                        <p className="text-blue-700 text-sm">
                          <span className="font-medium">{`${guide.user.nama_depan} ${guide.user.nama_belakang}`}</span>
                          {` ingin menjadi penyedia jasa trip gunung. Silakan periksa dan verifikasi data sebelum menyetujui.`}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
  
  