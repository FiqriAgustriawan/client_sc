"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";
import { format, parseISO, addDays, subDays } from "date-fns";
import { id } from "date-fns/locale";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaMountain,
  FaStar,
  FaChevronRight,
  FaFilter,
  FaHistory,
  FaSearch,
  FaHeart,
  FaClock,
  FaCheck,
  FaChartLine
} from "react-icons/fa";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TRIP_CATEGORIES = [
  { id: "all", name: "Semua Trip" },
  { id: "popular", name: "Terpopuler" },
  { id: "upcoming", name: "Akan Datang" },
  { id: "weekend", name: "Akhir Pekan" },
  { id: "beginner", name: "Untuk Pemula" },
];

const TRIP_FILTER_OPTIONS = [
  { id: "date", name: "Tanggal" },
  { id: "difficulty", name: "Tingkat Kesulitan" },
  { id: "price", name: "Harga" },
  { id: "duration", name: "Durasi" },
];

const TripExplorer = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredTrip, setHoveredTrip] = useState(null);
  const tripsContainerRef = useRef(null);
  const historySectionRef = useRef(null);
  const statsRef = useRef(null);

  // Fetch trips data
  const { data: tripsData, isLoading: loadingTrips } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/api/trips/all");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });

  // Fetch trip history data
  const { data: tripHistoryData, isLoading: loadingHistory } = useQuery({
    queryKey: ["tripHistory"],
    queryFn: async () => {
      // This would be the actual endpoint for trip history
      // Simulating data for now
      return Array(8)
        .fill()
        .map((_, i) => ({
          id: i + 1,
          name: `Trip ke Gunung ${["Bromo", "Semeru", "Merbabu", "Merapi", "Prau", "Lawu", "Rinjani", "Slamet"][i % 8]}`,
          date: format(subDays(new Date(), 7 + i * 3), "yyyy-MM-dd"),
          image: `/mountains/mountain-${(i % 4) + 1}.jpg`,
          completed: true,
          participants: 4 + Math.floor(Math.random() * 10),
          duration: 2 + Math.floor(Math.random() * 3),
          elevation: 2000 + Math.floor(Math.random() * 1500),
          rating: 3.5 + Math.random() * 1.5,
          guide: {
            name: `Pemandu ${i + 1}`,
            image: `/guides/guide-${(i % 4) + 1}.jpg`
          }
        }));
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize GSAP animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (tripsContainerRef.current) {
        // Animate trip cards as they come into view
        gsap.from(tripsContainerRef.current.querySelectorAll(".trip-card"), {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: tripsContainerRef.current,
            start: "top 80%",
          },
        });
      }

      if (historySectionRef.current) {
        // Animate history section
        gsap.from(historySectionRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: historySectionRef.current,
            start: "top 85%",
          },
        });
      }

      if (statsRef.current) {
        // Animate stats counters
        gsap.from(statsRef.current.querySelectorAll(".stat-counter"), {
          textContent: 0,
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          stagger: 0.25,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
        });
      }
    }
  }, [tripsData, tripHistoryData, isMobile]);

  // Filter trips based on active category and search query
  const filteredTrips = React.useMemo(() => {
    if (!tripsData) return [];
    
    // Start with all trips
    let filtered = [...tripsData];
    
    // Apply category filter
    if (activeCategory === "popular") {
      filtered = filtered.filter(trip => trip.participants_count > 5);
    } else if (activeCategory === "upcoming") {
      filtered = filtered.filter(trip => new Date(trip.start_date) > new Date());
    } else if (activeCategory === "weekend") {
      filtered = filtered.filter(trip => {
        const tripDate = new Date(trip.start_date);
        const day = tripDate.getDay();
        return day === 0 || day === 6; // Saturday or Sunday
      });
    } else if (activeCategory === "beginner") {
      filtered = filtered.filter(trip => trip.difficulty_level === "Mudah");
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trip => 
        trip.name.toLowerCase().includes(query) || 
        trip.mountain_name.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [tripsData, activeCategory, searchQuery]);

  // Handler for trip card click
  const handleTripClick = (tripId) => {
    router.push(`/trips/${tripId}`);
  };

  // Format date to Indonesian format
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
    } catch (e) {
      return dateString;
    }
  };

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 pt-10 pb-16 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Trip Pendakian</h1>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              onClick={() => setShowFilters(true)}
            >
              <FaFilter className="text-white" />
            </motion.button>
          </div>
          
          {/* Search bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Cari gunung atau trip..."
              className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
          </div>
          
          {/* Category tabs */}
          <div className="overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-3">
              {TRIP_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                    activeCategory === category.id
                      ? "bg-white text-blue-600"
                      : "bg-white/20 text-white"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* CONTENT */}
        <div className="px-4 -mt-8">
          {/* Stats cards */}
          <div className="flex space-x-3 mb-6 overflow-x-auto hide-scrollbar pb-2">
            <div className="bg-white rounded-xl shadow-sm p-4 min-w-[140px] flex flex-col justify-between">
              <div className="text-xs text-gray-500 mb-1">Trip Tersedia</div>
              <div className="text-2xl font-bold text-blue-600 stat-counter">{tripsData?.length || 0}</div>
              <div className="flex items-center text-xs text-green-500 mt-2">
                <FaChartLine className="mr-1" />
                +12% minggu ini
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 min-w-[140px] flex flex-col justify-between">
              <div className="text-xs text-gray-500 mb-1">Trip Selesai</div>
              <div className="text-2xl font-bold text-indigo-600 stat-counter">{tripHistoryData?.length || 0}</div>
              <div className="flex items-center text-xs text-green-500 mt-2">
                <FaCheck className="mr-1" />
                100% sukses
              </div>
            </div>
          </div>
          
          {/* Main content tabs */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  selectedTab === "upcoming"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setSelectedTab("upcoming")}
              >
                Akan Datang
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  selectedTab === "history"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setSelectedTab("history")}
              >
                Riwayat Trip
              </button>
            </div>
            
            <div className="p-4">
              {/* Upcoming Trips */}
              <AnimatePresence mode="wait">
                {selectedTab === "upcoming" && (
                  <motion.div
                    key="upcoming"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    ref={tripsContainerRef}
                  >
                    {loadingTrips ? (
                      <div className="flex justify-center p-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : filteredTrips.length === 0 ? (
                      <div className="text-center py-8">
                        <FaMountain className="mx-auto text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-500">
                          Tidak ada trip yang cocok dengan filter Anda
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredTrips.slice(0, 5).map((trip) => (
                          <motion.div
                            key={trip.id}
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden trip-card"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTripClick(trip.id)}
                            layout
                          >
                            <div className="relative h-40">
                              <Image
                                src={`http://localhost:8000/storage/${trip.featured_image || "mountains/default.jpg"}`}
                                alt={trip.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                              
                              <div className="absolute top-3 right-3">
                                <motion.button 
                                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <FaHeart className="text-white" />
                                </motion.button>
                              </div>
                              
                              <div className="absolute top-3 left-3 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                                {trip.duration} Hari
                              </div>
                              
                              <div className="absolute bottom-3 left-3 right-3">
                                <div className="flex items-center">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mr-2">
                                    <FaMountain className="text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-white font-medium">{trip.mountain_name}</h3>
                                    <div className="flex items-center text-xs text-white/80">
                                      <FaMapMarkerAlt className="mr-1" size={10} />
                                      {trip.location}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-1">{trip.name}</h3>
                              
                              <div className="flex items-center text-yellow-500 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar 
                                    key={i} 
                                    className={`w-3 h-3 ${i < Math.floor(trip.rating || 4.5) ? 'text-yellow-500' : 'text-gray-300'}`} 
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">({trip.reviews_count || 12} ulasan)</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="flex items-center text-xs text-gray-500">
                                  <FaCalendarAlt className="mr-1.5 text-blue-500" />
                                  {formatDate(trip.start_date)}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <FaUsers className="mr-1.5 text-blue-500" />
                                  {trip.participants_count || 0}/{trip.max_participants || 10} Peserta
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-lg font-bold text-blue-600">
                                  Rp {Number(trip.price || 500000).toLocaleString('id-ID')}
                                </div>
                                <button className="text-xs bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg px-3 py-1.5 font-medium">
                                  Detail
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        
                        {filteredTrips.length > 5 && (
                          <button className="w-full py-3 text-blue-600 font-medium text-sm border border-blue-600 rounded-xl">
                            Lihat Semua Trip ({filteredTrips.length})
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Trip History */}
                {selectedTab === "history" && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    ref={historySectionRef}
                  >
                    {loadingHistory ? (
                      <div className="flex justify-center p-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {tripHistoryData.slice(0, 5).map((trip) => (
                            <div key={trip.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                              <div className="relative h-32">
                                <Image
                                  src={trip.image}
                                  alt={trip.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                
                                <div className="absolute top-3 right-3 bg-green-500/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
                                  <FaCheck className="mr-1" />
                                  Selesai
                                </div>
                                
                                <div className="absolute bottom-3 left-3 right-3">
                                  <h3 className="text-white font-medium">{trip.name}</h3>
                                  <div className="flex items-center text-xs text-white/80">
                                    <FaCalendarAlt className="mr-1" size={10} />
                                    {formatDate(trip.date)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                      <Image
                                        src={trip.guide.image}
                                        alt={trip.guide.name}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Pemandu</p>
                                      <p className="text-sm font-medium">{trip.guide.name}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center text-yellow-500">
                                    <FaStar className="mr-1" />
                                    <span className="font-medium">{trip.rating.toFixed(1)}</span>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <button className="flex-1 text-xs bg-blue-600 text-white rounded-lg py-2 font-medium">
                                    Nilai Trip
                                  </button>
                                  <button className="flex-1 text-xs border border-blue-600 text-blue-600 rounded-lg py-2 font-medium">
                                    Detail
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button className="w-full mt-4 py-3 text-blue-600 font-medium text-sm border border-blue-600 rounded-xl">
                          Lihat Semua Riwayat ({tripHistoryData.length})
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Trip Achievement Stats */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6" ref={statsRef}>
            <h2 className="font-semibold mb-4">Pencapaian Trip Anda</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaMountain className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Gunung</p>
                    <p className="text-xs text-gray-500">Gunung yang sudah didaki</p>
                  </div>
                </div>
                <p className="font-bold text-lg stat-counter">8</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <FaClock className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Jam</p>
                    <p className="text-xs text-gray-500">Waktu yang dihabiskan</p>
                  </div>
                </div>
                <p className="font-bold text-lg stat-counter">124</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <FaUsers className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Teman Pendaki</p>
                    <p className="text-xs text-gray-500">Pendaki yang ditemui</p>
                  </div>
                </div>
                <p className="font-bold text-lg stat-counter">47</p>
              </div>
            </div>
            
            {/* Mini chart */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-500">Aktivitas pendakian (6 bulan terakhir)</p>
                <p className="text-xs font-medium text-blue-600">+24%</p>
              </div>
              <div className="h-16 flex items-end space-x-1">
                {[30, 45, 25, 60, 35, 80, 55, 75, 45, 65, 90, 70].map((height, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.7,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Popular guides section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Pemandu Populer</h2>
              <button className="text-blue-600 text-sm font-medium">Lihat Semua</button>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white shadow-sm rounded-xl p-4 min-w-[160px] flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-3">
                    <Image
                      src={`/guides/guide-${i}.jpg`}
                      alt={`Guide ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="font-medium text-center">Pemandu {i}</p>
                  <div className="flex items-center text-yellow-500 mt-1">
                    <FaStar className="mr-1" size={12} />
                    <span className="text-xs">{(4 + i * 0.2).toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {10 + i * 5} trip selesai
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Filter Modal */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 flex items-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                className="bg-white rounded-t-2xl w-full p-5"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-semibold text-lg">Filter Trip</h3>
                  <button onClick={() => setShowFilters(false)}>✕</button>
                </div>
                
                <div className="space-y-5 mb-5">
                  {TRIP_FILTER_OPTIONS.map((option) => (
                    <div key={option.id}>
                      <p className="font-medium mb-2">{option.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {option.id === "date" && 
                          ["Hari ini", "Minggu ini", "Bulan ini", "Custom"].map((item) => (
                            <button
                              key={item}
                              className="border border-gray-300 rounded-full px-4 py-1.5 text-sm"
                            >
                              {item}
                            </button>
                          ))
                        }
                        
                        {option.id === "difficulty" && 
                          ["Semua", "Mudah", "Menengah", "Sulit"].map((item) => (
                            <button
                              key={item}
                              className="border border-gray-300 rounded-full px-4 py-1.5 text-sm"
                            >
                              {item}
                            </button>
                          ))
                        }
                        
                        {option.id === "price" && 
                          ["Semua", "< 500k", "500k - 1jt", "> 1jt"].map((item) => (
                            <button
                              key={item}
                              className="border border-gray-300 rounded-full px-4 py-1.5 text-sm"
                            >
                              {item}
                            </button>
                          ))
                        }
                        
                        {option.id === "duration" && 
                          ["Semua", "1-2 hari", "3-5 hari", "> 5 hari"].map((item) => (
                            <button
                              key={item}
                              className="border border-gray-300 rounded-full px-4 py-1.5 text-sm"
                            >
                              {item}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-xl font-medium">
                    Reset
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl font-medium">
                    Terapkan Filter
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="container mx-auto">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Pendakian</h1>
            <p className="text-gray-600">Temukan pengalaman pendakian terbaik di seluruh Indonesia</p>
          </div>
          
          {/* Search bar */}
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Cari trip..."
              className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8" ref={statsRef}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg col-span-2">
            <div className="flex justify-between">
              <div>
                <p className="text-white/80">Total Trip Tersedia</p>
                <h3 className="text-3xl font-bold mb-1 stat-counter">{tripsData?.length || 28}</h3>
                <p className="text-sm text-white/70">Diperbarui {format(new Date(), "dd MMMM yyyy")}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <FaMountain className="text-white text-xl" />
              </div>
            </div>
            
            <div className="mt-6 h-12 flex items-end space-x-1">
              {[35, 25, 40, 30, 45, 55, 35, 60, 75, 65, 45, 75].map((height, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-white/20 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between mb-3">
              <p className="text-gray-600">Trip Selesai</p>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2 stat-counter">
              {tripHistoryData?.length || 23}
            </h3>
            <div className="flex items-center text-green-600">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M12 10L8 6L4 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-medium">+18% dari bulan lalu</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between mb-3">
              <p className="text-gray-600">Rating Rata-rata</p>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaStar className="text-yellow-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              4.8<span className="text-lg font-normal text-gray-400">/5</span>
            </h3>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500" size={14} />
              ))}
              <span className="text-sm font-medium text-gray-500 ml-1">
                (234 ulasan)
              </span>
            </div>
          </div>
        </div>
        
        {/* Main content with tabs */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Filter Trip</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="font-medium text-gray-900 mb-2">Kategori</p>
                  <div className="space-y-2">
                    {TRIP_CATEGORIES.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center cursor-pointer"
                        onClick={() => setActiveCategory(category.id)}
                      >
                        <div
                          className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${
                            activeCategory === category.id
                              ? "bg-blue-500"
                              : "border border-gray-300"
                          }`}
                        >
                          {activeCategory === category.id && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <p className="text-gray-700">{category.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 mb-2">Tingkat Kesulitan</p>
                  <div className="space-y-2">
                    {["Semua", "Mudah", "Menengah", "Sulit"].map((level) => (
                      <div key={level} className="flex items-center cursor-pointer">
                        <div
                          className="w-4 h-4 rounded-full mr-3 border border-gray-300"
                        ></div>
                        <p className="text-gray-700">{level}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 mb-2">Rentang Harga</p>
                  <div className="px-2">
                    <div className="h-2 bg-gray-200 rounded-full mt-4 mb-6 relative">
                      <div className="absolute h-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full w-1/2"></div>
                      <div className="absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-full -mt-1 left-1/2 transform -translate-x-1/2 cursor-pointer"></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Rp 0</span>
                      <span>Rp 5.000.000</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-gray-900 mb-2">Durasi Trip</p>
                  <div className="flex flex-wrap gap-2">
                    {["1-2 hari", "3-5 hari", "> 5 hari"].map((duration) => (
                      <button
                        key={duration}
                        className="border border-gray-200 rounded-full px-4 py-1.5 text-sm hover:border-blue-500 hover:bg-blue-50"
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2.5 rounded-lg font-medium">
                  Terapkan Filter
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium">
                  Reset Filter
                </button>
              </div>
            </div>
            
            {/* Trip Stats */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Statistik Trip Anda</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FaMountain className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Gunung</p>
                    <p className="font-semibold text-xl stat-counter">8</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <FaClock className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Jam</p>
                    <p className="font-semibold text-xl stat-counter">124</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <FaUsers className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teman Pendaki</p>
                    <p className="font-semibold text-xl stat-counter">47</p>
                  </div>
                </div>
              </div>
              
              {/* Activity Chart */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Aktivitas Pendakian</p>
                  <p className="text-sm font-medium text-green-600">+24%</p>
                </div>
                <div className="h-16 flex items-end space-x-1">
                  {[30, 45, 25, 60, 35, 80, 55, 75, 45, 65, 90, 70].map((height, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-600 opacity-80 rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        delay: i * 0.05,
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>Mei</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>
            
            {/* Popular Guides */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Pemandu Populer</h3>
                <button className="text-sm text-blue-600 font-medium">Lihat Semua</button>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 border-2 border-blue-100">
                      <Image
                        src={`/guides/guide-${i}.jpg`}
                        alt={`Guide ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Pemandu {i}</p>
                      <div className="flex items-center">
                        <div className="flex items-center text-yellow-500 mr-2">
                          <FaStar className="mr-1" size={12} />
                          <span className="text-xs">{(4.5 + i * 0.1).toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {10 + i * 8} trip selesai
                        </span>
                      </div>
                    </div>
                    <button className="text-blue-600">
                      <FaChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="col-span-12 lg:col-span-9">
            {/* Tabs for content type */}
            <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="flex border-b">
                <button
                  className={`px-6 py-4 text-base font-medium ${
                    selectedTab === "upcoming"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setSelectedTab("upcoming")}
                >
                  Trip Mendatang
                </button>
                <button
                  className={`px-6 py-4 text-base font-medium ${
                    selectedTab === "history"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setSelectedTab("history")}
                >
                  Riwayat Trip
                </button>
                <button
                  className={`px-6 py-4 text-base font-medium ${
                    selectedTab === "recommendations"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setSelectedTab("recommendations")}
                >
                  Rekomendasi
                </button>
              </div>
            </div>
            
            {/* Tab content with animation */}
            <AnimatePresence mode="wait">
              {selectedTab === "upcoming" && (
                <motion.div
                  key="upcoming"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  ref={tripsContainerRef}
                >
                  {loadingTrips ? (
                    <div className="flex justify-center p-20">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : filteredTrips.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-16 text-center">
                      <FaMountain className="mx-auto text-gray-300 text-5xl mb-4" />
                      <h3 className="text-xl font-medium text-gray-700 mb-2">
                        Tidak ada trip yang ditemukan
                      </h3>
                      <p className="text-gray-500">
                        Coba ubah filter atau kata kunci pencarian Anda
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Featured trip card */}
                      <div className="mb-6">
                        <div className="bg-white rounded-xl overflow-hidden shadow-md">
                          <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="relative h-64 lg:h-auto">
                              <Image
                                src={`http://localhost:8000/storage/${filteredTrips[0]?.featured_image || "mountains/default.jpg"}`}
                                alt={filteredTrips[0]?.name || "Featured trip"}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                              
                              <div className="absolute top-6 left-6">
                                <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                                  Trip Populer
                                </span>
                              </div>
                              
                              <div className="absolute bottom-6 left-6 right-6">
                                <h2 className="text-white text-2xl font-semibold mb-2">
                                  {filteredTrips[0]?.name || "Trip Pendakian"}
                                </h2>
                                <div className="flex items-center text-white/90 mb-4">
                                  <FaMapMarkerAlt className="mr-1" size={14} />
                                  <span>{filteredTrips[0]?.mountain_name || "Gunung"}</span>
                                </div>
                                <div className="flex space-x-3">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center">
                                    <FaCalendarAlt className="mr-2 text-white" size={14} />
                                    <span className="text-white text-sm">
                                      {formatDate(filteredTrips[0]?.start_date || new Date())}
                                    </span>
                                  </div>
                                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center">
                                    <FaUsers className="mr-2 text-white" size={14} />
                                    <span className="text-white text-sm">
                                      {filteredTrips[0]?.participants_count || 0}/{filteredTrips[0]?.max_participants || 10} Peserta
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center text-yellow-500 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(filteredTrips[0]?.rating || 4.5) ? 'text-yellow-500' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                    <span className="text-sm text-gray-500 ml-2">
                                      ({filteredTrips[0]?.reviews_count || 12} ulasan)
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    Dipandu oleh <span className="font-medium text-gray-900">
                                      {filteredTrips[0]?.guide_name || "Guide Name"}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full">
                                    Tersedia
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-gray-700 mb-5">
                                {filteredTrips[0]?.description?.substring(0, 200) || 
                                  "Trip pendakian menakjubkan yang dilengkapi dengan pemandu berpengalaman. Nikmati keindahan alam dan petualangan mendaki gunung yang menantang. Pastikan Anda membawa perlengkapan yang diperlukan untuk kenyamanan dan keselamatan."}...
                              </p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-500 mb-1">Tingkat Kesulitan</p>
                                  <p className="font-medium">
                                    {filteredTrips[0]?.difficulty_level || "Menengah"}
                                  </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-500 mb-1">Durasi Trip</p>
                                  <p className="font-medium">
                                    {filteredTrips[0]?.duration || "3"} Hari
                                  </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-500 mb-1">Ketinggian</p>
                                  <p className="font-medium">
                                    {filteredTrips[0]?.elevation || "2.800"} mdpl
                                  </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-500 mb-1">Jarak Tempuh</p>
                                  <p className="font-medium">
                                    {filteredTrips[0]?.distance || "12"} km
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-500">Mulai dari</p>
                                  <p className="text-2xl font-bold text-blue-600">
                                    Rp {Number(filteredTrips[0]?.price || 1500000).toLocaleString('id-ID')}
                                  </p>
                                </div>
                                
                                <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-lg transition-shadow">
                                  Lihat Detail
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trip grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTrips.slice(1).map((trip) => (
                          <motion.div
                            key={trip.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden trip-card cursor-pointer"
                            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                            onClick={() => handleTripClick(trip.id)}
                            onMouseEnter={() => setHoveredTrip(trip.id)}
                            onMouseLeave={() => setHoveredTrip(null)}
                          >
                            <div className="relative h-48">
                              <Image
                                src={`http://localhost:8000/storage/${trip.featured_image || "mountains/default.jpg"}`}
                                alt={trip.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                              
                              <motion.div 
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                whileTap={{ scale: 0.9 }}
                              >
                                <FaHeart className={`${hoveredTrip === trip.id ? 'text-red-500' : 'text-white'}`} />
                              </motion.div>
                              
                              <div className="absolute top-3 left-3">
                                <span className="bg-blue-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                                  {trip.duration} Hari
                                </span>
                              </div>
                              
                              <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="text-white font-medium text-lg">{trip.name}</h3>
                                <div className="flex items-center text-white/80">
                                  <FaMapMarkerAlt className="mr-1" size={12} />
                                  <span className="text-sm">{trip.mountain_name}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-5">
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center text-yellow-500">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar 
                                      key={i} 
                                      className={`w-3.5 h-3.5 ${i < Math.floor(trip.rating || 4) ? 'text-yellow-500' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                  <span className="text-xs text-gray-500 ml-1">
                                    ({trip.reviews_count || Math.floor(Math.random() * 20 + 5)})
                                  </span>
                                </div>
                                
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  trip.status === "completed" ? "bg-green-100 text-green-600" : 
                                  trip.status === "cancelled" ? "bg-red-100 text-red-600" : 
                                  "bg-blue-100 text-blue-600"
                                }`}>
                                  {trip.status === "completed" ? "Selesai" : 
                                   trip.status === "cancelled" ? "Dibatalkan" : 
                                   "Tersedia"}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <FaCalendarAlt className="mr-1.5 text-blue-500" size={12} />
                                  {formatDate(trip.start_date)}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <FaUsers className="mr-1.5 text-blue-500" size={12} />
                                  {trip.participants_count || 0}/{trip.max_participants || 10}
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs text-gray-500">Harga mulai dari</p>
                                  <p className="text-blue-600 font-bold">
                                    Rp {Number(trip.price || 1000000).toLocaleString('id-ID')}
                                  </p>
                                </div>
                                
                                <motion.button
                                  className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white h-9 w-9 rounded-full"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <FaChevronRight size={12} />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
              
              {selectedTab === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  ref={historySectionRef}
                >
                  {loadingHistory ? (
                    <div className="flex justify-center p-20">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-5">Ringkasan Pencapaian Pendakian</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <p className="text-gray-700">Total Gunung</p>
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <FaMountain className="text-blue-600" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 stat-counter">8</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <p className="text-gray-700">Total Trip</p>
                              <div className="bg-indigo-100 p-2 rounded-lg">
                                <FaHistory className="text-indigo-600" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 stat-counter">{tripHistoryData.length}</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <p className="text-gray-700">Ketinggian Maks</p>
                              <div className="bg-green-100 p-2 rounded-lg">
                                <FaChartLine className="text-green-600" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 stat-counter">3,726</p>
                            <p className="text-sm text-gray-500">mdpl</p>
                          </div>
                          
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <p className="text-gray-700">Total Jam</p>
                              <div className="bg-yellow-100 p-2 rounded-lg">
                                <FaClock className="text-yellow-600" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 stat-counter">124</p>
                            <p className="text-sm text-gray-500">jam pendakian</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Frekuensi Pendakian</h3>
                            <div className="h-40 flex items-end space-x-1">
                              {[25, 40, 35, 50, 30, 60, 45, 65, 55, 45, 70, 60].map((height, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                  <motion.div 
                                    className="w-full bg-blue-500 rounded-t"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${height}%` }}
                                    transition={{ duration: 0.7, delay: i * 0.05 }}
                                  />
                                  <span className="text-xs text-gray-500 mt-2">{
                                    ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 
                                     'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]
                                  }</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4">
                            <h3 className="font-medium text-gray-900 mb-3">Gunung Terpopuler</h3>
                            <div className="space-y-3">
                              {['Semeru', 'Rinjani', 'Merapi', 'Bromo', 'Merbabu'].map((mountain, i) => (
                                <div key={i} className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                                    {i + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{mountain}</p>
                                    <div className="h-1.5 bg-gray-100 rounded-full mt-1">
                                      <motion.div
                                        className="h-full bg-blue-600 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${85 - (i * 12)}%` }}
                                        transition={{ duration: 0.7, delay: 0.2 + (i * 0.1) }}
                                      />
                                    </div>
                                  </div>
                                  <span className="text-sm font-medium ml-3">
                                    {5 - i} kali
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-4">Riwayat Trip</h3>
                      
                      <div className="space-y-6">
                        {tripHistoryData.map((trip) => (
                          <motion.div 
                            key={trip.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                            whileHover={{ y: -3 }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3">
                              <div className="relative h-48 md:h-auto">
                                <Image
                                  src={trip.image}
                                  alt={trip.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                
                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                  <FaCheck className="mr-1" />
                                  Selesai
                                </div>
                                
                                <div className="absolute bottom-4 left-4">
                                  <h3 className="text-white font-medium text-lg mb-1">{trip.name}</h3>
                                  <div className="flex items-center text-white/80 text-sm">
                                    <FaCalendarAlt className="mr-2" size={12} />
                                    {formatDate(trip.date)}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="col-span-2 p-6">
                                <div className="flex flex-wrap gap-6 mb-6">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                      <Image
                                        src={trip.guide.image}
                                        alt={trip.guide.name}
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Pemandu</p>
                                      <p className="font-medium">{trip.guide.name}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="text-xs text-gray-500">Peserta</p>
                                    <p className="font-medium">{trip.participants} orang</p>
                                  </div>
                                  
                                  <div>
                                    <p className="text-xs text-gray-500">Durasi</p>
                                    <p className="font-medium">{trip.duration} hari</p>
                                  </div>
                                  
                                  <div>
                                    <p className="text-xs text-gray-500">Ketinggian</p>
                                    <p className="font-medium">{trip.elevation.toLocaleString()} mdpl</p>
                                  </div>
                                  
                                  <div>
                                    <p className="text-xs text-gray-500">Rating</p>
                                    <div className="flex items-center">
                                      <div className="flex items-center text-yellow-500 mr-1">
                                        <FaStar size={14} />
                                      </div>
                                      <p className="font-medium">{trip.rating.toFixed(1)}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div className="flex">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium mr-2">
                                      Nilai Trip
                                    </button>
                                    <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium">
                                      Lihat Detail
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center text-gray-500">
                                    <FaHistory className="mr-2" />
                                    <span className="text-sm">{Math.floor(Math.random() * 11) + 2} bulan yang lalu</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
              
              {selectedTab === "recommendations" && (
                <motion.div
                  key="recommendations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 text-center border-b">
                      <h2 className="text-2xl font-semibold mb-2">Trip yang Direkomendasikan untuk Anda</h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        Berdasarkan riwayat pendakian dan preferensi Anda, kami merekomendasikan trip pendakian berikut
                      </p>
                    </div>
                    
                    <div className="p-6">
                      {!loadingTrips && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {filteredTrips.slice(0, 3).map((trip) => (
                            <motion.div
                              key={trip.id}
                              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
                              onClick={() => handleTripClick(trip.id)}
                            >
                              <div className="relative h-48">
                                <Image
                                  src={`http://localhost:8000/storage/${trip.featured_image || "mountains/default.jpg"}`}
                                  alt={trip.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                
                                <div className="absolute top-3 left-3">
                                  <span className="bg-blue-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                                    Rekomendasi
                                  </span>
                                </div>
                                
                                <div className="absolute bottom-3 left-3 right-3">
                                  <h3 className="text-white font-medium text-lg">{trip.name}</h3>
                                  <div className="flex items-center text-white/80">
                                    <FaMapMarkerAlt className="mr-1" size={12} />
                                    <span className="text-sm">{trip.mountain_name}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <div className="flex justify-between items-center mb-3">
                                  <div className="flex items-center text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar 
                                        key={i} 
                                        className={`w-3.5 h-3.5 ${i < Math.floor(trip.rating || 4) ? 'text-yellow-500' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">
                                      ({trip.reviews_count || Math.floor(Math.random() * 20 + 5)})
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center mb-4">
                                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                    <FaCalendarAlt className="text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Tanggal Mulai</p>
                                    <p className="text-sm font-medium">{formatDate(trip.start_date)}</p>
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-xs text-gray-500">Harga mulai dari</p>
                                    <p className="text-blue-600 font-bold">
                                      Rp {Number(trip.price || 1000000).toLocaleString('id-ID')}
                                    </p>
                                  </div>
                                  
                                  <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                    Detail
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripExplorer;