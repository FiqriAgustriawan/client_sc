'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import arrow from "@/assets/svgs/Arrow.svg";
import { getMountains } from "@/services/mountain.service";
import Link from "next/link";
import { FiMapPin, FiArrowRight, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaMountain, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion"; // Tambahkan framer-motion untuk animasi

function CardListGunung() {
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleMountains, setVisibleMountains] = useState([]); // Untuk animasi tampilan bertahap
  
  // Fitur carousel untuk mobile
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredMountain, setHoveredMountain] = useState(null);

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');
        // Call the correct function with the token
        const response = await getMountains(token);
        // Update to use the correct data structure
        const mountainsData = response.data || response;
        setMountains(mountainsData);
        
        // Animasi tampilan bertahap
        if (mountainsData.length > 0) {
          setVisibleMountains([mountainsData[0]]);
          
          // Add more mountains one by one
          let index = 1;
          const interval = setInterval(() => {
            if (index < mountainsData.length) {
              setVisibleMountains(prev => [...prev, mountainsData[index]]);
              index++;
            } else {
              clearInterval(interval);
            }
          }, 100); // Interval antar animasi
        }
      } catch (err) {
        console.error("Error fetching mountains:", err);
        setError("Failed to load mountains data");
      } finally {
        setLoading(false);
      }
    };

    fetchMountains();
  }, []);
  
  // Filter mountains based on search and filter
  const filteredMountains = mountains.filter(mountain => {
    const matchesSearch = mountain.nama_gunung.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mountain.lokasi.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === "all") return matchesSearch;
    
    // Contoh filter ketinggian, bisa disesuaikan dengan kebutuhan
    if (activeFilter === "high") return matchesSearch && mountain.ketinggian > 3000;
    if (activeFilter === "medium") return matchesSearch && mountain.ketinggian <= 3000 && mountain.ketinggian >= 2000;
    if (activeFilter === "low") return matchesSearch && mountain.ketinggian < 2000;
    
    return matchesSearch;
  });
  
  // Next/Prev controls for mobile carousel
  const nextSlide = () => {
    if (currentIndex < mountains.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };
  
  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(mountains.length - 1); // Loop to end
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"></div>
            <FaMountain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 text-xl" />
          </div>
          <p className="text-blue-500 font-medium animate-pulse">Loading mountains...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-red-50 rounded-lg m-4">
        <div className="text-center p-8 rounded-lg border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="text-red-500 font-medium text-lg">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="mountains-list" className="pb-16 bg-gradient-to-b from-white to-blue-50">
      {/* Header with search and filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-20 bg-white/80 backdrop-blur-md shadow-sm px-[20px] md:px-[50px] lg:px-[65px] py-4"
      >
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-[18px] md:text-[23px] lg:text-[28px] font-bold text-gray-800">
            <span className="text-blue-500">Menampilkan</span> {filteredMountains.length} Gunung
          </h1>
          
          {/* Search input */}
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <input
              type="text"
              placeholder="Cari nama gunung atau lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Filter buttons */}
          <div className="flex space-x-2 overflow-x-auto scrollbar-hidden w-full md:w-auto py-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeFilter === "all" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveFilter("high")}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeFilter === "high" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              &gt; 3000 MDPL
            </button>
            <button
              onClick={() => setActiveFilter("medium")}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeFilter === "medium" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              2000-3000 MDPL
            </button>
            <button
              onClick={() => setActiveFilter("low")}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                activeFilter === "low" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              &lt; 2000 MDPL
            </button>
          </div>
        </div>
      </motion.div>

      {/* Featured Mountains - Desktop */}
      {filteredMountains.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex pt-10 gap-[34px] px-[20px] md:px-[50px] lg:px-[65px]"
        >
          {/* Featured Mountain 1 */}
          <Link href={`/gunung/${filteredMountains[0].id}`} className="w-1/2 group">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-[30px] h-[400px] shadow-lg"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${filteredMountains[0].images[0]?.image_path}`}
                alt={filteredMountains[0].nama_gunung}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="bg-blue-500/80 backdrop-blur-sm w-fit px-3 py-1 rounded-full text-white text-sm">
                  Featured
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-white/90">
                    <FaMountain /> 
                    <span className="text-lg">{filteredMountains[0].ketinggian} MDPL</span>
                  </div>
                  
                  <h1 className="text-[45px] xl:text-[59px] font-bold text-white drop-shadow-lg">
                    {filteredMountains[0].nama_gunung}
                  </h1>
                  
                  <div className="flex justify-between items-end pt-2">
                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <FiMapPin className="text-white" />
                      <h2 className="text-[18px] xl:text-[22px] font-medium text-white">
                        {filteredMountains[0].lokasi.split(',')[0]}
                      </h2>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-[60px] w-[180px] lg:w-[180px] lg:h-[60px] xl:w-[210px] xl:h-[69px] bg-white/90 backdrop-blur-md lg:text-[16px] xl:text-[18px] flex items-center justify-center rounded-full font-medium shadow-lg group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"
                    >
                      <span className="mr-2">Lihat Detail</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Featured Mountain 2 */}
          {filteredMountains.length > 1 && (
            <Link href={`/gunung/${filteredMountains[1].id}`} className="w-1/2 group">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-[30px] h-[400px] shadow-lg"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${filteredMountains[1].images[0]?.image_path}`}
                  alt={filteredMountains[1].nama_gunung}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="bg-emerald-500/80 backdrop-blur-sm w-fit px-3 py-1 rounded-full text-white text-sm">
                    Featured
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-white/90">
                      <FaMountain /> 
                      <span className="text-lg">{filteredMountains[1].ketinggian} MDPL</span>
                    </div>
                    
                    <h1 className="text-[45px] xl:text-[59px] font-bold text-white drop-shadow-lg">
                      {filteredMountains[1].nama_gunung}
                    </h1>
                    
                    <div className="flex justify-between items-end pt-2">
                      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <FiMapPin className="text-white" />
                        <h2 className="text-[18px] xl:text-[22px] font-medium text-white">
                          {filteredMountains[1].lokasi.split(',')[0]}
                        </h2>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-[60px] w-[180px] lg:w-[180px] lg:h-[60px] xl:w-[210px] xl:h-[69px] bg-white/90 backdrop-blur-md lg:text-[16px] xl:text-[18px] flex items-center justify-center rounded-full font-medium shadow-lg group-hover:bg-blue-500 group-hover:text-white transition-all duration-300"
                      >
                        <span className="mr-2">Lihat Detail</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          )}
        </motion.div>
      )}

      {/* Mobile Carousel - Improved with controls */}
      <div className="block lg:hidden pt-[20px] relative">
        <h2 className="text-xl font-bold px-[20px] md:px-[50px] mb-4 text-gray-800">
          Featured <span className="text-blue-500">Mountains</span>
        </h2>
        
        <div className="overflow-x-hidden px-[20px] md:px-[50px] relative">
          <div 
            className="flex transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {filteredMountains.map((mountain, index) => (
              <motion.div 
                key={mountain.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="w-full flex-shrink-0 px-2"
              >
                <Link href={`/gunung/${mountain.id}`}>
                  <div className="relative overflow-hidden rounded-3xl h-[400px] shadow-xl">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountain.images[0]?.image_path}`}
                      alt={mountain.nama_gunung}
                      fill
                      className="object-cover transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                        <FiMapPin className="text-white" />
                        <h2 className="text-sm font-medium text-white">
                          {mountain.lokasi.split(',')[0]}
                        </h2>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <FaMountain className="text-white/90 text-sm" /> 
                          <span className="text-white text-sm">{mountain.ketinggian} MDPL</span>
                        </div>
                        
                        <h2 className="text-[28px] font-bold text-white drop-shadow-md">
                          {mountain.nama_gunung}
                        </h2>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                            {mountain.status_gunung}
                          </div>
                          <button className="bg-blue-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-600 transition-all duration-300 shadow-lg flex items-center">
                            Lihat <FiArrowRight className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Carousel Controls */}
          <div className="flex justify-between absolute top-1/2 left-0 right-0 transform -translate-y-1/2 px-2 md:px-4 pointer-events-none z-10">
            <button 
              onClick={prevSlide}
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center pointer-events-auto hover:bg-blue-500 hover:text-white transition-all"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button 
              onClick={nextSlide}
              className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center pointer-events-auto hover:bg-blue-500 hover:text-white transition-all"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-4 gap-2">
            {filteredMountains.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-gray-300'
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Mountain Grid - Desktop dengan animasi hover yang lebih baik */}
      <div className="hidden lg:block pt-[65px]">
        <div className="flex justify-between items-center px-[20px] md:px-[50px] lg:px-[65px] mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            All <span className="text-blue-500">Mountains</span>
          </h2>
          
          <div className="text-sm text-gray-600">
            Showing {filteredMountains.length} mountains
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-[20px] md:px-[50px] lg:px-[65px]">
          {filteredMountains.map((mountain, index) => (
            <motion.div
              key={mountain.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index % 6), duration: 0.6 }}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredMountain(mountain.id)}
              onMouseLeave={() => setHoveredMountain(null)}
            >
              <Link href={`/gunung/${mountain.id}`}>
                <div className="rounded-2xl overflow-hidden shadow-lg bg-white h-full hover:shadow-2xl transition-all duration-500 relative group">
                  <div className="relative h-[240px] overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountain.images[0]?.image_path}`}
                      alt={mountain.nama_gunung}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      <div className="flex items-center gap-2 mb-1 text-white">
                        <FaMountain />
                        <span className="font-medium">{mountain.ketinggian} MDPL</span>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white truncate drop-shadow-md">
                        {mountain.nama_gunung}
                      </h2>
                      
                      <div className="flex items-center gap-1 mt-1 text-white/90">
                        <FiMapPin />
                        <span>{mountain.lokasi.split(',')[0]}</span>
                      </div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredMountain === mountain.id ? 1 : 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-blue-500/30 backdrop-blur-sm"
                    >
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ 
                          scale: hoveredMountain === mountain.id ? 1 : 0.8,
                          opacity: hoveredMountain === mountain.id ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                        className="px-5 py-3 bg-white rounded-full flex items-center gap-2 font-medium shadow-lg"
                      >
                        <span>Lihat Detail</span>
                        <FiArrowRight />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mountain Grid - Mobile (improved) */}
      <div className="block lg:hidden mt-12">
        <h2 className="text-xl font-bold px-[20px] md:px-[50px] mb-4 text-gray-800">
          All <span className="text-blue-500">Mountains</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-[20px] md:px-[50px]">
          {filteredMountains.map((mountain, index) => (
            <motion.div 
              key={mountain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index % 4), duration: 0.5 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/gunung/${mountain.id}`}>
                <div className="relative h-[200px]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountain.images[0]?.image_path}`}
                    alt={mountain.nama_gunung}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  <div className="absolute top-2 right-2 bg-blue-500/80 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs">
                    {mountain.ketinggian} MDPL
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {mountain.nama_gunung}
                  </h3>
                  
                  <div className="flex items-center gap-1 mt-1 text-gray-600 text-sm">
                    <FiMapPin className="text-blue-500" />
                    <span>{mountain.lokasi.split(',')[0]}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {mountain.status_gunung}
                    </span>
                    
                    <button className="text-blue-500 font-medium text-sm flex items-center gap-1 hover:text-blue-700 transition-colors">
                      Details <FiArrowRight />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Empty state if no mountains match filters */}
      {filteredMountains.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaMountain className="text-blue-500 text-4xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">Tidak ada gunung ditemukan</h3>
          <p className="text-gray-500 max-w-md text-center mb-6">
            Tidak ada gunung yang sesuai dengan filter atau pencarian Anda. Coba sesuaikan pencarian atau filter.
          </p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setActiveFilter("all");
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}

export default CardListGunung;