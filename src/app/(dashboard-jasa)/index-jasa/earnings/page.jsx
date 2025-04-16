'use client';

import React, { useEffect, useState } from 'react';
import { earningsService } from '@/services/earningsService';
import { FaMoneyBillWave, FaHistory, FaWallet, FaExchangeAlt, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function EarningsPage() {
  const [activeTab, setActiveTab] = useState('earnings');
  const [summary, setSummary] = useState({
    total_earnings: 0,
    pending_earnings: 0,
    available_balance: 0
  });
  const [earnings, setEarnings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ loading: false, success: '', error: '' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch earnings summary
      const summaryData = await earningsService.getEarningsSummary();
      if (summaryData.success) {
        setSummary(summaryData.data);
      }

      // Fetch earnings list
      const earningsData = await earningsService.getEarnings();
      if (earningsData.success) {
        // Make sure we're getting the earnings array from the correct property
        const earningsArray = earningsData.data.earnings || earningsData.data || [];
        setEarnings(earningsArray);
      }

      // Fetch withdrawals
      const withdrawalsData = await earningsService.getWithdrawals();
      if (withdrawalsData.success) {
        // Make sure we're getting the withdrawals array from the correct property
        const withdrawalsArray = withdrawalsData.data.withdrawals || withdrawalsData.data || [];
        setWithdrawals(withdrawalsArray);
      }
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast.error('Gagal memuat data pendapatan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalForm({
      ...withdrawalForm,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!withdrawalForm.amount) {
      errors.amount = 'Jumlah penarikan wajib diisi';
    } else if (isNaN(withdrawalForm.amount) || Number(withdrawalForm.amount) <= 0) {
      errors.amount = 'Jumlah penarikan harus berupa angka positif';
    } else if (Number(withdrawalForm.amount) < 50000) {
      errors.amount = 'Jumlah penarikan minimal Rp 50.000';
    } else if (Number(withdrawalForm.amount) > summary.available_balance) {
      errors.amount = 'Jumlah penarikan melebihi saldo tersedia';
    }

    if (!withdrawalForm.bank_name) {
      errors.bank_name = 'Nama bank wajib diisi';
    }
    
    if (!withdrawalForm.account_number) {
      errors.account_number = 'Nomor rekening wajib diisi';
    }
    
    if (!withdrawalForm.account_name) {
      errors.account_name = 'Nama pemilik rekening wajib diisi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitStatus({ loading: true, success: '', error: '' });
    
    try {
      const response = await earningsService.requestWithdrawal({
        amount: Number(withdrawalForm.amount),
        bank_name: withdrawalForm.bank_name,
        account_number: withdrawalForm.account_number,
        account_name: withdrawalForm.account_name,
        notes: withdrawalForm.notes
      });

      if (response.success) {
        setSubmitStatus({ 
          loading: false, 
          success: 'Permintaan penarikan berhasil dikirim', 
          error: '' 
        });
        
        toast.success('Permintaan penarikan berhasil dikirim');
        
        // Reset form
        setWithdrawalForm({
          amount: '',
          bank_name: '',
          account_number: '',
          account_name: '',
          notes: ''
        });
        
        // Refresh data
        setRefreshTrigger(prev => prev + 1);
        
        // Switch to withdrawals tab
        setActiveTab('withdrawals');
      } else {
        setSubmitStatus({ 
          loading: false, 
          success: '', 
          error: response.message || 'Gagal mengirim permintaan penarikan' 
        });
        toast.error(response.message || 'Gagal mengirim permintaan penarikan');
      }
    } catch (error) {
      setSubmitStatus({ 
        loading: false, 
        success: '', 
        error: error.response?.data?.message || 'Terjadi kesalahan saat memproses permintaan' 
      });
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat memproses permintaan');
    }
  };

  const formatCurrency = (amount) => {
    return `Rp ${Number(amount).toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
      case 'processed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Selesai</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Menunggu</span>;
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

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col md:flex-row md:mr-5 max-w-[1200px] mx-auto">
      <div className="hidden md:block w-[10%]"></div>
      <div className="top-8 w-[1640px] bg-white rounded-[24px] overflow-hidden relative mr-14 mt-10 shadow-lg p-6 max-w-full ml-14">
        <div className="mx-4 mt-2">
          <div className="flex items-center mb-6">
            <Link href="/index-jasa" className="mr-4">
              <FaChevronLeft className="text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-semibold">Kelola Pendapatan</h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Total Pendapatan</h3>
                <FaMoneyBillWave className="text-white/70 text-xl" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(summary.total_earnings)}</p>
              <p className="text-sm mt-2 text-white/70">Dari semua trip yang selesai</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Pendapatan Tertunda</h3>
                <FaHistory className="text-white/70 text-xl" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(summary.pending_earnings)}</p>
              <p className="text-sm mt-2 text-white/70">Menunggu penyelesaian trip</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Saldo Tersedia</h3>
                <FaWallet className="text-white/70 text-xl" />
              </div>
              <p className="text-3xl font-bold">{formatCurrency(summary.available_balance)}</p>
              <p className="text-sm mt-2 text-white/70">Siap untuk ditarik</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'earnings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('earnings')}
              >
                Riwayat Pendapatan
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'withdrawals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('withdrawals')}
              >
                Riwayat Penarikan
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'earnings' ? (
            <div>
              <h2 className="text-xl font-medium mb-4">Riwayat Pendapatan</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earnings.length > 0 ? (
                      earnings.map((earning) => (
                        <tr key={earning.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {earning.trip_title || earning.description || `Trip #${earning.trip_id}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {earning.booking_id ? `Booking #${earning.booking_id}` : ''}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(earning.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(earning.amount)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(earning.status)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                          Belum ada riwayat pendapatan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-medium mb-4">Tarik Dana</h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jumlah Penarikan
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={withdrawalForm.amount}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${formErrors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Masukkan jumlah (min. Rp 50.000)"
                      />
                      {formErrors.amount && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Saldo tersedia: {formatCurrency(summary.available_balance)}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Bank
                      </label>
                      <input
                        type="text"
                        name="bank_name"
                        value={withdrawalForm.bank_name}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${formErrors.bank_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Contoh: BCA, BNI, Mandiri"
                      />
                      {formErrors.bank_name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.bank_name}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Rekening
                      </label>
                      <input
                        type="text"
                        name="account_number"
                        value={withdrawalForm.account_number}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${formErrors.account_number ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Masukkan nomor rekening"
                      />
                      {formErrors.account_number && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.account_number}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Pemilik Rekening
                      </label>
                      <input
                        type="text"
                        name="account_name"
                        value={withdrawalForm.account_name}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${formErrors.account_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Masukkan nama pemilik rekening"
                      />
                      {formErrors.account_name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.account_name}</p>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Catatan (Opsional)
                      </label>
                      <textarea
                        name="notes"
                        value={withdrawalForm.notes}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tambahkan catatan jika diperlukan"
                        rows={2}
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
                    
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      disabled={submitStatus.loading || summary.available_balance <= 0}
                    >
                      {submitStatus.loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Memproses...</span>
                        </>
                      ) : summary.available_balance <= 0 ? (
                        <>
                          <FaWallet />
                          <span>Saldo Tidak Mencukupi</span>
                        </>
                      ) : (
                        <>
                          <FaExchangeAlt />
                          <span>Ajukan Penarikan</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h2 className="text-xl font-medium mb-4">Riwayat Penarikan</h2>
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {withdrawals.length > 0 ? (
                        withdrawals.map((withdrawal) => (
                          <tr key={withdrawal.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(withdrawal.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatCurrency(withdrawal.amount)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div>{withdrawal.bank_name}</div>
                              <div className="text-xs text-gray-500">{withdrawal.account_number}</div>
                              <div className="text-xs text-gray-500">{withdrawal.account_name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(withdrawal.status)}
                              {withdrawal.status === 'rejected' && withdrawal.reject_reason && (
                                <div className="text-xs text-red-600 mt-1">{withdrawal.reject_reason}</div>
                              )}
                              {withdrawal.status === 'processed' && withdrawal.reference_number && (
                                <div className="text-xs text-gray-500 mt-1">Ref: {withdrawal.reference_number}</div>
                              )}
                              {withdrawal.processed_at && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Diproses: {formatDate(withdrawal.processed_at)}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                            Belum ada riwayat penarikan
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}