"use client";

import React, { useState, useEffect, useRef } from "react";
import HeroGunung from "@/assets/images/Bg-Home.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaMountain,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// Climber experience levels
const CLIMBER_LEVELS = [
  { id: "pemula", label: "Pemula" },
  { id: "menengah", label: "Menengah" },
  { id: "berpengalaman", label: "Berpengalaman" },
  { id: "profesional", label: "Profesional" },
];

const HeroImage = () => {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cardExpanded, setCardExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State for filter values
  const [selectedLevel, setSelectedLevel] = useState(CLIMBER_LEVELS[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showMobileLevelSelector, setShowMobileLevelSelector] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");

  // Fetch mountains data from API
  const { data: mountainsData, isLoading: loadingMountains } = useQuery({
    queryKey: ["mountains"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8000/api/mountains");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    placeholderData: [],
  });

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close datepicker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    // Navigate to trips page with filter params
    router.push(
      `/trips?level=${selectedLevel.id}&date=${format(
        selectedDate,
        "yyyy-MM-dd"
      )}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`
    );
  };

  // Toggle card expansion for mobile
  const toggleCard = () => {
    setCardExpanded(!cardExpanded);
  };

  // Mobile design
  if (isMobile) {
    return (
      <div className="relative h-screen overflow-hidden  bg-gradient-to-b from-blue-600 to-indigo-900">
        {/* Background image with parallax effect */}
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0.6 }}
          className="w-full h-full absolute  "
        >
          <Image
            src={HeroGunung}
            alt="Mountain landscape"
            className="w-full h-full object-cover   "
            fill
            priority
            quality={90}
          />
        </motion.div>

        {/* Header text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="absolute top-0 left-0 right-0 pt-16 px-6 text-white z-10"
        >
          <h1 className="text-4xl font-bold mb-2">Jelajahi Puncak</h1>
          <h1 className="text-4xl font-bold mb-3">Gunung Indonesia</h1>
          <p className="text-lg opacity-90 mb-6 leading-relaxed">
            Temukan pengalaman pendakian yang aman dan berkesan bersama pemandu
            terpercaya
          </p>
        </motion.div>

        {/* Bottom sheet card with animation */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20 transition-all duration-500`}
          animate={{
            height: cardExpanded ? "85%" : "60%",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          {/* Drag handle */}
          <div
            className="flex justify-center py-3 cursor-pointer"
            onClick={toggleCard}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Card content */}
          <div className="px-6 pb-20 h-full overflow-y-auto">
            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative mb-6"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari gunung atau trip..."
                  className="w-full px-5 py-4 pl-12 pr-10 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <FaSearch
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            </motion.div>

            {/* Tabs for different sections */}
            <div className="flex justify-between mb-6 bg-gray-100 rounded-xl p-1">
              {["popular", "nearby", "trending"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  {tab === "popular" && "Populer"}
                  {tab === "nearby" && "Terdekat"}
                  {tab === "trending" && "Trending"}
                </button>
              ))}
            </div>

            {/* Mountain Destinations Carousel */}
            <div className="mb-7">
              <h2 className="text-xl font-bold mb-4">Destinasi Populer</h2>

              {loadingMountains ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={"auto"}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                  }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  pagination={{ clickable: true }}
                  modules={[Autoplay, Pagination, EffectCoverflow]}
                  className="mountCarousel py-6"
                >
                  {(mountainsData || []).map((mountain) => (
                    <SwiperSlide
                      key={mountain.id}
                      style={{ width: "260px", height: "160px" }}
                    >
                      <div className="relative w-full h-full rounded-2xl overflow-hidden mx-auto">
                        <Image
                          src={`http://localhost:8000/storage/${
                            mountain.images?.[0]?.image_path ||
                            "mountains/default.jpg"
                          }`}
                          alt={mountain.nama_gunung}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-white font-semibold text-lg">
                            {mountain.nama_gunung}
                          </h3>
                          <div className="flex items-center text-white text-sm mt-1">
                            <FaMapMarkerAlt className="mr-1" size={12} />
                            <span>{mountain.lokasi}</span>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Search filters */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Filter Pencarian</h2>
              <div className="space-y-4">
                {/* Status Pendaki */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div
                    className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMobileLevelSelector(true)}
                  >
                    <div className="bg-blue-100 p-3 rounded-full mr-3">
                      <FaUser className="text-blue-500" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Status Pendaki
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedLevel.label}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.div>

                {/* Tanggal Mendaki */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div
                    className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDatePicker(true)}
                  >
                    <div className="bg-blue-100 p-3 rounded-full mr-3">
                      <FaCalendarAlt className="text-blue-500" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Tanggal Mendaki
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(selectedDate, "dd MMMM yyyy")}
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Date quick select */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Tanggal Populer
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { days: 0, label: "Hari ini" },
                  { days: 3, label: "Akhir pekan" },
                  { days: 7, label: "Minggu depan" },
                ].map((item) => (
                  <motion.button
                    key={item.days}
                    whileTap={{ scale: 0.95 }}
                    className={`py-3 px-2 rounded-xl text-sm font-medium flex flex-col items-center justify-center ${
                      format(addDays(new Date(), item.days), "yyyy-MM-dd") ===
                      format(selectedDate, "yyyy-MM-dd")
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50 text-gray-800"
                    }`}
                    onClick={() =>
                      setSelectedDate(addDays(new Date(), item.days))
                    }
                  >
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Analytics chart area */}
            {cardExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      Statistik Pendakian
                    </h3>
                    <p className="text-xs text-gray-600">
                      Bulan{" "}
                      {new Date().toLocaleDateString("id-ID", {
                        month: "long",
                      })}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    +12%
                  </span>
                </div>
                <div className="h-32 flex items-end space-x-1.5">
                  {[35, 25, 40, 30, 45, 55, 35, 60, 75, 65, 45, 80].map(
                    (height, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{
                          delay: i * 0.05,
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                      />
                    )
                  )}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>1</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                  <span>25</span>
                  <span>30</span>
                </div>
              </motion.div>
            )}

            {/* Search button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold mb-8 flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-indigo-700 shadow-md"
              onClick={handleSearch}
            >
              <FaMountain size={18} />
              <span>Cari Trip Pendakian</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Level selector modal */}
        <AnimatePresence>
          {showMobileLevelSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
              onClick={() => setShowMobileLevelSelector(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-4/5 max-w-xs overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Status Pendaki
                  </h3>
                </div>
                <div className="py-2">
                  {CLIMBER_LEVELS.map((level) => (
                    <div
                      key={level.id}
                      className="px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 active:bg-gray-100"
                      onClick={() => {
                        setSelectedLevel(level);
                        setShowMobileLevelSelector(false);
                      }}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedLevel.id === level.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedLevel.id === level.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <p className="text-gray-900">{level.label}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <button
                    className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium"
                    onClick={() => setShowMobileLevelSelector(false)}
                  >
                    Pilih
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Date picker modal */}
        <AnimatePresence>
          {showDatePicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4"
              onClick={() => setShowDatePicker(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-xs overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pilih Tanggal
                  </h3>
                </div>
                <div className="p-2">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date || new Date());
                      setShowDatePicker(false);
                    }}
                    inline
                    minDate={new Date()}
                    className="react-datepicker--mobile"
                  />
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-between">
                  <button
                    className="px-4 py-2 text-gray-500"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Batal
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => setShowDatePicker(false)}
                  >
                    Pilih
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop design from DesktopHeroSection.jsx
  return (
    <div className="relative h-screen bg-[#4a75e4] overflow-hidden ">
      {/* Background Image with overlay */}
      <Image
        src={HeroGunung}
        alt="Mountain landscape"
        width={1920}
        height={1080}
        priority
        quality={85}
        className=" w-full h-[1080px] mt-64  object-cover " // Reduced height while keeping full width
      />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        {/* Hero Text */}
        <h1 className="text-5xl sm:text-5xl md:text-6xl font-bold max-w-5xl mx-auto leading-tight text-center mb-6 px-4">
          Setiap Langkah Membawa Anda Menuju Puncak Impian
        </h1>

        {/* Subtitle text */}
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-base sm:text-lg md:text-xl lg:text-xl font-normal leading-normal">
            Gabung bersama kami untuk pengalaman pendakian yang aman, seru, dan
            tak terlupakan.
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl font-normal leading-normal mt-1">
            Siap melangkah lebih dekat ke puncak impian?
          </p>
        </div>

        {/* Search/Filter Component */}
        <div className="absolute bottom-20 md:bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-[600px] px-4">
          <div className="bg-white rounded-full shadow-lg flex items-center overflow-hidden">
            {/* Status Pendaki */}
            <div className="flex-1 border-r border-gray-200 relative">
              <div
                className="flex items-center px-5 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setShowLevelDropdown((prev) => !prev)}
              >
                <div className="text-blue-500 mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">Status Pendaki</p>
                  <p className="text-gray-900 font-medium">Pemula</p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Level Dropdown */}
              {showLevelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg z-50 py-2">
                  {CLIMBER_LEVELS.map((level) => (
                    <div
                      key={level.id}
                      className="px-5 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLevel(level);
                        setShowLevelDropdown(false);
                      }}
                    >
                      <p className="text-gray-900">{level.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tanggal Mendaki */}
            <div ref={datePickerRef} className="relative flex-1">
              <div
                className="flex items-center px-5 py-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <div className="text-blue-500 mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8 2V5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 2V5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 9.09H20.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">Tanggal Mendaki</p>
                  <p className="text-gray-900 font-medium">
                    {format(selectedDate, "dd / MM / yyyy")}
                  </p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Submit Button - Arrow icon */}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center transition-colors flex-shrink-0 mr-4"
              onClick={handleSearch}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4301 5.93005L20.5001 12.0001L14.4301 18.0701"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 12H20.33"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating DatePicker */}
      {showDatePicker && !isMobile && (
        <div
          className="fixed inset-0 z-[999] flex items-start justify-center pt-32"
          onClick={(e) =>
            e.target === e.currentTarget && setShowDatePicker(false)
          }
        >
          <div className="bg-white shadow-2xl rounded-xl p-5 border border-gray-100 animate-fadeIn">
            <div className="mb-2 pb-2 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">
                Pilih Tanggal Mendaki
              </h3>
            </div>

            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date || new Date());
                  setShowDatePicker(false);
                }}
                inline
                minDate={new Date()}
                className="react-datepicker--custom"
                calendarClassName="!rounded-lg shadow-sm"
                monthsShown={1}
              />

              <div className="absolute inset-0 pointer-events-none rounded-lg border border-blue-100"></div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
              <button
                className="text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors py-2 px-4"
                onClick={() => setShowDatePicker(false)}
              >
                Cancel
              </button>
              <button
                className="text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors py-2 px-4 rounded-lg"
                onClick={() => setShowDatePicker(false)}
              >
                Pilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroImage;
