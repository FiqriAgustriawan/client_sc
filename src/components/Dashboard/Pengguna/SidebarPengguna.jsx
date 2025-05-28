"use client";

import { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { profileService } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import LogoProductSide from "@/assets/svgs/LogoProductSide.svg";
import { SidebarContext } from "@/services/SidebarContext";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUser,
  FiImage,
  FiLogOut,
  FiMenu,
  FiX,
  FiClipboard,
  FiHeart,
  FiClock,
  FiSettings,
  FiMapPin,
} from "react-icons/fi";
import { BsClipboardCheck } from "react-icons/bs";

export default function Sidebar() {
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const pathname = usePathname(); // Gunakan usePathname untuk dapat reaktif terhadap perubahan rute

  // Fix: Jika context tidak tersedia, gunakan state lokal
  const sidebarContext = useContext(SidebarContext);
  const [localSidebarOpen, setLocalSidebarOpen] = useState(false);

  // Gunakan nilai dari context jika tersedia, jika tidak gunakan state lokal
  const sidebarOpen = sidebarContext?.sidebarOpen ?? localSidebarOpen;
  const setSidebarOpen = sidebarContext?.setSidebarOpen ?? setLocalSidebarOpen;

  // Track active route for highlighting current page - gunakan pathname dari hook
  const activePath = pathname;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast({
        variant: "destructive",
        title: "Format tidak didukung",
        description: "Gunakan format gambar JPG atau PNG",
      });
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Ukuran terlalu besar",
        description: "Ukuran gambar maksimal 2MB",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("profile_image", file);

      const result = await profileService.updateProfileImage(formData);

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Foto profil berhasil diperbarui",
        });

        // Fetch updated profile data
        const profileResult = await profileService.getProfile();
        if (profileResult.success) {
          setProfileData(profileResult.data);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Gagal",
          description: result.error || "Gagal memperbarui foto profil",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui foto profil",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Add useEffect to fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const result = await profileService.getProfile();
        if (result.success && result.data) {
          // Ensure profile_image has the full URL
          setProfileData({
            ...result.data,
            profile_image: result.data.profile_image
              ? result.data.profile_image
              : null,
          });
        } else {
          console.error("Failed to fetch profile data:", result.error);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Sidebar animation variants
  const sidebarVariants = {
    expanded: { width: "256px", transition: { duration: 0.3 } },
    collapsed: { width: "70px", transition: { duration: 0.3 } },
  };

  // Content animation variants
  const contentVariants = {
    visible: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } },
    hidden: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  // Add a new state for dropdown menus
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Add a function to toggle dropdowns
  const toggleDropdown = (menuName) => {
    if (activeDropdown === menuName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(menuName);
    }
  };

  // Effect to handle body class for main content shift
  useEffect(() => {
    // Add or remove a class from document body based on sidebar state
    if (sidebarOpen) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("sidebar-expanded");
    };
  }, [sidebarOpen]);

  // Function to check if a route is active - dengan memperbaiki implementasi
  const isRouteActive = (path) => {
    // Memeriksa dengan lebih teliti apakah path saat ini adalah bagian dari rute yang aktif
    if (path === "/dashboard-user" && activePath === "/dashboard-user") {
      return true;
    }
    return activePath.startsWith(path) && path !== "/dashboard-user";
  };

  // Enhanced navigation item component with better hover effects - dengan perbaikan animasi
  const NavItem = ({ href, icon, label }) => {
    const isActive = isRouteActive(href);

    return (
      <Link href={href} className="group relative">
        <motion.div
          className={`flex items-center p-3 rounded-xl text-white transition-all ${
            isActive ? "bg-white bg-opacity-20" : ""
          }`}
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 ${
              isActive ? "text-blue-100" : ""
            }`}
          >
            {icon}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                className={`ml-3 text-sm font-medium ${
                  isActive ? "text-blue-100" : ""
                }`}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Indikator aktif dengan perbaikan */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full"
                layoutId="activeIndicator"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  duration: 0.2,
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      {/* New Vertical Sidebar */}
      <motion.div
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-[#4A5EF1] to-[#2E3CB3] z-40 shadow-lg flex flex-col"
        initial="collapsed"
        animate={sidebarOpen ? "expanded" : "collapsed"}
        variants={sidebarVariants}
      >
        {/* Logo and Brand Section */}
        <div className="flex items-center p-3 border-b border-blue-400 border-opacity-30">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                className="flex items-center justify-between w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <Image
                    src={LogoProductSide}
                    alt="SummitCS"
                    width={32}
                    height={32}
                  />
                  <span className="ml-3 text-white font-semibold">
                    SummitCS
                  </span>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="text-white p-1 rounded-full transition-all transform hover:rotate-90"
                >
                  <FiX size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                onClick={toggleSidebar}
                className="w-full flex justify-center text-white p-1 rounded-full transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <FiMenu size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Section - Moved up from bottom */}
        <div className="p-4 border-b border-blue-400 border-opacity-20">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleDropdown("profile")}
          >
            <div className="relative">
              <div
                className="w-10 h-10 flex-shrink-0 overflow-hidden bg-white border-2 border-white shadow-lg"
                style={{
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profileData?.profile_image ? (
                  <Image
                    src={profileData.profile_image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                    style={{ borderRadius: "9999px" }}
                    unoptimized={true}
                  />
                ) : (
                  <div
                    className="w-full h-full bg-[#809CFF] flex items-center justify-center text-white text-lg"
                    style={{ borderRadius: "9999px" }}
                  >
                    {user?.nama_depan?.charAt(0) || ""}
                    {user?.nama_belakang?.charAt(0) || ""}
                  </div>
                )}
                {isUploading && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
                    style={{ borderRadius: "9999px" }}
                  >
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  className="ml-3 flex flex-col truncate"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                >
                  <span className="text-white font-semibold text-sm truncate">
                    {user?.nama_depan} {user?.nama_belakang}
                  </span>
                  <span className="text-blue-100 text-xs truncate">
                    {user?.email}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {activeDropdown === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`mt-2 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100 ${
                  sidebarOpen ? "mx-2" : "absolute left-[70px] w-56"
                }`}
              >
                <div className="py-1">
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <FiHome className="mr-2" size={16} />
                      <span>Home</span>
                    </div>
                  </Link>
                  <Link
                    href="/dashboard-user"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <FiUser className="mr-2" size={16} />
                      <span>Profil Saya</span>
                    </div>
                  </Link>
                  <div
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center">
                      <FiImage className="mr-2" size={16} />
                      <span>Ubah Foto</span>
                    </div>
                  </div>
                  <div
                    onClick={logout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-gray-100 mt-1"
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2" size={16} />
                      <span>Keluar</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* "Jadi Penyedia Jasa" Button - Moved up from bottom */}
        <div className="px-3 py-2 border-b border-blue-400 border-opacity-20">
          <Link href="/daftar-guide">
            <motion.div
              className="flex items-center p-2 rounded-xl bg-white text-[#3A7DF7] transition-all shadow-md"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-8 h-8">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 6V18M18 12H6" />
                </svg>
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    className="ml-2 text-sm font-medium whitespace-nowrap"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                  >
                    Jadi Penyedia Jasa
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>

        {/* Divider with label */}
        <div className="px-4 py-2">
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="h-px bg-blue-300 bg-opacity-30 flex-grow"></div>
              <span className="px-2 text-xs text-blue-100">MENU NAVIGASI</span>
              <div className="h-px bg-blue-300 bg-opacity-30 flex-grow"></div>
            </div>
          )}
        </div>

        {/* Navigation Links with fixed animation */}
        <div className="flex-1 flex flex-col space-y-1 px-3">
          {/* Profile */}
          <NavItem
            href="/dashboard-user"
            icon={<FiUser size={20} />}
            label="Profil Saya"
          />

          {/* Trip Manage */}
          <NavItem
            href="/dashboard-user/trip-manage"
            icon={<BsClipboardCheck size={20} />}
            label="Trip Manage"
          />

          {/* Invoice */}
          <NavItem
            href="/dashboard-user/invoice"
            icon={<FiClipboard size={20} />}
            label="Invoice"
          />

          {/* History */}
          <NavItem
            href="/dashboard-user/history"
            icon={<FiClock size={20} />}
            label="History"
          />
        </div>
        
           {/* Logout Section */}
           <div className="p-4 border-t border-blue-400 border-opacity-30">
          <motion.button
            onClick={logout}
            className="flex items-center w-full p-2 rounded-xl text-white hover:bg-white hover:bg-opacity-10 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center w-8 h-8 text-red-300">
              <FiLogOut size={20} />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  className="ml-3 text-sm font-medium text-red-200"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={contentVariants}
                >
                  Keluar
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <div onClick={handleProfileClick} className="hidden">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg, image/png, image/jpg"
          />
        </div>
      </motion.div>

      {/* Overlay to close sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
