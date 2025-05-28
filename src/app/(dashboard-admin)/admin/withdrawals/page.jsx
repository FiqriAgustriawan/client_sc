"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaFilter,
  FaMoneyBillWave,
} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import api from "@/utils/axios";
import { Toaster, toast } from "react-hot-toast";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [processingStatus, setProcessingStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await api.get("/api/admin/withdrawals", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data.success) {
        // Pastikan data withdrawals adalah array
        const withdrawalData = response.data.data;
        setWithdrawals(Array.isArray(withdrawalData) ? withdrawalData : []);
      } else {
        toast.error("Gagal memuat data penarikan");
        setWithdrawals([]);
      }
    } catch (error) {
      console.error(
        "Error fetching withdrawals:",
        error.response?.data || error.message
      );
      toast.error("Terjadi kesalahan saat memuat data");
      setWithdrawals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedWithdrawal) return;

    if (!referenceNumber.trim()) {
      setProcessingStatus({
        loading: false,
        error: "Nomor referensi wajib diisi",
        success: "",
      });
      return;
    }

    setProcessingStatus({ loading: true, error: "", success: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/api/admin/withdrawals/${selectedWithdrawal.id}/process`,
        {
          reference_number: referenceNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProcessingStatus({
          loading: false,
          error: "",
          success: "Penarikan berhasil diproses",
        });
        toast.success("Penarikan berhasil diproses");
        await fetchWithdrawals();
        setTimeout(() => {
          setShowProcessModal(false);
          setSelectedWithdrawal(null);
          setReferenceNumber("");
          setProcessingStatus({ loading: false, error: "", success: "" });
        }, 1500);
      } else {
        setProcessingStatus({
          loading: false,
          error: response.data.message,
          success: "",
        });
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      setProcessingStatus({
        loading: false,
        error:
          error.response?.data?.message ||
          "Terjadi kesalahan saat memproses penarikan",
        success: "",
      });
    }
  };

  const handleReject = async () => {
    if (!selectedWithdrawal) return;

    if (!rejectReason.trim()) {
      setProcessingStatus({
        loading: false,
        error: "Alasan penolakan wajib diisi",
        success: "",
      });
      return;
    }

    setProcessingStatus({ loading: true, error: "", success: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        `/api/admin/withdrawals/${selectedWithdrawal.id}/reject`,
        {
          reason: rejectReason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProcessingStatus({
          loading: false,
          error: "",
          success: "Penarikan berhasil ditolak",
        });
        toast.success("Penarikan berhasil ditolak");
        await fetchWithdrawals();
        setTimeout(() => {
          setShowRejectModal(false);
          setSelectedWithdrawal(null);
          setRejectReason("");
          setProcessingStatus({ loading: false, error: "", success: "" });
        }, 1500);
      } else {
        setProcessingStatus({
          loading: false,
          error: response.data.message,
          success: "",
        });
      }
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      setProcessingStatus({
        loading: false,
        error:
          error.response?.data?.message ||
          "Terjadi kesalahan saat menolak penarikan",
        success: "",
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `Rp ${Number(amount).toLocaleString()}`;
  };

  // Perbaikan fungsi getFilteredWithdrawals untuk menangani kasus withdrawals bukan array
  const getFilteredWithdrawals = () => {
    // Pastikan withdrawals adalah array sebelum menggunakan .filter()
    if (!Array.isArray(withdrawals)) {
      console.warn("withdrawals is not an array:", withdrawals);
      return [];
    }

    if (filterStatus === "all") return withdrawals;
    return withdrawals.filter((w) => w.status === filterStatus);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <div className="h-16 w-16 rounded-full border-t-2 border-b-2 border-gray-300 animate-spin"></div>
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <FaMoneyBillWave className="text-gray-500 text-xl" />
          </motion.div>
        </motion.div>
        <p className="mt-4 text-gray-500 text-sm">Memuat data penarikan...</p>
      </div>
    );
  }

  // Simpan hasil getFilteredWithdrawals ke variabel untuk mencegah pemanggilan berulang
  const filteredWithdrawals = getFilteredWithdrawals();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 py-6 px-3 md:px-6"
      >
        <div className="flex flex-col space-y-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <FaChevronLeft />
                </Link>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Manajemen Penarikan Dana
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-1 ml-9">
                Kelola permintaan penarikan dana dari penyedia jasa
              </p>
            </div>

            {/* Filter controls */}
            <div className="ml-9 md:ml-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center p-1 bg-gray-50 border border-gray-100 rounded-lg shadow-sm"
              >
                {[
                  { value: "all", label: "Semua" },
                  { value: "pending", label: "Menunggu" },
                  { value: "processed", label: "Diproses" },
                  { value: "rejected", label: "Ditolak" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value)}
                    className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 ${
                      filterStatus === filter.value
                        ? "bg-white text-gray-800 shadow-sm"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {filteredWithdrawals.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Penyedia Jasa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWithdrawals.map((withdrawal, index) => (
                      <motion.tr
                        key={withdrawal.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 + 0.3 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-gray-700 font-medium">
                                {withdrawal.guide?.user?.name?.charAt(0) ||
                                  withdrawal.guide?.name?.charAt(0) ||
                                  "U"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-800">
                                {withdrawal.guide?.user?.name ||
                                  withdrawal.guide?.name ||
                                  (withdrawal.guide_id
                                    ? `Guide #${withdrawal.guide_id}`
                                    : "Unknown")}
                              </div>
                              <div className="text-sm text-gray-500">
                                {withdrawal.guide?.user?.email ||
                                  withdrawal.guide?.email ||
                                  "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(withdrawal.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-800">
                            {formatCurrency(withdrawal.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-800">
                              {withdrawal.bank_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {withdrawal.account_number}
                            </div>
                            <div className="text-xs text-gray-500">
                              {withdrawal.account_name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 inline-flex text-xs leading-5 font-medium rounded-full ${
                              withdrawal.status === "processed"
                                ? "bg-green-50 text-green-700 ring-1 ring-green-100"
                                : withdrawal.status === "rejected"
                                ? "bg-red-50 text-red-700 ring-1 ring-red-100"
                                : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
                            }`}
                          >
                            {withdrawal.status === "processed"
                              ? "Diproses"
                              : withdrawal.status === "rejected"
                              ? "Ditolak"
                              : "Menunggu"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {withdrawal.status === "pending" ? (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedWithdrawal(withdrawal);
                                  setShowProcessModal(true);
                                }}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors shadow-sm"
                                title="Proses Penarikan"
                              >
                                <FaCheck className="text-xs" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setSelectedWithdrawal(withdrawal);
                                  setShowRejectModal(true);
                                }}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm"
                                title="Tolak Penarikan"
                              >
                                <FaTimes className="text-xs" />
                              </motion.button>
                            </div>
                          ) : (
                            <Link href={`/admin/withdrawals/${withdrawal.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                                title="Lihat Detail"
                              >
                                <FaInfoCircle className="text-xs" />
                              </motion.button>
                            </Link>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <HiOutlineDocumentText className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  {filterStatus === "all"
                    ? "Tidak ada permintaan penarikan"
                    : `Tidak ada penarikan dengan status "${
                        filterStatus === "processed"
                          ? "diproses"
                          : filterStatus === "rejected"
                          ? "ditolak"
                          : "menunggu"
                      }"`}
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  {filterStatus === "all"
                    ? "Belum ada permintaan penarikan dana dari penyedia jasa saat ini."
                    : "Coba pilih filter lain untuk melihat penarikan dengan status berbeda."}
                </p>
                {filterStatus !== "all" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterStatus("all")}
                    className="mt-4 px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-all font-medium text-sm"
                  >
                    Lihat Semua Penarikan
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Process Modal */}
      <AnimatePresence>
        {showProcessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                {selectedWithdrawal?.status === "pending" ? (
                  <>
                    <span className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                      <FaCheck />
                    </span>
                    <span>Proses Penarikan</span>
                  </>
                ) : (
                  <>
                    <span className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                      <FaInfoCircle />
                    </span>
                    <span>Detail Penarikan</span>
                  </>
                )}
              </h2>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100"
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Penyedia Jasa:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedWithdrawal?.guide?.user?.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Jumlah:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {formatCurrency(selectedWithdrawal?.amount)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Bank:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedWithdrawal?.bank_name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Nomor Rekening:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedWithdrawal?.account_number}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Nama Pemilik:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedWithdrawal?.account_name}
                    </div>
                  </div>

                  {selectedWithdrawal?.notes && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-gray-500">Catatan:</div>
                      <div className="text-sm font-medium text-gray-800">
                        {selectedWithdrawal?.notes}
                      </div>
                    </div>
                  )}

                  {selectedWithdrawal?.status === "processed" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-gray-500">
                        Nomor Referensi:
                      </div>
                      <div className="text-sm font-medium text-gray-800">
                        {selectedWithdrawal?.reference_number || "-"}
                      </div>
                    </div>
                  )}

                  {selectedWithdrawal?.status === "rejected" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-gray-500">
                        Alasan Penolakan:
                      </div>
                      <div className="text-sm font-medium text-red-600">
                        {selectedWithdrawal?.reject_reason || "-"}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {selectedWithdrawal?.status === "pending" && (
                <>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-5"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Referensi Pembayaran
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200"
                      placeholder="Masukkan nomor referensi"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Masukkan nomor referensi transaksi untuk konfirmasi
                      pembayaran
                    </p>
                  </motion.div>

                  <AnimatePresence>
                    {processingStatus.error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start"
                      >
                        <FaTimes className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>{processingStatus.error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {processingStatus.success && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-start"
                      >
                        <FaCheck className="mr-2 mt-0.5 flex-shrink-0" />
                        <span>{processingStatus.success}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-end gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setShowProcessModal(false);
                        setSelectedWithdrawal(null);
                        setReferenceNumber("");
                        setProcessingStatus({
                          loading: false,
                          error: "",
                          success: "",
                        });
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                      disabled={processingStatus.loading}
                    >
                      Batal
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleProcess}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm"
                      disabled={
                        processingStatus.loading || !referenceNumber.trim()
                      }
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
                    </motion.button>
                  </div>
                </>
              )}

              {selectedWithdrawal?.status !== "pending" && (
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setShowProcessModal(false);
                      setSelectedWithdrawal(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                  >
                    Tutup
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <span className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                  <FaTimes />
                </span>
                <span>Tolak Penarikan</span>
              </h2>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100"
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Penyedia Jasa:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedWithdrawal?.guide?.user?.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Jumlah:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {formatCurrency(selectedWithdrawal?.amount)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-gray-500">Bank:</div>
                    <div className="text-sm font-medium text-gray-800">
                      {selectedWithdrawal?.bank_name}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-5"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alasan Penolakan
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all duration-200 resize-none"
                  placeholder="Masukkan alasan penolakan"
                  rows={3}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Berikan alasan yang jelas mengapa permintaan penarikan ini
                  ditolak
                </p>
              </motion.div>

              <AnimatePresence>
                {processingStatus.error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start"
                  >
                    <FaTimes className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{processingStatus.error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {processingStatus.success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-start"
                  >
                    <FaCheck className="mr-2 mt-0.5 flex-shrink-0" />
                    <span>{processingStatus.success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedWithdrawal(null);
                    setRejectReason("");
                    setProcessingStatus({
                      loading: false,
                      error: "",
                      success: "",
                    });
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                  disabled={processingStatus.loading}
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium shadow-sm"
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
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
