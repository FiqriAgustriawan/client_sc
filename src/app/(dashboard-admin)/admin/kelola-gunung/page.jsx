"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiSearch, FiAlertCircle, FiPlus } from 'react-icons/fi';
import Link from "next/link";
import { getMountains, deleteMountain } from "@/services/mountain.service";
import { Toaster, toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function KelolaGunung() {
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Animation variants
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

  useEffect(() => {
    fetchMountains();
  }, []);

  const fetchMountains = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');

      const response = await getMountains(token);
      setMountains(response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, mountainName) => {
    toast((t) => (
      <div className="flex items-start gap-3 w-[320px]">
        <div className="flex-shrink-0 mt-1">
          <FiTrash2 className="text-red-500 text-xl" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">Hapus Gunung</h4>
          <p className="text-sm text-gray-600 mt-1">
            Apakah Anda yakin ingin menghapus gunung {mountainName}? Aksi ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const token = localStorage.getItem('token');
                  if (!token) throw new Error('Token tidak ditemukan');

                  await deleteMountain(id, token);
                  toast.success('Gunung berhasil dihapus!', {
                    position: 'top-right',
                    style: {
                      background: '#10B981',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                    },
                    duration: 3000,
                  });
                  fetchMountains();
                } catch (error) {
                  toast.error(error.message || 'Gagal menghapus gunung', {
                    position: 'top-right',
                    style: {
                      background: '#EF4444',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                    },
                    duration: 4000,
                  });
                }
              }}
              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
            >
              Hapus
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-right',
      style: {
        background: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'mudah': 'bg-green-100 text-green-800',
      'menengah': 'bg-yellow-100 text-yellow-800',
      'sulit': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

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
          <h1 className="text-3xl font-bold text-blue-900 mb-4 sm:mb-0">Kelola Gunung</h1>
          <Link 
            href="/admin/kelola-gunung/tambah-gunung" 
            className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium transition-all hover:bg-blue-700 flex items-center gap-2"
          >
            <FiPlus />
            Tambah Gunung
          </Link>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari gunung berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 border-b focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <FiAlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Terjadi Kesalahan</h3>
                <p className="text-gray-500 max-w-md mx-auto">{error}</p>
              </motion.div>
            ) : mountains.length === 0 ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <FiAlertCircle className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Tidak ada hasil pencarian' : 'Belum ada gunung yang terdaftar'}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm 
                    ? 'Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda' 
                    : 'Gunung akan muncul di sini setelah Anda menambahkannya'}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6"
              >
                {mountains
                  .filter(mountain => mountain.nama_gunung.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((mountain, index) => (
                    <motion.div
                      key={mountain.id}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                          <div className="mb-4 sm:mb-0 flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{mountain.nama_gunung}</h3>
                            <div className="flex items-center text-gray-500 text-sm">
                              <span>{mountain.lokasi}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 min-w-[200px]">
                            <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium flex items-center gap-1">
                              <span>{mountain.ketinggian}</span>
                              <span className="text-xs">MDPL</span>
                            </div>
                            
                            <span className={`px-3 py-1 rounded-full text-xs font-medium min-w-[80px] text-center ${getStatusColor(mountain.status_gunung)}`}>
                              {mountain.status_gunung}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 px-6 py-3 flex justify-end border-t gap-3">
                        <Link
                          href={`/admin/kelola-gunung/edit/${mountain.id}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <FiEdit2 size={16} />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(mountain.id, mountain.nama_gunung)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          <FiTrash2 size={16} />
                          Hapus
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      <Toaster />
    </motion.div>
  );
}
