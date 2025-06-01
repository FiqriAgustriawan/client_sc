'use client'

import React, { useState, useEffect } from "react";
import { IoChevronForward, IoCamera, IoLocation, IoTrendingUp } from "react-icons/io5";

const ReadytoChallenge = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animated stats - replaced IoMountain with IoTrendingUp
  const stats = [
    { number: "500+", label: "Pendaki Bergabung", icon: IoTrendingUp },
    { number: "25+", label: "Destinasi Tersedia", icon: IoLocation },
    { number: "1000+", label: "Foto Petualangan", icon: IoCamera }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <div className="relative min-h-[60vh] md:min-h-[50vh] lg:min-h-[60vh]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full blur-xl"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 py-12">
          

          {/* Main Heading */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} text-center mb-12`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-5xl mx-auto leading-tight mb-6">
              Siap Untuk Memulai
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Petualangan Baru?
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed font-light">
              Bergabunglah dengan komunitas pendaki dan jelajahi keindahan alam Indonesia bersama kami
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} flex flex-col sm:flex-row gap-6 items-center justify-center mb-12`}>
            {/* Primary CTA Button */}
            <button className="group relative px-10 py-5 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:scale-95 min-w-[200px]">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,4L4,1L10,7C10,7 13.75,9.81 16,11.5L14.8,13.1L11,10.25L16,6H14Z" />
                </svg>
                <span className="text-lg">Gabung Sekarang</span>
                <IoChevronForward className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>

            {/* Secondary CTA Button */}
            <button className="group px-10 py-5 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-2 active:scale-95 min-w-[200px]">
              <div className="flex items-center justify-center gap-3">
                <IoCamera className="w-6 h-6 group-hover:animate-pulse" />
                <span className="text-lg">Lihat Galeri</span>
              </div>
            </button>
          </div>

         
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default ReadytoChallenge;