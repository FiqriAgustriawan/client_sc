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
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";
import { BsClipboardCheck } from "react-icons/bs";

export default function SidebarPengguna() {
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const pathname = usePathname();

  // Use sidebar context
  const sidebarContext = useContext(SidebarContext);
  const [localSidebarOpen, setLocalSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Use context if available, otherwise use local state
  const sidebarOpen = sidebarContext?.sidebarOpen ?? localSidebarOpen;
  const setSidebarOpen = sidebarContext?.setSidebarOpen ?? setLocalSidebarOpen;

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check if a route is active
  const isRouteActive = (path) => {
    if (path === "/dashboard-user" && pathname === "/dashboard-user") {
      return true;
    }
    return pathname.startsWith(path) && path !== "/dashboard-user";
  };

  // Mobile sidebar animations - slide from bottom
  const mobileSidebarVariants = {
    hidden: {
      y: "100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  // Desktop sidebar animations
  const desktopSidebarVariants = {
    expanded: { width: "280px", transition: { duration: 0.3 } },
    collapsed: { width: "70px", transition: { duration: 0.3 } },
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleDropdown = (menuName) => {
    if (activeDropdown === menuName) setActiveDropdown(null);
    else setActiveDropdown(menuName);
  };

  // Effect to handle body class for main content shift
  useEffect(() => {
    if (sidebarOpen && !isMobile) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }

    return () => {
      document.body.classList.remove("sidebar-expanded");
    };
  }, [sidebarOpen, isMobile]);

  // Handle profile image functions
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

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const result = await profileService.getProfile();
        if (result.success && result.data) {
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

  // Mobile Navigation Item
  const MobileNavItem = ({ href, icon, label, isLast = false }) => {
    const isActive = isRouteActive(href);

    return (
      <Link href={href} onClick={() => setSidebarOpen(false)}>
        <motion.div
          className={`flex items-center justify-between p-4 mx-4 mb-2 rounded-2xl transition-all ${
            isActive
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
              : "bg-white hover:bg-gray-50 text-gray-700"
          } ${isLast ? "mb-6" : ""}`}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                isActive ? "bg-white/20" : "bg-blue-50"
              }`}
            >
              <div className={`${isActive ? "text-white" : "text-blue-600"}`}>
                {icon}
              </div>
            </div>
            <div className="ml-4">
              <span
                className={`text-lg font-semibold ${
                  isActive ? "text-white" : "text-gray-800"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
          <FiChevronRight
            className={`w-5 h-5 ${
              isActive ? "text-white/70" : "text-gray-400"
            }`}
          />
        </motion.div>
      </Link>
    );
  };

  // Desktop Navigation Item
  const DesktopNavItem = ({ href, icon, label }) => {
    const isActive = isRouteActive(href);

    return (
      <Link href={href} className="group relative">
        <motion.div
          className={`flex items-center p-3 rounded-xl text-white transition-all ${
            isActive ? "bg-white bg-opacity-20" : ""
          } relative`}
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

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

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />

          {/* Mobile Sidebar */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-gray-100 z-50 rounded-t-3xl max-h-[85vh] overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileSidebarVariants}
          >
            {/* Handle Bar */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="bg-white mx-4 rounded-2xl p-6 mb-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden">
                      {profileData?.profile_image ? (
                        <Image
                          src={profileData.profile_image}
                          alt="Profile"
                          width={64}
                          height={64}
                          className="object-cover w-full h-full rounded-2xl"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                          unoptimized={true}
                        />
                      ) : (
                        <>
                          {user?.nama_depan?.charAt(0) || "U"}
                          {user?.nama_belakang?.charAt(0) || "S"}
                        </>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-2xl">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {user?.nama_depan || "User"} {user?.nama_belakang || "Summit"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {user?.email || "user@summitcs.com"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="p-2 bg-gray-100 rounded-xl"
                >
                  <FiX className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="pb-8 max-h-[calc(85vh-200px)] overflow-y-auto">
              <div className="px-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Menu Navigasi
                </h4>
              </div>

              <MobileNavItem
                href="/dashboard-user"
                icon={<FiUser size={24} />}
                label="Profil Saya"
              />

              <MobileNavItem
                href="/dashboard-user/trip-manage"
                icon={<BsClipboardCheck size={24} />}
                label="Trip Manage"
              />

              <MobileNavItem
                href="/dashboard-user/invoice"
                icon={<FiClipboard size={24} />}
                label="Invoice"
              />

              <MobileNavItem
                href="/dashboard-user/history"
                icon={<FiClock size={24} />}
                label="History"
              />

              {/* Quick Actions */}
              <div className="px-4 mb-4 mt-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Aksi Cepat
                </h4>
              </div>

              <MobileNavItem
                href="/daftar-guide"
                icon={<FiPlus size={24} />}
                label="Jadi Penyedia Jasa"
              />

              <motion.div
                className="mx-4 mb-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl transition-all"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50">
                      <FiImage className="text-blue-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <span className="text-lg font-semibold text-gray-800">
                        Ubah Foto Profil
                      </span>
                    </div>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </motion.div>

              <MobileNavItem
                href="/"
                icon={<FiHome size={24} />}
                label="Kembali ke Home"
              />

              {/* Logout Button */}
              <motion.div
                className="mx-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center p-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-semibold transition-colors shadow-lg"
                >
                  <FiLogOut className="w-6 h-6 mr-3" />
                  Keluar dari Akun
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <motion.div
      className="fixed left-0 top-0 h-full bg-gradient-to-b from-[#4A5EF1] to-[#2E3CB3] z-40 shadow-lg flex flex-col"
      initial="collapsed"
      animate={sidebarOpen ? "expanded" : "collapsed"}
      variants={desktopSidebarVariants}
    >
      {/* Logo and toggle button */}
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
                  alt="SummitCS Logo"
                  width={32}
                  height={32}
                  className="size-7"
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

      {/* User Profile Section */}
      <div className="p-4 border-b border-blue-400 border-opacity-20">
        <div
          className="flex items-center cursor-pointer relative"
          onClick={() => toggleDropdown("profile")}
        >
          <div className="relative">
            <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-white border-2 border-white shadow-lg rounded-full flex items-center justify-center">
              {profileData?.profile_image ? (
                <Image
                  src={profileData.profile_image}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full rounded-full"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                  unoptimized={true}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-base font-medium rounded-full">
                  {user?.nama_depan?.charAt(0) || "U"}
                  {user?.nama_belakang?.charAt(0) || "S"}
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-full">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="ml-3 flex flex-col truncate"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-semibold text-sm truncate">
                  {user?.nama_depan || "User"}{" "}
                  {user?.nama_belakang || "Summit"}
                </span>
                <span className="text-blue-100 text-xs truncate">
                  {user?.email || "user@summitcs.com"}
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

      {/* "Jadi Penyedia Jasa" Button */}
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
              <FiPlus size={20} />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  className="ml-2 text-sm font-medium whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
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

      {/* Navigation Links */}
      <div className="flex-1 flex flex-col space-y-1 px-3">
        <DesktopNavItem
          href="/dashboard-user"
          icon={<FiUser size={20} />}
          label="Profil Saya"
        />

        <DesktopNavItem
          href="/dashboard-user/trip-manage"
          icon={<BsClipboardCheck size={20} />}
          label="Trip Manage"
        />

        <DesktopNavItem
          href="/dashboard-user/invoice"
          icon={<FiClipboard size={20} />}
          label="Invoice"
        />

        <DesktopNavItem
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                Keluar
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Hidden file input */}
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
  );

  // Mobile FAB (Floating Action Button)
  const MobileFAB = () => (
    <motion.button
      onClick={toggleSidebar}
      className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <FiMenu className="w-7 h-7 text-white" />
    </motion.button>
  );

  return (
    <>
      {/* Mobile Version */}
      {isMobile ? (
        <>
          <MobileSidebar />
          <MobileFAB />
        </>
      ) : (
        /* Desktop Version */
        <DesktopSidebar />
      )}
    </>
  );
}
