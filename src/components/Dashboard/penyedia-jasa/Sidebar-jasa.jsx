"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import LogoProductSide from "@/assets/svgs/LogoProductSide.svg";
import {
  FiClipboard,
  FiBriefcase,
  FiDollarSign,
  FiClock,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
} from "react-icons/fi";
import Image from "next/image";
import { SidebarContext } from "@/services/SidebarContext";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname(); // Menggunakan usePathname dari Next.js

  // Fix: Jika context tidak tersedia, gunakan state lokal
  const sidebarContext = useContext(SidebarContext);
  const [localSidebarOpen, setLocalSidebarOpen] = useState(false);

  // Gunakan nilai dari context jika tersedia, jika tidak gunakan state lokal
  const sidebarOpen = sidebarContext?.sidebarOpen ?? localSidebarOpen;
  const setSidebarOpen = sidebarContext?.setSidebarOpen ?? setLocalSidebarOpen;

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Fetch profile data like in the profile page
  useEffect(() => {
    const fetchGuideProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("Authentication token not found");
          return;
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
          const profileData = data.data;

          // Handle profile photo URL
          if (profileData.profile_photo) {
            // Ensure the URL has the correct format with base URL
            if (!profileData.profile_photo.startsWith("http")) {
              profileData.profile_photo = `http://localhost:8000${profileData.profile_photo}`;
            }
          }

          setProfileData(profileData);
        }
      } catch (err) {
        console.error("Error fetching guide profile:", err);
      }
    };

    if (user) {
      fetchGuideProfile();
    }
  }, [user]);

  // Check if a route is active - perbaikan untuk lebih reaktif
  const isRouteActive = (path) => {
    // Handle kasus khusus untuk root path
    if (path === "/index-jasa" && pathname === "/index-jasa") {
      return true;
    }
    return pathname.startsWith(path) && path !== "/index-jasa";
  };

  // Animasi sidebar
  const sidebarVariants = {
    expanded: { width: "256px", transition: { duration: 0.3 } },
    collapsed: { width: "70px", transition: { duration: 0.3 } },
  };

  // Animasi konten
  const contentVariants = {
    visible: { opacity: 1, x: 0, transition: { delay: 0.05, duration: 0.2 } },
    hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleDropdown = (menuName) => {
    if (activeDropdown === menuName) setActiveDropdown(null);
    else setActiveDropdown(menuName);
  };

  // Effect to handle body class for main content shift
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }

    return () => {
      document.body.classList.remove("sidebar-expanded");
    };
  }, [sidebarOpen]);

  // Enhanced navigation item component with fixed indicator animations
  const NavItem = ({ href, icon, label }) => {
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
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Perbaikan indikator aktif */}
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
      <motion.div
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-[#4A5EF1] to-[#2E3CB3] z-40 shadow-lg flex flex-col"
        initial="collapsed"
        animate={sidebarOpen ? "expanded" : "collapsed"}
        variants={sidebarVariants}
      >
        {/* Logo dan tombol */}
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

        {/* User Profile Section - Moved to top with improved photo display */}
        <div className="p-4 border-b border-blue-400 border-opacity-20">
          <div
            className="flex items-center cursor-pointer relative"
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
                {profileData?.profile_photo ? (
                  <Image
                    src={profileData.profile_photo}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      console.error("Image failed to load");
                      e.target.src = "/default-avatar.png";
                    }}
                    style={{ borderRadius: "9999px" }}
                    unoptimized={true}
                  />
                ) : (
                  <div
                    className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-base font-medium"
                    style={{ borderRadius: "9999px" }}
                  >
                    {user?.nama_depan?.charAt(0) || ""}
                    {user?.nama_belakang?.charAt(0) || ""}
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

            {/* Profile Dropdown Menu - Positioned outside sidebar when open */}
            <AnimatePresence>
              {activeDropdown === "profile" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-0 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100 w-56 ${
                    sidebarOpen ? "right-0 translate-x-full" : "left-[70px]"
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
                      href="/index-jasa/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <FiUser className="mr-2" size={16} />
                        <span>Profil Saya</span>
                      </div>
                    </Link>
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
          {/* Dashboard */}
          <NavItem
            href="/index-jasa"
            icon={<FiClipboard size={20} />}
            label="Dashboard"
          />

          {/* Trip */}
          <NavItem
            href="/index-jasa/trip-jasa"
            icon={<FiBriefcase size={20} />}
            label="Trip"
          />

          {/* Pendapatan */}
          <NavItem
            href="/index-jasa/earnings"
            icon={<FiDollarSign size={20} />}
            label="Pendapatan"
          />

          {/* History Trip */}
          <NavItem
            href="/index-jasa/history"
            icon={<FiClock size={20} />}
            label="History Trip"
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
