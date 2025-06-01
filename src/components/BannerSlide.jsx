"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { IoChevronBack, IoChevronForward, IoLocationSharp, IoStar } from "react-icons/io5";

const BannerSlide = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const bannerData = [
    {
      id: 1,
      title: "Gunung Bromo Sunrise",
      subtitle: "Nikmati keindahan sunrise terbaik di Indonesia",
      price: "Rp 350.000",
      originalPrice: "Rp 450.000",
      discount: "22%",
      rating: 4.8,
      location: "Jawa Timur",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center",
      gradient: "from-orange-400 to-red-500"
    },
    {
      id: 2,
      title: "Gunung Rinjani Trekking",
      subtitle: "Pendakian menantang dengan pemandangan danau Segara Anak",
      price: "Rp 850.000",
      originalPrice: "Rp 1.200.000",
      discount: "29%",
      rating: 4.9,
      location: "Lombok, NTB",
      image: "https://images.unsplash.com/photo-1464822759844-d150ad6ba52c?w=1200&h=800&fit=crop&crop=center",
      gradient: "from-blue-400 to-purple-500"
    },
    {
      id: 3,
      title: "Gunung Semeru Adventure",
      subtitle: "Taklukkan puncak tertinggi di Pulau Jawa",
      price: "Rp 650.000",
      originalPrice: "Rp 800.000",
      discount: "19%",
      rating: 4.7,
      location: "Jawa Timur",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop&crop=center",
      gradient: "from-green-400 to-blue-500"
    },
    {
      id: 4,
      title: "Gunung Merapi Jeep Tour",
      subtitle: "Wisata volcano tour dengan jeep 4WD",
      price: "Rp 250.000",
      originalPrice: "Rp 300.000",
      discount: "17%",
      rating: 4.6,
      location: "Yogyakarta",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center",
      gradient: "from-red-400 to-pink-500"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  }, [bannerData.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, nextSlide]);

  return (
    <div className="relative w-full bg-gray-50 py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header - More compact */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 font-poppins">
            Penawaran{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Spesial
            </span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base font-poppins">
            Jangan lewatkan kesempatan emas untuk menjelajahi keindahan alam Indonesia
          </p>
        </div>

        {/* Banner Slider - Traveloka style rectangular */}
        <div 
          className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-lg"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Slider Container - More compact height */}
          <div className="relative h-[200px] md:h-[280px] lg:h-[320px]">
            {bannerData.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide 
                    ? 'opacity-100 transform translate-x-0' 
                    : index < currentSlide
                    ? 'opacity-0 transform -translate-x-full'
                    : 'opacity-0 transform translate-x-full'
                }`}
              >
                {/* Background Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    unoptimized
                  />
                  {/* Gradient Overlay - Less opacity */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-60`} />
                  <div className="absolute inset-0 bg-black bg-opacity-20" />
                </div>

                {/* Content - More compact layout */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-lg text-white">
                      {/* Location & Rating - Smaller */}
                      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        <div className="flex items-center gap-1 bg-white bg-opacity-20 rounded-full px-2 py-1">
                          <IoLocationSharp className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="text-xs md:text-sm font-medium">{banner.location}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white bg-opacity-20 rounded-full px-2 py-1">
                          <IoStar className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                          <span className="text-xs md:text-sm font-medium">{banner.rating}</span>
                        </div>
                      </div>

                      {/* Title - Smaller and more readable */}
                      <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 font-poppins">
                        {banner.title}
                      </h3>

                      {/* Subtitle - Smaller */}
                      <p className="text-sm md:text-base mb-3 md:mb-4 opacity-90 font-poppins line-clamp-2">
                        {banner.subtitle}
                      </p>

                      {/* Price & Discount - More compact */}
                      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                        <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                          -{banner.discount}
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <span className="text-lg md:text-xl lg:text-2xl font-bold">{banner.price}</span>
                          <span className="text-sm md:text-base line-through opacity-60">{banner.originalPrice}</span>
                        </div>
                      </div>

                      {/* CTA Button - Smaller */}
                      <button className="bg-white text-gray-800 px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold text-sm md:text-base hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-md font-poppins">
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Smaller */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <IoChevronBack className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <IoChevronForward className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Dots Indicator - Smaller */}
          <div className="absolute bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
            {bannerData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default BannerSlide;