"use client";
// Import existing dependencies
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/app/contexts/NotificationContext";
import api from "@/utils/axios";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiStar,
  FiActivity,
  FiAlertCircle,
  FiBell,
  FiMap,
  FiCalendar,
  FiUserPlus,
  FiMapPin,
} from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import Link from "next/link";
import dynamic from "next/dynamic";

// Import chart components
import UserStatsChart from "@/components/charts/UserStatsChart ";
import MountainStatsChart from "@/components/charts/MountainStatsChart";
import UserSegmentationChart from "@/components/charts/UserSegmentationChart";
import {
  BookingHoursChart,
  BookingDaysChart,
} from "@/components/charts/BookingPatternCharts";

// Dynamic import for small mountain trend charts
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function Page() {
  const router = useRouter();
  const { user, loading, refreshToken } = useAuth();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // All state declarations remain the same
  const [mountains, setMountains] = useState([]);
  const [pendingGuides, setPendingGuides] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalGuides: 0,
    activeGuides: 0,
    totalTrips: 0,
    totalUsers: 0,
    averageRating: 0,
    pendingApprovals: 0,
    totalMountains: 0,
    pendingWithdrawals: 0,
    totalRevenue: 0,
    completedBookings: 0,
    newUsersToday: 0,
    newBookingsToday: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [dataFetched, setDataFetched] = useState(false);
  const [mountainStats, setMountainStats] = useState({
    mountains: [],
    mountainTrends: [],
    topMountains: [],
  });

  const [userStats, setUserStats] = useState({
    registrationsByMonth: [],
    activeUsers: [],
    bookingPatterns: {
      byHour: [],
      byDay: [],
    },
    userSegmentation: {},
    summary: {
      totalUsers: 0,
      totalGuides: 0,
      newUsersThisMonth: 0,
      activeUsersThisMonth: 0,
    },
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6))
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [userViewMode, setUserViewMode] = useState("registrations");
  const [mountainViewMode, setMountainViewMode] = useState("trends");

  // FIX 1: Perbaikan state dengan nilai dinamis - gunakan nilai statik dulu
  const [lastDataUpdate, setLastDataUpdate] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  // FIX 1: Update nilai lastDataUpdate setelah mount
  useEffect(() => {
    setLastDataUpdate(Date.now());
  }, []);

  // Animation variants (unchanged)
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
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const cardVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 },
    },
  };

  // Refresh token periodically to prevent automatic logout
  useEffect(() => {
    if (!loading && user && user.role === "admin") {
      // Refresh token every 10 minutes
      const tokenRefreshInterval = setInterval(() => {
        refreshToken();
      }, 10 * 60 * 1000);

      return () => clearInterval(tokenRefreshInterval);
    }
  }, [user, isLoading, refreshToken]);

  // Fix issue with dependencies order - move safeApiGet first
  const safeApiGet = useCallback(
    async (url) => {
      try {
        const response = await api.get(url);
        return response;
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);

        // Handle 401 Unauthorized - redirect to login
        if (error.response && error.response.status === 401) {
          router.push("/login");
          return { data: { success: false, error: "Session expired" } };
        }

        // Handle 429 Too Many Requests
        if (error.response && error.response.status === 429) {
          return {
            data: {
              success: false,
              error: "Rate limit exceeded. Please try again later.",
            },
          };
        }

        return { data: { success: false, error: error.message } };
      }
    },
    [router]
  );

  // Define fetchDashboardData - first function to be defined
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch the dashboard stats first
      const statsResponse = await api.get("/api/admin/dashboard/stats");
      if (statsResponse.data && statsResponse.data.success) {
        const data = statsResponse.data.data;
        setStats({
          totalUsers: data.users?.total || 0,
          activeGuides: data.guides?.active || 0,
          totalGuides: data.guides?.total || 0,
          totalTrips: data.trips?.total || 0,
          averageRating: data.ratings?.average || 0,
          pendingApprovals: data.guides?.pending || 0,
          totalMountains: data.mountains?.total || 0,
          pendingWithdrawals: data.finance?.pending_withdrawals || 0,
          totalRevenue: data.finance?.total_revenue || 0,
          completedBookings: data.bookings?.completed || 0,
          newUsersToday: data.users?.new_today || 0,
          newBookingsToday: data.bookings?.new_today || 0,
        });
      }

      // Fetch pending guides
      const pendingGuidesResponse = await api.get("/api/admin/guides/pending");
      if (pendingGuidesResponse.data && pendingGuidesResponse.data.success) {
        setPendingGuides(pendingGuidesResponse.data.data || []);
      }

      // Fetch pending withdrawals
      const pendingWithdrawalsResponse = await api.get(
        "/api/admin/withdrawals/pending"
      );
      if (
        pendingWithdrawalsResponse.data &&
        pendingWithdrawalsResponse.data.success
      ) {
        setPendingWithdrawals(pendingWithdrawalsResponse.data.data || []);
      }

      // Fetch recent users
      const recentUsersResponse = await api.get("/api/admin/users/recent");
      if (recentUsersResponse.data && recentUsersResponse.data.success) {
        setRecentUsers(recentUsersResponse.data.data || []);
      }

      setLastDataUpdate(new Date());
      setIsLoading(false);
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
      setIsLoading(false);
    }
  }, []);

  // Then define the other fetch functions
  const fetchMountainStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLastRefreshTime(Date.now());

      console.log("Fetching mountain statistics with date range:", dateRange);

      const response = await api.get("/api/admin/statistics/mountains", {
        params: {
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        },
      });

      console.log("Mountain statistics API response:", response.data);

      if (response.data && response.data.success) {
        setMountainStats({
          mountains: response.data.data.mountains || [],
          mountainTrends: response.data.data.mountainTrends || [],
          topMountains: response.data.data.topMountains || [],
        });

        setLastDataUpdate(new Date());
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching mountain statistics:", error);
      setError("Failed to load mountain statistics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const fetchUserStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLastRefreshTime(Date.now());

      console.log("Fetching user statistics with date range:", dateRange);

      const response = await api.get("/api/admin/statistics/users", {
        params: {
          start_date: dateRange.startDate,
          end_date: dateRange.endDate,
        },
      });

      console.log("User statistics API response:", response.data);

      if (response.data && response.data.success) {
        if (response.data.data.registrationsByMonth) {
          setUserStats({
            registrationsByMonth: response.data.data.registrationsByMonth || [],
            activeUsers: response.data.data.activeUsers || [],
            bookingPatterns: {
              byHour: response.data.data.bookingPatterns?.byHour || [],
              byDay: response.data.data.bookingPatterns?.byDay || [],
            },
            userSegmentation: response.data.data.userSegmentation || {},
            summary: response.data.data.summary || {
              totalUsers: 0,
              totalGuides: 0,
              newUsersThisMonth: 0,
              activeUsersThisMonth: 0,
            },
          });
        } else {
          const sampleData = generateUserStatisticsSampleData(dateRange);
          setUserStats(sampleData);
        }

        setLastDataUpdate(new Date());
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      setError("Failed to load user statistics. Using sample data instead.");

      const sampleData = generateUserStatisticsSampleData(dateRange);
      setUserStats(sampleData);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  // Update handleTabChange to immediately load data for the selected tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);

    // Force data refresh when switching tabs
    if (tab === "overview") {
      fetchDashboardData();
    } else if (tab === "mountains") {
      fetchMountainStatistics();
    } else if (tab === "users") {
      fetchUserStatistics();
    }
  };

  // Now our useEffect can use the functions without circular references
  useEffect(() => {
    // Initial data load based on active tab
    if (activeTab === "overview") {
      fetchDashboardData();
    } else if (activeTab === "mountains") {
      fetchMountainStatistics();
    } else if (activeTab === "users") {
      fetchUserStatistics();
    }

    // Auto refresh if enabled
    let intervalId;
    if (autoRefreshEnabled) {
      intervalId = setInterval(() => {
        if (activeTab === "overview") {
          fetchDashboardData();
        } else if (activeTab === "mountains") {
          fetchMountainStatistics();
        } else if (activeTab === "users") {
          fetchUserStatistics();
        }
      }, 60000); // Refresh every minute
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    fetchDashboardData,
    fetchMountainStatistics,
    fetchUserStatistics,
    autoRefreshEnabled,
    activeTab,
  ]);

  // Manual refresh handler with cooldown
  const handleRefresh = () => {
    const now = Date.now();
    const cooldownPeriod = 5000; // 5 seconds cooldown

    if (isLoading) {
      return; // Prevent multiple refreshes while loading
    }

    if (now - lastRefreshTime < cooldownPeriod) {
      alert(
        `Harap tunggu ${Math.ceil(
          (cooldownPeriod - (now - lastRefreshTime)) / 1000
        )} detik sebelum refresh kembali`
      );
      return;
    }

    setLastRefreshTime(now);
    setError(null);

    // Force a complete refresh of data based on active tab
    if (activeTab === "mountains") {
      fetchMountainStatistics();
    } else if (activeTab === "users") {
      fetchUserStatistics();
    } else {
      setDataFetched(false);
      fetchDashboardData();
    }
  };

  // Handle guide approval
  const handleApproveGuide = async (guideId) => {
    try {
      const response = await api.post(`/api/admin/guides/${guideId}/approve`);
      if (response.data.success) {
        // Remove the approved guide from the pending list
        setPendingGuides(pendingGuides.filter((guide) => guide.id !== guideId));
        // Update stats
        setStats((prev) => ({
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
          activeGuides: prev.activeGuides + 1,
        }));
        // Refresh notifications
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error approving guide:", error);
      alert("Failed to approve guide. Please try again.");
    }
  };

  // Handle withdrawal approval
  const handleApproveWithdrawal = async (withdrawalId) => {
    try {
      const response = await api.post(
        `/api/admin/withdrawals/${withdrawalId}/approve`
      );
      if (response.data.success) {
        // Remove the approved withdrawal from the pending list
        setPendingWithdrawals(
          pendingWithdrawals.filter(
            (withdrawal) => withdrawal.id !== withdrawalId
          )
        );
        // Update stats
        setStats((prev) => ({
          ...prev,
          pendingWithdrawals: Math.max(0, prev.pendingWithdrawals - 1),
        }));
        // Refresh notifications
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      alert("Failed to approve withdrawal. Please try again.");
    }
  };

  // Handle withdrawal rejection
  const handleRejectWithdrawal = async (withdrawalId, reason) => {
    try {
      const response = await api.post(
        `/api/admin/withdrawals/${withdrawalId}/reject`,
        {
          reason: reason || "Ditolak oleh admin",
        }
      );

      if (response.data.success) {
        // Remove the rejected withdrawal from the pending list
        setPendingWithdrawals(
          pendingWithdrawals.filter(
            (withdrawal) => withdrawal.id !== withdrawalId
          )
        );
        // Update stats
        setStats((prev) => ({
          ...prev,
          pendingWithdrawals: Math.max(0, prev.pendingWithdrawals - 1),
        }));
        // Refresh notifications
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      alert("Failed to reject withdrawal. Please try again.");
    }
  };

  // Add this function to handle analytics data fetching
  const fetchAnalyticsData = async (period = "30days") => {
    try {
      const response = await api.get(
        `/api/admin/dashboard/analytics?period=${period}`
      );
      if (response.data.success) {
        // Process analytics data here
        return response.data.data;
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      return null;
    }
  };

  // Add useEffect to load data when tabs change
  useEffect(() => {
    if (activeTab === "mountains" && !mountainStats.mountains.length) {
      fetchMountainStatistics();
    } else if (
      activeTab === "users" &&
      !userStats.registrationsByMonth.length
    ) {
      fetchUserStatistics();
    }
  }, [
    activeTab,
    mountainStats.mountains.length,
    userStats.registrationsByMonth.length,
    fetchMountainStatistics,
    fetchUserStatistics,
  ]);

  // Add a function to handle date range changes
  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const applyDateFilter = () => {
    if (activeTab === "mountains") {
      fetchMountainStatistics();
    } else if (activeTab === "users") {
      fetchUserStatistics();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    router.push("/login");
    return null;
  }

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(angka)
      .replace("IDR", "Rp")
      .replace(/\./g, ",")
      .replace(/,/g, ".");
  };

  // Menampilkan growth rate yang benar
  const growthRate =
    userStats.summary && userStats.summary.growthRate
      ? userStats.summary.growthRate.toFixed(1)
      : "0.0";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-4 md:p-8 lg:p-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Admin
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola aplikasi dan pantau aktivitas pengguna
            </p>
          </motion.div>

          {/* Error message if any */}
          {error && (
            <motion.div
              variants={itemVariants}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
            >
              <p>{error}</p>
              <button
                onClick={handleRefresh}
                className="text-red-700 font-medium underline mt-1"
              >
                Coba lagi
              </button>
            </motion.div>
          )}

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm mb-8 p-1"
          >
            <div className="flex space-x-2">
              <button
                onClick={() => handleTabChange("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => handleTabChange("mountains")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "mountains"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Statistik Gunung
              </button>

              <button
                onClick={() => handleTabChange("users")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "users"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Statistik Pengguna
              </button>
            </div>
          </motion.div>

          {/* Date Range Filter - Only show for statistics tabs */}
          {(activeTab === "mountains" || activeTab === "users") && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm mb-8 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 md:mb-0">
                  Filter Rentang Waktu
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={dateRange.startDate}
                      onChange={handleDateRangeChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tanggal Akhir
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={dateRange.endDate}
                      onChange={handleDateRangeChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="self-end">
                    <button
                      onClick={applyDateFilter}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                    >
                      Terapkan Filter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Content based on active tab */}
            {activeTab === "overview" ? (
              <>
                {/* Overview content */}
                <div className="lg:col-span-2">
                  {/* Summary Card */}
                  <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold flex items-center">
                          <FiActivity className="mr-2 text-2xl" />
                          Ringkasan Platform
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                        >
                          <p className="text-white/80 text-sm mb-1">
                            Total Pengguna
                          </p>
                          <motion.p
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.2,
                              type: "spring",
                              stiffness: 100,
                            }}
                          >
                            {stats.totalUsers || 0}
                          </motion.p>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                        >
                          <p className="text-white/80 text-sm mb-1">
                            Total Trip
                          </p>
                          <motion.p
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.3,
                              type: "spring",
                              stiffness: 100,
                            }}
                          >
                            {stats.totalTrips || 0}
                          </motion.p>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                        >
                          <p className="text-white/80 text-sm mb-1">
                            Penyedia Trip
                          </p>
                          <motion.p
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.4,
                              type: "spring",
                              stiffness: 100,
                            }}
                          >
                            {stats.totalGuides || 0}
                          </motion.p>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                        >
                          <p className="text-white/80 text-sm mb-1">
                            Total Pendapatan
                          </p>
                          <motion.p
                            className="text-2xl font-bold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.5,
                              type: "spring",
                              stiffness: 100,
                            }}
                          >
                            {formatRupiah(stats.totalRevenue || 0)}
                          </motion.p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                  {/* Stats Grid */}
                  <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">
                          Gunung
                        </h3>
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FiMap className="text-green-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.totalMountains || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Destinasi</p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">
                          Pemesanan
                        </h3>
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FiCalendar className="text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.completedBookings || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Selesai</p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">
                          Persetujuan
                        </h3>
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <FiCheckCircle className="text-yellow-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.pendingApprovals || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Menunggu</p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">
                          Rating
                        </h3>
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <FiStar className="text-purple-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.averageRating?.toFixed(1) || "0.0"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Rata-rata</p>
                    </motion.div>
                  </motion.div>

                  {/* Pending Guides List */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm p-6 mb-8"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiUsers className="mr-2 text-blue-500" />
                      Guide Menunggu Persetujuan
                    </h2>

                    <div className="space-y-3">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : pendingGuides && pendingGuides.length > 0 ? (
                        pendingGuides.slice(0, 3).map((guide) => (
                          <div
                            key={guide.id}
                            className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-600 font-medium">
                                    {guide.name ? guide.name.charAt(0) : "G"}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {guide.name || "Unnamed Guide"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {guide.email || "No email"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveGuide(guide.id)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                >
                                  Setujui
                                </button>
                                <Link href={`/admin/guides/${guide.id}`}>
                                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm transition-colors">
                                    Detail
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                          Tidak ada guide yang menunggu persetujuan
                        </div>
                      )}

                      {pendingGuides && pendingGuides.length > 0 && (
                        <div className="mt-2 text-center">
                          <Link
                            href="/admin/guides/approval"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Lihat semua persetujuan (
                            {stats.pendingApprovals || 0})
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Pending Withdrawals */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm p-6 mb-8"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <RiMoneyDollarCircleLine className="mr-2 text-green-500" />
                      Penarikan Dana Tertunda
                    </h2>

                    <div className="space-y-3">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                      ) : pendingWithdrawals &&
                        pendingWithdrawals.length > 0 ? (
                        pendingWithdrawals.slice(0, 3).map((withdrawal) => (
                          <div
                            key={withdrawal.id}
                            className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-800">
                                  {withdrawal.guide_name || "Unnamed Guide"}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <span className="mr-2">
                                    {withdrawal.bank_name || "No bank info"}
                                  </span>
                                  <span>
                                    {withdrawal.account_number ||
                                      "No account number"}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">
                                  Rp {(withdrawal.amount || 0).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {withdrawal.created_at
                                    ? new Date(
                                        withdrawal.created_at
                                      ).toLocaleDateString("id-ID")
                                    : "No date"}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end space-x-2">
                              <button
                                onClick={() =>
                                  handleApproveWithdrawal(withdrawal.id)
                                }
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt("Alasan penolakan:");
                                  if (reason)
                                    handleRejectWithdrawal(
                                      withdrawal.id,
                                      reason
                                    );
                                }}
                                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-xs transition-colors"
                              >
                                Tolak
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                          Tidak ada penarikan dana tertunda
                        </div>
                      )}

                      {pendingWithdrawals && pendingWithdrawals.length > 0 && (
                        <div className="mt-2 text-center">
                          <Link
                            href="/admin/withdrawals"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Lihat semua penarikan dana (
                            {stats.pendingWithdrawals || 0})
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Recent Users */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm p-6 mb-8"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiUsers className="mr-2 text-indigo-500" />
                      Pengguna Terbaru
                    </h2>

                    <div className="space-y-3">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                      ) : recentUsers && recentUsers.length > 0 ? (
                        recentUsers.slice(0, 5).map((user) => (
                          <div
                            key={user.id}
                            className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-indigo-600 font-medium">
                                    {user.name ? user.name.charAt(0) : "U"}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">
                                    {user.name || "Unnamed User"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {user.email || "No email"}
                                  </p>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.created_at
                                  ? new Date(
                                      user.created_at
                                    ).toLocaleDateString("id-ID")
                                  : "No date"}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                          Tidak ada data pengguna terbaru
                        </div>
                      )}

                      <div className="mt-2 text-center">
                        <Link
                          href="/admin/users"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Lihat semua pengguna
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="lg:col-span-1">
                  {/* Notifications */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm p-6 mb-8"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiBell className="mr-2 text-orange-500" />
                      Notifikasi
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </h2>

                    <div className="space-y-3">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                      ) : notifications &&
                        Array.isArray(notifications) &&
                        notifications.length > 0 ? (
                        notifications.slice(0, 4).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg border ${
                              notification.is_read
                                ? "border-gray-100"
                                : "border-blue-100 bg-blue-50"
                            } hover:bg-gray-50 transition-colors cursor-pointer`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                                <FiAlertCircle className="text-orange-500" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800">
                                  {notification.message || "No message"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.created_at
                                    ? formatDistanceToNow(
                                        new Date(notification.created_at),
                                        { addSuffix: true, locale: id }
                                      )
                                    : "No date"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                          Tidak ada notifikasi
                        </div>
                      )}

                      {notifications &&
                        Array.isArray(notifications) &&
                        notifications.length > 0 && (
                          <div className="mt-4 flex justify-between">
                            <button
                              onClick={markAllAsRead}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Tandai semua telah dibaca
                            </button>
                            <Link
                              href="/admin/notifications"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Lihat semua
                            </Link>
                          </div>
                        )}
                    </div>
                  </motion.div>

                  {/* Quick Access */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-xl shadow-sm p-6 mb-8"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Akses Cepat
                    </h2>

                    <div className="space-y-2">
                      <Link href="/admin/guides/approval">
                        <motion.div
                          whileHover="hover"
                          variants={cardVariants}
                          className="p-3 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors flex items-center"
                        >
                          <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <FiUsers className="text-blue-600" />
                          </div>
                          <span className="text-gray-800">
                            Persetujuan Guide
                          </span>
                        </motion.div>
                      </Link>

                      <Link href="/admin/withdrawals">
                        <motion.div
                          whileHover="hover"
                          variants={cardVariants}
                          className="p-3 rounded-lg border border-gray-100 hover:bg-green-50 transition-colors flex items-center"
                        >
                          <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <RiMoneyDollarCircleLine className="text-green-600" />
                          </div>
                          <span className="text-gray-800">Penarikan Dana</span>
                        </motion.div>
                      </Link>

                      <Link href="/admin/mountains">
                        <motion.div
                          whileHover="hover"
                          variants={cardVariants}
                          className="p-3 rounded-lg border border-gray-100 hover:bg-purple-50 transition-colors flex items-center"
                        >
                          <div className="bg-purple-100 p-2 rounded-lg mr-3">
                            <FiMap className="text-purple-600" />
                          </div>
                          <span className="text-gray-800">Kelola Gunung</span>
                        </motion.div>
                      </Link>

                      <Link href="/admin/suspended-guides">
                        <motion.div
                          whileHover="hover"
                          variants={cardVariants}
                          className="p-3 rounded-lg border border-gray-100 hover:bg-red-50 transition-colors flex items-center"
                        >
                          <div className="bg-red-100 p-2 rounded-lg mr-3">
                            <FiAlertCircle className="text-red-600" />
                          </div>
                          <span className="text-gray-800">Guide Disuspend</span>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </>
            ) : activeTab === "mountains" ? (
              // Tab Statistik Gunung - Menggunakan komponen chart yang diimpor
              <div className="lg:col-span-3">
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6 mb-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <FiMapPin className="mr-2 text-blue-600" />
                      Statistik Gunung
                    </h2>

                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-500">
                        Terakhir diperbarui:{" "}
                        {new Date(lastDataUpdate).toLocaleTimeString()}
                      </p>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={autoRefreshEnabled}
                            onChange={() =>
                              setAutoRefreshEnabled(!autoRefreshEnabled)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            Auto-refresh
                          </span>
                        </label>
                      </div>
                      <button
                        onClick={handleRefresh}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        Refresh
                      </button>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      {/* Filter untuk jenis data */}
                      <div className="mb-6 flex flex-wrap gap-2">
                        <button
                          onClick={() => setMountainViewMode("trends")}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            mountainViewMode === "trends"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Tren Pengunjung
                        </button>

                        <button
                          onClick={() => setMountainViewMode("revenue")}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            mountainViewMode === "revenue"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Pendapatan
                        </button>

                        <button
                          onClick={() => setMountainViewMode("comparison")}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            mountainViewMode === "comparison"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Perbandingan
                        </button>
                      </div>

                      {/* Main Chart - Spline chart untuk gunung */}
                      <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          {mountainViewMode === "trends" &&
                            "Tren Kunjungan Gunung"}
                          {mountainViewMode === "revenue" &&
                            "Pendapatan Per Gunung"}
                          {mountainViewMode === "comparison" &&
                            "Perbandingan Gunung"}
                        </h3>

                        <div className="h-[500px]">
                          {mountainStats.mountainTrends.length > 0 && (
                            <MountainStatsChart
                              mountainStats={mountainStats}
                              viewMode={mountainViewMode}
                              height="500px"
                            />
                          )}
                        </div>
                      </div>

                      {/* Interaktif Stat Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {mountainStats.topMountains
                          .slice(0, 6)
                          .map((mountain, index) => (
                            <motion.div
                              key={mountain.id || index}
                              whileHover={{ scale: 1.03, translateY: -5 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-800">
                                    {mountain.name}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {mountain.location}
                                  </p>
                                </div>
                                <div
                                  className={`text-xs px-2 py-1 rounded-full 
                                ${
                                  mountain.difficulty === "mudah"
                                    ? "bg-green-100 text-green-800"
                                    : mountain.difficulty === "menengah"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                                >
                                  {mountain.difficulty || "Tidak diketahui"}
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                <div className="flex-1 bg-blue-50 p-2 rounded-lg">
                                  <p className="text-xs text-blue-600 mb-1">
                                    Total Trip
                                  </p>
                                  <p className="font-bold text-gray-800">
                                    {mountain.trip_count}
                                  </p>
                                </div>
                                <div className="flex-1 bg-green-50 p-2 rounded-lg">
                                  <p className="text-xs text-green-600 mb-1">
                                    Pendapatan
                                  </p>
                                  <p className="font-bold text-gray-800">
                                    Rp{" "}
                                    {Intl.NumberFormat("id").format(
                                      mountain.revenue || 0
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="h-[60px] opacity-75">
                                {mountain.trend_data?.length > 0 && (
                                  <ReactApexChart
                                    options={{
                                      chart: {
                                        type: "line",
                                        sparkline: {
                                          enabled: true,
                                        },
                                        animations: {
                                          enabled: true,
                                          speed: 350,
                                        },
                                      },
                                      stroke: {
                                        curve: "smooth",
                                        width: 2,
                                      },
                                      colors: ["#3B82F6"],
                                      tooltip: {
                                        fixed: {
                                          enabled: false,
                                        },
                                        x: {
                                          show: false,
                                        },
                                        y: {
                                          title: {
                                            formatter: () => "Jumlah:",
                                          },
                                          formatter: (val) => val,
                                        },
                                        marker: {
                                          show: false,
                                        },
                                      },
                                    }}
                                    series={[
                                      {
                                        name: "Trend",
                                        data: mountain.trend_data || [
                                          0, 0, 0, 0, 0, 0,
                                        ],
                                      },
                                    ]}
                                    type="line"
                                    height="100%"
                                  />
                                )}
                              </div>
                            </motion.div>
                          ))}
                      </div>

                      {/* Interactive Metrics Summary */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg mb-6">
                        <div className="flex flex-wrap justify-between items-center mb-5">
                          <h3 className="text-lg font-semibold">
                            Ringkasan Statistik
                          </h3>
                          <div className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                            {dateRange.startDate} - {dateRange.endDate}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                            <h4 className="text-sm text-white/80">
                              Gunung Terpopuler
                            </h4>
                            <p className="text-xl font-semibold mt-1">
                              {mountainStats.topMountains[0]?.name ||
                                "Tidak ada data"}
                            </p>
                            <div className="flex items-center text-xs text-white/70 mt-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>
                              {mountainStats.topMountains[0]?.trip_count || 0}{" "}
                              trips
                            </div>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                            <h4 className="text-sm text-white/80">
                              Total Pendapatan
                            </h4>
                            <p className="text-xl font-semibold mt-1">
                              {formatRupiah(
                                mountainStats.topMountains.reduce(
                                  (sum, m) => sum + (m.revenue || 0),
                                  0
                                )
                              )}
                            </p>
                            <div className="flex items-center text-xs text-white/70 mt-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>
                              Dari {mountainStats.topMountains.length} gunung
                            </div>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                            <h4 className="text-sm text-white/80">
                              Total Kunjungan
                            </h4>
                            <p className="text-xl font-semibold mt-1">
                              {mountainStats.topMountains.reduce(
                                (sum, m) => sum + (m.trip_count || 0),
                                0
                              )}
                            </p>
                            <div className="flex items-center text-xs text-white/70 mt-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1"></span>
                              Semua perjalanan
                            </div>
                          </div>

                          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                            <h4 className="text-sm text-white/80">
                              Rata-rata Perjalanan
                            </h4>
                            <p className="text-xl font-semibold mt-1">
                              {mountainStats.topMountains.length > 0
                                ? (
                                    mountainStats.topMountains.reduce(
                                      (sum, m) => sum + (m.trip_count || 0),
                                      0
                                    ) / mountainStats.topMountains.length
                                  ).toFixed(1)
                                : "0"}
                            </p>
                            <div className="flex items-center text-xs text-white/70 mt-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1"></span>
                              Per gunung
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            ) : (
              // Tab Statistik Pengguna
              <div className="lg:col-span-3">
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm p-6 mb-8"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <FiUserPlus className="mr-2 text-indigo-600" />
                      Statistik Pengguna
                    </h2>

                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-500">
                        Terakhir diperbarui:{" "}
                        {new Date(lastDataUpdate).toLocaleTimeString()}
                      </p>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={autoRefreshEnabled}
                            onChange={() =>
                              setAutoRefreshEnabled(!autoRefreshEnabled)
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          <span className="ml-3 text-sm font-medium text-gray-700">
                            Auto-refresh
                          </span>
                        </label>
                      </div>
                      <button
                        onClick={handleRefresh}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          ></path>
                        </svg>
                        Refresh
                      </button>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : (
                    <>
                      {/* Filter untuk jenis data */}
                      <div className="mb-6 flex flex-wrap gap-2">
                        <button
                          onClick={() => setUserViewMode("registrations")}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            userViewMode === "registrations"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Pendaftaran
                        </button>

                        <button
                          onClick={() => setUserViewMode("activity")}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            userViewMode === "activity"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Aktivitas
                        </button>
                      </div>

                      {/* Main Chart - Area chart untuk pengguna */}
                      <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          {userViewMode === "registrations" &&
                            "Tren Pendaftaran Pengguna"}
                          {userViewMode === "activity" && "Aktivitas Pengguna"}
                          {userViewMode === "segmentation" &&
                            "Segmentasi Pengguna"}
                          {userViewMode === "booking" && "Pola Pemesanan"}
                        </h3>

                        <div className="h-[500px]">
                          {userViewMode === "registrations" && (
                            <UserStatsChart
                              data={userStats.registrationsByMonth}
                              activeUsers={userStats.activeUsers}
                              viewMode="registrations"
                            />
                          )}

                          {userViewMode === "activity" && (
                            <UserStatsChart
                              data={userStats.registrationsByMonth}
                              activeUsers={userStats.activeUsers}
                              viewMode="activity"
                            />
                          )}

                          {userViewMode === "segmentation" && (
                            <UserSegmentationChart
                              data={userStats.userSegmentation}
                            />
                          )}

                          {userViewMode === "booking" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="h-[400px]">
                                <h4 className="text-sm font-medium text-gray-600 mb-3">
                                  Pemesanan Berdasarkan Jam
                                </h4>
                                <BookingHoursChart
                                  data={userStats.bookingPatterns.byHour}
                                />
                              </div>
                              <div className="h-[400px]">
                                <h4 className="text-sm font-medium text-gray-600 mb-3">
                                  Pemesanan Berdasarkan Hari
                                </h4>
                                <BookingDaysChart
                                  data={userStats.bookingPatterns.byDay}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* User Stats Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-indigo-100 p-2 rounded-full">
                              <FiUsers className="text-indigo-600 text-lg" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Total Pengguna
                            </h3>
                          </div>
                          <p className="text-2xl font-semibold text-gray-800">
                            {userStats.summary.totalUsers.toLocaleString()}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <FiTrendingUp className="text-green-500 mr-1" />
                            <span>
                              +{userStats.summary.newUsersThisMonth} bulan ini
                            </span>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <FiActivity className="text-blue-600 text-lg" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Pengguna Aktif
                            </h3>
                          </div>
                          <p className="text-2xl font-semibold text-gray-800">
                            {userStats.summary.activeUsersThisMonth.toLocaleString()}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>
                              {Math.round(
                                (userStats.summary.activeUsersThisMonth /
                                  Math.max(1, userStats.summary.totalUsers)) *
                                  100
                              )}
                              % dari total
                            </span>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-green-100 p-2 rounded-full">
                              <FiUserPlus className="text-green-600 text-lg" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Guide
                            </h3>
                          </div>
                          <p className="text-2xl font-semibold text-gray-800">
                            {userStats.summary.totalGuides.toLocaleString()}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>
                              {Math.round(
                                (userStats.summary.totalGuides /
                                  Math.max(1, userStats.summary.totalUsers)) *
                                  100
                              )}
                              % dari pengguna
                            </span>
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-purple-100 p-2 rounded-full">
                              <FiUsers className="text-purple-600 text-lg" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Pengguna Baru
                            </h3>
                          </div>
                          <p className="text-2xl font-semibold text-gray-800">
                            {userStats.summary.newUsersThisMonth.toLocaleString()}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>Bergabung bulan ini</span>
                          </div>
                        </motion.div>
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Page;
