'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/app/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { FiBell, FiUsers, FiMap, FiCalendar, FiArrowLeft, FiCheck, FiTrash2, FiFilter } from 'react-icons/fi';
import Link from 'next/link';

function NotificationsPage() {
  const { user, loading } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
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

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard-user');
      } else {
        // Refresh notifications when page loads
        fetchNotifications();
      }
    }
  }, [user, loading, router, fetchNotifications]);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'new_guide':
        return <FiUsers className="text-blue-600" />;
      case 'new_trip':
        return <FiMap className="text-green-600" />;
      case 'booking':
        return <FiCalendar className="text-purple-600" />;
      default:
        return <FiBell className="text-blue-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return 'Hari Ini';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Kemarin';
    } else {
      return date.toLocaleDateString('id-ID', { month: 'long', day: 'numeric' });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    // Apply filter
    if (filter === 'unread' && notification.is_read) return false;
    if (filter === 'read' && !notification.is_read) return false;
    
    // Apply search
    if (searchTerm && !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = notification.created_at ? formatDate(notification.created_at) : 'Tanggal Tidak Tersedia';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat notifikasi...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/admin">
            <button className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <FiArrowLeft className="text-gray-600" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                >
                  <option value="all">Semua</option>
                  <option value="unread">Belum Dibaca</option>
                  <option value="read">Sudah Dibaca</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiFilter />
                </div>
              </div>
              
              <div className="ml-4">
                <input
                  type="text"
                  placeholder="Cari notifikasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-100 border border-gray-200 rounded-lg py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <FiCheck className="mr-2" />
                  Tandai Semua Dibaca
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          {Object.keys(groupedNotifications).length > 0 ? (
            Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
              <div key={date} className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4">{date}</h2>
                <div className="space-y-4">
                  {dateNotifications.map((notification) => (
                    <motion.div 
                      key={notification.id}
                      variants={itemVariants}
                      className={`p-4 rounded-lg transition-all ${
                        !notification.is_read 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'bg-gray-50 hover:bg-gray-100 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{notification.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: id
                              }) : 'Waktu tidak tersedia'}
                            </span>
                            <div className="flex items-center space-x-2">
                              {!notification.is_read && (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                >
                                  <FiCheck className="mr-1" />
                                  Tandai Dibaca
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                <FiBell className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Tidak Ada Notifikasi</h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? 'Tidak ada notifikasi yang sesuai dengan filter' 
                  : 'Anda belum memiliki notifikasi'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default NotificationsPage;