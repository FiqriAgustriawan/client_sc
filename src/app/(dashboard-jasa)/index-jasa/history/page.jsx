"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaStar,
  FaMoneyBillWave,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaFilter,
  FaCamera,
  FaRegClock,
  FaInfoCircle,
  FaFileInvoiceDollar,
  FaHistory,
  FaMountain,
  FaChevronRight,
  FaBookmark,
} from "react-icons/fa";
import { FiSearch, FiRefreshCw, FiExternalLink, FiAward } from "react-icons/fi";
import { MdHiking } from "react-icons/md";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { toast, Toaster } from "react-hot-toast";

export default function HistoryTrip() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const router = useRouter();
  const [sortBy, setSortBy] = useState("date_desc");
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    fetchTrips();

    // Highlight animation when navigating back from trip details
    const urlParams = new URLSearchParams(window.location.search);
    const highlight = urlParams.get("highlight");
    if (highlight) {
      setHighlightedId(parseInt(highlight));
      setTimeout(() => setHighlightedId(null), 3000); // Remove highlight after 3 seconds
    }
  }, []);

  useEffect(() => {
    filterAndSortTrips();
  }, [trips, searchQuery, sortBy]);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/guide/trips/completed`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch completed trips");
      }

      const data = await response.json();
      if (data.success) {
        setTrips(data.data);
        setFilteredTrips(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch trips");
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError(error.message);
      toast.error("Gagal memuat data perjalanan selesai");
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortTrips = () => {
    let results = [...trips];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (trip) =>
          trip.mountain?.nama_gunung?.toLowerCase().includes(query) ||
          trip.id?.toString().includes(query) ||
          formatDate(trip.start_date).toLowerCase().includes(query)
      );
    }

    // Sort trips
    switch (sortBy) {
      case "date_asc":
        results.sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
        break;
      case "date_desc":
        results.sort((a, b) => new Date(b.end_date) - new Date(a.end_date));
        break;
      case "participants_desc":
        results.sort((a, b) => {
          const aParticipants =
            a.bookings?.reduce(
              (sum, booking) => sum + (booking.participants || 0),
              0
            ) || 0;
          const bParticipants =
            b.bookings?.reduce(
              (sum, booking) => sum + (booking.participants || 0),
              0
            ) || 0;
          return bParticipants - aParticipants;
        });
        break;
      case "mountain_name":
        results.sort((a, b) => {
          const aName = a.mountain?.nama_gunung || "";
          const bName = b.mountain?.nama_gunung || "";
          return aName.localeCompare(bName);
        });
        break;
    }

    setFilteredTrips(results);
  };

  const toggleExpandedTrip = (tripId) => {
    if (expandedTrip === tripId) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(tripId);
    }
  };

  const handleViewGallery = (trip, index = 0) => {
    setSelectedTrip(trip);
    setLightboxIndex(index);
    setOpenLightbox(true);
  };

  const getStatusBadge = (status) => {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <FaCheckCircle className="mr-1" /> Selesai
      </span>
    );
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

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";
    const cleanPath = imagePath.replace("public/", "");
    return `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/storage/${cleanPath}`;
  };

  // Stats calculation - only for completed trips
  const stats = {
    total: trips.length,
    totalParticipants: trips.reduce((total, trip) => {
      return (
        total +
        (trip.bookings?.reduce(
          (sum, booking) => sum + (booking.participants || 0),
          0
        ) || 0)
      );
    }, 0),
    uniqueMountains: [...new Set(trips.map((trip) => trip.mountain?.id))]
      .length,
    highestRated:
      trips.length > 0
        ? trips.reduce((highest, trip) => {
            const tripRating =
              trip.reviews?.reduce((sum, review) => sum + review.rating, 0) /
                trip.reviews?.length || 0;
            const highestRating =
              highest.reviews?.reduce((sum, review) => sum + review.rating, 0) /
                highest.reviews?.length || 0;
            return tripRating > highestRating ? trip : highest;
          }, trips[0])
        : null,
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

  const highlightAnimation = {
    initial: { backgroundColor: "rgba(249, 250, 251, 1)" },
    highlight: {
      backgroundColor: ["rgba(219, 234, 254, 1)", "rgba(249, 250, 251, 1)"],
      transition: { duration: 2, times: [0, 1] },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-5">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Memuat Riwayat
          </h2>
          <p className="text-gray-500">
            Mengambil perjalanan yang telah selesai...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaInfoCircle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchTrips}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
          >
            <FiRefreshCw className="mr-2" /> Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 lg:p-10">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header with decorative elements */}
          <motion.div variants={itemVariants} className="relative mb-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/20 rounded-full -z-10 blur-2xl"></div>
            <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/20 rounded-full -z-10 blur-xl"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center">
                  <FaHistory className="text-blue-500 mr-3" />
                  <span>Riwayat Perjalanan</span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Menampilkan daftar perjalanan yang telah Anda selesaikan
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <button
                  onClick={fetchTrips}
                  className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center hover:border-blue-300"
                >
                  <FiRefreshCw className="mr-2 text-blue-500" /> Refresh Data
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
          >
            <motion.div
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
              }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600">
                  Total Perjalanan
                </h3>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FaMountain className="text-blue-500 text-xl" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              <p className="mt-2 text-sm text-gray-500">
                Perjalanan yang telah selesai
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
              }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600">
                  Total Peserta
                </h3>
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <FaUsers className="text-indigo-500 text-xl" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalParticipants}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Peserta yang telah mendaki bersama Anda
              </p>
            </motion.div>

            <motion.div
              whileHover={{
                y: -5,
                boxShadow:
                  "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
              }}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-600">
                  Gunung Dikunjungi
                </h3>
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <FaMountain className="text-emerald-500 text-xl" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-800">
                {stats.uniqueMountains}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Jumlah gunung yang telah didaki
              </p>
            </motion.div>
          </motion.div>

          {/* Search and Sort */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Cari berdasarkan gunung atau tanggal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort dropdown */}
              <div className="relative w-full md:w-60">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="date_desc">Terbaru</option>
                  <option value="date_asc">Terlama</option>
                  <option value="participants_desc">Peserta Terbanyak</option>
                  <option value="mountain_name">Nama Gunung (A-Z)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <FaChevronDown className="text-gray-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trip List */}
          {filteredTrips.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <MdHiking className="text-blue-500 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Belum Ada Riwayat Perjalanan
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchQuery
                  ? "Tidak ada perjalanan yang sesuai dengan pencarian Anda"
                  : "Anda belum memiliki perjalanan yang telah selesai. Buat perjalanan dan selesaikan untuk melihatnya di sini."}
              </p>
              <button
                onClick={() => router.push("/index-jasa/add-trip")}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md inline-flex items-center"
              >
                + Buat Trip Baru
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {filteredTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={highlightedId === trip.id ? "highlight" : "visible"}
                  variants={{
                    ...itemVariants,
                    highlight: {
                      ...itemVariants.visible,
                      backgroundColor: [
                        "rgba(219, 234, 254, 0.6)",
                        "rgba(255, 255, 255, 1)",
                      ],
                    },
                  }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="md:flex">
                    {/* Trip Image */}
                    <div
                      className="md:w-2/5 lg:w-1/3 relative h-60 md:h-auto group cursor-pointer"
                      onClick={() =>
                        trip.images &&
                        trip.images.length > 0 &&
                        handleViewGallery(trip)
                      }
                    >
                      {trip.images && trip.images.length > 0 ? (
                        <>
                          <Image
                            src={getImageUrl(trip.images[0]?.image_path)}
                            alt={trip.mountain?.nama_gunung || "Mountain Trip"}
                            fill
                            className="object-cover transition-transform group-hover:scale-105 duration-700"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70">
                            {/* Overlay gradient for better text visibility */}
                          </div>
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform">
                              <FaCamera className="text-gray-800 text-xl" />
                            </div>
                            <p className="absolute bottom-3 right-3 text-white bg-black/50 px-2.5 py-1 rounded text-xs">
                              {trip.images?.length || 0} foto
                            </p>
                          </div>

                          {/* Status and Date Badge */}
                          <div className="absolute top-3 left-3 flex flex-col space-y-2">
                            {getStatusBadge(trip.status)}
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm">
                              <FaCalendarAlt className="mr-1 text-blue-500" />{" "}
                              {formatDate(trip.start_date)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-400">Tidak ada foto</p>
                        </div>
                      )}

                      {/* Trip ID Badge */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/90 text-gray-800 rounded text-xs backdrop-blur-sm">
                        ID Trip: {trip.id}
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="p-6 md:w-3/5 lg:w-2/3">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-800 mb-1 group">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                              {trip.mountain?.nama_gunung || "Mountain Trip"}
                            </span>
                          </h2>
                          <div className="flex items-center text-gray-500 mb-3">
                            <FaMapMarkerAlt className="mr-1.5 text-red-500" />
                            <span>{trip.mountain?.lokasi || "Location"}</span>
                            <span className="mx-2">•</span>
                            <span>
                              Ketinggian: {trip.mountain?.tinggi || 0}m
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3 mb-2">
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-sm">
                              <FaCalendarAlt className="text-blue-500" />
                              <span>
                                {formatDate(trip.start_date)} -{" "}
                                {formatDate(trip.end_date)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-md text-sm">
                              <FaUsers className="text-purple-500" />
                              <span>
                                {trip.bookings
                                  ?.filter((b) => b.status === "confirmed")
                                  .reduce(
                                    (sum, b) => sum + (b.participants || 0),
                                    0
                                  ) || 0}{" "}
                                peserta
                              </span>
                            </div>

                            {trip.reviews && trip.reviews.length > 0 && (
                              <div className="flex items-center gap-1 px-2.5 py-1 bg-yellow-50 rounded-md text-sm">
                                <FaStar className="text-yellow-500" />
                                <span>
                                  {(
                                    trip.reviews.reduce(
                                      (sum, review) => sum + review.rating,
                                      0
                                    ) / trip.reviews.length
                                  ).toFixed(1)}{" "}
                                  / 5.0
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Trip Price */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 rounded-lg flex items-center">
                          <FaMoneyBillWave className="text-blue-500 mr-2" />
                          <span className="font-bold text-blue-700">
                            {formatCurrency(trip.price)}
                          </span>
                        </div>
                      </div>

                      {/* Trip Actions */}
                      <div className="flex flex-wrap gap-3 my-4">
                        <motion.button
                          onClick={() => toggleExpandedTrip(trip.id)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                        >
                          {expandedTrip === trip.id ? (
                            <>
                              <FaChevronUp className="mr-2" />
                              Sembunyikan Detail
                            </>
                          ) : (
                            <>
                              <FaChevronDown className="mr-2" />
                              Lihat Detail
                            </>
                          )}
                        </motion.button>

                        <Link href={`/index-jasa/trip-jasa/dashboard/${trip.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <FaBookmark className="mr-2" />
                            Detail Perjalanan
                            <FaChevronRight className="ml-2" />
                          </motion.button>
                        </Link>
                      </div>

                      {/* Summary */}
                      <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Ringkasan: </span>
                          {trip.trip_info ? (
                            <span className="line-clamp-2">
                              {trip.trip_info}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">
                              Tidak ada deskripsi perjalanan
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedTrip === trip.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-200"
                          >
                            {/* Trip Description */}
                            <div className="mb-6">
                              <h4 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                                <FaInfoCircle className="mr-2 text-blue-500" />
                                Informasi Perjalanan
                              </h4>
                              <div className="bg-gray-50 p-5 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-line">
                                  {trip.trip_info ||
                                    "Tidak ada deskripsi perjalanan."}
                                </p>
                              </div>
                            </div>

                            {/* Facilities */}
                            {trip.facilities &&
                              Object.keys(trip.facilities).length > 0 && (
                                <div className="mb-6">
                                  <h4 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                                    <FiAward className="mr-2 text-blue-500" />
                                    Fasilitas yang Disediakan
                                  </h4>
                                  <div className="bg-gray-50 p-5 rounded-lg">
                                    <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {Object.entries(trip.facilities).map(
                                        ([key, value]) => (
                                          <li
                                            key={key}
                                            className="flex items-center bg-white p-2 rounded-lg shadow-sm"
                                          >
                                            <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                                            <span className="text-gray-700">
                                              {typeof value === "string"
                                                ? value
                                                : key}
                                            </span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}

                            {/* Booking Information */}
                            {trip.bookings && trip.bookings.length > 0 ? (
                              <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                                  <FaUsers className="mr-2 text-blue-500" />
                                  Daftar Peserta
                                </h4>
                                <div className="overflow-x-auto bg-gray-50 rounded-lg">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                      <tr className="bg-gray-100">
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          ID
                                        </th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Nama Peserta
                                        </th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Jumlah
                                        </th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                          Tanggal Booking
                                        </th>
                                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                      {trip.bookings
                                        .filter((b) => b.status === "confirmed")
                                        .map((booking) => (
                                          <tr
                                            key={booking.id}
                                            className="hover:bg-blue-50 transition-colors"
                                          >
                                            <td className="py-3 px-4 whitespace-nowrap">
                                              #{booking.id}
                                            </td>
                                            <td className="py-3 px-4">
                                              <div className="font-medium text-gray-800">
                                                {booking.user?.nama_depan ||
                                                  "User"}{" "}
                                                {booking.user?.nama_belakang ||
                                                  ""}
                                              </div>
                                              <div className="text-xs text-gray-500">
                                                {booking.user?.email}
                                              </div>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                {booking.participants} orang
                                              </span>
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap hidden md:table-cell">
                                              {formatDate(booking.created_at)}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full flex items-center w-fit">
                                                <FaCheckCircle className="mr-1" />{" "}
                                                Terkonfirmasi
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ) : (
                              <div className="mb-6 text-center py-8 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                  <FaUsers className="text-gray-400 text-2xl" />
                                </div>
                                <p className="text-gray-500">
                                  Tidak ada peserta yang terdaftar pada trip ini
                                </p>
                              </div>
                            )}

                            {/* Photo Gallery */}
                            {trip.images && trip.images.length > 0 && (
                              <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                                  <FaCamera className="mr-2 text-blue-500" />
                                  Galeri Foto
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {trip.images
                                    .slice(0, 8)
                                    .map((image, index) => (
                                      <motion.div
                                        key={index}
                                        whileHover={{
                                          scale: 1.05,
                                          boxShadow:
                                            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                                        }}
                                        className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-gray-200"
                                        onClick={() =>
                                          handleViewGallery(trip, index)
                                        }
                                      >
                                        <Image
                                          src={getImageUrl(image.image_path)}
                                          alt={`Gallery image ${index + 1}`}
                                          fill
                                          className="object-cover transition-transform hover:scale-110 duration-700"
                                          unoptimized
                                        />
                                        {index === 7 &&
                                          trip.images.length > 8 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                              <span className="text-white font-medium text-lg">
                                                +{trip.images.length - 8} lagi
                                              </span>
                                            </div>
                                          )}
                                      </motion.div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {/* Reviews if any */}
                            {trip.reviews && trip.reviews.length > 0 && (
                              <div className="mb-6">
                                <h4 className="text-base font-medium text-gray-700 mb-3 flex items-center">
                                  <FaStar className="mr-2 text-yellow-500" />
                                  Ulasan dari Peserta
                                </h4>
                                <div className="space-y-3">
                                  {trip.reviews
                                    .slice(0, 3)
                                    .map((review, idx) => (
                                      <div
                                        key={idx}
                                        className="p-4 bg-yellow-50 rounded-lg"
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="font-medium">
                                            {review.user_name || "Peserta"}
                                          </div>
                                          <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                              <FaStar
                                                key={i}
                                                className={
                                                  i < review.rating
                                                    ? "text-yellow-500"
                                                    : "text-gray-300"
                                                }
                                              />
                                            ))}
                                          </div>
                                        </div>
                                        <p className="text-gray-700">
                                          {review.comment ||
                                            "Tidak ada komentar."}
                                        </p>
                                      </div>
                                    ))}
                                  {trip.reviews.length > 3 && (
                                    <div className="text-center">
                                      <span className="text-blue-600 hover:underline cursor-pointer">
                                        + {trip.reviews.length - 3} ulasan
                                        lainnya
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination if needed */}
          {filteredTrips.length > 0 && filteredTrips.length > 10 && (
            <motion.div
              variants={itemVariants}
              className="mt-8 flex justify-center"
            >
              <nav className="flex items-center gap-1">
                <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-500 disabled:bg-gray-100 disabled:text-gray-400">
                  &laquo; Prev
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-500">
                  1
                </button>
                <button className="px-3 py-1 border border-blue-500 rounded bg-blue-500 text-white">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-500">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-500">
                  Next &raquo;
                </button>
              </nav>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Lightbox for Gallery */}
      {selectedTrip && (
        <Lightbox
          open={openLightbox}
          close={() => setOpenLightbox(false)}
          slides={selectedTrip.images.map((img) => ({
            src: getImageUrl(img.image_path),
          }))}
          index={lightboxIndex}
        />
      )}
    </div>
  );
}
