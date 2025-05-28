"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import img from "@/assets/images/Jastrip.png";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiUsers,
  FiMapPin,
  FiPlus,
  FiArrowRight,
  FiActivity,
  FiSearch,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { SidebarContext } from "@/services/SidebarContext";

function TripJasa() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'open', 'completed'
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Get sidebar context
  const sidebarContext = useContext(SidebarContext);
  const sidebarOpen = sidebarContext?.sidebarOpen ?? false;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:8000/api/guide/trips",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Sort trips by start date (newest first)
          const sortedTrips = response.data.data.sort((a, b) => {
            return new Date(b.start_date) - new Date(a.start_date);
          });
          setTrips(sortedTrips);
        } else {
          setError("Failed to fetch trips");
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Error fetching trips. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [router]);

  const navigateToDashboard = (tripId) => {
    router.push(`/index-jasa/trip-jasa/dashboard/${tripId}`);
  };

  // Filter trips based on status and search query
  const filteredTrips = trips.filter((trip) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "open"
        ? trip.status === "open"
        : trip.status === "completed" || trip.status === "closed";

    const matchesSearch =
      searchQuery === "" ||
      trip.mountain?.nama_gunung
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      trip.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Get status badge styles
  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border border-green-200";
      case "completed":
      case "closed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
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

  // Stats
  const stats = {
    total: trips.length,
    open: trips.filter((trip) => trip.status === "open").length,
    completed: trips.filter(
      (trip) => trip.status === "completed" || trip.status === "closed"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="transition-all duration-300 ease-in-out">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-full mx-auto"
        >
          {/* Main content card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8"
          >
            {/* Search and filters */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari trip pendakian..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX />
                    </button>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  {/* Tombol Tambah Trip di kanan */}
                  <Link
                    href="trip-jasa/buat-trip"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-all shadow-sm hover:shadow-md ml-2"
                  >
                    <FiPlus className="mr-2" />
                    <span className="hidden sm:inline">Buat Trip</span>
                  </Link>
                </div>
              </div>

              {/* Expanded filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-sm font-medium text-gray-500 mb-2">
                        Status Trip:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["all", "open", "completed"].map((statusFilter) => (
                          <button
                            key={statusFilter}
                            onClick={() => setFilter(statusFilter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              filter === statusFilter
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                            }`}
                          >
                            {statusFilter === "all"
                              ? "Semua Trip"
                              : statusFilter === "open"
                              ? "Trip Aktif"
                              : "Trip Selesai"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter tabs with floating Add Button */}
            <div className="border-b border-gray-200 px-6 relative">
              <div className="flex space-x-6 -mb-px overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setFilter("all")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    filter === "all"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Semua Trip{" "}
                  <span className="ml-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {stats.total}
                  </span>
                </button>
                <button
                  onClick={() => setFilter("open")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    filter === "open"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Trip Aktif{" "}
                  <span className="ml-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    {stats.open}
                  </span>
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    filter === "completed"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Trip Selesai{" "}
                  <span className="ml-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                    {stats.completed}
                  </span>
                </button>
              </div>

              {/* Floating Add Button - Visible only on medium-sized screens and above */}
              {/* <motion.div
                className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="trip-jasa/buat-trip"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-full w-10 h-10 flex items-center justify-center shadow-sm transition-all"
                  title="Buat Trip Baru"
                >
                  <FiPlus size={20} />
                </Link>
              </motion.div> */}
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-500">Memuat trip...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-red-100 rounded-full p-3">
                      <FiX className="text-red-500 text-xl" />
                    </div>
                  </div>
                  <p className="mb-3 font-medium">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : filteredTrips.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 px-4"
                >
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMapPin className="text-blue-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {searchQuery
                      ? "Tidak ada hasil pencarian"
                      : filter === "all"
                      ? "Belum Ada Trip"
                      : filter === "open"
                      ? "Tidak Ada Trip Aktif"
                      : "Tidak Ada Trip Selesai"}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    {searchQuery
                      ? `Tidak ada trip yang sesuai dengan "${searchQuery}". Coba kata kunci lain atau hapus filter.`
                      : filter === "all"
                      ? "Kamu belum membuat trip pendakian. Mulai buat trip pertamamu sekarang!"
                      : filter === "open"
                      ? "Kamu belum memiliki trip aktif saat ini."
                      : "Kamu belum memiliki trip yang telah selesai."}
                  </p>
                  {filter === "all" && !searchQuery && (
                    <Link
                      href={"trip-jasa/buat-trip"}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg inline-flex items-center font-medium transition-colors shadow-md hover:shadow-lg"
                    >
                      <FiPlus className="mr-2" /> Buat Trip Sekarang
                    </Link>
                  )}
                  {(filter !== "all" || searchQuery) && (
                    <button
                      onClick={() => {
                        setFilter("all");
                        setSearchQuery("");
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg inline-flex items-center font-medium transition-colors"
                    >
                      Tampilkan Semua Trip
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 gap-6"
                >
                  <AnimatePresence>
                    {filteredTrips.map((trip) => (
                      <TripCard
                        key={trip.id}
                        trip={trip}
                        onDashboardClick={() => navigateToDashboard(trip.id)}
                        getStatusBadge={getStatusBadge}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Floating action button untuk mobile */}
            <motion.div
              className="fixed bottom-6 right-6 md:hidden z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="trip-jasa/buat-trip"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
              >
                <FiPlus size={24} />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function TripCard({ trip, onDashboardClick, getStatusBadge }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Get the first image or use placeholder
  const tripImage =
    trip.images && trip.images.length > 0
      ? `http://localhost:8000/storage/${trip.images[0].image_path}`
      : null;

  // Format price
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(trip.price);

  // Calculate days until trip starts
  const getDaysUntilTrip = () => {
    const today = new Date();
    const startDate = new Date(trip.start_date);
    const diffTime = startDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Sudah lewat";
    if (diffDays === 0) return "Hari ini";
    return `${diffDays} hari lagi`;
  };

  // Calculate booking status
  const getBookingStatus = () => {
    if (!trip.bookings) return { count: 0, percent: 0 };

    const bookedCount = trip.bookings.length;
    const percent = Math.round((bookedCount / trip.capacity) * 100);

    return {
      count: bookedCount,
      percent: percent > 100 ? 100 : percent,
    };
  };

  const bookingStatus = getBookingStatus();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 100 },
        },
      }}
      whileHover={{
        y: -3,
        boxShadow:
          "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
      }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all"
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 lg:w-1/4 relative h-48 md:h-auto">
          {tripImage ? (
            <Image
              src={tripImage}
              alt={trip.mountain?.nama_gunung || "Mountain"}
              fill
              style={{ objectFit: "cover" }}
              className="md:rounded-l-xl"
            />
          ) : (
            <Image
              src={img}
              alt="Default mountain"
              fill
              style={{ objectFit: "cover" }}
              className="md:rounded-l-xl"
            />
          )}
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                trip.status
              )}`}
            >
              {trip.status === "open"
                ? "Open"
                : trip.status === "completed" || trip.status === "closed"
                ? "Selesai"
                : trip.status}
            </span>
          </div>
        </div>

        <div className="p-5 md:p-6 flex flex-col justify-between w-full md:w-2/3 lg:w-3/4">
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {trip.mountain?.nama_gunung || "Mountain Trip"}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2">
                  Status:{" "}
                  {trip.mountain?.status_gunung || "Status tidak tersedia"}
                </p>
              </div>
              {trip.status === "open" && (
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full flex items-center">
                  <FiCalendar className="mr-1" />
                  {getDaysUntilTrip()}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 mt-5">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2 text-blue-500" />
                <span className="text-sm">
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiUsers className="mr-2 text-blue-500" />
                <span className="text-sm">
                  Kapasitas: {trip.capacity} orang
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <RiMoneyDollarCircleLine
                  className="mr-2 text-blue-500"
                  size={18}
                />
                <span className="text-sm font-semibold">{formattedPrice}</span>
              </div>
            </div>

            {trip.status === "open" && (
              <div className="mt-4 mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress pendaftaran:</span>
                  <span className="font-medium">
                    {bookingStatus.count}/{trip.capacity} peserta (
                    {bookingStatus.percent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${bookingStatus.percent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`h-2.5 rounded-full ${
                      bookingStatus.percent > 85
                        ? "bg-green-500"
                        : bookingStatus.percent > 40
                        ? "bg-blue-500"
                        : "bg-blue-300"
                    }`}
                  ></motion.div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-5 pt-4 border-t border-gray-100">
            <motion.button
              onClick={onDashboardClick}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 rounded-lg flex items-center font-medium transition-all shadow-sm hover:shadow-md"
            >
              {trip.status === "completed" || trip.status === "closed"
                ? "Lihat Detail"
                : "Masuk Dashboard"}
              <FiArrowRight className="ml-2" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TripJasa;
