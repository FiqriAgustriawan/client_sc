"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  FaFileInvoiceDollar,
  FaDownload,
  FaEye,
  FaChartPie,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronRight,
  FaWallet,
  FaMapMarkerAlt,
  FaMountain,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Import custom components
import SpendingChart from "./components/SpendingChart";
import MonthlySpendingChart from "./components/MonthlySpendingChart";
import LoadingSkeleton from "./components/LoadingSkeleton";
import EmptyState from "./components/EmptyState";

// Create a common button component
const Button = ({ onClick, children, className = "", variant = "primary" }) => {
  const baseClass =
    "px-3 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default function InvoicePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showStats, setShowStats] = useState(true);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Spending stats
  const [spendingStats, setSpendingStats] = useState({
    totalSpent: 0,
    thisMonth: 0,
    lastMonth: 0,
    thisYear: 0,
    avgPerTrip: 0,
    tripCount: 0,
    topDestination: "",
    monthlyData: [],
    categoryData: [],
  });

  // Fetch invoices from API
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        // Use the environment variable for API URL
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
          }/api/user/invoices`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch invoices");

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setInvoices(data.data);
          setFilteredInvoices(data.data);
          calculateSpendingStats(data.data);
        } else {
          toast.error("Failed to load invoice data");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Error loading invoices");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Update the calculateSpendingStats function to properly parse numeric values
  const calculateSpendingStats = (invoiceData) => {
    // Filter only paid invoices
    const paidInvoices = invoiceData.filter(
      (invoice) => invoice.status === "paid"
    );

    // Ensure amounts are converted to numbers
    const parseAmount = (amount) => {
      const num = parseFloat(amount);
      return isNaN(num) ? 0 : num; // Return 0 if parsing fails
    };

    // Calculate total spending with safer parsing
    const totalSpent = paidInvoices.reduce(
      (sum, invoice) => sum + parseAmount(invoice.amount),
      0
    );

    // Calculate this month's spending with safer parsing
    const now = new Date();
    const thisMonth = paidInvoices
      .filter((invoice) => {
        const paidDate = new Date(invoice.paid_at || invoice.created_at);
        return (
          paidDate.getMonth() === now.getMonth() &&
          paidDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);

    // Calculate last month's spending with safer parsing
    const lastMonth = paidInvoices
      .filter((invoice) => {
        const paidDate = new Date(invoice.paid_at || invoice.created_at);
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        return (
          paidDate.getMonth() === lastMonthDate.getMonth() &&
          paidDate.getFullYear() === lastMonthDate.getFullYear()
        );
      })
      .reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);

    // Calculate this year's spending with safer parsing
    const thisYear = paidInvoices
      .filter((invoice) => {
        const paidDate = new Date(invoice.paid_at || invoice.created_at);
        return paidDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);

    // Average spending per trip with safer calculation
    const avgPerTrip =
      paidInvoices.length > 0 ? totalSpent / paidInvoices.length : 0;

    // Find top destination
    const destinations = paidInvoices.map(
      (invoice) => invoice.trip?.mountain?.nama_gunung || "Unknown"
    );
    const destinationCounts = destinations.reduce((acc, dest) => {
      acc[dest] = (acc[dest] || 0) + 1;
      return acc;
    }, {});

    const topDestination = Object.keys(destinationCounts).reduce(
      (a, b) => (destinationCounts[a] > destinationCounts[b] ? a : b),
      ""
    );

    // Monthly spending data for chart
    const monthlyData = Array(12)
      .fill(0)
      .map((_, i) => {
        const month = new Date(now.getFullYear(), i, 1);
        const amount = paidInvoices
          .filter((invoice) => {
            const paidDate = new Date(invoice.paid_at || invoice.created_at);
            return (
              paidDate.getMonth() === i &&
              paidDate.getFullYear() === now.getFullYear()
            );
          })
          .reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);

        return {
          month: format(month, "MMM", { locale: id }),
          amount,
        };
      });

    // For the category data, ensure amounts are parsed as numbers
    const categoryData = Object.entries(
      paidInvoices.reduce((acc, invoice) => {
        const mountain = invoice.trip?.mountain?.nama_gunung || "Unknown";
        acc[mountain] = (acc[mountain] || 0) + parseAmount(invoice.amount);
        return acc;
      }, {})
    ).map(([category, amount]) => ({ category, amount }));

    // Update your state with the calculated values
    setSpendingStats({
      totalSpent,
      thisMonth,
      lastMonth,
      thisYear,
      avgPerTrip,
      tripCount: paidInvoices.length,
      topDestination,
      monthlyData,
      categoryData,
    });
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...invoices];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.trip?.mountain?.nama_gunung
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.trip?.mountain?.lokasi
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      if (dateFilter === "this-month") {
        filtered = filtered.filter((invoice) => {
          const invoiceDate = new Date(invoice.created_at);
          return (
            invoiceDate.getMonth() === now.getMonth() &&
            invoiceDate.getFullYear() === now.getFullYear()
          );
        });
      } else if (dateFilter === "last-month") {
        filtered = filtered.filter((invoice) => {
          const invoiceDate = new Date(invoice.created_at);
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
          return (
            invoiceDate.getMonth() === lastMonth.getMonth() &&
            invoiceDate.getFullYear() === lastMonth.getFullYear()
          );
        });
      } else if (dateFilter === "this-year") {
        filtered = filtered.filter((invoice) => {
          const invoiceDate = new Date(invoice.created_at);
          return invoiceDate.getFullYear() === now.getFullYear();
        });
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "date-asc":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "date-desc":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "amount-asc":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case "amount-desc":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, dateFilter, sortBy]);

  // Handle invoice download
  const handleDownload = (invoiceId) => {
    window.open(
      `/api/payments/${invoiceId}/download?token=${localStorage.getItem(
        "token"
      )}`,
      "_blank"
    );
  };

  // Update the formatCurrency function to handle invalid values
  const formatCurrency = (amount) => {
    if (isNaN(amount) || amount === undefined || amount === null) {
      return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR", // Was missing the "IDR" value here
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge based on payment status
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Lunas
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            Menunggu
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            Gagal
          </span>
        );
      case "expired":
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            Kedaluwarsa
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  // Format date in Indonesian format
  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
    setSortBy("date-desc");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header with Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Riwayat Pembayaran
          </h1>
          <p className="text-gray-600">
            Seluruh rincian pembayaran dan pengeluaran pendakian Anda
          </p>
        </motion.div>

        {/* Spending Statistics Cards */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FaChartPie className="mr-2 text-blue-600" />
                    Analisis Pengeluaran
                  </h2>
                  <Button
                    variant="secondary"
                    onClick={() => setShowStats(false)}
                    className="text-sm"
                  >
                    <FaChevronDown className="mr-1" /> Sembunyikan
                  </Button>
                </div>

                {/* Stats Summary Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-600 font-medium mb-1">
                      Total Pengeluaran
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatCurrency(spendingStats.totalSpent)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {spendingStats.tripCount} trip
                    </p>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-sm text-emerald-600 font-medium mb-1">
                      Bulan Ini
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatCurrency(spendingStats.thisMonth)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {spendingStats.lastMonth > 0 ? (
                        spendingStats.thisMonth > spendingStats.lastMonth ? (
                          <span className="text-green-600">
                            ▲{" "}
                            {Math.round(
                              ((spendingStats.thisMonth -
                                spendingStats.lastMonth) /
                                spendingStats.lastMonth) *
                                100
                            )}
                            % dari bulan lalu
                          </span>
                        ) : (
                          <span className="text-red-600">
                            ▼{" "}
                            {Math.round(
                              ((spendingStats.lastMonth -
                                spendingStats.thisMonth) /
                                spendingStats.lastMonth) *
                                100
                            )}
                            % dari bulan lalu
                          </span>
                        )
                      ) : (
                        "Tidak ada data bulan lalu"
                      )}
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="text-sm text-amber-600 font-medium mb-1">
                      Rata-rata per Trip
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatCurrency(spendingStats.avgPerTrip)}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-sm text-purple-600 font-medium mb-1">
                      Top Destinasi
                    </p>
                    <p className="text-xl font-bold text-gray-800 truncate">
                      {spendingStats.topDestination || "Belum ada"}
                    </p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      Pengeluaran Bulanan (2025)
                    </h3>
                    <div className="h-64">
                      <MonthlySpendingChart data={spendingStats.monthlyData} />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      Distribusi Destinasi
                    </h3>
                    <div className="h-64">
                      <SpendingChart data={spendingStats.categoryData} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Button
              variant="secondary"
              onClick={() => setShowStats(true)}
              className="mx-auto block"
            >
              <FaChartPie className="mr-2" /> Tampilkan Analisis Pengeluaran
            </Button>
          </motion.div>
        )}

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:max-w-xs relative">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari invoice atau gunung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="relative">
                <Button
                  variant="secondary"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="text-sm"
                >
                  <FaFilter className="mr-2" />
                  Filter & Urutan
                  <FaChevronDown className="ml-2" />
                </Button>

                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 p-4"
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status Pembayaran
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="all">Semua Status</option>
                        <option value="paid">Lunas</option>
                        <option value="pending">Menunggu</option>
                        <option value="failed">Gagal</option>
                        <option value="expired">Kedaluwarsa</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Periode
                      </label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="all">Semua Waktu</option>
                        <option value="this-month">Bulan Ini</option>
                        <option value="last-month">Bulan Lalu</option>
                        <option value="this-year">Tahun Ini</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urutkan
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="date-desc">Tanggal (Terbaru)</option>
                        <option value="date-asc">Tanggal (Terlama)</option>
                        <option value="amount-desc">Nominal (Tertinggi)</option>
                        <option value="amount-asc">Nominal (Terendah)</option>
                      </select>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="secondary"
                        onClick={clearFilters}
                        className="text-sm px-2 py-1"
                      >
                        Reset Filter
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => setShowFilterMenu(false)}
                        className="text-sm px-2 py-1"
                      >
                        Terapkan
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Filter pills to show active filters */}
              <div className="flex flex-wrap gap-1">
                {statusFilter !== "all" && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center">
                    Status:{" "}
                    {statusFilter === "paid"
                      ? "Lunas"
                      : statusFilter === "pending"
                      ? "Menunggu"
                      : statusFilter === "failed"
                      ? "Gagal"
                      : "Kedaluwarsa"}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="ml-1"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
                {dateFilter !== "all" && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center">
                    Periode:{" "}
                    {dateFilter === "this-month"
                      ? "Bulan Ini"
                      : dateFilter === "last-month"
                      ? "Bulan Lalu"
                      : "Tahun Ini"}
                    <button
                      onClick={() => setDateFilter("all")}
                      className="ml-1"
                    >
                      <FaTimes size={10} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Search results summary */}
          {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {filteredInvoices.length} dari {invoices.length}{" "}
              invoice
              {searchTerm && <span> dengan kata kunci "{searchTerm}"</span>}
            </div>
          )}
        </motion.div>

        {/* Invoices List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Loading State */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredInvoices.length === 0 ? (
            <EmptyState
              message={
                searchTerm
                  ? `Tidak ada invoice yang cocok dengan kata kunci "${searchTerm}"`
                  : "Belum ada data invoice"
              }
            />
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-5 border-b p-4 bg-gray-50 font-medium text-gray-600 text-sm">
                <div>No. Invoice</div>
                <div>Trip</div>
                <div>Tanggal</div>
                <div>Status</div>
                <div>Nominal</div>
              </div>

              {/* Invoice items */}
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredInvoices.map((invoice, index) => (
                    <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:px-6"
                    >
                      <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-0 md:items-center">
                        {/* Invoice Number */}
                        <div>
                          <div className="flex items-center text-blue-600 font-medium">
                            <FaFileInvoiceDollar className="mr-2 text-blue-500" />
                            <span className="truncate">
                              {invoice.invoice_number}
                            </span>
                          </div>
                          <div className="md:hidden text-sm text-gray-500 mt-1">
                            {formatDate(invoice.created_at)}
                          </div>
                        </div>

                        {/* Trip Info */}
                        <div className="flex flex-col">
                          <div className="font-medium">
                            {invoice.trip?.mountain?.nama_gunung || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <FaMapMarkerAlt
                              className="mr-1 text-gray-400"
                              size={12}
                            />
                            {invoice.trip?.mountain?.lokasi ||
                              "Unknown location"}
                          </div>
                        </div>

                        {/* Date */}
                        <div className="hidden md:block">
                          {formatDate(invoice.created_at)}
                        </div>

                        {/* Status */}
                        <div>
                          {getStatusBadge(invoice.status)}
                          <div className="md:hidden mt-2">
                            {formatCurrency(invoice.amount)}
                          </div>
                        </div>

                        {/* Amount and Actions */}
                        <div className="flex items-center justify-between md:justify-end gap-6">
                          <div className="font-medium hidden md:block">
                            {formatCurrency(invoice.amount)}
                          </div>

                          <div className="flex gap-2">
                            {/* Link to invoice detail page */}
                            <Link
                              href={`/dashboard-user/trip-manage/invoice/${invoice.id}`}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Lihat Invoice"
                            >
                              <FaEye />
                            </Link>

                            {/* <button
                              onClick={() => handleDownload(invoice.id)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="Unduh Invoice"
                            >
                              <FaDownload />
                            </button> */}
                          </div>
                        </div>
                      </div>

                      {/* Mobile view trip date */}
                      <div className="md:hidden text-xs text-gray-500 mt-2 flex items-center">
                        <FaCalendarAlt className="mr-1" size={10} />
                        Tanggal trip:{" "}
                        {invoice.trip?.start_date
                          ? formatDate(invoice.trip.start_date)
                          : "N/A"}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
