'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaMoneyBillWave, FaHistory, FaWallet } from 'react-icons/fa';
import api from '@/utils/axios';
import { earningsService } from '@/services/earningsService';

export default function EarningsPage() {
  const [summary, setSummary] = useState({
    total_earnings: 0,
    pending_earnings: 0,
    withdrawn_amount: 0,
    pending_withdrawals: 0,
    available_balance: 0
  });
  const [earnings, setEarnings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [activeTab, setActiveTab] = useState('earnings');
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    notes: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch summary
        const summaryResponse = await earningsService.getEarningsSummary();
        if (summaryResponse.success) {
          setSummary(summaryResponse.data);
        }

        // Fetch earnings
        const earningsResponse = await earningsService.getEarnings();
        if (earningsResponse.success) {
          setEarnings(earningsResponse.data);
        }

        // Fetch withdrawals
        const withdrawalsResponse = await earningsService.getWithdrawals();
        if (withdrawalsResponse.success) {
          setWithdrawals(withdrawalsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      // Validate amount
      const amount = parseFloat(withdrawalForm.amount);
      if (isNaN(amount) || amount <= 0) {
        setFormError('Jumlah penarikan harus lebih dari 0');
        return;
      }

      if (amount > summary.available_balance) {
        setFormError('Jumlah penarikan melebihi saldo tersedia');
        return;
      }

      // Validate other fields
      if (!withdrawalForm.bank_name || !withdrawalForm.account_number || !withdrawalForm.account_name) {
        setFormError('Semua field harus diisi');
        return;
      }

      const response = await earningsService.requestWithdrawal({
        amount: amount,
        bank_name: withdrawalForm.bank_name,
        account_number: withdrawalForm.account_number,
        account_name: withdrawalForm.account_name,
        notes: withdrawalForm.notes
      });
      
      if (response.success) {
        setFormSuccess('Permintaan penarikan berhasil diajukan');
        setWithdrawalForm({
          amount: '',
          bank_name: '',
          account_number: '',
          account_name: '',
          notes: ''
        });
        setShowWithdrawalForm(false);

        // Refresh data
        const withdrawalsResponse = await earningsService.getWithdrawals();
        if (withdrawalsResponse.success) {
          setWithdrawals(withdrawalsResponse.data);
        }

        const summaryResponse = await earningsService.getEarningsSummary();
        if (summaryResponse.success) {
          setSummary(summaryResponse.data);
        }
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      setFormError('Gagal mengajukan penarikan. Silakan coba lagi.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/index-jasa">
            <span className="inline-flex items-center text-blue-500 hover:text-blue-700">
              <FaChevronLeft className="mr-2" />
              Kembali ke Dashboard
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-4">Manajemen Pendapatan</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-sm opacity-80">Total Pendapatan</p>
                <p className="text-2xl font-bold">Rp {summary.total_earnings.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-sm opacity-80">Saldo Tersedia</p>
                <p className="text-2xl font-bold">Rp {summary.available_balance.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                <p className="text-sm opacity-80">Total Penarikan</p>
                <p className="text-2xl font-bold">Rp {summary.withdrawn_amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('earnings')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'earnings' 
                    ? 'text-blue-500 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave />
                  <span>Riwayat Pendapatan</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`px-6 py-4 font-medium ${
                  activeTab === 'withdrawals' 
                    ? 'text-blue-500 border-b-2 border-blue-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaHistory />
                  <span>Riwayat Penarikan</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'earnings' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Riwayat Pendapatan</h2>
                {earnings.length > 0 ? (
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
                        {earnings.map((earning) => (
                          <tr key={earning.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {earning.trip.mountain.nama_gunung}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(earning.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              Rp {earning.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                earning.status === 'processed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {earning.status === 'processed' ? 'Diproses' : 'Tertunda'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada riwayat pendapatan
                  </div>
                )}
              </div>
            )}

            {activeTab === 'withdrawals' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Riwayat Penarikan</h2>
                  <button
                    onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
                  >
                    <FaWallet />
                    <span>{showWithdrawalForm ? 'Batal' : 'Tarik Dana'}</span>
                  </button>
                </div>

                {formSuccess && (
                  <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
                    {formSuccess}
                  </div>
                )}

                {showWithdrawalForm && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Form Penarikan Dana</h3>
                    {formError && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {formError}
                      </div>
                    )}
                    <form onSubmit={handleWithdrawalSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah Penarikan (Rp)
                          </label>
                          <input
                            type="number"
                            value={withdrawalForm.amount}
                            onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Jumlah penarikan"
                            required
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Saldo tersedia: Rp {summary.available_balance.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Bank
                          </label>
                          <input
                            type="text"
                            value={withdrawalForm.bank_name}
                            onChange={(e) => setWithdrawalForm({...withdrawalForm, bank_name: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: BCA, Mandiri, BNI"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nomor Rekening
                          </label>
                          <input
                            type="text"
                            value={withdrawalForm.account_number}
                            onChange={(e) => setWithdrawalForm({...withdrawalForm, account_number: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nomor rekening bank"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Pemilik Rekening
                          </label>
                          <input
                            type="text"
                            value={withdrawalForm.account_name}
                            onChange={(e) => setWithdrawalForm({...withdrawalForm, account_name: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nama pemilik rekening"
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Catatan (Opsional)
                        </label>
                        <textarea
                          value={withdrawalForm.notes}
                          onChange={(e) => setWithdrawalForm({...withdrawalForm, notes: e.target.value})}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Catatan tambahan"
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Ajukan Penarikan
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {withdrawals.length > 0 ? (
                  <div className="overflow-x-auto">
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
                        {withdrawals.map((withdrawal) => (
                          <tr key={withdrawal.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(withdrawal.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                              Rp {withdrawal.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {withdrawal.bank_name} - {withdrawal.account_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                withdrawal.status === 'processed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : withdrawal.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {withdrawal.status === 'processed' 
                                  ? 'Selesai' 
                                  : withdrawal.status === 'rejected'
                                  ? 'Ditolak'
                                  : 'Menunggu'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Belum ada riwayat penarikan
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}