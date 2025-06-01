"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { bookingService } from "@/services/bookingService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaWhatsapp,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaInfoCircle,
  FaList,
  FaCheckCircle,
  FaFileInvoice,
  FaClipboardList,
  FaClock,
  FaMoneyBillWave,
  FaImages,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function TripDetail({ params: routeParams }) {
  const params = useParams();
  const tripId = params.id || routeParams.id;

  const [trip, setTrip] = useState(null);
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const router = useRouter();
  const { user } = useAuth();
  const [tripStatus, setTripStatus] = useState("upcoming");

  // Fetch trip details and booking
  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const tripResponse = await tripService.getTripDetail(tripId);
        if (tripResponse.success) {
          setTrip(tripResponse.data);

          const today = new Date();
          const startDate = new Date(tripResponse.data.start_date);
          const endDate = new Date(tripResponse.data.end_date);

          if (today < startDate) {
            setTripStatus("upcoming");
          } else if (today >= startDate && today <= endDate) {
            setTripStatus("ongoing");
          } else {
            setTripStatus("completed");
          }

          if (tripResponse.data.status === "closed") {
            router.push(`/dashboard-user/trip-manage/${tripId}/rating`);
            return;
          }
        }

        const bookingsResponse = await bookingService.getUserBookings();
        if (bookingsResponse.success) {
          const tripBooking = bookingsResponse.data.find(
            (b) => b.trip_id === parseInt(tripId)
          );
          if (tripBooking) {
            setBooking(tripBooking);
          } else {
            router.push("/trips");
          }
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripDetail();
  }, [tripId, router]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/\/storage\/+/g, "/storage/");

    if (imagePath.includes("/storage/")) {
      return `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }${cleanPath}`;
    }

    return `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/storage/${imagePath}`;
  };

  // UPDATED: WhatsApp function with enhanced messaging
  const openWhatsAppGuide = () => {
    if (!trip?.guide?.whatsapp) {
      toast.error("Nomor WhatsApp guide tidak tersedia");
      return;
    }
    
    const cleanNumber = trip.guide.whatsapp.replace(/\D/g, "");
    const formattedDate = new Date(trip.start_date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long", 
      year: "numeric"
    });
    
    const message = encodeURIComponent(
      `Halo ${trip.guide?.name || "Guide"}! Saya ${user?.nama_depan || user?.name || "peserta"} yang terdaftar untuk trip ${trip.mountain?.nama_gunung || "pendakian"} pada tanggal ${formattedDate}. Mohon informasinya terkait persiapan dan detail trip. Terima kasih!`
    );
    
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} hari`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat informasi trip...</p>
        </div>
      </div>
    );
  }

  if (!trip || !booking || booking.status !== "confirmed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-red-100 rounded-full">
            <FaInfoCircle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Trip tidak ditemukan atau belum dikonfirmasi
          </h2>f
          <p className="text-gray-600 mb-6">
            Silakan periksa kembali status pemesanan Anda atau hubungi customer
            service
          </p>
          <Link href="/dashboard-user">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors w-full">
              Kembali ke Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/dashboard-user/trip-manage"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <FaChevronLeft className="mr-2" />
            Kembali ke Perjalanan Aktif
          </Link>
        </div>

        {/* Trip Status Badge */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold 
            ${
              tripStatus === "upcoming"
                ? "bg-blue-100 text-blue-700"
                : tripStatus === "ongoing"
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full mr-2 
              ${
                tripStatus === "upcoming"
                  ? "bg-blue-500"
                  : tripStatus === "ongoing"
                  ? "bg-green-500"
                  : "bg-purple-500"
              }`}
            ></div>
            {tripStatus === "upcoming"
              ? "Akan Datang"
              : tripStatus === "ongoing"
              ? "Sedang Berlangsung"
              : "Selesai"}
          </div>
        </div>

        {/* Trip Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-80">
            <Image
              src={getImageUrl(trip.images?.[0]?.image_path)}
              alt={trip.mountain?.nama_gunung || "Mountain"}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-3">
                {trip.mountain?.nama_gunung || "Mountain Trip"}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaCalendarAlt className="text-white" />
                  </div>
                  <span>
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaClock className="text-white" />
                  </div>
                  <span>
                    {calculateDuration(trip.start_date, trip.end_date)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaUsers className="text-white" />
                  </div>
                  <span>{trip.capacity} pendaki</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded-full">
                    <FaMoneyBillWave className="text-white" />
                  </div>
                  <span>{formatPrice(trip.price)}/orang</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* UPDATED: WhatsApp Contact Buttons for Mobile */}
            <div className="lg:hidden mb-6">
              <div className="grid grid-cols-1 gap-3">
                {trip.whatsapp_group && (
                  <button
                    onClick={() => {
                      window.open(trip.whatsapp_group, "_blank");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow-md font-medium flex items-center justify-center gap-3 transition-all hover:scale-105"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>Gabung Grup WhatsApp</span>
                  </button>
                )}
                
                {!trip.whatsapp_group && (
                  <div className="w-full bg-gray-100 text-gray-500 px-6 py-4 rounded-xl text-center">
                    <span>Grup WhatsApp belum tersedia</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              {/* Tab Navigation */}
              <div className="border-b">
                <div className="grid grid-cols-5 divide-x border-b">
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`py-4 font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${
                      activeTab === "info" 
                        ? "text-blue-600 border-b-2 border-blue-600 -mb-px" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <FaInfoCircle className="text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm">Informasi</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("facilities")}
                    className={`py-4 font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${
                      activeTab === "facilities" 
                        ? "text-blue-600 border-b-2 border-blue-600 -mb-px" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <FaList className="text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm">Fasilitas</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("terms")}
                    className={`py-4 font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${
                      activeTab === "terms" 
                        ? "text-blue-600 border-b-2 border-blue-600 -mb-px" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <FaCheckCircle className="text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm">Ketentuan</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`py-4 font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${
                      activeTab === "itinerary" 
                        ? "text-blue-600 border-b-2 border-blue-600 -mb-px" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <FaClipboardList className="text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm">Itinerary</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className={`py-4 font-medium flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 ${
                      activeTab === "gallery" 
                        ? "text-blue-600 border-b-2 border-blue-600 -mb-px" 
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <FaImages className="text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm">Galeri</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "info" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Informasi Trip
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-gray-500 text-sm mb-1">Lokasi</h4>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-500" />
                          <span className="font-medium">
                            {trip.mountain?.lokasi || "Indonesia"}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-gray-500 text-sm mb-1">
                          Ketinggian
                        </h4>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">
                            {trip.mountain?.ketinggian || "N/A"} mdpl
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-gray-500 text-sm mb-1">
                          Titik Kumpul
                        </h4>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">
                            {trip.meeting_point || "Akan diinformasikan"}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-gray-500 text-sm mb-1">
                          Tingkat Kesulitan
                        </h4>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">
                            {trip.difficulty_level || "Sedang"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {trip.trip_info}
                      </p>
                    </div>

                    {trip.highlights && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-3">
                          Highlight Trip
                        </h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {trip.highlights.split("\n").map((highlight, idx) => (
                            <li key={idx} className="text-gray-700">
                              {highlight.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Preview Gallery in Info Tab */}
                    {trip.images && trip.images.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">Preview Galeri</h4>
                          <button 
                            onClick={() => setActiveTab("gallery")}
                            className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1"
                          >
                            Lihat Semua
                            <FaChevronRight className="text-xs" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {trip.images.slice(0, 3).map((image, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-video rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                              <Image
                                src={getImageUrl(image.image_path)}
                                alt={`Preview foto trip ${idx + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                unoptimized
                              />
                            </div>
                          ))}
                          {trip.images.length > 3 && (
                            <div 
                              className="relative aspect-video rounded-lg overflow-hidden shadow-sm cursor-pointer group"
                              onClick={() => setActiveTab("gallery")}
                            >
                              <Image
                                src={getImageUrl(trip.images[3].image_path)}
                                alt="More photos"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                unoptimized
                              />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                                <div className="text-white text-center">
                                  <span className="font-bold text-lg">+{trip.images.length - 3}</span>
                                  <p className="text-sm">Foto Lainnya</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "facilities" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">Fasilitas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trip.facilities?.map((facility, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <FaCheckCircle />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {facility}
                          </span>
                        </div>
                      ))}
                    </div>

                    {trip.not_included && (
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold mb-3">
                          Tidak Termasuk
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <ul className="list-disc pl-5 space-y-2">
                            {trip.not_included.split("\n").map((item, idx) => (
                              <li key={idx} className="text-gray-700">
                                {item.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "terms" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Syarat & Ketentuan
                    </h3>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            Dengan memesan trip ini, Anda dianggap telah
                            menyetujui semua syarat dan ketentuan yang berlaku.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {trip.terms_conditions}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      Itinerary Trip
                    </h3>
                    {trip.itinerary ? (
                      <div className="space-y-6">
                        {trip.itinerary
                          .split("Hari")
                          .filter((day) => day.trim())
                          .map((day, idx) => {
                            const dayNumber = idx + 1;
                            return (
                              <div
                                key={idx}
                                className="border-l-4 border-blue-500 pl-4 pb-6"
                              >
                                <h4 className="font-bold text-lg mb-2">
                                  Hari {dayNumber}
                                </h4>
                                <div className="prose max-w-none text-gray-700">
                                  <p className="whitespace-pre-line">
                                    {day.replace(/^\d+:?\s*/, "")}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mx-auto text-gray-300 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-gray-500">
                          Itinerary tidak tersedia
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "gallery" && trip.images && trip.images.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold">Galeri Trip</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {trip.images.length} foto
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trip.images.map((image, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-lg group cursor-pointer"
                        >
                          <Image
                            src={getImageUrl(image.image_path)}
                            alt={`Trip image ${idx + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-3 left-3 text-white">
                              <p className="text-sm font-medium">Foto {idx + 1}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* UPDATED: WhatsApp Contact Button for Desktop */}
              <div className="hidden lg:block">
                {trip.whatsapp_group ? (
                  <button
                    onClick={() => {
                      window.open(trip.whatsapp_group, "_blank");
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow-md font-medium flex items-center justify-center gap-3 transition-all hover:scale-105"
                  >
                    <FaWhatsapp className="text-xl" />
                    <span>Gabung Grup WhatsApp</span>
                  </button>
                ) : (
                  <div className="w-full bg-gray-100 text-gray-500 px-6 py-4 rounded-xl text-center">
                    <span>Grup WhatsApp belum tersedia</span>
                  </div>
                )}
              </div>

              {/* Trip Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
                <div>
                
                  <div className="space-y-4">
                   

                    {/* Enhanced Guide Information */}
                    <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                      <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Informasi Guide</span>
                      </h4>

                      <div className="flex items-center gap-4 mb-5 p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
                        <div className="relative group">
                          {trip.guide?.profile_photo ? (
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                              <Image
                                src={getImageUrl(trip.guide.profile_photo)}
                                alt={trip.guide?.name || "Guide"}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-xl flex-shrink-0 border-2 border-white shadow-md">
                              {trip.guide?.name?.charAt(0) || "G"}
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-lg text-gray-800 transition-colors hover:text-blue-700">
                            {trip.guide?.name || "Guide Profesional"}
                          </div>
                          <div className="text-sm text-blue-600 font-medium">
                            Mountain Guide
                          </div>

                          <div className="mt-2 flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <=
                                    Math.round(trip.guide?.average_rating || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                  />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">
                              {parseFloat(
                                trip.guide?.average_rating || 0
                              ).toFixed(1)}{" "}
                              ({trip.guide?.ratings_count || 0} ulasan)
                            </span>
                          </div>
                        </div>
                      </div>

                      {trip.guide?.experience && (
                        <div className="flex items-center justify-center mb-5">
                          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
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
                              {trip.guide?.experience} tahun pengalaman
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* About Guide - Separated Card with Animation */}
                    {trip.guide?.about && (
                      <div className="mt-4 bg-white rounded-xl p-5 border border-blue-100 shadow-sm hover:border-blue-300 hover:shadow transition-all duration-300 transform hover:-translate-y-1">
                        <h5 className="text-gray-700 font-medium mb-3 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span>Tentang Guide</span>
                        </h5>
                        <div className="relative">
                          <p className="text-gray-600 italic pl-4 leading-relaxed">
                            "{trip.guide.about}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp contact button - Styled attractively */}
                    {trip.guide?.whatsapp && (
                      <a
                        href={`https://wa.me/${trip.guide.whatsapp.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-300 w-auto mx-auto shadow-sm hover:shadow"
                      >
                        <FaWhatsapp className="text-lg" />
                        <span>Hubungi Guide</span>
                      </a>
                    )}
                  </div>

                  {/* Invoice Section */}
                  <div className="p-4 my-3 bg-yellow-50 rounded-xl">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Invoice Pembayaran
                    </h4>
                    <Link
                      href={`/dashboard-user/trip-manage/invoice/${
                        booking.payment?.id || ""
                      }`}
                      className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                    >
                      <FaFileInvoice size={16} />
                      <span>Lihat Invoice</span>
                    </Link>
                  </div>

                 

                  {/* Emergency Contacts */}
                  {trip.emergency_contacts && (
                    <div className="p-4 bg-red-50 rounded-xl">
                      <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        Kontak Darurat
                      </h4>
                      <div className="space-y-2 mt-2">
                        {trip.emergency_contacts
                          .split("\n")
                          .map((contact, idx) => (
                            <div key={idx} className="text-sm">
                              {contact.includes(":") ? (
                                <>
                                  <span className="font-medium">
                                    {contact.split(":")[0]}:
                                  </span>
                                  <span className="text-gray-700">
                                    {contact.split(":")[1]}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-700">{contact}</span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
