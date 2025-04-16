'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/utils/axios';
import { ArrowLeft, Star, Users, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// First, update the Guide interface to properly type the suspension fields
interface Guide {
  id: number;
  nama: string;
  email: string;
  phone_number: string;
  ktp_image: string;
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
  const [suspensionDuration, setSuspensionDuration] = useState('1_week');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [showSuspendModal, setShowSuspendModal] = useState(false);

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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!guide) {
    return <div className="flex justify-center items-center h-screen">Guide not found</div>;
  }
  return (
    <>
      <div className="bg-white p-4 md:p-6 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>

          <div className="flex gap-2">
            {guide.suspended_until ? (
              <button
                onClick={handleUnsuspendGuide}
                disabled={isUnsuspending}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 border border-green-200"
              >
                <Clock size={18} className="text-green-600" />
                {isUnsuspending ? 'Memproses...' : 'Cabut Suspend'}
              </button>
            ) : (
              <button
                onClick={handleSuspendGuide}
                disabled={isSuspending}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors disabled:opacity-50 border border-yellow-200"
              >
                <Clock size={18} className="text-yellow-600" />
                {isSuspending ? 'Memproses...' : 'Suspend Akun'}
              </button>
            )}

            <button
              onClick={handleBanGuide}
              disabled={isBanning}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 border border-gray-200"
            >
              <Trash2 size={18} className="text-gray-600" />
              {isBanning ? 'Menghapus...' : 'Hapus Akun'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Header Profile */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              {guide?.ktp_image && (
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    src={`http://localhost:8000/storage/${guide.ktp_image}`}
                    alt="KTP"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                      console.error('Image failed to load:', guide.ktp_image);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{guide?.nama}</h1>
              <div className="space-y-2 text-gray-600">
                <p>Email: {guide.email}</p>
                <p>Telepon: {guide.phone_number}</p>
                <p>Bergabung: {new Date(guide.created_at).toLocaleDateString('id-ID')}</p>
                <div className="flex items-center gap-2 mt-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    guide.suspended_until && new Date(guide.suspended_until) > new Date()
                      ? 'bg-yellow-100 text-yellow-800'
                      : guide.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {guide.suspended_until && new Date(guide.suspended_until) > new Date()
                      ? 'Disuspend'
                      : guide.status === 'approved' 
                      ? 'Aktif' 
                      : 'Pending'}
                  </span>
                </div>

                {guide.suspended_until && new Date(guide.suspended_until) > new Date() && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800">
                      Akun disuspend hingga: {format(new Date(guide.suspended_until), 'dd MMMM yyyy', { locale: id })}
                    </p>
                    {guide.suspension_reason && (
                      <p className="text-sm text-yellow-700 mt-1">
                        Alasan: {guide.suspension_reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Trip</p>
                  <p className="text-xl font-bold">{guide.trips_created || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Pendaki</p>
                  <p className="text-xl font-bold">{guide.total_customers || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Star className="text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="text-xl font-bold">{guide.rating?.toFixed(1) || '0.0'}/5.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip History */}
          {guide.trips && guide.trips.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Riwayat Trip</h2>
              <div className="space-y-3">
                {guide.trips.map((trip) => (
                  <div key={trip.id} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{trip.title}</h3>
                        <p className="text-sm text-gray-600">{trip.mountain}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(trip.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${trip.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
                        {trip.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {trip.participants} Pendaki
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Suspension Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Suspend Akun Penyedia Jasa</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durasi Suspend
                </label>
                <select
                  value={suspensionDuration}
                  onChange={(e) => setSuspensionDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="1_day">1 Hari</option>
                  <option value="1_week">1 Minggu</option>
                  <option value="1_month">1 Bulan</option>
                  <option value="3_months">3 Bulan</option>
                  <option value="indefinite">Tidak terbatas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alasan Suspend
                </label>
                <textarea
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Masukkan alasan suspend..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmSuspend}
                disabled={!suspensionReason || isSuspending}
                className="px-4 py-2 text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-md disabled:opacity-50"
              >
                {isSuspending ? 'Memproses...' : 'Suspend Akun'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}