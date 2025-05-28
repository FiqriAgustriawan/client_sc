"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axios";
import { ArrowRight, Search, Users, Star, Calendar, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function ApprovedProviders() {
  const [guides, setGuides] = useState([]);
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
      if (error.response?.status === 401) {
        console.log('Unauthorized: Please login again');
      }
      setIsLoading(false);
    }
  };

  const handleUnsuspendGuide = async (guideId) => {
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
        guide.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : guides;

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

  // Komponen QuickInfo untuk menampilkan statistik
  const QuickInfoCard = ({ icon, label, value }) => (
    <div className="bg-blue-50 rounded-lg px-4 py-3 flex items-center gap-2 min-w-[100px]">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );

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
              className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium transition-all hover:bg-blue-700"
            >
              Semua
            </Link>
            <Link 
              href={'penyediatrip-req'} 
              className="px-4 py-2 rounded-full text-blue-600 hover:bg-blue-50 transition-all"
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
              placeholder="Cari penyedia trip berdasarkan nama atau email..."
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
                  {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada penyedia jasa yang terdaftar'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery 
                    ? 'Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda' 
                    : 'Penyedia jasa akan muncul di sini setelah mereka mendaftar dan disetujui'}
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
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{guide.nama}</h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar size={14} className="mr-1" />
                            <span>Bergabung: {format(new Date(guide.created_at), 'dd MMMM yyyy', { locale: id })}</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Statistik Trip */}
                         
                          
                          {/* Status - Ditampilkan terpisah dari statistik */}
                          <div className="flex flex-col items-end ml-auto">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    </div>

                    <div className="bg-gray-50 px-6 py-3 flex justify-end border-t">
                      <Link
                        href={`/admin/penyedia-trip/${guide.id}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Lihat Detail
                        <ArrowRight size={16} />
                      </Link>
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
