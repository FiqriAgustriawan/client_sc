"use client";

import React, { useEffect, useState } from "react";
import { earningsService } from "@/services/earningsService";
import {
  FaMoneyBillWave,
  FaHistory,
  FaWallet,
  FaExchangeAlt,
  FaChevronLeft,
  FaCalendarAlt,
  FaRegClock,
  FaUniversity,
  FaIdCard,
  FaInfoCircle,
} from "react-icons/fa";
import { FiCheck, FiClock, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function EarningsPage() {
  const [activeTab, setActiveTab] = useState("earnings");
  const [summary, setSummary] = useState({
    total_earnings: 0,
    pending_earnings: 0,
    available_balance: 0,
  });
  const [earnings, setEarnings] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    bank_name: "",
    account_number: "",
    account_name: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

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
        const earningsArray =
          earningsData.data.earnings || earningsData.data || [];
        setEarnings(earningsArray);
      }

      // Fetch withdrawals
      const withdrawalsData = await earningsService.getWithdrawals();
      if (withdrawalsData.success) {
        // Make sure we're getting the withdrawals array from the correct property
        const withdrawalsArray =
          withdrawalsData.data.withdrawals || withdrawalsData.data || [];
        setWithdrawals(withdrawalsArray);
      }
    } catch (error) {
      console.error("Error fetching earnings data:", error);
      toast.error("Gagal memuat data pendapatan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalForm({
      ...withdrawalForm,
      [name]: value,
    });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!withdrawalForm.amount) {
      errors.amount = "Jumlah penarikan wajib diisi";
    } else if (
      isNaN(withdrawalForm.amount) ||
      Number(withdrawalForm.amount) <= 0
    ) {
      errors.amount = "Jumlah penarikan harus berupa angka positif";
    } else if (Number(withdrawalForm.amount) < 50000) {
      errors.amount = "Jumlah penarikan minimal Rp 50.000";
    } else if (Number(withdrawalForm.amount) > summary.available_balance) {
      errors.amount = "Jumlah penarikan melebihi saldo tersedia";
    }

    if (!withdrawalForm.bank_name) {
      errors.bank_name = "Nama bank wajib diisi";
    }

    if (!withdrawalForm.account_number) {
      errors.account_number = "Nomor rekening wajib diisi";
    }

    if (!withdrawalForm.account_name) {
      errors.account_name = "Nama pemilik rekening wajib diisi";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitStatus({ loading: true, success: "", error: "" });

    try {
      const response = await earningsService.requestWithdrawal({
        amount: Number(withdrawalForm.amount),
        bank_name: withdrawalForm.bank_name,
        account_number: withdrawalForm.account_number,
        account_name: withdrawalForm.account_name,
        notes: withdrawalForm.notes,
      });

      if (response.success) {
        setSubmitStatus({
          loading: false,
          success: "Permintaan penarikan berhasil dikirim",
          error: "",
        });

        toast.success("Permintaan penarikan berhasil dikirim");

        // Reset form
        setWithdrawalForm({
          amount: "",
          bank_name: "",
          account_number: "",
          account_name: "",
          notes: "",
        });

        // Refresh data
        setRefreshTrigger((prev) => prev + 1);

        // Switch to withdrawals tab
        setActiveTab("withdrawals");
      } else {
        setSubmitStatus({
          loading: false,
          success: "",
          error: response.message || "Gagal mengirim permintaan penarikan",
        });
        toast.error(response.message || "Gagal mengirim permintaan penarikan");
      }
    } catch (error) {
      setSubmitStatus({
        loading: false,
        success: "",
        error:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memproses permintaan",
      });
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan saat memproses permintaan"
      );
    }
  };

  const formatCurrency = (amount) => {
    return `Rp ${Number(amount).toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
      case "processed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheck className="mr-1" /> Selesai
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="mr-1" /> Menunggu
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiAlertTriangle className="mr-1" /> Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Memuat data pendapatan...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-10"
    >
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-center justify-between mb-8"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <Link
                href="/index-jasa"
                className="mr-4 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <FaChevronLeft className="text-gray-500 hover:text-gray-700" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Kelola Pendapatan
              </h1>
            </div>

            <button
              onClick={() => setRefreshTrigger((prev) => prev + 1)}
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 transition-colors"
            >
              <FiRefreshCw className="mr-2" /> Refresh Data
            </button>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Total Pendapatan</h3>
                <div className="bg-white/20 p-2 rounded-full">
                  <FaMoneyBillWave className="text-white text-xl" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                {formatCurrency(summary.total_earnings)}
              </p>
              <p className="text-sm mt-2 text-white/80 flex items-center">
                <FaCalendarAlt className="mr-1.5" /> Dari semua trip yang
                selesai
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl p-6 text-white shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Pendapatan Tertunda</h3>
                <div className="bg-white/20 p-2 rounded-full">
                  <FaRegClock className="text-white text-xl" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                {formatCurrency(summary.pending_earnings)}
              </p>
              <p className="text-sm mt-2 text-white/80 flex items-center">
                <FaHistory className="mr-1.5" /> Menunggu penyelesaian trip
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white shadow-md relative"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Saldo Tersedia</h3>
                <div className="bg-white/20 p-2 rounded-full">
                  <FaWallet className="text-white text-xl" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                {formatCurrency(summary.available_balance)}
              </p>
              <p className="text-sm mt-2 text-white/80 flex items-center">
                <FaExchangeAlt className="mr-1.5" /> Siap untuk ditarik
              </p>

              {/* Info icon with tooltip */}
              <div className="absolute top-4 right-16">
                <button
                  className="bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition-colors"
                  onMouseEnter={() => setShowInfoTooltip(true)}
                  onMouseLeave={() => setShowInfoTooltip(false)}
                >
                  <FaInfoCircle size={16} />
                </button>
                <AnimatePresence>
                  {showInfoTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 p-3 bg-white rounded-lg shadow-lg z-10 text-gray-700 text-sm"
                    >
                      Saldo yang tersedia untuk ditarik setelah dikurangi biaya
                      platform dan pajak terkait.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-t-xl shadow-sm mb-0"
          >
            <div className="flex justify-center md:justify-start md:pl-6 border-b">
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "earnings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("earnings")}
              >
                <span className="flex items-center">
                  <FaMoneyBillWave className="mr-2" /> Riwayat Pendapatan
                </span>
              </button>
              <button
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "withdrawals"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("withdrawals")}
              >
                <span className="flex items-center">
                  <FaExchangeAlt className="mr-2" /> Riwayat Penarikan
                </span>
              </button>
            </div>
          </motion.div>

          {/* Content based on active tab */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-b-xl shadow-sm p-6"
          >
            <AnimatePresence mode="wait">
              {activeTab === "earnings" ? (
                <motion.div
                  key="earnings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Riwayat Pendapatan
                    </h2>
                    <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                      Total: {earnings.length} transaksi
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Trip
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tanggal
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Jumlah
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {earnings.length > 0 ? (
                          earnings.map((earning, index) => (
                            <motion.tr
                              key={earning.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{
                                backgroundColor: "rgba(243, 244, 246, 0.5)",
                              }}
                            >
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {earning.trip_title ||
                                    earning.description ||
                                    `Trip #${earning.trip_id}`}
                                </div>
                                {earning.booking_id && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Booking #{earning.booking_id}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-700">
                                  {formatDate(earning.created_at)}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  {formatCurrency(earning.amount)}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {getStatusBadge(earning.status)}
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <div className="bg-blue-100 rounded-full p-3 mb-3">
                                  <FaHistory className="text-blue-500 text-xl" />
                                </div>
                                <p className="text-gray-500 font-medium">
                                  Belum ada riwayat pendapatan
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                  Pendapatan akan muncul setelah trip selesai
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="withdrawals"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {/* Withdrawal Form */}
                  <div className="md:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 px-6 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                          <FaExchangeAlt className="mr-2 text-blue-500" /> Tarik
                          Dana
                        </h2>
                      </div>

                      <div className="p-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-center">
                          <FaWallet className="text-blue-500 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Saldo tersedia
                            </p>
                            <p className="text-lg font-bold text-gray-800">
                              {formatCurrency(summary.available_balance)}
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                          <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Jumlah Penarikan
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">Rp</span>
                              </div>
                              <input
                                type="text"
                                name="amount"
                                value={withdrawalForm.amount}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 border ${
                                  formErrors.amount
                                    ? "border-red-500"
                                    : "border-gray-300"
                                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                                placeholder="Minimal Rp 50.000"
                              />
                            </div>
                            {formErrors.amount && (
                              <p className="mt-1.5 text-sm text-red-600 flex items-start">
                                <FiAlertTriangle className="mr-1 mt-0.5 flex-shrink-0" />
                                <span>{formErrors.amount}</span>
                              </p>
                            )}
                          </div>

                          <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <span className="flex items-center">
                                <FaUniversity className="mr-2" /> Nama Bank
                              </span>
                            </label>
                            <input
                              type="text"
                              name="bank_name"
                              value={withdrawalForm.bank_name}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border ${
                                formErrors.bank_name
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                              placeholder="Contoh: BCA, BNI, Mandiri"
                            />
                            {formErrors.bank_name && (
                              <p className="mt-1.5 text-sm text-red-600 flex items-start">
                                <FiAlertTriangle className="mr-1 mt-0.5 flex-shrink-0" />
                                <span>{formErrors.bank_name}</span>
                              </p>
                            )}
                          </div>

                          <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              <span className="flex items-center">
                                <FaIdCard className="mr-2" /> Nomor Rekening
                              </span>
                            </label>
                            <input
                              type="text"
                              name="account_number"
                              value={withdrawalForm.account_number}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border ${
                                formErrors.account_number
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                              placeholder="Masukkan nomor rekening"
                            />
                            {formErrors.account_number && (
                              <p className="mt-1.5 text-sm text-red-600 flex items-start">
                                <FiAlertTriangle className="mr-1 mt-0.5 flex-shrink-0" />
                                <span>{formErrors.account_number}</span>
                              </p>
                            )}
                          </div>

                          <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nama Pemilik Rekening
                            </label>
                            <input
                              type="text"
                              name="account_name"
                              value={withdrawalForm.account_name}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 border ${
                                formErrors.account_name
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                              placeholder="Masukkan nama pemilik rekening"
                            />
                            {formErrors.account_name && (
                              <p className="mt-1.5 text-sm text-red-600 flex items-start">
                                <FiAlertTriangle className="mr-1 mt-0.5 flex-shrink-0" />
                                <span>{formErrors.account_name}</span>
                              </p>
                            )}
                          </div>

                          <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Catatan (Opsional)
                            </label>
                            <textarea
                              name="notes"
                              value={withdrawalForm.notes}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              placeholder="Tambahkan catatan jika diperlukan"
                              rows={2}
                            />
                          </div>

                          {submitStatus.error && (
                            <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center">
                              <FiAlertTriangle className="mr-2 flex-shrink-0" />
                              {submitStatus.error}
                            </div>
                          )}

                          {submitStatus.success && (
                            <div className="mb-5 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-center">
                              <FiCheck className="mr-2 flex-shrink-0" />
                              {submitStatus.success}
                            </div>
                          )}

                          <button
                            type="submit"
                            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                              summary.available_balance <= 0 ||
                              submitStatus.loading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md"
                            }`}
                            disabled={
                              submitStatus.loading ||
                              summary.available_balance <= 0
                            }
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
                  </div>

                  {/* Withdrawal History */}
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 px-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                          <FaHistory className="mr-2 text-blue-500" /> Riwayat
                          Penarikan
                        </h2>
                        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                          Total: {withdrawals.length} penarikan
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Tanggal
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Jumlah
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Bank
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {withdrawals.length > 0 ? (
                              withdrawals.map((withdrawal, index) => (
                                <motion.tr
                                  key={withdrawal.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{
                                    backgroundColor: "rgba(243, 244, 246, 0.5)",
                                  }}
                                >
                                  <td className="px-6 py-4">
                                    <div className="text-sm text-gray-700">
                                      {formatDate(withdrawal.created_at)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {formatCurrency(withdrawal.amount)}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {withdrawal.bank_name}
                                    </div>
                                    <div className="flex flex-col text-xs text-gray-500 mt-1">
                                      <span>{withdrawal.account_number}</span>
                                      <span>{withdrawal.account_name}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    {getStatusBadge(withdrawal.status)}

                                    {withdrawal.status === "rejected" &&
                                      withdrawal.reject_reason && (
                                        <div className="bg-red-50 border border-red-100 rounded-md p-2 mt-2 text-xs text-red-700">
                                          <div className="font-medium">
                                            Alasan penolakan:
                                          </div>
                                          <div>{withdrawal.reject_reason}</div>
                                        </div>
                                      )}

                                    {withdrawal.status === "processed" &&
                                      withdrawal.reference_number && (
                                        <div className="text-xs text-gray-500 mt-2">
                                          <span className="font-medium">
                                            Ref:
                                          </span>{" "}
                                          {withdrawal.reference_number}
                                        </div>
                                      )}

                                    {withdrawal.processed_at && (
                                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                                        <FaCalendarAlt className="mr-1.5" />
                                        Diproses:{" "}
                                        {formatDate(withdrawal.processed_at)}
                                      </div>
                                    )}
                                  </td>
                                </motion.tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="4"
                                  className="px-6 py-12 text-center"
                                >
                                  <div className="flex flex-col items-center">
                                    <div className="bg-blue-100 rounded-full p-3 mb-3">
                                      <FaExchangeAlt className="text-blue-500 text-xl" />
                                    </div>
                                    <p className="text-gray-500 font-medium">
                                      Belum ada riwayat penarikan
                                    </p>
                                    <p className="text-gray-400 text-sm mt-1">
                                      Ajukan penarikan dana pertama Anda
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
