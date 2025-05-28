"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMountain,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaSearch,
  FaChevronRight,
  FaFilter,
  FaHeart,
  FaClock,
  FaRuler,
} from "react-icons/fa";

// Set the correct API URL and include direct access to public storage
const API_URL = "http://localhost:8000/api";
// Use this for direct storage access without going through the API
const STORAGE_URL = "http://localhost:8000/storage";

function TripSheets() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [trips, setTrips] = useState([]);
  const [popularMountains, setPopularMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredTrip, setHoveredTrip] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const featuredTripRef = useRef(null);
  const tripGridRef = useRef(null);
  const mountainsRef = useRef(null);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch trips data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch trips from the endpoint defined in TripController@getAllTrips
        const tripsResponse = await axios.get(`${API_URL}/trips/all`);

        if (tripsResponse.data.success) {
          console.log("Trips data:", tripsResponse.data.data);
          setTrips(tripsResponse.data.data || []);
        }

        // Fetch mountains from the endpoint defined in MountainController@index
        const mountainsResponse = await axios.get(`${API_URL}/mountains`);

        if (mountainsResponse.data.success) {
          console.log("Mountains data:", mountainsResponse.data.data);
          setPopularMountains(mountainsResponse.data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper functions for data formatting
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    } catch (e) {
      return 1;
    }
  };

  const countParticipants = (bookings) => {
    if (!bookings || !Array.isArray(bookings)) return 0;
    return bookings.reduce((total, booking) => {
      if (booking.status === "confirmed") {
        return total + (booking.participants || 1);
      }
      return total;
    }, 0);
  };

  // Filter trips based on category and search query
  const filteredTrips = React.useMemo(() => {
    if (!trips.length) return [];

    let filtered = [...trips];

    if (activeCategory === "popular") {
      filtered = filtered.filter(
        (trip) =>
          trip.guide?.rating >= 4.5 || countParticipants(trip.bookings) > 5
      );
    } else if (activeCategory === "upcoming") {
      filtered = filtered.filter(
        (trip) => new Date(trip.start_date) > new Date()
      );
    } else if (activeCategory === "weekend") {
      filtered = filtered.filter((trip) => {
        const date = new Date(trip.start_date);
        return date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          trip.mountain?.nama_gunung?.toLowerCase().includes(query) ||
          trip.guide?.user?.nama_depan?.toLowerCase().includes(query) ||
          trip.mountain?.lokasi?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [trips, activeCategory, searchQuery]);

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  // Handle trip card click
  const handleTripClick = (tripId) => {
    router.push(`/trips/${tripId}`);
  };

  // FIXED: Image URL handling with multiple fallback options
  const getTripImageUrl = (trip) => {
    // Check if the trip has images
    if (trip.images && trip.images.length > 0 && trip.images[0].image_path) {
      const imagePath = trip.images[0].image_path;

      // Try direct storage path first (without going through API)
      if (imageErrors[`trip-api-${trip.id}`]) {
        return `/mountains/default.jpg`;
      }

      // Try API storage path
      return `${STORAGE_URL}/${imagePath}`;
    }
    return "/mountains/default.jpg";
  };

  // FIXED: Mountain image handling with fallbacks
  const getMountainImageUrl = (mountain) => {
    // Check if the mountain has images
    if (
      mountain.images &&
      mountain.images.length > 0 &&
      mountain.images[0].image_path
    ) {
      const imagePath = mountain.images[0].image_path;

      // Try direct storage path if API path failed
      if (imageErrors[`mountain-api-${mountain.id}`]) {
        return `/mountains/default.jpg`;
      }

      // Try API storage path
      return `${STORAGE_URL}/${mountain.images[0].image_path}`;
    }
    return "/mountains/default.jpg";
  };

  // FIXED: Guide profile photo with better error handling
  // Replace your current getGuidePhotoUrl function with this:

  const getGuidePhotoUrl = (guide) => {
    if (!guide?.profile_photo) return "/profile-placeholder.jpg";

    // If it's already a full URL, use it directly
    if (
      guide.profile_photo.startsWith("http://") ||
      guide.profile_photo.startsWith("https://")
    ) {
      return guide.profile_photo;
    }

    // Clean the path to handle any potential double slashes
    const cleanPath = guide.profile_photo.replace(/\/storage\/+/g, "/storage/");

    // If path already includes "/storage/", construct URL differently
    if (guide.profile_photo.includes("/storage/")) {
      return `http://localhost:8000${cleanPath}`;
    }

    // Otherwise use standard path
    return `http://localhost:8000/storage/${guide.profile_photo}`;
  };

  // FIXED: Better image error handling
  const handleImageError = (id, type) => {
    console.log(`Image load error for ${type}-${id}`);
    setImageErrors((prev) => ({
      ...prev,
      [`${type}-api-${id}`]: true,
    }));
  };

  // Get featured trip (first trip with highest rating)
  const featuredTrip =
    filteredTrips.length > 0
      ? [...filteredTrips].sort((a, b) => {
          const ratingA = a.guide?.rating || 0;
          const ratingB = b.guide?.rating || 0;
          return ratingB - ratingA;
        })[0]
      : null;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -12, transition: { duration: 0.2 } },
  };

  // Implement parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (featuredTripRef.current) {
        const scrollY = window.scrollY;
        const opacity = 1.0;
        featuredTripRef.current.style.opacity = opacity;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Trip exploration section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="hidden lg:block absolute -top-20 -right-20 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="hidden lg:block absolute bottom-20 -left-32 w-80 h-80 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 md:mb-0"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Trip Pendakian
              </h2>
              <p className="text-gray-600">
                Temukan petualangan pendakian terbaik di berbagai gunung
                Indonesia
              </p>
            </motion.div>
          </div>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex overflow-x-auto mb-8 pb-4 hide-scrollbar"
          >
            <div className="flex space-x-4">
              {[
                { id: "all", name: "Semua Trip" },
                { id: "popular", name: "Terpopuler" },
                { id: "upcoming", name: "Akan Datang" },
                { id: "weekend", name: "Akhir Pekan" },
              ].map((category) => (
                <motion.button
                  key={category.id}
                  className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category.name}
                </motion.button>
              ))}

              <motion.div
                className="relative ml-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="flex items-center px-4 py-2.5 bg-white text-gray-700 rounded-full border border-gray-200"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                >
                  <FaFilter className="mr-2 text-blue-600" />
                  <span>Filter</span>
                </button>

                {/* Filter dropdown */}
                {showFilterMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg p-4 w-64 z-30">
                    <h4 className="font-medium mb-3">Filter Trip</h4>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Durasi</p>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-blue-500">
                          1-2 Hari
                        </button>
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-blue-500">
                          3-5 Hari
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Harga</p>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-blue-500">
                          &lt; 500K
                        </button>
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-blue-500">
                          500K-1M
                        </button>
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-blue-500">
                          &gt; 1M
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowFilterMenu(false)}
                      className="mt-4 w-full py-2 text-center bg-blue-600 text-white rounded-lg text-sm font-medium"
                    >
                      Terapkan
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div
                animate={{
                  rotate: 360,
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
                className="w-12 h-12 border-t-4 border-b-4 border-blue-600 rounded-full mb-4"
              />
              <p className="text-gray-500 text-lg">Mengambil data trip...</p>
            </div>
          ) : (
            <>
              {/* Featured Trip Card */}
              {featuredTrip && (
                <motion.div
                  ref={featuredTripRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="mb-10"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-5">
                      <div className="md:col-span-2 relative h-64 md:h-auto bg-gray-900">
                        {" "}
                        {/* Added bg-gray-900 */}
                        <Image
                          src={getTripImageUrl(featuredTrip)}
                          alt={
                            featuredTrip.mountain?.nama_gunung ||
                            "Mountain Trip"
                          }
                          fill
                          className="object-cover"
                          priority
                          onError={() =>
                            handleImageError(featuredTrip.id, "trip")
                          }
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black opacity-60"></div>{" "}
                        {/* Replaced gradient with solid overlay */}
                        <div className="absolute top-6 left-6">
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full"
                          >
                            Trip Populer
                          </motion.span>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6">
                          <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-white text-2xl md:text-3xl font-bold mb-2"
                          >
                            {featuredTrip.mountain?.nama_gunung ||
                              "Trip Pendakian"}
                          </motion.h2>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="flex items-center text-white/90 mb-4"
                          >
                            <FaMapMarkerAlt className="mr-2" size={16} />
                            <span className="text-lg">
                              {featuredTrip.mountain?.lokasi || "Indonesia"}
                            </span>
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex space-x-3"
                          >
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center">
                              <FaCalendarAlt
                                className="mr-2 text-white"
                                size={14}
                              />
                              <span className="text-white">
                                {formatDate(featuredTrip.start_date)}
                              </span>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center">
                              <FaUsers className="mr-2 text-white" size={14} />
                              <span className="text-white">
                                {countParticipants(featuredTrip.bookings)}/
                                {featuredTrip.capacity || 10} Peserta
                              </span>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      <div className="md:col-span-3 p-6 md:p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            {/* Guide avatar and info */}
                            {featuredTrip.guide && (
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex items-center mr-4"
                              >
                                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 overflow-hidden">
                                  {/* FIXED: Enhanced guide image with error handling */}
                                  <Image
                                    src={getGuidePhotoUrl(featuredTrip.guide)}
                                    alt="Guide"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                    onError={() =>
                                      handleImageError(
                                        featuredTrip.guide.id,
                                        "guide"
                                      )
                                    }
                                    unoptimized
                                  />
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Dipandu oleh
                                  </p>
                                  <p className="font-medium">
                                    {featuredTrip.guide.user?.nama_depan ||
                                      "Guide"}
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className="flex items-center text-yellow-500"
                            >
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`${
                                    i <
                                    Math.floor(featuredTrip.guide?.rating || 0)
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-500 ml-2">
                                ({featuredTrip.guide?.ratings_count || 0}{" "}
                                ulasan)
                              </span>
                            </motion.div>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                          >
                            <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                              {featuredTrip.status === "closed"
                                ? "Selesai"
                                : "Tersedia"}
                            </span>
                          </motion.div>
                        </div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="text-gray-700 mb-6 line-clamp-2"
                        >
                          {featuredTrip.trip_info ||
                            `Nikmati petualangan mendaki ${featuredTrip.mountain?.nama_gunung} bersama pemandu profesional kami. Trip ini cocok untuk segala tingkat pendaki.`}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                        >
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Lokasi</p>
                            <p className="font-medium">
                              {featuredTrip.mountain?.lokasi?.split(",")[0] ||
                                "Indonesia"}
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Durasi</p>
                            <p className="font-medium">
                              {calculateDuration(
                                featuredTrip.start_date,
                                featuredTrip.end_date
                              )}{" "}
                              Hari
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">
                              Ketinggian
                            </p>
                            <p className="font-medium">
                              {featuredTrip.mountain?.ketinggian || 0} mdpl
                            </p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">
                              Kesulitan
                            </p>
                            <p className="font-medium">
                              {featuredTrip.mountain?.status_gunung ||
                                "Menengah"}
                            </p>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <p className="text-sm text-gray-500">Mulai dari</p>
                            <p className="text-2xl font-bold text-blue-600">
                              Rp{" "}
                              {Number(featuredTrip.price || 0).toLocaleString(
                                "id-ID"
                              )}
                            </p>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg"
                            onClick={() => handleTripClick(featuredTrip.id)}
                          >
                            Lihat Detail
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Trip Cards Grid */}
              {filteredTrips.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-20 bg-white rounded-xl shadow-sm"
                >
                  <FaMountain className="mx-auto text-gray-300 text-5xl mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Tidak ada trip yang ditemukan
                  </h3>
                  <p className="text-gray-500">
                    Coba ubah filter atau kata kunci pencarian Anda
                  </p>
                </motion.div>
              ) : (
                <div
                  ref={tripGridRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredTrips
                    .filter((trip) => trip.id !== featuredTrip?.id)
                    .slice(0, 6)
                    .map((trip, index) => (
                      <motion.div
                        key={trip.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                        onClick={() => handleTripClick(trip.id)}
                        onMouseEnter={() => setHoveredTrip(trip.id)}
                        onMouseLeave={() => setHoveredTrip(null)}
                      >
                        <div className="relative h-48">
                          {/* FIXED: Enhanced trip image with error handling */}
                          <Image
                            src={getTripImageUrl(trip)}
                            alt={trip.mountain?.nama_gunung || "Mountain Trip"}
                            fill
                            className="object-cover"
                            onError={() => handleImageError(trip.id, "trip")}
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                          {/* Like button */}
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center z-10"
                          >
                            <FaHeart
                              className={`${
                                hoveredTrip === trip.id
                                  ? "text-red-500"
                                  : "text-white"
                              }`}
                            />
                          </motion.button>

                          <div className="absolute top-3 left-3 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                            {calculateDuration(trip.start_date, trip.end_date)}{" "}
                            Hari
                          </div>

                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white font-bold text-lg">
                              {trip.mountain?.nama_gunung || "Trip Pendakian"}
                            </h3>
                            <div className="flex items-center text-white/80">
                              <FaMapMarkerAlt className="mr-1" size={12} />
                              <span>
                                {trip.mountain?.lokasi?.split(",")[0] ||
                                  "Indonesia"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.floor(trip.guide?.rating || 0)
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-500 ml-1">
                                ({trip.guide?.ratings_count || 0})
                              </span>
                            </div>

                            {/* Trip status badge */}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                trip.status === "closed"
                                  ? "bg-gray-100 text-gray-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {trip.status === "closed"
                                ? "Selesai"
                                : "Tersedia"}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <FaCalendarAlt
                                className="mr-1.5 text-blue-500"
                                size={12}
                              />
                              {formatDate(trip.start_date)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaUsers
                                className="mr-1.5 text-blue-500"
                                size={12}
                              />
                              {countParticipants(trip.bookings)}/
                              {trip.capacity || 10}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs text-gray-500">Harga</p>
                              <p className="text-blue-600 font-bold">
                                Rp{" "}
                                {Number(trip.price || 0).toLocaleString(
                                  "id-ID"
                                )}
                              </p>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white h-9 w-9 rounded-full shadow-md"
                            >
                              <FaChevronRight size={12} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}

              {/* Show more button */}
              {filteredTrips.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-center mt-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium transition-colors hover:bg-blue-50 hover:shadow-md"
                    onClick={() => router.push("/trips")}
                  >
                    Lihat Semua Trip ({filteredTrips.length})
                  </motion.button>
                </motion.div>
              )}

              {/* Popular Mountains Section */}
              {popularMountains.length > 0 && (
                <motion.div
                  ref={mountainsRef}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="mt-20"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    Destinasi Populer
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {popularMountains.slice(0, 3).map((mountain, index) => (
                      <motion.div
                        key={mountain.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.6,
                            delay: 0.4 + index * 0.1,
                          },
                        }}
                        whileHover="hover"
                        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                        onClick={() => router.push(`/mountains/${mountain.id}`)}
                      >
                        <div className="relative h-52">
                          {/* FIXED: Enhanced mountain image with error handling */}
                          <Image
                            src={getMountainImageUrl(mountain)}
                            alt={mountain.nama_gunung || "Mountain"}
                            fill
                            className="object-cover"
                            onError={() =>
                              handleImageError(mountain.id, "mountain")
                            }
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white text-xl font-bold">
                              {mountain.nama_gunung}
                            </h3>
                            <div className="flex items-center text-white/80">
                              <FaMapMarkerAlt className="mr-1" size={12} />
                              <span>
                                {mountain.lokasi?.split(",")[0] || "Indonesia"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex space-x-4 mb-4">
                            <div className="flex items-center">
                              <div className="p-2 bg-blue-50 rounded-lg mr-2">
                                <FaRuler className="text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Ketinggian
                                </p>
                                <p className="font-medium">
                                  {mountain.ketinggian || mountain.tinggi || 0}{" "}
                                  mdpl
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <div className="p-2 bg-indigo-50 rounded-lg mr-2">
                                <FaMountain className="text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Tingkat</p>
                                <p className="font-medium">
                                  {mountain.status_pendakian ||
                                    mountain.status_gunung ||
                                    "Menengah"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {mountain.deskripsi ||
                              "Informasi gunung tidak tersedia"}
                          </p>

                          <div className="flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center text-blue-600 font-medium text-sm"
                            >
                              <span className="mr-1">Selengkapnya</span>
                              <FaChevronRight size={12} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default TripSheets;
