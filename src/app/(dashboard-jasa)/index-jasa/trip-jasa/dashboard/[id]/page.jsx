"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { format, differenceInDays, isBefore, isAfter } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { chatService } from "@/services/chatService";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaComments,
  FaPaperPlane,
  FaTimes,
  FaChevronLeft,
  FaWhatsapp,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartBar,
  FaFileAlt,
  FaStar,
  FaInfoCircle,
  FaImage,
  FaCertificate,
  FaDownload,
  FaChevronRight,
  FaHistory,
  FaUserFriends,
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

export default function TripDashboard() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [finishLoading, setFinishLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [tripStats, setTripStats] = useState(null);
  const [user, setUser] = useState(null);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const chatChannelRef = useRef(null);

  const isCompletedTrip =
    trip && (trip.status === "completed" || trip.status === "closed");
  const isUpcomingTrip = trip && new Date(trip.start_date) > new Date();
  const isActiveTrip = trip && !isCompletedTrip && !isUpcomingTrip;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Use a try-catch to fetch user data with three attempts
        let attempt = 0;
        let userData = null;
        
        while (attempt < 3 && !userData) {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/guide/me`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            
            if (response.data.success) {
              userData = response.data.data;
            } else {
              throw new Error("Failed to fetch user data");
            }
          } catch (err) {
            console.error(`Attempt ${attempt + 1} failed:`, err);
            attempt++;
            if (attempt < 3) await new Promise(r => setTimeout(r, 1000));
          }
        }
        
        // If we got user data, set it
        if (userData) {
          setUser(userData);
          console.log("Guide user data loaded:", userData);
        } else {
          // Fallback - create a temporary user object to avoid errors
          console.warn("Could not load user data, using fallback");
          setUser({
            id: parseInt(localStorage.getItem("user_id") || "0"),
            name: localStorage.getItem("user_name") || "Guide",
            role: "guide"
          });
        }
      } catch (err) {
        console.error("Error in user fetch:", err);
        // Don't redirect - just use fallback user
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        console.log(`Attempting to fetch trip details for ID: ${params.id}`);
        
        // Attempt to fetch trip details with proper error handling
        let tripData = null;
        try {
          // Try the main endpoint
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/guide/trips/${params.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 10000, // 10 second timeout
            }
          );

          if (response.data.success) {
            tripData = response.data.data;
            console.log("Trip data loaded successfully:", tripData.id);
          }
        } catch (tripErr) {
          console.error("Main trip endpoint failed:", tripErr);
          
          // Try fallback endpoint
          try {
            console.log("Trying fallback trip endpoint...");
            const fallbackResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/trips/${params.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 8000,
              }
            );
            
            if (fallbackResponse.data.success) {
              tripData = fallbackResponse.data.data;
              console.log("Trip data loaded from fallback:", tripData.id);
            }
          } catch (fallbackErr) {
            console.error("Fallback trip endpoint also failed:", fallbackErr);
          }
        }

        // If we got trip data, process it
        if (tripData) {
          // Map 'closed' to 'completed' untuk tampilan UI
          if (tripData.status === "closed") {
            tripData.status = "completed";
          }

          // Generate trip stats
          generateTripStats(tripData);

          // Try to fetch bookings
          try {
            const bookingsResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/guide/bookings?trip_id=${params.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (bookingsResponse.data.success) {
              setBookings(bookingsResponse.data.data);
              console.log(`Loaded ${bookingsResponse.data.data.length} bookings`);

              // Only fetch unread counts for active trips
              if (tripData && tripData.status === "open") {
                await fetchUnreadCounts();
              }
            }
          } catch (bookingsErr) {
            console.error("Error fetching bookings:", bookingsErr);
            // Continue without bookings
            setBookings([]);
          }

          // Set trip state AFTER processing
          setTrip(tripData);
          setError(null);
        } else {
          // No trip data found after all attempts
          setError("Failed to fetch trip details. Please try again later.");
          toast.error("Gagal memuat data perjalanan");
        }
      } catch (err) {
        console.error("Error in trip details main function:", err);
        setError("Error fetching trip details. Please try again.");
        toast.error("Gagal memuat data perjalanan");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTripDetails();
    }

    // Polling untuk unread messages - only when needed
    const intervalId = setInterval(() => {
      if (params.id && !showChat && trip?.status === "open" && user) {
        fetchUnreadCounts();
      }
    }, 30000);

    return () => {
      clearInterval(intervalId);
      if (chatChannelRef.current) {
        chatService.unsubscribeFromChat(chatChannelRef.current);
      }
    };
  }, [params.id, router, user]); // Add user to dependencies, but remove trip

  const generateTripStats = (tripData) => {
    if (!tripData) {
      console.warn("Cannot generate stats - missing trip data");
      setTripStats({
        totalParticipants: 0,
        occupancyRate: 0,
        duration: 0,
        totalRevenue: 0,
        status: "unknown",
        startDate: new Date(),
        endDate: new Date(),
        daysLeft: 0,
        daysOverdue: 0
      });
      return;
    }

    console.log("Generating trip stats for:", tripData.id);

    // Calculate total participants
    const confirmedBookings =
      tripData.bookings?.filter((b) => b.status === "confirmed") || [];
    const totalParticipants = confirmedBookings.reduce(
      (sum, booking) => sum + (booking.participants || 0),
      0
    );

    // Calculate occupancy rate
    const occupancyRate = tripData.capacity
      ? Math.round((totalParticipants / tripData.capacity) * 100)
      : 0;

    // Calculate trip duration
    const startDate = new Date(tripData.start_date);
    const endDate = new Date(tripData.end_date);
    const duration = differenceInDays(endDate, startDate) + 1;

    // Calculate total revenue
    const totalRevenue = confirmedBookings.reduce(
      (sum, booking) => sum + (booking.total_price || 0),
      0
    );

    // Trip status
    let status = "upcoming";
    const now = new Date();
    if (tripData.status === "completed" || tripData.status === "closed") {
      status = "completed";
    } else if (isAfter(now, startDate) && isBefore(now, endDate)) {
      status = "ongoing";
    } else if (isBefore(now, startDate)) {
      status = "upcoming";
    } else if (isAfter(now, endDate)) {
      status = "pastDue";
    }

    setTripStats({
      totalParticipants,
      occupancyRate,
      duration,
      totalRevenue,
      status,
      startDate,
      endDate,
      daysLeft: isBefore(now, startDate) ? differenceInDays(startDate, now) : 0,
      daysOverdue:
        isAfter(now, endDate) && tripData.status === "open"
          ? differenceInDays(now, endDate)
          : 0,
    });
  };

  const restoreChatSession = (bookingsData) => {
    const savedSelectedUserId = localStorage.getItem(
      `guide_selected_user_${params.id}`
    );

    if (savedSelectedUserId) {
      const matchingBooking = bookingsData.find(
        (b) => b.user && b.user.id.toString() === savedSelectedUserId
      );

      if (matchingBooking && matchingBooking.user) {
        setSelectedUser(matchingBooking.user);
        setShowChat(true);
        openChatWithUser(matchingBooking.user, false);
      }
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      if (!params.id) return;

      let attempt = 0;
      let success = false;
      let result = {};

      while (attempt < 3 && !success) {
        try {
          // Gunakan endpoint yang sudah tersedia di API
          const response = await chatService.getUnreadMessagesPerUser(
            params.id
          );
          if (response && response.success) {
            success = true;
            result = response.data || {};
          } else {
            throw new Error("Invalid response format");
          }
        } catch (err) {
          attempt++;
          if (attempt < 3) {
            await new Promise((r) => setTimeout(r, 1000));
          }
        }
      }

      if (success) {
        setUnreadCounts(result);
      }
    } catch (err) {
      console.error("Error fetching unread counts:", err);
    }
  };

  const openChatWithUser = async (user, skipSetState = false) => {
    localStorage.setItem(
      `guide_selected_user_${params.id}`,
      user.id.toString()
    );

    if (!skipSetState) {
      setSelectedUser(user);
      setShowChat(true);
    }

    try {
      let attempt = 0;
      let success = false;

      while (attempt < 3 && !success) {
        try {
          const response = await chatService.getMessages(params.id, user.id);

          if (response && response.success) {
            setMessages(Array.isArray(response.data) ? response.data : []);
            setUnreadCounts((prev) => ({
              ...prev,
              [user.id]: 0,
            }));
            success = true;
            setTimeout(() => scrollToBottom(), 300);
          } else {
            throw new Error("Invalid response");
          }
        } catch (err) {
          attempt++;
          if (attempt < 3) {
            await new Promise((r) => setTimeout(r, 1000));
          }
        }
      }

      if (!success) {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    }
  };

  const closeChat = () => {
    setShowChat(false);
    setSelectedUser(null);
    setMessages([]);
    localStorage.removeItem(`guide_selected_user_${params.id}`);
    fetchUnreadCounts();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || isSendingMessage || !selectedUser) return;

    setIsSendingMessage(true);
    try {
      const messageData = {
        receiver_id: selectedUser.id,
        trip_id: params.id,
        content: newMessage.trim(),
        bypass: true,
      };

      const response = await chatService.sendMessage(messageData);
      if (response.success) {
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
        scrollToBottom();
      } else {
        toast.error("Pesan gagal dikirim");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Pesan gagal dikirim");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFinishTrip = async () => {
    try {
      setFinishLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/guide/trips/${params.id}/finish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Trip telah berhasil diselesaikan");
        setSuccessMessage(response.data.message);

        // Update trip status locally
        setTrip({
          ...trip,
          status: "completed",
          completed_at: new Date().toISOString(),
        });

        // Generate updated stats
        generateTripStats({
          ...trip,
          status: "completed",
          completed_at: new Date().toISOString(),
        });

        // Show success message for 3 seconds then redirect
        setTimeout(() => {
          router.push(`/index-jasa/history?highlight=${params.id}`);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to finish trip");
        toast.error("Gagal menyelesaikan trip");
      }
    } catch (err) {
      console.error("Error finishing trip:", err);
      setError(
        err.response?.data?.message || "Error finishing trip. Please try again."
      );
      toast.error("Gagal menyelesaikan trip");
    } finally {
      setFinishLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy", { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  // Get the first image or use placeholder
  const tripImage =
    trip?.images && trip.images.length > 0
      ? `${
          process.env.NEXT_PUBLIC_API_URL
        }/storage/${trip.images[0].image_path.replace("public/", "")}`
      : "/images/placeholder-mountain.jpg";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-5">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            Memuat Detail Trip
          </h2>
          <p className="text-gray-500 mt-2">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaInfoCircle className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/index-jasa/trip-jasa")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
          >
            <FaChevronLeft className="mr-2" /> Kembali ke Daftar Trip
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-yellow-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Trip Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Data trip yang Anda cari tidak tersedia.
          </p>
          <button
            onClick={() => router.push("/index-jasa/trip-jasa")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center mx-auto"
          >
            <FaChevronLeft className="mr-2" /> Kembali ke Daftar Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                <p>{successMessage}</p>
              </div>
              <p className="text-sm mt-2">
                Anda akan dialihkan ke halaman riwayat trip...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/index-jasa/trip-jasa")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaChevronLeft className="mr-2" />
            <span>Kembali ke Daftar Trip</span>
          </button>

          {isCompletedTrip && (
            <Link
              href={`/index-jasa/history?highlight=${params.id}`}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaHistory className="mr-2" />
              <span>Lihat di Riwayat</span>
            </Link>
          )}
        </div>

        {/* Trip Header with enhanced distinction between trip states */}
        <div
          className={`rounded-2xl shadow-md overflow-hidden mb-6 ${
            isCompletedTrip
              ? "bg-blue-50 border border-blue-100 shadow-blue-100"
              : isUpcomingTrip
              ? "bg-emerald-50 border border-emerald-100 shadow-emerald-100"
              : "bg-amber-50 border border-amber-100 shadow-amber-100"
          }`}
        >
          <div className="relative h-48 md:h-64 w-full">
            <Image
              src={tripImage}
              alt={trip.mountain?.nama_gunung || "Mountain Trip"}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-b from-transparent ${
                isCompletedTrip
                  ? "to-blue-900/70"
                  : isUpcomingTrip
                  ? "to-emerald-900/70"
                  : "to-amber-900/70"
              }`}
            />

            {/* Status Badge with animation for active trips */}
            <div className="absolute top-4 right-4">
              {isCompletedTrip ? (
                <span className="px-4 py-2 rounded-full text-sm font-medium text-blue-800">
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-1.5" />
                    <span>Trip Selesai</span>
                  </div>
                </span>
              ) : isUpcomingTrip ? (
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1.5" />
                    <span>Akan Datang</span>
                  </div>
                </span>
              ) : (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="px-4 py-2 rounded-full text-sm font-medium text-amber-800"
                >
                  <div className="flex items-center">
                    <FaExclamationTriangle className="mr-1.5" />
                    <span>Sedang Berlangsung</span>
                  </div>
                </motion.span>
              )}
            </div>

            {/* Enhanced Trip Details */}
            <div className="absolute bottom-0 left-0 w-full p-6 text-white">
              <h1 className="text-3xl font-bold mb-1 drop-shadow-md">
                {trip.mountain?.nama_gunung || "Mountain Trip"}
              </h1>
              <div className="flex flex-wrap items-center text-sm">
                <div className="flex items-center mr-3">
                  <FaMapMarkerAlt className="mr-1.5 text-red-400" />
                  <span>{trip.mountain?.lokasi || "Location"}</span>
                </div>
                <span className="mr-3 text-white/80">•</span>
                <div className="flex items-center">
                  <span>Ketinggian: {trip.mountain?.tinggi || 0}m</span>
                </div>
                {isCompletedTrip && (
                  <>
                    <span className="mr-3 text-white/80">•</span>
                    <div className="flex items-center text-blue-300">
                      <FaCheckCircle className="mr-1.5" />
                      <span>
                        Selesai:{" "}
                        {formatDate(trip.completed_at || trip.updated_at)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex flex-nowrap overflow-x-auto pb-1 hide-scrollbar">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 font-medium text-sm mr-4 whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <FaInfoCircle className="mr-2" />
                <span>Ringkasan</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("participants")}
              className={`px-4 py-3 font-medium text-sm mr-4 whitespace-nowrap ${
                activeTab === "participants"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <FaUsers className="mr-2" />
                <span>Peserta</span>
                {bookings.filter((b) => b.status === "confirmed").length >
                  0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </span>
                )}
              </div>
            </button>

            {!isCompletedTrip && (
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-3 font-medium text-sm mr-4 whitespace-nowrap ${
                  activeTab === "chat"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <FaComments className="mr-2" />
                  <span>Pesan</span>
                  {Object.values(unreadCounts).reduce((a, b) => a + b, 0) >
                    0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                      {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </div>
              </button>
            )}

            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-3 font-medium text-sm mr-4 whitespace-nowrap ${
                activeTab === "details"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <FaFileAlt className="mr-2" />
                <span>Detail Trip</span>
              </div>
            </button>

            {isCompletedTrip && (
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-3 font-medium text-sm mr-4 whitespace-nowrap ${
                  activeTab === "summary"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <FaChartBar className="mr-2" />
                  <span>Ringkasan Hasil</span>
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaInfoCircle className="text-blue-500 mr-2" />
                Ringkasan Trip
              </h2>

              {/* Status Alert for Current Trip */}
              {!isCompletedTrip && (
                <div
                  className={`p-4 rounded-lg mb-6 ${
                    isUpcomingTrip
                      ? "bg-emerald-50 border border-emerald-200"
                      : tripStats?.daysOverdue > 0
                      ? "bg-red-50 border border-red-200"
                      : "bg-amber-50 border border-amber-200"
                  }`}
                >
                  {isUpcomingTrip ? (
                    <div className="flex items-start">
                      <FaCalendarAlt className="text-emerald-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Trip Akan Datang
                        </h3>
                        <p className="text-gray-600">
                          Trip ke {trip.mountain?.nama_gunung} akan dimulai{" "}
                          {tripStats?.daysLeft === 0
                            ? "hari ini"
                            : `dalam ${tripStats?.daysLeft} hari`}
                          . Pastikan persiapan sudah lengkap.
                        </p>
                      </div>
                    </div>
                  ) : tripStats?.daysOverdue > 0 ? (
                    <div className="flex items-start">
                      <FaExclamationTriangle className="text-red-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Trip Telah Berakhir
                        </h3>
                        <p className="text-gray-600">
                          Trip ini seharusnya sudah berakhir{" "}
                          {tripStats?.daysOverdue} hari yang lalu. Harap segera
                          selesaikan trip ini.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <FaClock className="text-amber-500 mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Trip Sedang Berlangsung
                        </h3>
                        <p className="text-gray-600">
                          Trip ke {trip.mountain?.nama_gunung} sedang
                          berlangsung dan akan berakhir pada{" "}
                          {formatDate(trip.end_date)}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Trip Stats with Real Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm">Total Peserta</h3>
                    <FaUsers className="text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {tripStats?.totalParticipants || 0}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      orang
                    </span>
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-500">
                      Tingkat okupansi: {tripStats?.occupancyRate || 0}%
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm">Durasi Trip</h3>
                    <FaCalendarAlt className="text-indigo-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {tripStats?.duration || 1}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      hari
                    </span>
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-500">
                      {formatDate(trip.start_date)} -{" "}
                      {formatDate(trip.end_date)}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm">Total Pendapatan</h3>
                    <FaMoneyBillWave className="text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(tripStats?.totalRevenue || 0)}
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-500">
                      {bookings.filter((b) => b.status === "confirmed")
                        .length || 0}{" "}
                      booking terkonfirmasi
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gray-50 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-gray-500 text-sm">Kapasitas</h3>
                    <FaUserFriends className="text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {trip.capacity || 0}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      orang
                    </span>
                  </p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="text-gray-500">
                      Tersisa:{" "}
                      {Math.max(
                        0,
                        (trip.capacity || 0) -
                          (tripStats?.totalParticipants || 0)
                      )}{" "}
                      tempat
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Tambahkan ke dalam tab Overview */}
              {!isCompletedTrip && tripStats?.status === "pastDue" && (
                <div className="mt-6">
                  <button
                    onClick={handleFinishTrip}
                    disabled={finishLoading}
                    className="w-full md:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                  >
                    {finishLoading ? (
                      <>
                        <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-2" /> Selesaikan Trip
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Trip ini telah melewati tanggal selesai. Anda dapat menandai
                    trip ini sebagai selesai.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === "participants" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Daftar Peserta
              </h2>

              {bookings.length === 0 ? (
                <div className="bg-gray-50 p-12 rounded-lg text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Belum Ada Peserta
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Belum ada peserta yang mendaftar untuk trip ini.
                    {isCompletedTrip
                      ? " Trip sudah selesai tanpa peserta."
                      : " Peserta akan muncul di sini setelah mereka melakukan booking."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Participant Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm text-gray-600">Terkonfirmasi</h3>
                        <span className="text-green-600 bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                          <FaCheckCircle />
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 mt-2">
                        {
                          bookings.filter((b) => b.status === "confirmed")
                            .length
                        }
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm text-gray-600">Menunggu</h3>
                        <span className="text-yellow-600 bg-yellow-100 rounded-full w-8 h-8 flex items-center justify-center">
                          <FaClock />
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 mt-2">
                        {bookings.filter((b) => b.status === "pending").length}
                      </p>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm text-gray-600">Dibatalkan</h3>
                        <span className="text-red-600 bg-red-100 rounded-full w-8 h-8 flex items-center justify-center">
                          <FaTimes />
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800 mt-2">
                        {
                          bookings.filter((b) => b.status === "cancelled")
                            .length
                        }
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tanggal Booking
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jumlah
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Bayar
                          </th>
                          {!isCompletedTrip && (
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr
                            key={booking.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mr-3">
                                  {booking.user?.nama_depan?.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {booking.user?.nama_depan}{" "}
                                    {booking.user?.nama_belakang}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.user?.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatDate(booking.created_at)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(
                                  booking.created_at
                                ).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {booking.participants} orang
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                                  booking.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {booking.status === "confirmed" ? (
                                  <>
                                    <FaCheckCircle className="mr-1" />{" "}
                                    Terkonfirmasi
                                  </>
                                ) : booking.status === "pending" ? (
                                  <>
                                    <FaClock className="mr-1" /> Menunggu
                                  </>
                                ) : (
                                  <>
                                    <FaTimes className="mr-1" /> Dibatalkan
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {booking.total_price
                                  ? new Intl.NumberFormat("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                      minimumFractionDigits: 0,
                                    }).format(booking.total_price)
                                  : "Rp 0"}
                              </div>
                              {booking.payment && (
                                <div className="text-xs text-gray-500">
                                  {booking.payment.payment_method || "-"}
                                </div>
                              )}
                            </td>
                            {!isCompletedTrip && (
                              <td className="py-4 px-4 whitespace-nowrap">
                                {booking.status === "confirmed" &&
                                  booking.user && (
                                    <motion.button
                                      onClick={() =>
                                        openChatWithUser(booking.user)
                                      }
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="relative flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                      <FaComments className="mr-1" />
                                      <span>Chat</span>
                                      {unreadCounts[booking.user.id] > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                          {unreadCounts[booking.user.id] > 9
                                            ? "9+"
                                            : unreadCounts[booking.user.id]}
                                        </span>
                                      )}
                                    </motion.button>
                                  )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Chat Tab - Only for Active Trips */}
          {activeTab === "chat" && !isCompletedTrip && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Pesan Peserta
              </h2>

              {bookings.filter((b) => b.status === "confirmed").length === 0 ? (
                <div className="bg-gray-50 p-12 rounded-lg text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaComments className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Tidak Ada Peserta Terkonfirmasi
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Belum ada peserta yang terkonfirmasi untuk trip ini. Chat
                    akan tersedia setelah ada peserta yang terkonfirmasi.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {bookings
                    .filter((b) => b.status === "confirmed" && b.user)
                    .map((booking) => (
                      <motion.div
                        key={booking.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-center mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                              {booking.user?.nama_depan?.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {booking.user?.nama_depan}{" "}
                                {booking.user?.nama_belakang}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {booking.participants} peserta
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              {unreadCounts[booking.user?.id] > 0
                                ? `${
                                    unreadCounts[booking.user?.id]
                                  } pesan belum dibaca`
                                : "Tidak ada pesan baru"}
                            </p>
                            <motion.button
                              onClick={() => openChatWithUser(booking.user)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                            >
                              <FaComments className="mr-1" />
                              <span>Chat</span>
                              {unreadCounts[booking.user?.id] > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {unreadCounts[booking.user?.id] > 9
                                    ? "9+"
                                    : unreadCounts[booking.user?.id]}
                                </span>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Detail Trip
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <FaInfoCircle className="mr-2 text-blue-500" />
                      Informasi Trip
                    </h3>
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">
                        {trip.trip_info || "Tidak ada deskripsi perjalanan."}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-red-500" />
                      Info Gunung
                    </h3>
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Nama Gunung</p>
                          <p className="font-medium text-gray-800">
                            {trip.mountain?.nama_gunung || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Lokasi</p>
                          <p className="font-medium text-gray-800">
                            {trip.mountain?.lokasi || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ketinggian</p>
                          <p className="font-medium text-gray-800">
                            {trip.mountain?.tinggi || 0} mdpl
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <p className="font-medium text-gray-800">
                            {trip.mountain?.status || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <FaImage className="mr-2 text-purple-500" />
                      Galeri Foto
                    </h3>

                    {trip.images && trip.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {trip.images.slice(0, 4).map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden"
                          >
                            <Image
                              src={`${
                                process.env.NEXT_PUBLIC_API_URL
                              }/storage/${image.image_path.replace(
                                "public/",
                                ""
                              )}`}
                              alt={`Trip image ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                        {trip.images.length > 4 && (
                          <div className="col-span-2 text-center mt-2">
                            <Link
                              href="#"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Lihat {trip.images.length - 4} foto lainnya
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-5 rounded-lg text-center">
                        <p className="text-gray-500">
                          Tidak ada foto tersedia untuk trip ini.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <FaMoneyBillWave className="mr-2 text-green-500" />
                      Detail Harga
                    </h3>
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <div className="border-b border-gray-200 pb-4 mb-4">
                        <p className="text-sm text-gray-500">Harga per Orang</p>
                        <p className="font-bold text-2xl text-gray-800">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(trip.price)}
                        </p>
                      </div>

                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Sudah termasuk:</span>
                        </div>
                        <ul className="ml-5 list-disc text-gray-700 space-y-1">
                          {(() => {
                            try {
                              // Only parse if it's a string
                              if (trip.facilities && typeof trip.facilities === 'string') {
                                try {
                                  const parsedFacilities = JSON.parse(trip.facilities);
                                  if (Array.isArray(parsedFacilities)) {
                                    return parsedFacilities.map((facility, index) => (
                                      <li key={index}>{facility}</li>
                                    ));
                                  }
                                  // If not an array but parsed successfully, show as single item
                                  return <li>{trip.facilities}</li>;
                                } catch (e) {
                                  // If parsing fails, treat as a regular string
                                  return <li>{trip.facilities}</li>;
                                }
                              } else if (Array.isArray(trip.facilities)) {
                                // If already an array, render directly
                                return trip.facilities.map((facility, index) => (
                                  <li key={index}>{facility}</li>
                                ));
                              } else {
                                // Default facilities if nothing available
                                return (
                                  <>
                                    <li>Pendaftaran SIMAKSI</li>
                                    <li>Pemandu lokal</li>
                                    <li>Makan 3x sehari</li>
                                    <li>Transportasi lokal</li>
                                  </>
                                );
                              }
                            } catch (e) {
                              console.error("Error rendering facilities:", e);
                              return (
                                <>
                                  <li>Pendaftaran SIMAKSI</li>
                                  <li>Pemandu lokal</li>
                                  <li>Makan 3x sehari</li>
                                  <li>Transportasi lokal</li>
                                </>
                              );
                            }
                          })()}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary Tab - Only for Completed Trips */}
          {activeTab === "summary" && isCompletedTrip && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaChartBar className="text-blue-500 mr-2" />
                Ringkasan Hasil Trip
              </h2>

              <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg mb-8">
                <div className="flex items-center mb-3">
                  <FaCertificate className="text-blue-500 mr-2" />
                  <h3 className="font-semibold text-blue-800">Trip Selesai</h3>
                </div>
                <p className="text-blue-700 text-sm">
                  Trip ini telah selesai pada{" "}
                  {formatDate(trip.completed_at || trip.updated_at)}. Total{" "}
                  {tripStats?.totalParticipants || 0} peserta telah berhasil
                  mendaki gunung {trip.mountain?.nama_gunung}.
                </p>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-600">Total Peserta</h3>
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FaUsers className="text-blue-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {tripStats?.totalParticipants || 0}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Dari{" "}
                    {bookings.filter((b) => b.status === "confirmed").length}{" "}
                    booking
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-600">Total Pendapatan</h3>
                    <div className="p-2 bg-green-50 rounded-lg">
                      <FaMoneyBillWave className="text-green-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(tripStats?.totalRevenue || 0)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Semua pembayaran sudah lunas
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-600">Okupansi</h3>
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <FaChartBar className="text-indigo-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {tripStats?.occupancyRate || 0}%
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Dari kapasitas {trip.capacity} orang
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-gray-600">Durasi Trip</h3>
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <FaClock className="text-purple-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {tripStats?.duration || 1}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      hari
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                  </p>
                </motion.div>
              </div>

              {/* Participant Distribution */}
              {bookings.filter((b) => b.status === "confirmed").length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FaUserFriends className="text-blue-500 mr-2" />
                    Peserta Trip
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jumlah
                          </th>
                          <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Bayar
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {bookings
                          .filter((b) => b.status === "confirmed")
                          .map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                                    {booking.user?.nama_depan?.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {booking.user?.nama_depan}{" "}
                                      {booking.user?.nama_belakang}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {booking.user?.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {booking.participants} orang
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className="font-medium">
                                  {booking.total_price
                                    ? new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                      }).format(booking.total_price)
                                    : "Rp 0"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl w-full max-w-lg h-[80vh] flex flex-col shadow-2xl"
          >
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-blue-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={closeChat}
                  className="text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 p-2 rounded-full transition-all"
                >
                  <FaChevronLeft size={16} />
                </button>

                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                    {selectedUser?.nama_depan?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {selectedUser?.nama_depan} {selectedUser?.nama_belakang}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {bookings.find((b) => b.user?.id === selectedUser?.id)
                        ?.participants || 0}{" "}
                      peserta
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={closeChat}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <FaComments className="text-blue-400 text-xl" />
                  </div>
                  <p className="text-gray-500 max-w-xs">
                    Belum ada pesan. Mulailah percakapan dengan{" "}
                    {selectedUser?.nama_depan}.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`mb-4 flex ${
                      message.sender_id === selectedUser.id
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[75%] break-words ${
                        message.sender_id === selectedUser.id
                          ? "bg-white border border-gray-200 text-gray-800"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 text-right ${
                          message.sender_id === selectedUser.id
                            ? "text-gray-500"
                            : "text-blue-200"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t p-3 bg-white"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tulis pesan..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSendingMessage}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSendingMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSendingMessage ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white" />
                  ) : (
                    <FaPaperPlane size={16} />
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
