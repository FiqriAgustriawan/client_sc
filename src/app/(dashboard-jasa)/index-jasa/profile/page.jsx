"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiEdit,
  FiCamera,
  FiSave,
  FiX,
  FiInstagram,
  FiMessageCircle,
  FiChevronRight,
  FiInfo,
  FiLogOut,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiSettings,
  FiPhone,
  FiCheck,
} from "react-icons/fi";
import axios from "axios";

export default function ProfilePage() {
  const [guideData, setGuideData] = useState({
    name: "",
    email: "",
    about: "",
    instagram: "",
    whatsapp: "",
    profile_photo: null,
    average_rating: 0,
    ratings_count: 0,
    ratings: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [imagePreview, setImagePreview] = useState(null);
  const [isFormModified, setIsFormModified] = useState(false);

  // Fetch guide profile data
  useEffect(() => {
    const fetchGuideProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          "http://localhost:8000/api/guide/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          // Store original data for comparison when checking form modifications
          const profileData = data.data;

          // Handle profile photo URL
          if (profileData.profile_photo) {
            // Ensure the URL has the correct format with base URL
            if (!profileData.profile_photo.startsWith("http")) {
              profileData.profile_photo = `http://localhost:8000${profileData.profile_photo}`;
            }

            // Set the image preview as well
            setImagePreview(profileData.profile_photo);
          }

          // Fetch ratings data
          try {
            const ratingsResponse = await axios.get(
              `http://localhost:8000/api/guides/${profileData.id}/ratings`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (ratingsResponse.data.success) {
              setGuideData({
                ...profileData,
                average_rating: ratingsResponse.data.data.average_rating || 0,
                ratings_count: ratingsResponse.data.data.ratings_count || 0,
                ratings: ratingsResponse.data.data.ratings || [],
              });
            } else {
              setGuideData(profileData);
            }
          } catch (ratingErr) {
            console.error("Error fetching ratings:", ratingErr);
            setGuideData(profileData);
          }
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching guide profile:", err);
        setError(err.message);
        toast.error(`Failed to load profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideProfile();
  }, []);

  // Handle profile photo upload
  const handleProfilePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast.error("Format tidak didukung. Gunakan format gambar JPG atau PNG");
      return;
    }

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran terlalu besar. Ukuran gambar maksimal 2MB");
      return;
    }

    // Set image preview immediately for better user experience
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    fileReader.readAsDataURL(file);

    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profile_photo", file);

      const response = await fetch(
        "http://localhost:8000/api/guide/profile/photo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to update profile photo: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success) {
        // Update the state with the new photo URL
        const newPhotoUrl = result.data.profile_photo;
        const fullPhotoUrl = newPhotoUrl.startsWith("http")
          ? newPhotoUrl
          : `http://localhost:8000${newPhotoUrl}`;

        setGuideData((prev) => ({
          ...prev,
          profile_photo: fullPhotoUrl,
        }));

        // Show custom toast for successful upload
        toast.custom(
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-xl flex items-start gap-3">
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
              <FiCamera className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-white">Photo Updated!</h3>
              <p className="text-white/90 text-sm">
                Your profile photo has been successfully updated
              </p>
            </div>
          </div>,
          { duration: 4000 }
        );
      } else {
        throw new Error(result.error || "Failed to update profile photo");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.message);
      // Revert the image preview if upload fails
      setImagePreview(guideData.profile_photo);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle profile update
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8000/api/guide/profile/update",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            about: guideData.about,
            instagram: guideData.instagram,
            whatsapp: guideData.whatsapp,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update profile: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success) {
        setIsEditing(false);
        setIsFormModified(false);

        // Custom toast for successful update
        toast.custom(
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-start gap-3">
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
              <FiSave className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-white">Profile Saved!</h3>
              <p className="text-white/90 text-sm">
                Your profile has been successfully updated
              </p>
            </div>
          </div>,
          { duration: 4000 }
        );
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuideData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsFormModified(true);
  };

  const handleLogout = () => {
    // Clear token and other stored data
    localStorage.removeItem("token");

    // Show success toast
    toast.success("You have successfully logged out");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren",
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
  };

  const shimmerVariants = {
    initial: { x: "-100%", opacity: 0.1 },
    animate: {
      x: "100%",
      opacity: 0.5,
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Loading skeleton UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="flex flex-col items-center max-w-md mx-auto p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative w-24 h-24 mb-8 bg-gray-200 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-t-4 border-r-4 border-blue-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <motion.div
            className="w-full h-8 bg-gray-200 rounded-lg mb-4"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          <motion.div
            className="w-3/4 h-6 bg-gray-200 rounded-lg mb-8"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />

          <div className="space-y-3 w-full">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-full h-14 bg-gray-200 rounded-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 * i }}
              />
            ))}
          </div>

          <motion.p
            className="mt-10 text-gray-600 font-medium text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Loading your profile dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
          >
            <FiInfo className="text-red-500 text-3xl" />
          </motion.div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Failed to Load Profile
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main UI with improved design inspired by the dashboard-user page
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col mx-3.5 "
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Background */}
      <div className="w-full h-[280px] md:h-[320px] bg-gradient-to-r from-blue-700 to-blue-500 rounded-b-[40px] relative overflow-hidden ">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 800"
          >
            <path
              fill="none"
              stroke="white"
              strokeWidth="2"
              d="M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63"
            ></path>
            <path
              fill="none"
              stroke="white"
              strokeWidth="2"
              d="M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764"
            ></path>
            <path
              fill="none"
              stroke="white"
              strokeWidth="2"
              d="M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880"
            ></path>
          </svg>
        </div>

        {/* Header Content */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Guide Profile Dashboard
              </h1>
              <p className="text-blue-100 text-sm md:text-base max-w-xl">
                Manage your personal information, contact details, and guide
                profile to improve your presence.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Card - Positioned to overlap with header */}
          {/* Profile Card - Positioned to overlap with header - WIDER VERSION */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 w-full"
        >
          <div className="relative group">
            {/* Profile photo with preview */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
              onClick={handleProfilePhotoClick}
            >
              {imagePreview || guideData.profile_photo ? (
                <Image
                  src={imagePreview || guideData.profile_photo}
                  alt={guideData.name || "Profile"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error("Image failed to load");
                    e.target.src = "/default-avatar.png";
                  }}
                  unoptimized={true}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {guideData?.name?.charAt(0) || "G"}
                </div>
              )}
      
              {/* Camera icon overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                whileHover={{
                  opacity: 1,
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              >
                <motion.div
                  className="text-white text-sm font-medium opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                >
                  <FiCamera className="h-6 w-6 mx-auto" />
                  <span className="block mt-1 text-xs">Change Photo</span>
                </motion.div>
              </motion.div>
      
              {/* Loading overlay */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-20">
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              )}
            </motion.div>
      
            {/* Edit button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-600 transition-colors"
              onClick={handleProfilePhotoClick}
            >
              <FiCamera className="text-white" />
            </motion.div>
      
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg, image/png, image/jpg"
            />
          </div>
      
          {/* Profile info section - EXPANDED */}
          <div className="flex flex-col text-center md:text-left flex-grow">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              {guideData?.name || "Guide Name"}
            </h3>
            <p className="text-gray-500 mb-2 flex items-center justify-center md:justify-start">
              <FiMail className="mr-2" />
              {guideData?.email || "guide@example.com"}
            </p>
      
            {/* User info with better spacing */}
            <div className="flex flex-col space-y-3 w-full max-w-lg">
              {/* Experience badge */}
              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mb-1 mx-auto md:mx-0 w-fit">
                <FiMapPin className="mr-1" />
                Mountain Guide
              </div>
      
              {/* Ratings section with improved spacing and styling - with safer implementation */}
              {guideData?.average_rating !== undefined ? (
                <div className="flex items-center justify-center md:justify-start mb-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                          star <= Math.round(guideData.average_rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {/* Fixed the error by using string conversion instead of toFixed */}
                    {typeof guideData.average_rating === "number" 
                      ? guideData.average_rating.toString() 
                      : guideData.average_rating}{" "}
                    ({guideData.ratings_count || 0} reviews)
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center md:justify-start mb-1">
                  <span className="text-sm text-gray-500">No ratings yet</span>
                </div>
              )}
      
              {/* Additional info badges with improved layout */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {guideData?.experience_years && (
                  <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                    <FiCalendar className="mr-1 text-gray-500" />
                    {guideData.experience_years} years exp
                  </div>
                )}
      
                {guideData?.location && (
                  <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                    <FiMapPin className="mr-1 text-gray-500" />
                    {guideData.location}
                  </div>
                )}
      
                <div className="inline-flex items-center px-2 py-1 bg-green-50 rounded-lg text-xs text-green-700">
                  <FiCheck className="mr-1" />
                  Verified Guide
                </div>
              </div>
      
              {/* Last updated info with better alignment */}
              <p className="text-xs text-gray-500 italic flex items-center justify-center md:justify-start">
                <FiClock className="mr-1" />
                {guideData?.updated_at
                  ? `Last updated: ${formatDate(guideData.updated_at)}`
                  : "No updates yet"}
              </p>
            </div>
          </div>
      
          {/* Button group with better alignment for wider layout */}
          <div className="md:ml-auto mt-4 md:mt-0 flex flex-col md:flex-row gap-3 self-center md:self-start">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow flex items-center justify-center gap-2 min-w-[140px]
                ${
                  isEditing
                    ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-500/30"
                }`}
            >
              {isEditing ? (
                <>
                  <FiX className="text-lg" />
                  Cancel Editing
                </>
              ) : (
                <>
                  <FiEdit className="text-lg" />
                  Edit Profile
                </>
              )}
            </motion.button>
      
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium hover:bg-red-100 transition-all duration-300 shadow flex items-center justify-center gap-2 min-w-[140px]"
            >
              <FiLogOut className="text-lg" />
              Logout
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex overflow-x-auto space-x-3 mb-6 scrollbar-hide">
          {["profile", "social"].map((tab, index) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              onClick={() => setActiveSection(tab)}
              className={`px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeSection === tab
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {tab === "profile" && (
                <div className="flex items-center gap-2">
                  <FiUser />
                  <span>Personal Information</span>
                </div>
              )}
              {tab === "social" && (
                <div className="flex items-center gap-2">
                  <FiMessageCircle />
                  <span>Contact Information</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-6 pb-16">
          <AnimatePresence mode="wait">
            {activeSection === "profile" ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mr-4">
                    <FiUser className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Personal Information
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Edit your personal details and biography
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Name field - read only */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    <div className="space-y-2 md:col-span-6">
                      <label className="block text-sm text-gray-700 flex items-center justify-between">
                        <span>Full Name</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Tidak dapat diubah
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={guideData?.name || ""}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Email field - read only */}
                    <div className="space-y-2 md:col-span-6">
                      <label className="block text-sm text-gray-700 flex items-center justify-between">
                        <span>Email Address</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Tidak dapat diubah
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={guideData?.email || ""}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 focus:outline-none"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Email diambil dari data registrasi dan tidak dapat
                        diubah.
                      </p>
                    </div>

                    {/* About field - editable */}
                    <div className="space-y-2 md:col-span-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        About Me
                      </label>
                      {isEditing ? (
                        <textarea
                          name="about"
                          value={guideData?.about || ""}
                          onChange={handleInputChange}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Tell climbers about yourself, your experience, and your expertise..."
                        />
                      ) : (
                        <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 min-h-[150px]">
                          {guideData?.about || (
                            <span className="text-gray-400 italic">
                              No information provided yet. Click Edit Profile to
                              add details about yourself.
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Professional Info Card */}
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="font-medium text-lg text-gray-900 mb-4">
                      Professional Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          <FiMapPin />
                        </div>
                        <div>
                          <h3 className="font-medium">Mountain Guide</h3>
                          <p className="text-sm text-gray-600">
                            Professional mountain climbing guide
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                          <FiCalendar />
                        </div>
                        <div>
                          <h3 className="font-medium">Trip Management</h3>
                          <p className="text-sm text-gray-600">
                            <Link
                              href="/index-jasa/trips"
                              className="text-blue-600 hover:underline"
                            >
                              View your active trips
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mt-4">
                      As a mountain guide, you help climbers navigate mountains
                      safely, providing expertise on routes, weather conditions,
                      and safety protocols.
                    </p>

                    <div className="mt-6">
                      <Link
                        href="/index-jasa/trips"
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <span>View Your Trip Offerings</span>
                        <FiChevronRight className="ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Update button */}
                  {isEditing && isFormModified && (
                    <motion.button
                      onClick={handleUpdate}
                      className="mt-8 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                      whileHover={{
                        y: -2,
                        boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FiSave className="mr-2" />
                      Save Changes
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="social"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mr-4">
                    <FiMessageCircle className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Contact Information
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Update your contact details for climbers to reach you
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-xl mb-6">
                    <div className="flex items-start">
                      <FiInfo className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-blue-800 text-sm">
                        Your contact information will be visible to climbers who
                        book your trips. Make sure to keep it updated and use
                        contacts you check regularly.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Instagram field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram Username
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiInstagram className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="instagram"
                            value={guideData?.instagram || ""}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="your_instagram_username"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 flex items-center">
                            <FiInstagram className="text-pink-500 mr-2" />
                            {guideData?.instagram ? (
                              <span>@{guideData.instagram}</span>
                            ) : (
                              <span className="text-gray-400 italic">
                                No Instagram username provided
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp Number
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiPhone className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="whatsapp"
                            value={guideData?.whatsapp || ""}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            placeholder="+62 8xx-xxxx-xxxx"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 flex items-center justify-between">
                            <div className="flex items-center">
                              <FiPhone className="text-green-500 mr-2" />
                              {guideData?.whatsapp ? (
                                <span>{guideData.whatsapp}</span>
                              ) : (
                                <span className="text-gray-400 italic">
                                  No WhatsApp number provided
                                </span>
                              )}
                            </div>

                            {guideData?.whatsapp && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                                <FiCheck className="mr-1" size={12} />
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Privacy Notice */}
                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <h3 className="font-medium text-gray-800 mb-4">
                      Privacy Notice
                    </h3>

                    <div className="p-4 bg-amber-50 rounded-xl mb-4 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <div className="text-amber-500 mt-0.5">
                          <FiInfo />
                        </div>
                        <div>
                          <p className="text-amber-800 text-sm font-medium mb-1">
                            Important Privacy Information
                          </p>
                          <p className="text-amber-700 text-sm">
                            Your contact information is only shared with
                            climbers who have booked your trips. We recommend
                            using a dedicated business contact for your guide
                            services.
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                      Using a business contact helps maintain a professional
                      relationship with your clients and protects your personal
                      information. Make sure your contact details are active and
                      regularly monitored.
                    </p>
                  </div>

                  {/* Update button */}
                  {isEditing && isFormModified && (
                    <motion.button
                      onClick={handleUpdate}
                      className="mt-8 w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center"
                      whileHover={{
                        y: -2,
                        boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FiSave className="mr-2" />
                      Save Contact Information
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

         
        </div>
      </div>
    </motion.div>
  );
}
