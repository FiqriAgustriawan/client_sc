"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { bookingService } from "@/services/bookingService";
import Link from "next/link";
import Image from "next/image";
import {
  FaWhatsapp,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaHistory,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function TripManagePage() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!authLoading && !token) {
        router.push("/login?redirect=/dashboard-user/trip-manage");
        return;
      }

      if (token) {
        await fetchActiveBookings();
      }
    };

    checkAuthAndFetchBookings();
  }, [authLoading]);

  const fetchActiveBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingService.getUserBookings();
      if (response.success) {
        const updatedBookings = await Promise.all(
          response.data.map(async (booking) => {
            if (booking.payment?.status === "pending") {
              try {
                const paymentStatus = await bookingService.verifyPaymentStatus(
                  booking.payment.order_id
                );
                if (
                  paymentStatus.success &&
                  (paymentStatus.data.status === "settlement" ||
                    paymentStatus.data.status === "capture")
                ) {
                  booking.payment.status = "paid";
                  booking.status = "confirmed";
                }
              } catch (error) {
                console.error("Error checking payment status:", error);
              }
            }
            return booking;
          })
        );

        // Filter hanya untuk trip yang aktif/berjalan
        // Trip aktif = trip yang confirmed & trip dengan tanggal akhir >= saat ini
        const activeTrips = updatedBookings.filter((booking) => {
          // Trip sudah dikonfirmasi
          const isConfirmed = booking.status === "confirmed";
          // Trip sedang pending pembayaran
          const isPending = booking.status === "pending";
          // Trip belum selesai (tanggal akhir lebih besar atau sama dengan hari ini)
          const isOngoing =
            booking.trip && booking.trip.end_date
              ? new Date(booking.trip.end_date) >= new Date()
              : true;
          // Trip belum ditutup
          const isOpen = booking.trip && booking.trip.status !== "closed";

          // Trip aktif jika sedang pending ATAU (sudah confirmed DAN masih berlangsung/belum selesai)
          return isPending || (isConfirmed && (isOngoing || isOpen));
        });

        setActiveBookings(activeTrips);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      if (error.response?.status === 401) {
        router.push("/login?redirect=/dashboard-user/trip-manage");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async (booking) => {
    try {
      setIsLoading(true);
      if (!booking.payment?.invoice_number) {
        toast.error("Invalid payment information");
        return;
      }

      const paymentStatus = await bookingService.verifyPaymentStatus(
        booking.payment.invoice_number
      );

      if (paymentStatus.success) {
        if (
          paymentStatus.data.status === "settlement" ||
          paymentStatus.data.status === "capture"
        ) {
          await bookingService.handlePaymentReturn(
            booking.payment.order_id,
            paymentStatus.data.status
          );
          toast.success("Payment verified successfully!");
          fetchActiveBookings();
        } else {
          toast.info(`Payment status: ${paymentStatus.data.status}`);
        }
      } else {
        toast.error(paymentStatus.message || "Failed to verify payment");
      }
    } catch (error) {
      console.error("Payment check error:", error);
      toast.error("Failed to check payment status");
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";
    const cleanPath = imagePath.replace("public/", "");
    return `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/storage/${cleanPath}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTripStatus = (trip) => {
    if (!trip) return "Tidak diketahui";

    const now = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    if (trip.status === "cancelled") return "Dibatalkan";
    if (trip.status === "closed") return "Selesai";
    if (now < startDate) return "Akan Datang";
    if (now >= startDate && now <= endDate) return "Berlangsung";

    return "Aktif";
  };

  const getTripStatusColor = (trip) => {
    if (!trip) return "bg-gray-100 text-gray-700";

    const now = new Date();
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    if (trip.status === "cancelled") return "bg-red-100 text-red-700";
    if (trip.status === "closed") return "bg-gray-100 text-gray-700";
    if (now < startDate) return "bg-blue-100 text-blue-700";
    if (now >= startDate && now <= endDate)
      return "bg-green-100 text-green-700";

    return "bg-gray-100 text-gray-700";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleCompletePayment = async (bookingId) => {
    setIsLoading(true);
    console.log("Initiating payment completion for booking ID:", bookingId);
    try {
      const response = await bookingService.handleCompletePayment(bookingId);
      console.log("Payment completion response:", response);
      // Check if we received a payment URL
      if (response.payment_url) {
        // Redirect to the payment page
        console.log("Redirecting to payment URL:", response.payment_url);
        window.location.href = response.payment_url;
      } else if (response.is_paid) {
        // If payment is already completed
        toast.success("Pembayaran sudah diselesaikan sebelumnya!");
        fetchActiveBookings(); // Refresh the data
      } else {
        // If success but no URL (shouldn't normally happen)
        toast.success(response.message || "Status pembayaran diperbarui!");
        fetchActiveBookings();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header dengan tautan ke history */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Perjalanan Aktif</h1>
            <p className="text-gray-600">
              Trip gunung yang sedang Anda ikuti saat ini
            </p>
          </div>

          <Link href="/dashboard-user/history">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FaHistory />
              <span>Lihat Riwayat Perjalanan</span>
            </motion.button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : activeBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-blue-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Belum ada perjalanan aktif
            </h2>
            <p className="text-gray-600 mb-6">
              Jelajahi perjalanan yang tersedia dan mulai petualangan Anda!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/trips">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  Jelajahi Perjalanan
                </motion.button>
              </Link>
              <Link href="/dashboard-user/history">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <FaHistory />
                  <span>Lihat Riwayat Perjalanan</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {activeBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 relative h-48 md:h-auto">
                    <Image
                      src={getImageUrl(booking.trip?.images?.[0]?.image_path)}
                      alt={
                        booking.trip?.mountain?.nama_gunung || "Mountain Trip"
                      }
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getTripStatusColor(
                        booking.trip
                      )}`}
                    >
                      {getTripStatus(booking.trip)}
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold mb-1">
                          {booking.trip?.mountain?.nama_gunung ||
                            "Mountain Trip"}
                        </h2>
                        <p className="text-gray-600 mb-2">
                          {new Date(
                            booking.trip?.start_date
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(booking.trip?.end_date).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status === "confirmed"
                            ? "Dikonfirmasi"
                            : booking.status === "pending"
                            ? "Menunggu"
                            : booking.status === "cancelled"
                            ? "Dibatalkan"
                            : booking.status}
                        </div>
                        {booking.payment && (
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                              booking.payment.status
                            )}`}
                          >
                            {booking.payment.status === "paid"
                              ? "Lunas"
                              : booking.payment.status === "pending"
                              ? "Belum Dibayar"
                              : booking.payment.status === "failed"
                              ? "Gagal"
                              : booking.payment.status === "expired"
                              ? "Kedaluwarsa"
                              : booking.payment.status}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-blue-500" />
                        <span>{booking.trip?.capacity || 0} peserta</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span>
                          {booking.trip?.mountain?.lokasi || "Location"}
                        </span>
                      </div>

                      {booking.trip?.whatsapp_group && (
                        <a
                          href={booking.trip.whatsapp_group}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-600 hover:text-green-700"
                        >
                          <FaWhatsapp />
                          <span>Grup WhatsApp</span>
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {booking.status === "confirmed" && (
                        <Link
                          href={`/dashboard-user/trip-manage/${booking.trip_id}`}
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Lihat Detail
                          </motion.button>
                        </Link>
                      )}

                      {booking.payment && booking.payment.status === "paid" && (
                        <Link
                          href={`/dashboard-user/trip-manage/invoice/${booking.payment.id}`}
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Lihat Invoice
                          </motion.button>
                        </Link>
                      )}

                      {booking.payment &&
                        booking.payment.status === "pending" && (
                          <motion.button
                            onClick={() => handleCompletePayment(booking.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                          >
                            Selesaikan Pembayaran
                          </motion.button>
                        )}

                      {/* Tombol untuk menuju ke halaman chat dengan guide */}
                      {booking.status === "confirmed" && (
                        <Link
                          href={`/dashboard-user/trip-manage/${booking.trip_id}/chat`}
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                          >
                            Chat dengan Guide
                          </motion.button>
                        </Link>
                      )}
                    </div>

                    {/* Countdown timer untuk trip yang akan datang */}
                    {booking.trip &&
                      new Date(booking.trip.start_date) > new Date() && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                          <h3 className="text-sm font-medium text-gray-500 mb-3">
                            Trip dimulai dalam:
                          </h3>
                          <TripCountdown targetDate={booking.trip.start_date} />
                        </div>
                      )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Countdown timer component
function TripCountdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Format dengan leading zero
  const formatNumber = (num) => String(num).padStart(2, "0");

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="text-xl sm:text-2xl font-bold text-blue-700">
          {formatNumber(timeLeft.days)}
        </div>
        <div className="text-xs text-blue-500">Hari</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="text-xl sm:text-2xl font-bold text-blue-700">
          {formatNumber(timeLeft.hours)}
        </div>
        <div className="text-xs text-blue-500">Jam</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="text-xl sm:text-2xl font-bold text-blue-700">
          {formatNumber(timeLeft.minutes)}
        </div>
        <div className="text-xs text-blue-500">Menit</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="text-xl sm:text-2xl font-bold text-blue-700">
          {formatNumber(timeLeft.seconds)}
        </div>
        <div className="text-xs text-blue-500">Detik</div>
      </div>
    </div>
  );
}
