"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IoLocationSharp,
  IoCamera,
  IoTime,
  IoEye,
  IoChevronForward,
  IoEarth,
  IoStar,
} from "react-icons/io5";

const HighlightDestinations = () => {
  const [activeTab, setActiveTab] = useState("populer");
  const [hoveredCard, setHoveredCard] = useState(null);

  const viewDestinations = {
    populer: [
      {
        id: 1,
        slug: "danau-slank-latimojong",
        name: "Danau Slank",
        location: "Pegunungan Latimojong, Sulawesi Selatan",
        category: "High Altitude Lake",
        altitude: "3,200 mdpl",
        bestTime: "06:00 - 17:00",
        difficulty: "Hard",
        rating: 4.8,
        description:
          "Danau cantik di ketinggian dengan air jernih dan dikelilingi puncak-puncak tinggi Latimojong",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
        gallery: 189,
        badge: "Hidden Gem",
        highlight: "Danau Tertinggi Sulawesi",
      },
      {
        id: 2,
        slug: "danau-tranlalili-latimojong",
        name: "Danau Tranlalili",
        location: "Pegunungan Latimojong, Sulawesi Selatan",
        category: "Mountain Lake",
        altitude: "2,900 mdpl",
        bestTime: "07:00 - 18:00",
        difficulty: "Medium",
        rating: 4.7,
        description:
          "Danau alami dengan panorama spektakuler dan menjadi basecamp favorit para pendaki",
        image:
          "https://images.unsplash.com/photo-1464822759844-d150ad6ba52c?w=800&h=600&fit=crop&crop=center",
        gallery: 234,
        badge: "Basecamp",
        highlight: "Cermin Alam Latimojong",
      },
      {
        id: 3,
        slug: "puncak-rante-mario",
        name: "Puncak Gunung Rante Mario",
        location: "Pegunungan Latimojong, Sulawesi Selatan",
        category: "Summit View",
        altitude: "3,478 mdpl",
        bestTime: "05:00 - 08:00",
        difficulty: "Very Hard",
        rating: 4.9,
        description:
          "Puncak tertinggi Sulawesi dengan panorama 360° yang menakjubkan ke seluruh pulau",
        image:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&center",
        gallery: 156,
        badge: "Highest Peak",
        highlight: "Puncak Tertinggi Sulawesi",
      },
    ],
    danau: [
      {
        id: 4,
        slug: "danau-slank-sunrise",
        name: "Danau Slank Sunrise Point",
        location: "Latimojong, Sulawesi Selatan",
        category: "Sunrise Lake View",
        altitude: "3,200 mdpl",
        bestTime: "05:30 - 07:00",
        difficulty: "Hard",
        rating: 4.6,
        description:
          "Spot terbaik untuk menyaksikan sunrise di Danau Slank dengan refleksi gunung di air jernih",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
        gallery: 98,
        badge: "Sunrise Spot",
        highlight: "Refleksi Sempurna",
      },
      {
        id: 5,
        slug: "danau-tranlalili-camping",
        name: "Danau Tranlalili Camping Area",
        location: "Latimojong, Sulawesi Selatan",
        category: "Lake Camping",
        altitude: "2,900 mdpl",
        bestTime: "16:00 - 08:00",
        difficulty: "Medium",
        rating: 4.5,
        description:
          "Area berkemah terbaik dengan view danau dan suasana malam yang tenang di pegunungan",
        image:
          "https://images.unsplash.com/photo-1464822759844-d150ad6ba52c?w=800&h=600&fit=crop&crop=center",
        gallery: 167,
        badge: "Best Camping",
        highlight: "Camping Paradise",
      },
    ],
    puncak: [
      {
        id: 6,
        slug: "rante-mario-summit-sunrise",
        name: "Rante Mario Summit Sunrise",
        location: "Latimojong, Sulawesi Selatan",
        category: "Summit Sunrise",
        altitude: "3,478 mdpl",
        bestTime: "05:00 - 07:00",
        difficulty: "Very Hard",
        rating: 4.8,
        description:
          "Sunrise spektakuler dari puncak tertinggi Sulawesi dengan view ke seluruh kepulauan",
        image:
          "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop&crop=center",
        gallery: 145,
        badge: "Epic Sunrise",
        highlight: "Sunrise Terbaik Sulawesi",
      },
      {
        id: 7,
        slug: "rante-mario-360-view",
        name: "Rante Mario 360° Viewpoint",
        location: "Latimojong, Sulawesi Selatan",
        category: "Panoramic View",
        altitude: "3,478 mdpl",
        bestTime: "06:00 - 17:00",
        difficulty: "Very Hard",
        rating: 4.9,
        description:
          "Panorama 360 derajat dari puncak tertinggi dengan view ke Makassar, Bone, dan laut",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center",
        gallery: 203,
        badge: "360° View",
        highlight: "Panorama Menyeluruh",
      },
    ],
  };

  const tabs = [
    {
      id: "populer",
      label: "Most Popular",
      count: viewDestinations.populer.length,
    },
    {
      id: "danau",
      label: "Danau Views",
      count: viewDestinations.danau.length,
    },
    {
      id: "puncak",
      label: "Summit Views",
      count: viewDestinations.puncak.length,
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 text-emerald-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Hard":
        return "bg-orange-100 text-orange-700";
      case "Very Hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Hidden Gem":
        return "bg-blue-600";
      case "Basecamp":
        return "bg-cyan-600";
      case "Highest Peak":
        return "bg-red-600";
      case "Sunrise Spot":
        return "bg-orange-600";
      case "Best Camping":
        return "bg-green-600";
      case "Epic Sunrise":
        return "bg-yellow-600";
      case "360° View":
        return "bg-purple-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Clean Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Destinasi Wisata Sulawesi Selatan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Jelajahi keajaiban alam Pegunungan Latimojong dengan pemandangan spektakuler
          </p>
        </div>

        {/* Simple Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {tab.label}
                <span className="ml-2 text-xs opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Full Image Background Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {viewDestinations[activeTab].map((destination, index) => (
            <div
              key={destination.id}
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Full Background Image */}
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Top Elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className={`${getBadgeColor(destination.badge)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                  {destination.badge}
                </div>
                <div className="flex gap-2">
                  <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <IoCamera className="w-3 h-3 text-white" />
                    <span className="text-xs font-medium text-white">{destination.gallery}</span>
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <IoStar className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-medium text-white">{destination.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content at Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <IoLocationSharp className="w-4 h-4" />
                    <span className="text-xs">{destination.location}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(destination.difficulty)}`}>
                    {destination.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2 line-clamp-1">
                  {destination.name}
                </h3>
                
                <p className="text-sm text-blue-300 font-medium mb-3">
                  {destination.highlight}
                </p>

                <p className="text-sm text-white/90 mb-4 line-clamp-2">
                  {destination.description}
                </p>

                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <IoEarth className="w-4 h-4" />
                    <span>{destination.altitude}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IoTime className="w-4 h-4" />
                    <span>{destination.bestTime}</span>
                  </div>
                </div>

                <Link
                  href={`/destinations/${destination.slug}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 group/btn"
                >
                  <IoEye className="w-4 h-4" />
                  Lihat Detail
                  <IoChevronForward className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Simple View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 group"
          >
            Lihat Semua Destinasi
            <IoChevronForward className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HighlightDestinations;