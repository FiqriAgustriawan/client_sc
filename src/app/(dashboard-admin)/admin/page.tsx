'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Adjust from '@/assets/svgs/Adjust.svg';
import BarChart from '@/app/(dashboard-admin)/admin/chart';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/axios';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface Notification {
  id: number;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
  data?: any;
}

function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    totalGuides: 0,
    totalTrips: 0,
    totalUsers: 0,
    averageRating: 0
  });

  // Add markAsRead function
  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/api/admin/notifications/${notificationId}/read`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [notificationsRes, statsRes] = await Promise.all([
          api.get('/api/admin/notifications', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/api/admin/dashboard-stats', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setNotifications(notificationsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard-user');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }
  // Update the notifications panel section
  return (
    <>
      <div className="min-h-screen p-4 md:p-10 flex flex-col md:flex-row mt-16 md:mr-5 max-w-[1200px] mx-auto">
        <div className="hidden md:block w-[10%]"></div>
        <div className="-mt-[3px] w-[1640px] bg-white rounded-[24px] overflow-hidden relative mr-14 shadow-lg p-6 max-w-full ml-14">
          <div className='mx-4 mt-2'>
            {/* Stats section */}
            <h1 className='text-xl font-medium'>Dashboard</h1>
            <div className='mt-8 grid grid-cols-4 gap-x-7'>
              <div className='bg-[#eff6fe] transition-all duration-100 hover:bg-[#dbe7f6] pt-4 pl-4 w-52 h-32 rounded-[20px]'>
                <h1 className='text-[23px] leading-6 font-semibold'>Penyedia <br />Trip</h1>
                <h1 className='text-[16px] font-medium mt-2'>{stats.totalGuides || 0} Penyedia Trip</h1>
              </div>
              <div className='bg-[#eff6fe] transition-all duration-100 hover:bg-[#dbe7f6] pt-4 pl-4 w-52 h-32 rounded-[20px]'>
                <h1 className='text-[23px] leading-6 font-semibold'>Total <br />Trip</h1>
                <h1 className='text-[16px] font-medium mt-2'>{stats.totalTrips || 0} Total Trip</h1>
              </div>
              <div className='bg-[#eff6fe] transition-all duration-100 hover:bg-[#dbe7f6] pt-4 pl-4 w-52 h-32 rounded-[20px]'>
                <h1 className='text-[23px] leading-6 font-semibold'>Jumlah <br />Pengguna</h1>
                <h1 className='text-[16px] font-medium mt-2 leading-5'>{stats.totalUsers || 0} Pengguna <br />Terdaftar</h1>
              </div>
              <div className='bg-[#eff6fe] transition-all duration-100 hover:bg-[#dbe7f6] pt-4 pl-4 w-52 h-32 rounded-[20px]'>
                <h1 className='text-[23px] leading-6 font-semibold'>Ulasan &<br />Penilaian</h1>
                <h1 className='text-[16px] font-medium mt-2'>{stats.averageRating?.toFixed(1) || '0.0'}/5.0</h1>
              </div>
            </div>

            <div className='flex justify-between'>
              <div>
                <div className='flex justify-between mt-12 gap-x-36'>
                  <h1 className='text-[28px] font-semibold'>Ringkasan Statistik</h1>
                  <div className='flex gap-x-4'>
                    <h1 className='text-[25px] font-semibold text-[#1f4068]'>1 Tahun</h1>
                    <Image src={Adjust} width={20} height={20} alt='adjust' />
                  </div>
                </div>
                <BarChart />
              </div>
              {/* Updated Notifications Panel */}
              <div className='items-end grid grid-cols-1 gap-y-2 mt-12'>
                <div className='bg-[#eff6fe] items-center flex justify-between px-6 w-[290px] h-[50px] rounded-[20px]'>
                  <h1 className='text-[20px] font-semibold text-[#1f4068]'>Notifikasi</h1>
                  {notifications.some(n => !n.is_read) && (
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  )}
                </div>

                <div className="space-y-2 mt-3">
                  {notifications.length === 0 ? (
                    <div className="bg-[#f6f6f6] px-5 py-4 rounded-[18px] text-center text-gray-500">
                      Tidak ada notifikasi
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`bg-[#f6f6f6] px-5 rounded-[18px] cursor-pointer hover:bg-gray-100 transition-colors ${
                          !notification.is_read ? 'border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <h1 className="pt-2 text-[15px]">{notification.message}</h1>
                        <div className='flex justify-between text-[10px] text-[#848484] mt-2 mb-2'>
                          <h1>
                            {notification.created_at ? formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: id
                            }) : 'Waktu tidak tersedia'}
                          </h1>
                          <h1>
                            {notification.created_at ? new Date(notification.created_at).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : '--:--'}
                          </h1>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
