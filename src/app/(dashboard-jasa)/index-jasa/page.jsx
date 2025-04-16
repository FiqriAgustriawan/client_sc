'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiCheckCircle, FiStar, FiActivity, FiAlertCircle, FiBell } from 'react-icons/fi';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import api from '@/utils/axios';
import { earningsService } from '@/services/earningsService';
import Link from 'next/link';

function GuideDashboard() {
  const [stats, setStats] = useState({
    total_trips: 0,
    total_customers: 0,
    completed_trips: 0,
    rating: 0,
    total_reviews: 0,
    total_earnings: 0,
    pending_earnings: 0,
    available_balance: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/guide/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setStats(response.data.stats);
        setNotifications(response.data.notifications || []);
        
        // Fetch earnings data
        try {
          const earningsData = await earningsService.getEarningsSummary();
          if (earningsData.success) {
            setStats(prevStats => ({
              ...prevStats,
              total_earnings: earningsData.data.total_earnings,
              pending_earnings: earningsData.data.pending_earnings,
              available_balance: earningsData.data.available_balance
            }));
          }
        } catch (err) {
          console.error('Error fetching earnings data:', err);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Baru Saja';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { month: 'long', day: 'numeric' });
    }
  };

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
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const cardVariants = {
    hover: { 
      scale: 1.03,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { type: 'spring', stiffness: 300 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar spacing - hidden on mobile, visible on md screens and up */}
      <div className="hidden md:block w-[240px] lg:w-[26%]"></div>
      
      {/* Main content area with padding */}
      <div className="flex-1 p-4 md:p-8 lg:p-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Selamat Datang, Guide!</h1>
            <p className="text-gray-600 mt-2">Kelola perjalanan dan pantau pendapatan Anda</p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm mb-8 p-1">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'overview' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('earnings')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'earnings' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Pendapatan
              </button>
              <button 
                onClick={() => setActiveTab('trips')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'trips' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Trip
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Stats */}
            <div className="lg:col-span-2">
              {/* Earnings Summary Card */}
              <motion.div 
                variants={itemVariants}
                whileHover="hover"
                variants={cardVariants}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <RiMoneyDollarCircleLine className="mr-2 text-2xl" />
                    Ringkasan Pendapatan
                  </h2>
                  <Link 
                    href="/index-jasa/earnings"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Kelola Pendapatan
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                  >
                    <p className="text-white/80 text-sm mb-1">Total Pendapatan</p>
                    <p className="text-2xl font-bold">Rp {stats.total_earnings?.toLocaleString() || '0'}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                  >
                    <p className="text-white/80 text-sm mb-1">Pendapatan Tertunda</p>
                    <p className="text-2xl font-bold">Rp {stats.pending_earnings?.toLocaleString() || '0'}</p>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                  >
                    <p className="text-white/80 text-sm mb-1">Saldo Tersedia</p>
                    <p className="text-2xl font-bold">Rp {stats.available_balance?.toLocaleString() || '0'}</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                <motion.div 
                  variants={itemVariants}
                  whileHover="hover"
                  variants={cardVariants}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Trip</h3>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FiActivity className="text-blue-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.total_trips}</p>
                  <p className="text-sm text-gray-500 mt-1">Perjalanan</p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  whileHover="hover"
                  variants={cardVariants}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Trip Selesai</h3>
                    <div className="bg-green-100 p-2 rounded-lg">
                      <FiCheckCircle className="text-green-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.completed_trips}</p>
                  <p className="text-sm text-gray-500 mt-1">Perjalanan</p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  whileHover="hover"
                  variants={cardVariants}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Pendaki</h3>
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <FiUsers className="text-purple-600" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.total_customers}</p>
                  <p className="text-sm text-gray-500 mt-1">Pendaki</p>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants}
                  whileHover="hover"
                  variants={cardVariants}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Rating Anda</h3>
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <FiStar className="text-yellow-500" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.rating.toFixed(1)}/5.0</p>
                  <p className="text-sm text-gray-500 mt-1">dari {stats.total_reviews} ulasan</p>
                </motion.div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                variants={itemVariants}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="/index-jasa/trip-jasa/buat-trip">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-blue-50 hover:bg-blue-100 p-4 rounded-xl text-center cursor-pointer transition-all"
                    >
                      <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <FiActivity className="text-blue-600 text-xl" />
                      </div>
                      <p className="text-sm font-medium text-gray-800">Buat Trip Baru</p>
                    </motion.div>
                  </Link>
                  
                  <Link href="/index-jasa/trip-jasa">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-green-50 hover:bg-green-100 p-4 rounded-xl text-center cursor-pointer transition-all"
                    >
                      <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <FiCheckCircle className="text-green-600 text-xl" />
                      </div>
                      <p className="text-sm font-medium text-gray-800">Kelola Trip</p>
                    </motion.div>
                  </Link>
                  
                  <Link href="/index-jasa/earnings">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-purple-50 hover:bg-purple-100 p-4 rounded-xl text-center cursor-pointer transition-all"
                    >
                      <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                        <RiMoneyDollarCircleLine className="text-purple-600 text-xl" />
                      </div>
                      <p className="text-sm font-medium text-gray-800">Tarik Dana</p>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Notifications */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-1"
            >
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Notifikasi</h3>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FiBell className="text-blue-600" />
                  </div>
                </div>
                
                {notifications && notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notif, index) => (
                      <motion.div 
                        key={notif.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                      >
                        <p className="text-gray-800 text-sm">{notif.message}</p>
                        <div className="flex justify-between mt-2">
                          <p className="text-xs text-gray-500">{formatDate(notif.created_at)}</p>
                          <p className="text-xs text-gray-500">{notif.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <FiAlertCircle className="text-gray-400 text-xl" />
                    </div>
                    <p className="text-gray-500 text-sm">Tidak ada notifikasi baru</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default GuideDashboard;