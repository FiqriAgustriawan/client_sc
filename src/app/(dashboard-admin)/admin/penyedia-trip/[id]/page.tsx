'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/utils/axios';
import { ArrowLeft, Star, Users, MapPin, Clock, CheckCircle, Camera, FileText, X, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

// First, update the Guide interface to properly type the suspension fields
interface Guide {
  id: number;
  nama: string;
  email: string;
  phone_number: string;
  ktp_image: string;
  face_image: string; // Tambahkan field untuk foto wajah
  status: string;
  created_at: string;
  trips_created: number;
  total_customers: number;
  rating: number;
  suspended_until: string | null;
  suspension_reason: string | null;
}

interface GuideDetail extends Guide {
  trips?: {
    id: number;
    title: string;
    mountain: string;
    date: string;
    status: string;
    participants: number;
  }[];
}

export default function GuideProfile() {
  const params = useParams();
  const router = useRouter();
  const [guide, setGuide] = useState<GuideDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBanning, setIsBanning] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [isUnsuspending, setIsUnsuspending] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [suspensionDuration, setSuspensionDuration] = useState('1_week');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState<'ktp' | 'face' | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleRejectGuide = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = async () => {
    setIsRejecting(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/guides/${params.id}/reject`, {
        reason: rejectionReason
      }, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Pendaftaran penyedia jasa berhasil ditolak', {
        duration: 4000,
        style: {
          background: '#F0FDF4',
          color: '#166534',
          border: '1px solid #BBF7D0'
        }
      });

      // Refresh guide data
      const response = await api.get(`/api/guides/${params.id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setGuide(response.data);

    } catch (error) {
      console.error('Error rejecting guide:', error);
      toast.error('Terjadi kesalahan saat menolak penyedia jasa', {
        duration: 4000,
        style: {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FECACA'
        }
      });
    } finally {
      setIsRejecting(false);
      setShowRejectModal(false);
    }
  };


  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/guides/${params.id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setGuide(response.data);
      } catch (error) {
        console.error('Error fetching guide details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGuideDetails();
    }
  }, [params.id]);

  const handleSuspendGuide = () => {
    setShowSuspendModal(true);
  };

  const handleApproveGuide = () => {
    setShowApproveModal(true);
  };

  const handleConfirmApprove = async () => {
    setIsApproving(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/guides/${params.id}/approve`, {}, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Penyedia jasa berhasil disetujui', {
        duration: 4000,
        style: {
          background: '#F0FDF4',
          color: '#166534',
          border: '1px solid #BBF7D0'
        }
      });

      // Refresh guide data
      const response = await api.get(`/api/guides/${params.id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setGuide(response.data);

    } catch (error) {
      console.error('Error approving guide:', error);
      toast.error('Terjadi kesalahan saat menyetujui penyedia jasa', {
        duration: 4000,
        style: {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FECACA'
        }
      });
    } finally {
      setIsApproving(false);
      setShowApproveModal(false);
    }
  };

  const handleConfirmSuspend = async () => {
    setIsSuspending(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/guides/${params.id}/suspend`, {
        duration: suspensionDuration,
        reason: suspensionReason
      }, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Akun penyedia jasa berhasil disuspend', {
        duration: 4000,
        style: {
          background: '#F0FDF4',
          color: '#166534',
          border: '1px solid #BBF7D0'
        }
      });

      // Refresh guide data
      const response = await api.get(`/api/guides/${params.id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setGuide(response.data);

    } catch (error) {
      console.error('Error suspending guide:', error);
      toast.error('Terjadi kesalahan saat suspend penyedia jasa', {
        duration: 4000,
        style: {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FECACA'
        }
      });
    } finally {
      setIsSuspending(false);
      setShowSuspendModal(false);
    }
  };

  const handleUnsuspendGuide = async () => {
    setIsUnsuspending(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/guides/${params.id}/unsuspend`, {}, {
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

      // Refresh guide data
      const response = await api.get(`/api/guides/${params.id}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setGuide(response.data);

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

  const handleBanGuide = async () => {
    // Create custom confirmation toast
    toast((t) => (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-red-500" />
          <p className="font-medium">Hapus Penyedia Jasa?</p>
        </div>
        <p className="text-sm text-gray-600">
          Tindakan ini akan menghapus akun penyedia jasa secara permanen dan tidak dapat dibatalkan.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setIsBanning(true);
                const token = localStorage.getItem('token');
                await api.delete(`/api/guides/${params.id}/ban`, {
                  headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                });

                toast.success('Penyedia jasa telah dihapus dari sistem', {
                  duration: 4000,
                  style: {
                    background: '#F0FDF4',
                    color: '#166534',
                    border: '1px solid #BBF7D0'
                  }
                });
                router.push('/admin/penyedia-trip');
              } catch (error) {
                console.error('Error banning guide:', error);
                toast.error('Terjadi kesalahan saat menghapus penyedia jasa', {
                  duration: 4000,
                  style: {
                    background: '#FEF2F2',
                    color: '#991B1B',
                    border: '1px solid #FECACA'
                  }
                });
              } finally {
                setIsBanning(false);
              }
            }}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: {
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">Penyedia jasa tidak ditemukan</div>
        <button
          onClick={() => router.back()}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full min-h-screen pl-20"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-full mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
            <div className="flex flex-wrap justify-between items-center">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
              >
                <ArrowLeft size={20} />
                Kembali
              </button>

              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                {guide.status === 'pending' && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApproveGuide}
                      disabled={isApproving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 shadow-md"
                    >
                      <CheckCircle size={18} />
                      {isApproving ? 'Memproses...' : 'Setujui Pendaftaran'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRejectGuide}
                      disabled={isRejecting}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-50 shadow-md"
                    >
                      <X size={18} />
                      {isRejecting ? 'Memproses...' : 'Tolak Pendaftaran'}
                    </motion.button>
                  </>
                )}

                {guide.status === 'rejected' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBanGuide}
                    disabled={isBanning}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 shadow-md"
                  >
                    <Trash2 size={18} />
                    {isBanning ? 'Menghapus...' : 'Hapus Akun'}
                  </motion.button>
                )}

                {guide.status === 'approved' && !guide.suspended_until && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSuspendGuide}
                    disabled={isSuspending}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg transition-colors disabled:opacity-50 shadow-md"
                  >
                    <Clock size={18} />
                    {isSuspending ? 'Memproses...' : 'Suspend Akun'}
                  </motion.button>
                )}

                {guide.suspended_until && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUnsuspendGuide}
                    disabled={isUnsuspending}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors disabled:opacity-50 shadow-md"
                  >
                    <Clock size={18} />
                    {isUnsuspending ? 'Memproses...' : 'Cabut Suspend'}
                  </motion.button>
                )}

                {guide.status === 'approved' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBanGuide}
                    disabled={isBanning}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 shadow-md"
                  >
                    <Trash2 size={18} />
                    {isBanning ? 'Menghapus...' : 'Hapus Akun'}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Foto KTP dan Wajah */}
              <div className="w-full lg:w-1/3 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-4 bg-blue-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-blue-600" />
                      <h3 className="font-medium text-gray-800">Foto KTP</h3>
                    </div>
                    <button
                      onClick={() => setShowImageModal('ktp')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lihat Detail
                    </button>
                  </div>
                  <div className="p-4">
                    {guide?.ktp_image ? (
                      <div
                        className="aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setShowImageModal('ktp')}
                      >
                        <Image
                          src={`http://localhost:8000/storage/${guide.ktp_image}`}
                          alt="KTP"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-gray-500">Tidak ada foto KTP</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <div className="p-4 bg-blue-50 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera size={18} className="text-blue-600" />
                      <h3 className="font-medium text-gray-800">Foto Wajah</h3>
                    </div>
                    <button
                      onClick={() => setShowImageModal('face')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lihat Detail
                    </button>
                  </div>
                  <div className="p-4">
                    {guide?.face_image ? (
                      <div
                        className="aspect-[4/3] relative rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setShowImageModal('face')}
                      >
                        <Image
                          src={`http://localhost:8000/storage/${guide.face_image}`}
                          alt="Foto Wajah"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-gray-500">Tidak ada foto wajah</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{guide?.nama}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm ${guide.suspended_until && new Date(guide.suspended_until) > new Date()
                      ? 'bg-yellow-100 text-yellow-800'
                      : guide.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : guide.status === 'pending'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {guide.suspended_until && new Date(guide.suspended_until) > new Date()
                        ? 'Disuspend'
                        : guide.status === 'approved'
                          ? 'Aktif'
                          : guide.status === 'pending'
                            ? 'Menunggu Persetujuan'
                            : 'Ditolak'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium">{guide.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Telepon</p>
                      <p className="font-medium">{guide.phone_number}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Tanggal Bergabung</p>
                      <p className="font-medium">{format(new Date(guide.created_at), 'dd MMMM yyyy', { locale: id })}</p>
                    </div>
                  </div>

                  {guide.suspended_until && new Date(guide.suspended_until) > new Date() && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-start gap-3">
                        <Clock size={20} className="text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">
                            Akun disuspend hingga: {format(new Date(guide.suspended_until), 'dd MMMM yyyy', { locale: id })}
                          </p>
                          {guide.suspension_reason && (
                            <p className="text-yellow-700 mt-1">
                              Alasan: {guide.suspension_reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Statistics */}
                  <div className="flex flex-wrap gap-6 mb-6 bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Calendar size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Trip</p>
                        <p className="font-semibold text-lg">{guide.trips_created || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pendaki</p>
                        <p className="font-semibold text-lg">{guide.total_customers || 0}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Star size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Rating</p>
                        <p className="font-semibold text-lg">{guide.rating ? Number(guide.rating).toFixed(1) : '0.0'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trip History */}
                  {guide.trips && guide.trips.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="mt-8"
                    >
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Riwayat Trip</h2>
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Nama Trip
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Gunung
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Tanggal
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Peserta
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {guide.trips.map((trip) => (
                                <motion.tr
                                  key={trip.id}
                                  whileHover={{ backgroundColor: '#f9fafb' }}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{trip.title}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{trip.mountain}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                      {format(new Date(trip.date), 'dd MMM yyyy', { locale: id })}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                          trip.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'}`}>
                                      {trip.status === 'completed' ? 'Selesai' :
                                        trip.status === 'upcoming' ? 'Akan Datang' :
                                          trip.status === 'cancelled' ? 'Dibatalkan' :
                                            trip.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {trip.participants} orang
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center"
                    >
                      <p className="text-gray-500">Penyedia jasa belum membuat trip apapun</p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-blue-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showImageModal === 'ktp' ? (
                    <>
                      <FileText size={20} className="text-blue-600" />
                      <h3 className="font-medium text-gray-800">Foto KTP</h3>
                    </>
                  ) : (
                    <>
                      <Camera size={20} className="text-blue-600" />
                      <h3 className="font-medium text-gray-800">Foto Wajah</h3>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowImageModal(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-auto flex-1 p-4 flex items-center justify-center">
                <div className="relative w-full h-full min-h-[300px]">
                  <Image
                    src={`http://localhost:8000/storage/${showImageModal === 'ktp' ? guide?.ktp_image : guide?.face_image}`}
                    alt={showImageModal === 'ktp' ? "KTP" : "Foto Wajah"}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {showImageModal === 'ktp'
                    ? "Foto KTP digunakan untuk verifikasi identitas penyedia jasa"
                    : "Foto wajah digunakan untuk verifikasi identitas penyedia jasa"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suspend Modal */}
      <AnimatePresence>
        {showSuspendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuspendModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl overflow-hidden max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-yellow-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-yellow-600" />
                  <h3 className="font-medium text-gray-800">Suspend Akun Penyedia Jasa</h3>
                </div>
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durasi Suspend
                  </label>
                  <select
                    value={suspensionDuration}
                    onChange={(e) => setSuspensionDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1_day">1 Hari</option>
                    <option value="3_days">3 Hari</option>
                    <option value="1_week">1 Minggu</option>
                    <option value="2_weeks">2 Minggu</option>
                    <option value="1_month">1 Bulan</option>
                    <option value="3_months">3 Bulan</option>
                    <option value="permanent">Permanen</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alasan Suspend
                  </label>
                  <textarea
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Berikan alasan mengapa akun ini disuspend..."
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowSuspendModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Batal
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmSuspend}
                    disabled={isSuspending || !suspensionReason.trim()}
                    className="px-4 py-2 text-sm bg-yellow-500 text-white hover:bg-yellow-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSuspending ? 'Memproses...' : 'Suspend Akun'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setShowApproveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-2xl overflow-hidden max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 bg-green-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  <h3 className="font-medium text-gray-800">Setujui Pendaftaran Penyedia Jasa</h3>
                </div>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-3 bg-blue-50 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700">Foto KTP</h4>
                    </div>
                    <div className="p-3">
                      {guide?.ktp_image ? (
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                          <Image
                            src={`http://localhost:8000/storage/${guide.ktp_image}`}
                            alt="KTP"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-lg">
                          <p className="text-gray-500 text-sm">Tidak ada foto KTP</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-3 bg-blue-50 border-b border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700">Foto Wajah</h4>
                    </div>
                    <div className="p-3">
                      {guide?.face_image ? (
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                          <Image
                            src={`http://localhost:8000/storage/${guide.face_image}`}
                            alt="Foto Wajah"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] flex items-center justify-center bg-gray-100 rounded-lg">
                          <p className="text-gray-500 text-sm">Tidak ada foto wajah</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-1.5 rounded-full">
                      <CheckCircle size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-800">
                        Dengan menyetujui pendaftaran, Anda mengonfirmasi bahwa:
                      </p>
                      <ul className="mt-2 text-sm text-blue-700 space-y-1">
                        <li className="flex items-start gap-1.5">
                          <span className="mt-0.5">•</span>
                          <span>Identitas penyedia jasa telah diverifikasi</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="mt-0.5">•</span>
                          <span>Foto KTP dan wajah telah diperiksa dan valid</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="mt-0.5">•</span>
                          <span>Penyedia jasa memenuhi semua persyaratan</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Batal
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmApprove}
                    disabled={isApproving}
                    className="px-4 py-2 text-sm bg-green-500 text-white hover:bg-green-600 rounded-md transition-colors disabled:opacity-50"
                  >
                    {isApproving ? 'Memproses...' : 'Setujui Pendaftaran'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Reject Modal */}
        <AnimatePresence>
          {showRejectModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <X className="h-6 w-6 text-orange-500" />
                    <h3 className="text-xl font-bold text-gray-800">Tolak Pendaftaran</h3>
                  </div>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  Pendaftaran penyedia jasa ini akan ditolak. Berikan alasan penolakan agar penyedia jasa dapat memperbaiki pendaftarannya.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alasan Penolakan
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Berikan alasan mengapa pendaftaran ini ditolak..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmReject}
                    disabled={isRejecting || !rejectionReason.trim()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <X size={18} />
                    {isRejecting ? 'Memproses...' : 'Tolak Pendaftaran'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </AnimatePresence>

    </>
  );
}

