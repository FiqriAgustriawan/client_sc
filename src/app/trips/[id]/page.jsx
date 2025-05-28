"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { bookingService } from "@/services/bookingService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { paymentConfig } from "@/config/payment";
import {
  FaWhatsapp,
  FaCalendarAlt,
  FaUserFriends,
  FaMountain,
  FaInfoCircle,
  FaCheck,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
} from "react-icons/fa";
import { IoLocation, IoChevronBack, IoClose } from "react-icons/io5";

// Image modal component for lightbox effect
const ImageModal = ({ image, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 right-4 text-white hover:text-blue-300 p-2 rounded-full bg-black/30 backdrop-blur-md"
        onClick={onClose}
      >
        <IoClose size={24} />
      </motion.button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative max-w-7xl max-h-[90vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image}
          alt="Photo Preview"
          fill
          className="object-contain"
          sizes="100vw"
        />
      </motion.div>
    </motion.div>
  );
};

// Helper functions
const getGuideName = (guide) => {
  if (!guide) return "Guide";

  if (guide.nama) return guide.nama;
  if (guide.name) return guide.name;

  if (guide.user?.nama_depan) {
    const fullName = `${guide.user.nama_depan} ${
      guide.user.nama_belakang || ""
    }`.trim();
    return fullName;
  }

  if (guide.user?.name) return guide.user.name;
  if (guide.user?.nama) return guide.user.nama;

  if (guide.user?.email) {
    return guide.user.email.split("@")[0];
  }

  return "Mountain Guide";
};

const getGuideInitials = (guide) => {
  const name = getGuideName(guide);
  if (!name || name === "Mountain Guide") return "G";

  const names = name.split(" ");
  if (names.length > 1) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return names[0][0].toUpperCase();
};

