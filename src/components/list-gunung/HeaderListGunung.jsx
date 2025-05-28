"use client";
import React, { useState, useEffect } from "react";
import HeaderGunung from "@/assets/images/ImgBromo.png";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion"; // Import tambahan dari framer-motion
import { useRouter } from "next/navigation"; // Import useRouter untuk navigasi
import { FiArrowLeft } from "react-icons/fi"; // Import icon arrow left

const HeaderListGunung = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter(); // Initialize router

  // Transform properties berdasarkan scroll
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  // Deteksi scroll untuk animasi
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animasi smooth scroll saat tombol diklik
  const scrollToMountains = (e) => {
    e.preventDefault();
    const mountainsSection = document.getElementById("mountains-list");
    if (mountainsSection) {
      mountainsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle back button click
  const handleBackClick = () => {
    router.push("/"); // Navigate to home page
  };

  return (
    <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Background image dengan parallax efek scrolling */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 h-full w-full"
      >
        <Image
          src={HeaderGunung}
          alt="Mountain landscape"
          fill
          priority
          className="object-cover brightness-75 transition-all duration-10000"
        />
      </motion.div>

      {/* Gradient overlay dengan opacity dinamis */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"
      ></motion.div>

      {/* Animated gradient bar */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>

      {/* Back button - Posisi di kiri atas */}
      <motion.button
        onClick={handleBackClick}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-[20px] md:left-[50px] lg:left-[65px] z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-500/60 hover:border-blue-300/40 transition-all duration-300"
      >
        <FiArrowLeft className="text-lg" />
        <span>Kembali</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 flex flex-col justify-center items-start px-[20px] md:px-[50px] lg:px-[65px]"
      >
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white"
          animate={{ x: isScrolling ? -30 : 0, opacity: isScrolling ? 0.8 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300">
            Pilih Gunung Favorit
          </span>
          <br />
          <span className="drop-shadow-xl">Anda</span>
        </motion.h1>

        <motion.p
          className="mt-4 text-white/80 max-w-lg text-base sm:text-lg md:text-xl"
          animate={{ x: isScrolling ? -20 : 0, opacity: isScrolling ? 0.7 : 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Jelajahi keindahan alam pegunungan Indonesia yang menakjubkan
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href="#mountains-list"
            onClick={scrollToMountains}
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-500/60 hover:border-blue-300/40 transition-all duration-300"
          >
            <span>Lihat Semua Gunung</span>
            <motion.svg
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </motion.svg>
          </a>
        </motion.div>
      </motion.div>

      {/* Wave element dengan animasi */}
      <motion.div
        initial={{ y: 20, opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-0 left-0 right-0 h-20 bg-white"
        style={{
          clipPath:
            "polygon(0 100%, 100% 100%, 100% 0, 75% 50%, 50% 0, 25% 50%, 0 0)",
        }}
      ></motion.div>

      {/* Tambahan elemen dekoratif - mountain particles */}
      <div className="absolute bottom-[20%] left-[10%] w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[30%] left-[20%] w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[15%] left-[30%] w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[25%] left-[40%] w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[35%] left-[70%] w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-[18%] left-[80%] w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
    </div>
  );
};

export default HeaderListGunung;
