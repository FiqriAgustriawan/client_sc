"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { tripService } from "@/services/tripService";
import {
  FiFilter,
  FiX,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiSearch,
  FiChevronDown,
  FiMapPin,
  FiTrendingUp,
} from "react-icons/fi";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    mountain: "",
    difficulty: "",
    priceRange: "",
    dateRange: "",
    capacity: "",
    guide: "",
  });

  // Filter options based on available data
  const [filterOptions, setFilterOptions] = useState({
    mountains: [],
    difficulties: [],
    guides: [],
    priceRanges: [
      { label: "< Rp 500.000", min: 0, max: 500000 },
      { label: "Rp 500.000 - Rp 1.000.000", min: 500000, max: 1000000 },
      { label: "Rp 1.000.000 - Rp 2.000.000", min: 1000000, max: 2000000 },
      { label: "> Rp 2.000.000", min: 2000000, max: Infinity },
    ],
    dateRanges: [
      { label: "Minggu ini", value: "thisWeek" },
      { label: "Bulan ini", value: "thisMonth" },
      { label: "3 Bulan kedepan", value: "next3Months" },
      { label: "6 Bulan kedepan", value: "next6Months" },
    ],
    capacityRanges: [
      { label: "1-5 orang", min: 1, max: 5 },
      { label: "6-10 orang", min: 6, max: 10 },
      { label: "11-15 orang", min: 11, max: 15 },
      { label: "> 15 orang", min: 16, max: Infinity },
    ],
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await tripService.getAllTrips();
        if (response.success) {
          setTrips(response.data);
          setFilteredTrips(response.data);

          // Extract unique filter options from trips data
          const mountains = [
            ...new Set(
              response.data
                .map((trip) => trip.mountain?.nama_gunung)
                .filter(Boolean)
            ),
          ];
          const difficulties = [
            ...new Set(
              response.data
                .map((trip) => trip.mountain?.tingkat_kesulitan)
                .filter(Boolean)
            ),
          ];
          const guides = [
            ...new Set(
              response.data
                .map((trip) => getGuideName(trip.guide))
                .filter((name) => name !== "Guide not found")
            ),
          ];

          setFilterOptions((prev) => ({
            ...prev,
            mountains: mountains.map((name) => ({ label: name, value: name })),
            difficulties: difficulties.map((diff) => ({
              label: diff,
              value: diff,
            })),
            guides: guides.map((name) => ({ label: name, value: name })),
          }));
        }
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...trips];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (trip) =>
          trip.mountain?.nama_gunung
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          trip.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          getGuideName(trip.guide)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Mountain filter
    if (filters.mountain) {
      filtered = filtered.filter(
        (trip) => trip.mountain?.nama_gunung === filters.mountain
      );
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(
        (trip) => trip.mountain?.tingkat_kesulitan === filters.difficulty
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const range = filterOptions.priceRanges.find(
        (r) => r.label === filters.priceRange
      );
      if (range) {
        filtered = filtered.filter(
          (trip) => trip.price >= range.min && trip.price <= range.max
        );
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date();
      filtered = filtered.filter((trip) => {
        const tripStart = new Date(trip.start_date);

        switch (filters.dateRange) {
          case "thisWeek":
            const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            return tripStart >= now && tripStart <= oneWeek;
          case "thisMonth":
            const oneMonth = new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              now.getDate()
            );
            return tripStart >= now && tripStart <= oneMonth;
          case "next3Months":
            const threeMonths = new Date(
              now.getFullYear(),
              now.getMonth() + 3,
              now.getDate()
            );
            return tripStart >= now && tripStart <= threeMonths;
          case "next6Months":
            const sixMonths = new Date(
              now.getFullYear(),
              now.getMonth() + 6,
              now.getDate()
            );
            return tripStart >= now && tripStart <= sixMonths;
          default:
            return true;
        }
      });
    }

    // Capacity filter
    if (filters.capacity) {
      const range = filterOptions.capacityRanges.find(
        (r) => r.label === filters.capacity
      );
      if (range) {
        filtered = filtered.filter(
          (trip) => trip.capacity >= range.min && trip.capacity <= range.max
        );
      }
    }

    // Guide filter
    if (filters.guide) {
      filtered = filtered.filter(
        (trip) => getGuideName(trip.guide) === filters.guide
      );
    }

    setFilteredTrips(filtered);
  }, [trips, searchQuery, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      mountain: "",
      difficulty: "",
      priceRange: "",
      dateRange: "",
      capacity: "",
      guide: "",
    });
    setSearchQuery("");
  };

  const activeFiltersCount =
    Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

  const getGuideName = (guide) => {
    if (!guide) return "Guide not found";

    // Try to get name from user relationship
    if (guide.user?.username) return guide.user.username;
    if (guide.user?.full_name) return guide.user.full_name;
    if (guide.user?.email) return guide.user.email.split("@")[0];

    // Fallback to guide's own properties
    if (guide.username) return guide.username;
    if (guide.full_name) return guide.full_name;
    if (guide.email) return guide.email.split("@")[0];

    return "Unknown Guide";
  };

  const getMountainImage = (trip) => {
    if (trip?.mountain?.image_path) {
      return trip.mountain.image_path;
    }
    return "/placeholder.jpg";
  };

  const getGuideInitials = (guide) => {
    if (!guide?.user?.name) return "GD";
    const names = guide.user.name.split(" ");
    return names
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  const getGuideImage = (guide) => {
    return guide?.user?.profile_image || "/default-avatar.png";
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";
    return `http://localhost:8000/storage/${imagePath}`;
  };

  const formatTripDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If same month
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString(
        "id-ID",
        { month: "long" }
      )}`;
    }

    // Different months
    return `${start.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })} - ${end.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    })}`;
  };

  const FilterDropdown = ({
    title,
    icon,
    options,
    value,
    onChange,
    placeholder,
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-3 border rounded-xl bg-white hover:bg-gray-50 transition-colors ${
            value ? "border-blue-500 bg-blue-50" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{value || placeholder}</span>
          </div>
          <FiChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto"
            >
              <div className="p-1">
                {value && (
                  <button
                    onClick={() => {
                      onChange("");
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg"
                  >
                    Hapus filter
                  </button>
                )}
                {options.map((option) => (
                  <button
                    key={option.value || option.label}
                    onClick={() => {
                      onChange(option.value || option.label);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat trip...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-32">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Open Trip Available</h1>
            <p className="text-gray-600">
              {filteredTrips.length} dari {trips.length} trip tersedia
            </p>
          </div>

          {/* Search & Filter Toggle */}
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative flex-1 md:w-80">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari gunung, guide, atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                showFilters || activeFiltersCount > 0
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FiFilter className="w-4 h-4" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filter Trip</h3>
                <div className="flex items-center gap-2">
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50"
                    >
                      Hapus semua
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <FilterDropdown
                  title="Gunung"
                  icon={<FiMapPin className="w-4 h-4 text-gray-500" />}
                  options={filterOptions.mountains}
                  value={filters.mountain}
                  onChange={(value) => handleFilterChange("mountain", value)}
                  placeholder="Pilih Gunung"
                />

                <FilterDropdown
                  title="Tingkat Kesulitan"
                  icon={<FiTrendingUp className="w-4 h-4 text-gray-500" />}
                  options={filterOptions.difficulties}
                  value={filters.difficulty}
                  onChange={(value) => handleFilterChange("difficulty", value)}
                  placeholder="Tingkat Kesulitan"
                />

                <FilterDropdown
                  title="Rentang Harga"
                  icon={<FiDollarSign className="w-4 h-4 text-gray-500" />}
                  options={filterOptions.priceRanges}
                  value={filters.priceRange}
                  onChange={(value) => handleFilterChange("priceRange", value)}
                  placeholder="Rentang Harga"
                />

                <FilterDropdown
                  title="Waktu Trip"
                  icon={<FiCalendar className="w-4 h-4 text-gray-500" />}
                  options={filterOptions.dateRanges}
                  value={filters.dateRange}
                  onChange={(value) => handleFilterChange("dateRange", value)}
                  placeholder="Waktu Trip"
                />

                <FilterDropdown
                  title="Kapasitas"
                  icon={<FiUsers className="w-4 h-4 text-gray-500" />}
                  options={filterOptions.capacityRanges}
                  value={filters.capacity}
                  onChange={(value) => handleFilterChange("capacity", value)}
                  placeholder="Kapasitas"
                />

                <FilterDropdown
                  title="Guide"
                  icon={<FiUsers className="w-4 h-4 text-gray-500" />}
                  options={filterOptions.guides}
                  value={filters.guide}
                  onChange={(value) => handleFilterChange("guide", value)}
                  placeholder="Pilih Guide"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <FiSearch className="w-3 h-3" />"{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-blue-600"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {Object.entries(filters).map(([key, value]) =>
              value ? (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {value}
                  <button
                    onClick={() => handleFilterChange(key, "")}
                    className="ml-1 hover:text-blue-600"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ) : null
            )}
          </div>
        )}

        {/* Trip Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <FiMapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Tidak ada trip yang ditemukan
            </h3>
            <p className="text-gray-500 mb-4">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Hapus semua filter
            </button>
          </div>
        ) : (
          <motion.div
            key={filteredTrips.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTrips.map((trip) => (
              <Link href={`/trips/${trip.id}`} key={trip.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={getImageUrl(trip.images[0]?.image_path)}
                      alt={trip.mountain?.nama_gunung || "Mountain"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      Open Trip
                    </div>
                    {trip.mountain?.tingkat_kesulitan && (
                      <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {trip.mountain.tingkat_kesulitan}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <h2 className="text-xl font-semibold text-white mb-2">
                        {trip.mountain?.nama_gunung || "Mountain Name"}
                      </h2>

                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1.5 text-white/90 text-sm">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {formatTripDate(trip.start_date, trip.end_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/90 text-sm">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <span>{trip.capacity} slot</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {trip.guide?.user?.profile_image ? (
                            <Image
                              src={getImageUrl(trip.guide.user.profile_image)}
                              alt={getGuideName(trip.guide)}
                              width={24}
                              height={24}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold">
                              {getGuideInitials(trip.guide)}
                            </div>
                          )}
                          <span className="text-white/90 text-sm">
                            {getGuideName(trip.guide)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold">
                            Rp {trip.price?.toLocaleString()}
                          </span>
                          <button className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all duration-300">
                            Lihat Trip
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}