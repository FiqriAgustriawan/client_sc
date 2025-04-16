'use client';

import React, { useEffect, useState } from 'react';
import { adminWithdrawalService } from '@/services/adminWithdrawalService';
import { FaChevronLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function WithdrawalDetailsPage({ params }) {
  const { id } = params;
  const [withdrawal, setWithdrawal] = useState(null);
  const [guideBalance, setGuideBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [modalType, setModalType] = useState(null); // 'process' or 'reject'
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: '', error: '' });

  useEffect(() => {
    fetchWithdrawalDetails();
  }, [id]);

  const fetchWithdrawalDetails = async () => {
    setIsLoading(true);
    try {
      const response = await adminWithdrawalService.getWithdrawalDetails(id);
      if (response.success) {
        setWithdrawal(response.data.withdrawal);
        setGuideBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openProcessModal = () => {
    setReferenceNumber('');
    setModalType('process');
    setSubmitStatus({ loading: false, success: '', error: '' });
  };

  const openRejectModal = () => {
    setRejectReason('');
    setModalType('reject');
    setSubmitStatus({ loading: false, success: '', error: '' });
  };

  const closeModal = () => {
    setModalType(null);
  };

  const handleProcessWithdrawal = async (e) => {
    e.preventDefault();
    if (!referenceNumber) {
      setSubmitStatus({ loading: false, success: '', error: 'Nomor referensi wajib diisi' });
      return;
    }

    setSubmitStatus({ loading: true, success: '', error: '' });
    try {
      const response = await adminWithdrawalService.processWithdrawal(id, referenceNumber);
      if (response.success) {
        setSubmitStatus({ loading: false, success: 'Penarikan berhasil diproses', error: '' });
        // Refresh data after a short delay
        setTimeout(() => {
          closeModal();
          fetchWithdrawalDetails();
        }, 1500);
      } else {
        setSubmitStatus({ loading: false, success: '', error: response.message || 'Gagal memproses penarikan' });
      }
    } catch (error) {
      setSubmitStatus({ 
        loading: false, 
        success: '', 
        error: error.response?.data?.message || 'Terjadi kesalahan saat memproses penarikan' 
      });
    }
  };

  const handleRejectWithdrawal = async (e) => {
    e.preventDefault();
    if (!rejectReason) {
      setSubmitStatus({ loading: false, success: '', error: 'Alasan penolakan wajib diisi' });
      return;
    }

    setSubmitStatus({ loading: true, success: '', error: '' });
    try {
      const response = await adminWithdrawalService.rejectWithdrawal(id, rejectReason);
      if (response.success) {
        setSubmitStatus({ loading: false, success: 'Penarikan berhasil ditolak', error: '' });
        // Refresh data after a short delay
        setTimeout(() => {
          closeModal();
          fetchWithdrawalDetails();
        }, 1500);
      } else {
        setSubmitStatus({ loading: false, success: '', error: response.message || 'Gagal menolak penarikan' });
      }
    } catch (error) {
      setSubmitStatus({ 
        loading: false, 
        success: '', 
        error: error.response?.data?.message || 'Terjadi kesalahan saat menolak penarikan' 
      });
    }
  };

  const formatCurrency = (amount) => {
    return `Rp ${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Menunggu</span>;
      case 'processed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Diproses</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Ditolak</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!withdrawal) {
    return (
      <div className="min-h-screen p-4 md:p-10 max-w-[1200px] mx-auto">
        <div className="bg-white rounded-[24px] shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Link href="/admin/withdrawals" className="mr-4">
              <FaChevronLeft className="text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-semibold">Detail Penarikan Dana</h1>
          </div>
          <div className="text-center py-10">
            <p className="text-gray-600">Penarikan tidak ditemukan</p>
            <Link href="/admin/withdrawals" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Kembali ke Daftar Penarikan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-10 max-w-[1200px] mx-auto">
      <div className="bg-white rounded-[24px] shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/withdrawals" className="mr-4">
            <FaChevronLeft className="text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="text-2xl font-semibold">Detail Penarikan Dana</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-medium mb-4">Informasi Penarikan</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">ID Penarikan</p>
                <p className="font-medium">{withdrawal.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Permintaan</p>
                <p className="font-medium">{formatDate(withdrawal.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jumlah</p>
                <p className="font-medium text-lg text-green-600">{formatCurrency(withdrawal.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(withdrawal.status)}</div>
              </div>
              {withdrawal.status === 'processed' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Diproses Pada</p>
                    <p className="font-medium">{formatDate(withdrawal.processed_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nomor Referensi</p>
                    <p className="font-medium">{withdrawal.reference_number}</p>
                  </div>
                </>
              )}
              {withdrawal.status === 'rejected' && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Ditolak Pada</p>
                    <p className="font-medium">{formatDate(withdrawal.rejected_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Alasan Penolakan</p>
                    <p className="font-medium text-red-600">{withdrawal.reject_reason}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-medium mb-4">Informasi Rekening</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Bank</p>
                <p className="font-medium">{withdrawal.bank_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nomor Rekening</p>
                <p className="font-medium">{withdrawal.account_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nama Pemilik</p>
                <p className="font-medium">{withdrawal.account_name}</p>
              </div>
              {withdrawal.notes && (
                <div>
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p className="font-medium">{withdrawal.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-lg font-medium mb-4">Informasi Guide</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">ID Guide</p>
                <p className="font-medium">{withdrawal.guide_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="font-medium">{withdrawal.guide?.user?.name || 'Tidak tersedia'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{withdrawal.guide?.user?.email || 'Tidak tersedia'}</p>
              </div>
              {guideBalance && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Total Pendapatan</p>
                    <p className="font-medium">{formatCurrency(guideBalance.total_earnings)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Saldo Tersedia</p>
                    <p className="font-medium">{formatCurrency(guideBalance.available_balance)}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {withdrawal.status === 'pending' && (
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={openProcessModal}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FaCheckCircle />
              <span>Proses Penarikan</span>
            </button>
            <button
              onClick={openRejectModal}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FaTimesCircle />
              <span>Tolak Penarikan</span>
            </button>
          </div>
        )}
      </div>

      {/* Process Withdrawal Modal */}
      {modalType === 'process' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Proses Penarikan Dana</h2>
            
            <div className="mb-4">
              <p className="text-gray-700">Anda akan memproses penarikan dana sebesar:</p>
              <p className="text-xl font-bold text-green-600 my-2">{formatCurrency(withdrawal.amount)}</p>
              <p className="text-sm text-gray-600">
                Ke rekening: {withdrawal.bank_name} - {withdrawal.account_number} - {withdrawal.account_name}
              </p>
            </div>
            
            <form onSubmit={handleProcessWithdrawal}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Referensi Transfer
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan nomor referensi transfer"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Masukkan nomor referensi dari bukti transfer bank
                </p>
              </div>
              
              {submitStatus.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {submitStatus.error}
                </div>
              )}
              
              {submitStatus.success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  {submitStatus.success}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  disabled={submitStatus.loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  disabled={submitStatus.loading}
                >
                  {submitStatus.loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Konfirmasi Pembayaran</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Withdrawal Modal */}
      {modalType === 'reject' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Tolak Penarikan Dana</h2>
            
            <div className="mb-4">
              <p className="text-gray-700">Anda akan menolak penarikan dana sebesar:</p>
              <p className="text-xl font-bold text-red-600 my-2">{formatCurrency(withdrawal.amount)}</p>
              <p className="text-sm text-gray-600">
                Dari: {withdrawal.guide?.user?.name || 'Guide #' + withdrawal.guide_id}
              </p>
            </div>
            
            <form onSubmit={handleRejectWithdrawal}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alasan Penolakan
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan alasan penolakan"
                  rows={3}
                />
              </div>
              
              {submitStatus.error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {submitStatus.error}
                </div>
              )}
              
              {submitStatus.success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  {submitStatus.success}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  disabled={submitStatus.loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  disabled={submitStatus.loading}
                >
                  {submitStatus.loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Tolak Penarikan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}