// Collapsible section component
const CollapsibleSection = ({
  title,
  icon,
  children,
  initiallyExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <div className="border border-blue-100 rounded-xl overflow-hidden bg-white shadow-sm mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full p-4 text-left bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-blue-900">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {expanded ? (
            <FaChevronUp className="text-blue-500" />
          ) : (
            <FaChevronDown className="text-blue-500" />
          )}
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TripDetail() {
  const params = useParams();
  const [trip, setTrip] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("info");
  const { user } = useAuth();
  const router = useRouter();
  const tripId = params.id;
  const headerRef = useRef(null);

  // Scroll animations
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const headerScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const response = await tripService.getTripDetail(tripId);
        if (response.success) {
          console.log("Trip Detail Data:", response.data);
          setTrip(response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch trip details:", error);
        toast.error("Failed to load trip details");
        setIsLoading(false);
      }
    };

    fetchTripDetail();
  }, [tripId]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Clean path to handle any potential double slashes
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

  const handleBookTrip = async () => {
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(`/trips/${tripId}`));
      return;
    }

    try {
      setIsLoading(true);
      toast.loading("Processing your booking...");

      const bookingsResponse = await bookingService.getUserBookings();

      if (bookingsResponse.success) {
        const existingBooking = bookingsResponse.data.find(
          (booking) => booking.trip_id === parseInt(tripId)
        );

        if (
          existingBooking &&
          (existingBooking.status === "confirmed" ||
            existingBooking.payment?.status === "paid")
        ) {
          toast.dismiss();
          toast.success("You already have a confirmed booking for this trip");
          router.push("/dashboard-user");
          return;
        }
      }

      const response = await bookingService.bookTrip(tripId);

      toast.dismiss();

      if (response.success && response.data?.payment_url) {
        localStorage.setItem("pending_trip_id", tripId);
        toast.success("Redirecting to payment page...");
        window.location.href = response.data.payment_url;
      } else if (!response.success && response.data?.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        router.push("/dashboard-user");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Booking error:", error);
      toast.error("Failed to process booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  // Observe sections for active state
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-100px 0px -100px 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [trip]);

  // Loading state
  if (isLoading || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center p-8"
        >
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-blue-800">
            Loading Trip Details
          </h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen ">
      {/* Hero Section with Parallax Effect */}
      <motion.div
        ref={headerRef}
        style={{ opacity: headerOpacity, scale: headerScale }}
        className="relative h-[60vh] overflow-hidden"
      >
        <Image
          src={getImageUrl(trip?.images?.[selectedImage]?.image_path)}
          alt={trip?.mountain?.nama_gunung || "Mountain View"}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-blue-900/70" />

        {/* Back Button */}
        <Link
          href="/trips"
          className="absolute top-6 left-6 z-20 flex items-center text-white hover:text-blue-200 transition-colors bg-black/20 backdrop-blur-sm p-2 rounded-lg"
        >
          <IoChevronBack size={20} />
          <span className="ml-1 font-medium">Back</span>
        </Link>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg"
            >
              {trip?.mountain?.nama_gunung}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 text-white mb-4"
            >
              <span className="px-4 py-1.5 bg-blue-600/80 backdrop-blur-sm rounded-full text-sm font-medium">
                Open Trip
              </span>
              <div className="flex items-center gap-1">
                <IoLocation size={18} className="text-blue-300" />
                <span>{trip?.mountain?.lokasi || "Unknown Location"}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaMountain size={16} className="text-blue-300" />
                <span>{trip?.mountain?.tinggi || 0} mdpl</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-30 bg-white shadow-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center overflow-x-auto hide-scrollbar py-3">
            <button
              onClick={() => scrollToSection("info")}
              className={`px-4 py-2 rounded-full whitespace-nowrap mr-3 transition-colors ${
                activeSection === "info"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              Trip Info
            </button>
            <button
              onClick={() => scrollToSection("facilities")}
              className={`px-4 py-2 rounded-full whitespace-nowrap mr-3 transition-colors ${
                activeSection === "facilities"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              Facilities
            </button>
            <button
              onClick={() => scrollToSection("terms")}
              className={`px-4 py-2 rounded-full whitespace-nowrap mr-3 transition-colors ${
                activeSection === "terms"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`px-4 py-2 rounded-full whitespace-nowrap mr-3 transition-colors ${
                activeSection === "about"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("guide")}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeSection === "guide"
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              Guide Info
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Trip Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" />
              Trip Gallery
            </h2>

            <div
              className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-4 cursor-pointer"
              onClick={() =>
                setPreviewImage(
                  getImageUrl(trip?.images?.[selectedImage]?.image_path)
                )
              }
            >
              <Image
                src={getImageUrl(trip?.images?.[selectedImage]?.image_path)}
                alt={trip?.mountain?.nama_gunung || "Mountain View"}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              {trip?.images?.map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative h-16 md:h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 
                    ${
                      selectedImage === idx
                        ? "ring-2 ring-blue-600 shadow-lg shadow-blue-100"
                        : "hover:opacity-90"
                    }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <Image
                    src={getImageUrl(img.image_path)}
                    alt={`Trip image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trip Information Section */}
          <section id="info" className="scroll-mt-20">
            <CollapsibleSection
              title="Trip Information"
              icon={<FaInfoCircle className="text-blue-600" />}
              initiallyExpanded={true}
            >
              <div className="prose prose-blue max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{trip?.trip_info}</p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
                  <FaCalendarAlt />
                  <span className="text-sm">
                    {new Date(trip.start_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    {" - "}
                    {new Date(trip.end_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full">
                  <FaUserFriends />
                  <span className="text-sm">{trip?.capacity} Climbers Max</span>
                </div>
              </div>
            </CollapsibleSection>
          </section>

          {/* Facilities Section */}
          <section id="facilities" className="scroll-mt-20">
            <CollapsibleSection
              title="Facilities"
              icon={<FaCheck className="text-blue-600" />}
              initiallyExpanded={true}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {trip?.facilities?.map((facility, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <FaCheck size={12} />
                    </div>
                    <span className="text-gray-800">{facility}</span>
                  </motion.div>
                ))}
              </div>
            </CollapsibleSection>
          </section>

          {/* Terms & Conditions Section */}
          <section id="terms" className="scroll-mt-20">
            <CollapsibleSection
              title="Terms & Conditions"
              icon={<FaInfoCircle className="text-blue-600" />}
              initiallyExpanded={true}
            >
              <div className="prose prose-blue max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{trip?.terms_conditions}</p>
              </div>
            </CollapsibleSection>
          </section>

          {/* About Section (Added as requested, below Terms & Conditions) */}
          <section id="about" className="scroll-mt-20">
            <CollapsibleSection
              title="About This Trip"
              icon={<FaMountain className="text-blue-600" />}
              initiallyExpanded={true}
            >
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Mountain Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Mountain Name</p>
                      <p className="font-medium text-gray-800">
                        {trip.mountain?.nama_gunung}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-gray-800">
                        {trip.mountain?.lokasi}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Elevation</p>
                      <p className="font-medium text-gray-800">
                        {trip.mountain?.tinggi} mdpl
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="font-medium text-gray-800">
                        {trip.mountain?.status || "Normal"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Difficulty Level
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-3 flex-1 rounded-full ${
                          level <= (trip.difficulty_level || 3)
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    {trip.difficulty_level === 1 &&
                      "Easy - Suitable for beginners"}
                    {trip.difficulty_level === 2 &&
                      "Moderate - Some hiking experience recommended"}
                    {trip.difficulty_level === 3 &&
                      "Medium - Good fitness level required"}
                    {trip.difficulty_level === 4 &&
                      "Challenging - Experienced hikers recommended"}
                    {trip.difficulty_level === 5 &&
                      "Advanced - Technical climbing required"}
                    {(!trip.difficulty_level || trip.difficulty_level > 5) &&
                      "Medium - Good fitness level required"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Best Time to Visit
                  </h4>
                  <p className="text-gray-700">
                    The best time to climb {trip.mountain?.nama_gunung} is
                    during the dry season, usually between April and October
                    when the weather is more stable and trails are less muddy.
                  </p>
                </div>
              </div>
            </CollapsibleSection>
          </section>

          {/* Guide Info Section for Mobile */}
          <section id="guide-mobile" className="lg:hidden scroll-mt-20">
            <CollapsibleSection
              title="Guide Information"
              icon={<FaUserFriends className="text-blue-600" />}
              initiallyExpanded={true}
            >
              <div className="flex flex-col items-center text-center p-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md"
                >
                  {trip.guide?.profile_photo ? (
                    <Image
                      src={getImageUrl(trip.guide.profile_photo)}
                      alt={getGuideName(trip.guide)}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {getGuideInitials(trip.guide)}
                    </div>
                  )}

                  {/* Online status indicator */}
                  {trip.guide?.is_online && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </motion.div>

                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {getGuideName(trip.guide)}
                </h3>

                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Mountain Guide
                  </span>

                  {(trip.guide?.rating || trip.guide?.average_rating) && (
                    <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">
                      <div className="flex mr-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill={
                              star <=
                              Math.round(
                                trip.guide?.rating ||
                                  trip.guide?.average_rating ||
                                  0
                              )
                                ? "currentColor"
                                : "none"
                            }
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-medium">
                        {parseFloat(
                          trip.guide?.rating || trip.guide?.average_rating || 0
                        ).toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Experience badge */}
                  {(trip.guide?.experience || trip.guide?.user?.experience) && (
                    <div className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs border border-indigo-200">
                      {trip.guide?.experience || trip.guide?.user?.experience}{" "}
                      years exp
                    </div>
                  )}
                </div>

                {(trip.guide?.about || trip.guide?.user?.about) && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-xl text-left border border-blue-100">
                    <p className="text-gray-700 italic">
                      "{trip.guide?.about || trip.guide?.user?.about}"
                    </p>
                  </div>
                )}

                <div className="space-y-2 w-full mb-4">
                  {(trip.guide?.experience || trip.guide?.user?.experience) && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <FaCalendarAlt size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="font-medium text-gray-700">
                          {trip.guide?.experience ||
                            trip.guide?.user?.experience}{" "}
                          years as a guide
                        </p>
                      </div>
                    </div>
                  )}

                  {(trip.guide?.specialty || trip.guide?.user?.specialty) && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <FaMountain size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Specialty</p>
                        <p className="font-medium text-gray-700">
                          {trip.guide?.specialty ||
                            trip.guide?.user?.specialty ||
                            "Mountain Climbing"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {(trip.guide?.whatsapp || trip.guide?.user?.whatsapp) && (
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={`https://wa.me/${(
                      trip.guide?.whatsapp || trip.guide?.user?.whatsapp
                    )?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    <FaWhatsapp size={20} />
                    <span>Contact via WhatsApp</span>
                  </motion.a>
                )}
              </div>
            </CollapsibleSection>
          </section>
        </div>

        {/* Right Column - Sticky Booking & Guide Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-blue-100"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Price per person</p>
                  <div className="text-3xl font-bold text-blue-700">
                    Rp {trip.price.toLocaleString()}
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
                  Open Trip
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" />
                  Trip Schedule
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-gray-600">Start Date</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {new Date(trip.start_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-600">End Date</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {new Date(trip.end_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-800"></div>
                      <span className="text-gray-600">Duration</span>
                    </div>
                    <span className="font-medium text-gray-800">
                      {Math.ceil(
                        (new Date(trip.end_date) - new Date(trip.start_date)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              </div>

              {user ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookTrip}
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-xl font-medium text-white transition-all ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Book This Trip"
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    router.push(
                      "/login?redirect=" +
                        encodeURIComponent(`/trips/${tripId}`)
                    )
                  }
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all"
                >
                  Sign In to Book
                </motion.button>
              )}

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Secure payment processed by{" "}
                  {paymentConfig?.processor || "Payment Provider"}
                </p>
              </div>
            </motion.div>

            {/* Guide Info Card - Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              id="guide"
              className="hidden lg:block bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-md p-6 border border-blue-100 scroll-mt-24"
            >
              <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
                <FaUserFriends className="text-blue-600" />
                Guide Information
              </h3>

              {/* Enhanced Guide Profile Header */}
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-24 h-24 shadow-md rounded-full overflow-hidden flex-shrink-0 border-4 border-white"
                >
                  {trip.guide?.profile_photo ? (
                    <Image
                      src={getImageUrl(trip.guide.profile_photo)}
                      alt={getGuideName(trip.guide)}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                      {getGuideInitials(trip.guide)}
                    </div>
                  )}

                  {/* Online status indicator */}
                  {trip.guide?.is_online && (
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </motion.div>

                <div>
                  <h4 className="font-bold text-gray-800 text-xl">
                    {getGuideName(trip.guide)}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      Mountain Guide
                    </span>

                    {/* Enhanced rating display */}
                    {(trip.guide?.rating || trip.guide?.average_rating) && (
                      <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200">
                        <div className="flex mr-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className="w-3 h-3"
                              viewBox="0 0 24 24"
                              fill={
                                star <=
                                Math.round(
                                  trip.guide?.rating ||
                                    trip.guide?.average_rating ||
                                    0
                                )
                                  ? "currentColor"
                                  : "none"
                              }
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs font-medium">
                          {parseFloat(
                            trip.guide?.rating ||
                              trip.guide?.average_rating ||
                              0
                          ).toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Experience badge */}
                    {(trip.guide?.experience ||
                      trip.guide?.user?.experience) && (
                      <div className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs border border-indigo-200">
                        {trip.guide?.experience || trip.guide?.user?.experience}{" "}
                        years exp
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Guide bio/about */}
              {(trip.guide?.about || trip.guide?.user?.about) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-5 p-4 bg-white bg-opacity-80 rounded-lg border border-blue-100 shadow-inner"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h5 className="text-sm font-medium text-blue-700">About</h5>
                  </div>
                  <p className="text-gray-700 text-sm italic leading-relaxed">
                    "{trip.guide?.about || trip.guide?.user?.about}"
                  </p>
                </motion.div>
              )}

              {/* Guide details with icons */}
              <div className="space-y-3 text-sm text-gray-600 mb-5">
                {(trip.guide?.experience || trip.guide?.user?.experience) && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-50">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <FaCalendarAlt size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="font-medium text-gray-700">
                        {trip.guide?.experience || trip.guide?.user?.experience}{" "}
                        years as a guide
                      </p>
                    </div>
                  </div>
                )}

                {(trip.guide?.specialty || trip.guide?.user?.specialty) && (
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-50">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      <FaMountain size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Specialty</p>
                      <p className="font-medium text-gray-700">
                        {trip.guide?.specialty ||
                          trip.guide?.user?.specialty ||
                          "Mountain Climbing"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced WhatsApp contact button */}
              {(trip.guide?.whatsapp || trip.guide?.user?.whatsapp) && (
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href={`https://wa.me/${(
                    trip.guide?.whatsapp || trip.guide?.user?.whatsapp
                  )?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
                >
                  <FaWhatsapp size={20} />
                  <span>Contact via WhatsApp</span>
                </motion.a>
              )}

              {/* Guide ratings summary if available */}
              {trip.guide?.ratings_count > 0 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/guide/${trip.guide_id || trip.guide?.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center gap-1"
                  >
                    <span>See {trip.guide.ratings_count} reviews</span>
                    <FaChevronRight size={12} />
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Quick Facts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="bg-white rounded-2xl shadow-md p-6 border border-blue-100"
            >
              <h3 className="font-bold text-lg text-blue-900 mb-4">
                Quick Facts
              </h3>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaMountain className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-700">
                    {trip.mountain?.nama_gunung} is {trip.mountain?.tinggi}{" "}
                    meters above sea level
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-700">
                    Trip duration:{" "}
                    {Math.ceil(
                      (new Date(trip.end_date) - new Date(trip.start_date)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUserFriends className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-700">
                    Maximum {trip.capacity} participants
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <IoLocation className="text-blue-600 text-xs" />
                  </div>
                  <span className="text-gray-700">
                    Located in {trip.mountain?.lokasi}
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Booking Button for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-gray-500">Price per person</p>
            <p className="text-xl font-bold text-blue-700">
              Rp {trip.price.toLocaleString()}
            </p>
          </div>
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookTrip}
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium text-white ${
                isLoading
                  ? "bg-blue-400"
                  : "bg-blue-600 shadow-md shadow-blue-200"
              }`}
            >
              {isLoading ? "Processing..." : "Book Now"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                router.push(
                  "/login?redirect=" + encodeURIComponent(`/trips/${tripId}`)
                )
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md shadow-blue-200"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <ImageModal
            image={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
