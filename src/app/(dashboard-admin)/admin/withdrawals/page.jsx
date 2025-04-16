'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import api from '@/utils/axios';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [processingStatus, setProcessingStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Update the fetchWithdrawals function in your React component
  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      console.log('Using token:', token); // Debug log
      
      const response = await api.get('/api/admin/withdrawals', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
  
      if (response.data.success) {
        console.log('Withdrawal data:', response.data.data); // Debug log to see the full data structure
        setWithdrawals(response.data.data);
      } else {
        console.error('Error response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedWithdrawal) return;
    
    setProcessingStatus({ loading: true, error: '', success: '' });
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/api/admin/withdrawals/${selectedWithdrawal.id}/process`, {
        reference_number: referenceNumber
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setProcessingStatus({ loading: false, error: '', success: 'Penarikan berhasil diproses' });
        await fetchWithdrawals();
        setTimeout(() => {
          setShowProcessModal(false);
          setSelectedWithdrawal(null);
          setReferenceNumber('');
          setProcessingStatus({ loading: false, error: '', success: '' });
        }, 2000);
      } else {
        setProcessingStatus({ loading: false, error: response.data.message, success: '' });
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      setProcessingStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Terjadi kesalahan saat memproses penarikan', 
        success: '' 
      });
    }
  };

  const handleReject = async () => {
    if (!selectedWithdrawal) return;
    
    setProcessingStatus({ loading: true, error: '', success: '' });
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/api/admin/withdrawals/${selectedWithdrawal.id}/reject`, {
        reason: rejectReason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setProcessingStatus({ loading: false, error: '', success: 'Penarikan berhasil ditolak' });
        await fetchWithdrawals();
        setTimeout(() => {
          setShowRejectModal(false);
          setSelectedWithdrawal(null);
          setRejectReason('');
          setProcessingStatus({ loading: false, error: '', success: '' });
        }, 2000);
      } else {
        setProcessingStatus({ loading: false, error: response.data.message, success: '' });
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      setProcessingStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Terjadi kesalahan saat menolak penarikan', 
        success: '' 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `Rp ${Number(amount).toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col md:flex-row mt-16 md:mr-5 max-w-[1200px] mx-auto">
      <div className="hidden md:block w-[10%]"></div>
      <div className="w-full md:w-[80%] bg-white rounded-[24px] overflow-hidden relative shadow-lg">
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center mb-2">
            <Link href="/admin" className="mr-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
              <FaChevronLeft className="text-white" />
            </Link>
            <h1 className="text-2xl font-bold">Manajemen Penarikan Dana</h1>
          </div>
          <p className="opacity-80 ml-12">Kelola permintaan penarikan dana dari penyedia jasa</p>
        </div>

        <div className="p-6">
          {withdrawals.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Penyedia Jasa</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bank</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {withdrawal.guide?.user?.name?.charAt(0) || 
                             withdrawal.guide?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {withdrawal.guide?.user?.name || 
                               withdrawal.guide?.name || 
                               (withdrawal.guide_id ? `Guide #${withdrawal.guide_id}` : 'Unknown')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {withdrawal.guide?.user?.email || 
                               withdrawal.guide?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(withdrawal.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(withdrawal.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{withdrawal.bank_name}</div>
                        <div className="text-sm text-gray-500">{withdrawal.account_number}</div>
                        <div className="text-xs text-gray-500">{withdrawal.account_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          withdrawal.status === 'processed' 
                            ? 'bg-green-100 text-green-800' 
                            : withdrawal.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {withdrawal.status === 'processed' 
                            ? 'Diproses' 
                            : withdrawal.status === 'rejected'
                            ? 'Ditolak'
                            : 'Menunggu'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {withdrawal.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setShowProcessModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 bg-green-100 p-2 rounded-full hover:bg-green-200 transition-colors"
                              title="Proses Penarikan"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setShowRejectModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full hover:bg-red-200 transition-colors"
                              title="Tolak Penarikan"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        )}
                        {withdrawal.status !== 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedWithdrawal(withdrawal);
                              setShowProcessModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded-full hover:bg-blue-200 transition-colors"
                            title="Lihat Detail"
                          >
                            <FaInfoCircle />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada permintaan penarikan</h3>
              <p className="text-gray-500">Belum ada permintaan penarikan dana dari penyedia jasa saat ini.</p>
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block w-[10%]"></div>

      {/* Process Modal */}
      {showProcessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              {selectedWithdrawal?.status === 'pending' ? (
                <>
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-2">
                    <FaCheck className="text-sm" />
                  </span>
                  Proses Penarikan
                </>
              ) : (
                <>
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-2">
                    <FaInfoCircle className="text-sm" />
                  </span>
                  Detail Penarikan
                </>
              )}
            </h2>
            
            <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-gray-500 text-sm">Penyedia Jasa</div>
                <div className="font-medium text-sm">{selectedWithdrawal?.guide?.user?.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-gray-500 text-sm">Jumlah</div>
                <div className="font-medium text-sm">{formatCurrency(selectedWithdrawal?.amount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-gray-500 text-sm">Bank</div>
                <div className="font-medium text-sm">{selectedWithdrawal?.bank_name}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-gray-500 text-sm">Nomor Rekening</div>
                <div className="font-medium text-sm">{selectedWithdrawal?.account_number}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-gray-500 text-sm">Nama Pemilik</div>
                <div className="font-medium text-sm">{selectedWithdrawal?.account_name}</div>
              </div>
              {selectedWithdrawal?.notes && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-gray-500 text-sm">Catatan</div>
                  <div className="font-medium text-sm">{selectedWithdrawal?.notes}</div>
                </div>
              )}
              {selectedWithdrawal?.status === 'processed' && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-gray-500 text-sm">Nomor Referensi</div>
                  <div className="font-medium text-sm">{selectedWithdrawal?.reference_number || '-'}</div>
                </div>
              )}
              {selectedWithdrawal?.status === 'rejected' && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-gray-500 text-sm">Alasan Penolakan</div>
                  <div className="font-medium text-sm">{selectedWithdrawal?.reject_reason || '-'}</div>
                </div>
              )}
            </div>

            {selectedWithdrawal?.status === 'pending' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Referensi Pembayaran
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nomor referensi"
                  />
                  <p className="mt-1 text-xs text-gray-500">Masukkan nomor referensi transaksi untuk konfirmasi pembayaran</p>
                </div>

                {processingStatus.error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-start">
                    <FaTimes className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{processingStatus.error}</span>
                  </div>
                )}

                {processingStatus.success && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200 flex items-start">
                    <FaCheck className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{processingStatus.success}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowProcessModal(false);
                      setSelectedWithdrawal(null);
                      setReferenceNumber('');
                      setProcessingStatus({ loading: false, error: '', success: '' });
                    }}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    disabled={processingStatus.loading}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleProcess}
                    className="px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
                    disabled={processingStatus.loading}
                  >
                    {processingStatus.loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <FaCheck />
                        <span>Proses Penarikan</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {selectedWithdrawal?.status !== 'pending' && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowProcessModal(false);
                    setSelectedWithdrawal(null);
                  }}
                  className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 mr-2">
                <FaTimes className="text-sm" />
              </span>
              Tolak Penarikan
            </h2>
            
            <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-gray-500 text-sm">Penyedia Jasa</div>
                <div className="font-medium text-sm">{selectedWithdrawal?.guide?.user?.name}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-gray-500 text-sm">Jumlah</div>
                <div className="font-medium text-sm">{formatCurrency(selectedWithdrawal?.amount)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-gray-500 text-sm">Bank</div>
                <div className="font-medium text-sm">{selectedWithdrawal?.bank_name}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alasan Penolakan
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan alasan penolakan"
                rows={3}
              />
              <p className="mt-1 text-xs text-gray-500">Berikan alasan yang jelas mengapa permintaan penarikan ini ditolak</p>
            </div>

            {processingStatus.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-start">
                <FaTimes className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{processingStatus.error}</span>
              </div>
            )}

            {processingStatus.success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200 flex items-start">
                <FaCheck className="mr-2 mt-0.5 flex-shrink-0" />
                <span>{processingStatus.success}</span>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedWithdrawal(null);
                  setRejectReason('');
                  setProcessingStatus({ loading: false, error: '', success: '' });
                }}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                disabled={processingStatus.loading}
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 font-medium"
                disabled={processingStatus.loading || !rejectReason.trim()}
              >
                {processingStatus.loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <FaTimes />
                    <span>Tolak Penarikan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
