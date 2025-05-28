"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiStar,
  FiActivity,
  FiAlertCircle,
  FiBell,
} from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import api from "@/utils/axios";
import { earningsService } from "@/services/earningsService";
import Link from "next/link";
// Import recharts components
import {
  ResponsiveContainer,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";

function GuideDashboard() {
  const [stats, setStats] = useState({
    total_trips: 0,
    total_customers: 0,
    completed_trips: 0,
    rating: 0,
    total_reviews: 0,
    total_earnings: 0,
    pending_earnings: 0,
    available_balance: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("month");
  const [statisticsData, setStatisticsData] = useState({
    earnings: [],
    trips: { completed: 0, ongoing: 0, upcoming: 0, cancelled: 0 },
    customerGrowth: [],
    ratings: [],
    totalStats: {
      totalEarnings: 0,
      totalTrips: 0,
      averageRating: 0,
      totalCustomers: 0,
    },
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Pindahkan fungsi fetchStatisticsData ke sini (sebelum semua hooks dan conditional rendering)
  const fetchStatisticsData = async () => {
    console.log("fetchStatisticsData called, active tab:", activeTab);
    try {
      setIsStatsLoading(true);
      const token = localStorage.getItem("token");

      // 1. Fetch trips data for statistics
      const tripsResponse = await api.get("/api/guide/trips", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const trips = tripsResponse.data.success ? tripsResponse.data.data : [];

      // 2. Prepare trip status counts
      const tripStatusCounts = {
        completed: trips.filter(
          (trip) => trip.status === "closed" || trip.status === "completed"
        ).length,
        ongoing: trips.filter((trip) => trip.status === "active").length,
        upcoming: trips.filter((trip) => trip.status === "open").length,
        cancelled: trips.filter((trip) => trip.status === "cancelled").length,
      };

      // 3. Fetch bookings to get customer data
      const bookingsResponse = await api.get("/api/guide/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bookings = bookingsResponse.data.success
        ? bookingsResponse.data.data
        : [];

      // 4. Extract unique customer IDs
      const customerIds = new Set();
      bookings.forEach((booking) => {
        if (booking.user_id) {
          customerIds.add(booking.user_id);
        }
      });

      // 5. Generate monthly earnings data based on time range
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Okt",
        "Nov",
        "Dec",
      ];

      // Initialize earnings data
      const earningsData = months.map((month) => ({ name: month, amount: 0 }));

      // Populate earnings data from bookings
      bookings.forEach((booking) => {
        if (booking.payment && booking.payment.status === "paid") {
          const date = new Date(
            booking.payment.paid_at || booking.payment.created_at
          );
          const monthIdx = date.getMonth();
          earningsData[monthIdx].amount += booking.payment.amount || 0;
        }
      });

      // 6. Generate customer growth data (cumulative)
      const customerGrowth = months.map((month) => ({
        name: month,
        totalCustomers: 0,
      }));
      const customersByMonth = Array(12)
        .fill()
        .map(() => new Set());

      bookings.forEach((booking) => {
        if (booking.created_at) {
          const date = new Date(booking.created_at);
          const monthIdx = date.getMonth();
          if (booking.user_id) {
            customersByMonth[monthIdx].add(booking.user_id);
          }
        }
      });

      // Make it cumulative
      let totalCustomers = 0;
      customersByMonth.forEach((customers, idx) => {
        totalCustomers += customers.size;
        customerGrowth[idx].totalCustomers = totalCustomers;
      });

      // 7. Generate rating data
      const ratingsResponse = await api.get("/api/guide/refresh-ratings", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ratingsData = months.map((month) => ({ name: month, rating: 0 }));

      if (ratingsResponse.data.success && ratingsResponse.data.data.ratings) {
        const ratings = ratingsResponse.data.data.ratings;
        const ratingsByMonth = Array(12)
          .fill()
          .map(() => ({ count: 0, total: 0 }));

        ratings.forEach((rating) => {
          if (rating.created_at) {
            const date = new Date(rating.created_at);
            const monthIdx = date.getMonth();
            ratingsByMonth[monthIdx].count++;
            ratingsByMonth[monthIdx].total += rating.rating;
          }
        });

        ratingsByMonth.forEach((data, idx) => {
          if (data.count > 0) {
            ratingsData[idx].rating = data.total / data.count;
          }
        });
      }

      // 8. Set statistics data
      setStatisticsData({
        earnings: earningsData,
        trips: tripStatusCounts,
        customerGrowth: customerGrowth,
        ratings: ratingsData,
        totalStats: {
          totalEarnings: stats.total_earnings || 0,
          totalTrips: trips.length,
          averageRating: stats.rating || 0,
          totalCustomers: customerIds.size,
        },
      });
    } catch (error) {
      console.error("Error fetching statistics data:", error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Lanjutkan dengan useEffect dan kode lainnya
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch trip data untuk memastikan data yang akurat
        try {
          const tripResponse = await api.get("/api/guide/trips", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (tripResponse.data.success) {
            const trips = tripResponse.data.data;
            const completedTrips = trips.filter(
              (trip) => trip.status === "completed"
            ).length;

            setStats((prevStats) => ({
              ...prevStats,
              total_trips: trips.length,
              completed_trips: completedTrips,
            }));
          }
        } catch (err) {
          console.error("Error fetching trip data:", err);
        }

        // Fetch dashboard data
        const response = await api.get("/api/guide/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Pastikan data statistik tersedia
        if (response.data && response.data.stats) {
          // Gunakan data dari dashboard API, tapi prioritaskan data trip yang baru saja diambil
          setStats((prevStats) => ({
            ...response.data.stats,
            total_trips: prevStats.total_trips,
            completed_trips: prevStats.completed_trips,
          }));
        }

        // Pastikan data notifikasi tersedia
        setNotifications(response.data.notifications || []);

        // Fetch earnings data
        try {
          const earningsData = await earningsService.getEarningsSummary();
          if (earningsData.success) {
            setStats((prevStats) => ({
              ...prevStats,
              total_earnings: earningsData.data.total_earnings,
              pending_earnings: earningsData.data.pending_earnings,
              available_balance: earningsData.data.available_balance,
            }));
          }
        } catch (err) {
          console.error("Error fetching earnings data:", err);
        }

        // Fetch ratings data - menggunakan endpoint yang sudah diperbaiki
        try {
          const ratingsResponse = await api.get("/api/guide/refresh-ratings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (ratingsResponse.data.success) {
            setStats((prevStats) => ({
              ...prevStats,
              rating: ratingsResponse.data.data.average_rating || 0,
              total_reviews: ratingsResponse.data.data.ratings_count || 0,
            }));
          }
        } catch (err) {
          console.error("Error fetching ratings data:", err);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Perbarui useEffect untuk memastikan data statistik dimuat dengan benar
  useEffect(() => {
    if (activeTab === "statistics" && !isLoading) {
      console.log("Fetching statistics data from useEffect");
      fetchStatisticsData();
    }
  }, [activeTab, isLoading, timeRange]); // Tambahkan timeRange sebagai dependency

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return "Baru Saja";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Kemarin";
    } else {
      return date.toLocaleDateString("id-ID", {
        month: "long",
        day: "numeric",
      });
    }
  };

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

  const cardVariants = {
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300 },
    },
  };

  // Tambahkan variant animasi untuk tab switching
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar spacing - hidden on mobile, visible on md screens and up */}

      {/* Main content area with padding */}
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
              Selamat Datang, Guide!
            </h1>
            <p className="text-gray-600 mt-2">
              Kelola perjalanan dan pantau pendapatan Anda
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm mb-8 p-1"
          >
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setActiveTab("statistics");
                  // Gunakan async/await untuk memastikan state telah diperbarui
                  setTimeout(() => {
                    console.log("Loading statistics data from tab click");
                    fetchStatisticsData();
                  }, 0);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === "statistics"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Statistik
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div
                key="overview"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabContentVariants}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Left Column - Stats */}
                <div className="lg:col-span-2">
                  {/* Earnings Summary Card */}
                  <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg mb-8"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold flex items-center">
                        <RiMoneyDollarCircleLine className="mr-2 text-2xl" />
                        Ringkasan Pendapatan
                      </h2>
                      <Link
                        href="/index-jasa/earnings"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        Kelola Pendapatan
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                      >
                        <p className="text-white/80 text-sm mb-1">
                          Total Pendapatan
                        </p>
                        <p className="text-2xl font-bold">
                          Rp {stats.total_earnings?.toLocaleString() || "0"}
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                      >
                        <p className="text-white/80 text-sm mb-1">
                          Pendapatan Tertunda
                        </p>
                        <p className="text-2xl font-bold">
                          Rp {stats.pending_earnings?.toLocaleString() || "0"}
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                      >
                        <p className="text-white/80 text-sm mb-1">
                          Saldo Tersedia
                        </p>
                        <p className="text-2xl font-bold">
                          Rp {stats.available_balance?.toLocaleString() || "0"}
                        </p>
                      </motion.div>
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
                          Total Trip
                        </h3>
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FiActivity className="text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.total_trips || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Perjalanan</p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">
                          Trip Selesai
                        </h3>
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FiCheckCircle className="text-green-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.completed_trips || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Perjalanan</p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">
                          Total Pendaki
                        </h3>
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <FiUsers className="text-purple-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {stats.total_customers || 0}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Pendaki</p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      whileHover="hover"
                      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 text-sm font-medium">
                          Rating Anda
                        </h3>
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <FiStar className="text-yellow-500" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {(stats.rating || 0).toFixed(1)}/5.0
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        dari {stats.total_reviews || 0} ulasan
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    variants={itemVariants}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Aksi Cepat
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Link href="/index-jasa/trip-jasa/buat-trip">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-blue-50 hover:bg-blue-100 p-4 rounded-xl text-center cursor-pointer transition-all"
                        >
                          <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                            <FiActivity className="text-blue-600 text-xl" />
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            Buat Trip Baru
                          </p>
                        </motion.div>
                      </Link>

                      {/* Perbaikan pada Link component untuk Kelola Trip yang error */}
                      <Link href="/index-jasa/trip-jasa">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-green-50 hover:bg-green-100 p-4 rounded-xl text-center cursor-pointer transition-all"
                        >
                          <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                            <FiCheckCircle className="text-green-600 text-xl" />
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            Kelola Trip
                          </p>
                        </motion.div>
                      </Link>

                      <Link href="/index-jasa/earnings">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-purple-50 hover:bg-purple-100 p-4 rounded-xl text-center cursor-pointer transition-all"
                        >
                          <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                            <RiMoneyDollarCircleLine className="text-purple-600 text-xl" />
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            Tarik Dana
                          </p>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Notifications */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Notifikasi
                      </h3>
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FiBell className="text-blue-600" />
                      </div>
                    </div>

                    {notifications && notifications.length > 0 ? (
                      <div className="space-y-4">
                        {notifications.map((notif, index) => (
                          <motion.div
                            key={notif.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                          >
                            <p className="text-gray-800 text-sm">
                              {notif.message}
                            </p>
                            <div className="flex justify-between mt-2">
                              <p className="text-xs text-gray-500">
                                {formatDate(notif.created_at)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notif.time}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-gray-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                          <FiAlertCircle className="text-gray-400 text-xl" />
                        </div>
                        <p className="text-gray-500 text-sm">
                          Tidak ada notifikasi baru
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* Statistics Content */
              <motion.div
                key="statistics"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabContentVariants}
              >
                <div className="my-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <FiTrendingUp className="mr-2 text-blue-600" />
                        Statistik Pendapatan
                      </h2>

                      <div className="flex space-x-2">
                        <select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                          className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 focus:outline-none"
                        >
                          <option value="month">30 Hari Terakhir</option>
                          <option value="quarter">3 Bulan Terakhir</option>
                          <option value="year">Tahun Ini</option>
                        </select>
                      </div>
                    </div>

                    {isStatsLoading ? (
                      <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <div>
                        {/* Monthly Earnings Chart */}
                        <div className="mb-8">
                          <h3 className="text-md font-semibold text-gray-700 mb-4">
                            Pendapatan Bulanan
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-xl h-80">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={statisticsData.earnings}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <defs>
                                  <linearGradient
                                    id="colorAmount"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="#3B82F6"
                                      stopOpacity={0.8}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="#3B82F6"
                                      stopOpacity={0.1}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#E5E7EB"
                                />
                                <XAxis
                                  dataKey="name"
                                  tick={{ fill: "#6B7280", fontSize: 12 }}
                                  tickLine={false}
                                />
                                <YAxis
                                  tick={{ fill: "#6B7280", fontSize: 12 }}
                                  tickFormatter={(value) =>
                                    `Rp ${value.toLocaleString()}`
                                  }
                                  tickLine={false}
                                />
                                <Tooltip
                                  formatter={(value) => [
                                    `Rp ${value.toLocaleString()}`,
                                    "Pendapatan",
                                  ]}
                                  labelFormatter={(label) => `Bulan ${label}`}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="amount"
                                  stroke="#3B82F6"
                                  strokeWidth={2}
                                  fillOpacity={1}
                                  fill="url(#colorAmount)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Trip Performance */}
                        <div className="mb-8">
                          <h3 className="text-md font-semibold text-gray-700 mb-4">
                            Performa Trip
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Trip Status Distribution */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <h4 className="text-sm font-medium text-gray-600 mb-3">
                                Status Trip
                              </h4>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={[
                                        {
                                          name: "Selesai",
                                          value:
                                            statisticsData.trips.completed || 0,
                                          color: "#10B981",
                                        },
                                        {
                                          name: "Berlangsung",
                                          value:
                                            statisticsData.trips.ongoing || 0,
                                          color: "#3B82F6",
                                        },
                                        {
                                          name: "Mendatang",
                                          value:
                                            statisticsData.trips.upcoming || 0,
                                          color: "#F59E0B",
                                        },
                                        {
                                          name: "Dibatalkan",
                                          value:
                                            statisticsData.trips.cancelled || 0,
                                          color: "#EF4444",
                                        },
                                      ]}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      fill="#8884d8"
                                      paddingAngle={5}
                                      dataKey="value"
                                      label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(
                                          0
                                        )}%`
                                      }
                                    >
                                      {[
                                        { name: "Selesai", color: "#10B981" },
                                        {
                                          name: "Berlangsung",
                                          color: "#3B82F6",
                                        },
                                        { name: "Mendatang", color: "#F59E0B" },
                                        {
                                          name: "Dibatalkan",
                                          color: "#EF4444",
                                        },
                                      ].map((entry, index) => (
                                        <Cell
                                          key={`cell-${index}`}
                                          fill={entry.color}
                                        />
                                      ))}
                                    </Pie>
                                    <Tooltip
                                      formatter={(value) => [
                                        `${value} trip`,
                                        "Jumlah",
                                      ]}
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Customer Growth */}
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <h4 className="text-sm font-medium text-gray-600 mb-3">
                                Pertumbuhan Pelanggan
                              </h4>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={statisticsData.customerGrowth}
                                    margin={{
                                      top: 10,
                                      right: 30,
                                      left: 0,
                                      bottom: 0,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient
                                        id="colorCustomers"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                      >
                                        <stop
                                          offset="5%"
                                          stopColor="#8B5CF6"
                                          stopOpacity={0.8}
                                        />
                                        <stop
                                          offset="95%"
                                          stopColor="#8B5CF6"
                                          stopOpacity={0.1}
                                        />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                      strokeDasharray="3 3"
                                      stroke="#E5E7EB"
                                    />
                                    <XAxis
                                      dataKey="name"
                                      tick={{ fill: "#6B7280", fontSize: 12 }}
                                      tickLine={false}
                                    />
                                    <YAxis
                                      tick={{ fill: "#6B7280", fontSize: 12 }}
                                      tickLine={false}
                                    />
                                    <Tooltip />
                                    <Area
                                      type="monotone"
                                      dataKey="totalCustomers"
                                      stroke="#8B5CF6"
                                      strokeWidth={2}
                                      fillOpacity={1}
                                      fill="url(#colorCustomers)"
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rating Performance */}
                        <div className="mb-8">
                          <h3 className="text-md font-semibold text-gray-700 mb-4">
                            Rating Kinerja
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-xl h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={statisticsData.ratings}
                                margin={{
                                  top: 10,
                                  right: 30,
                                  left: 0,
                                  bottom: 0,
                                }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#E5E7EB"
                                />
                                <XAxis
                                  dataKey="name"
                                  tick={{ fill: "#6B7280", fontSize: 12 }}
                                  tickLine={false}
                                />
                                <YAxis
                                  domain={[0, 5]}
                                  tick={{ fill: "#6B7280", fontSize: 12 }}
                                  tickLine={false}
                                />
                                <Tooltip
                                  formatter={(value) => [`${value}`, "Rating"]}
                                  labelFormatter={(label) => `Bulan ${label}`}
                                />
                                <Bar dataKey="rating" fill="#F59E0B">
                                  {statisticsData.ratings.map(
                                    (entry, index) => (
                                      <Cell
                                        key={`cell-${index}`}
                                        fill={
                                          entry.rating >= 4.5
                                            ? "#10B981"
                                            : entry.rating >= 4
                                            ? "#3B82F6"
                                            : "#F59E0B"
                                        }
                                      />
                                    )
                                  )}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Summary Cards */}
                        <div>
                          <h3 className="text-md font-semibold text-gray-700 mb-4">
                            Ringkasan
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs text-blue-700 font-medium">
                                  Total Pendapatan
                                </h4>
                                <div className="bg-blue-100 rounded-lg p-2">
                                  <RiMoneyDollarCircleLine
                                    className="text-blue-500"
                                    size={16}
                                  />
                                </div>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                Rp{" "}
                                {statisticsData.totalStats.totalEarnings.toLocaleString()}
                              </p>
                            </div>

                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs text-purple-700 font-medium">
                                  Total Trip
                                </h4>
                                <div className="bg-purple-100 rounded-lg p-2">
                                  <FiActivity
                                    className="text-purple-500"
                                    size={16}
                                  />
                                </div>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                {statisticsData.totalStats.totalTrips} Trip
                              </p>
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs text-green-700 font-medium">
                                  Rating Rata-rata
                                </h4>
                                <div className="bg-green-100 rounded-lg p-2">
                                  <FiStar
                                    className="text-green-500"
                                    size={16}
                                  />
                                </div>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                {statisticsData.totalStats.averageRating.toFixed(
                                  1
                                )}
                                /5.0
                              </p>
                            </div>

                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs text-orange-700 font-medium">
                                  Total Pelanggan
                                </h4>
                                <div className="bg-orange-100 rounded-lg p-2">
                                  <FiUsers
                                    className="text-orange-500"
                                    size={16}
                                  />
                                </div>
                              </div>
                              <p className="text-lg font-bold text-gray-900">
                                {statisticsData.totalStats.totalCustomers}{" "}
                                Pendaki
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default GuideDashboard;
