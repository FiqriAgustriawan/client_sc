"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarContext } from "@/services/SidebarContext";
import LogoProductSide from "@/assets/svgs/LogoProductSide.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiMapPin,
  FiFileText,
  FiClock,
  FiDollarSign,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";

export default function SidebarAdmin() {
  const { logout, user } = useAuth();
  const pathname = usePathname(); // Use Next.js pathname hook for reactivity

  // Use sidebar context
  const sidebarContext = useContext(SidebarContext);
  const [localSidebarOpen, setLocalSidebarOpen] = useState(false);

  // Use context if available, otherwise use local state
  const sidebarOpen = sidebarContext?.sidebarOpen ?? localSidebarOpen;
  const setSidebarOpen = sidebarContext?.setSidebarOpen ?? setLocalSidebarOpen;

  const [activeDropdown, setActiveDropdown] = useState(null);

  // Check if a route is active - improved with pathname hook
  const isRouteActive = (path) => {
    // Handle special case for root admin path
    if (path === "/admin" && pathname === "/admin") {
      return true;
    }
    return pathname.startsWith(path) && path !== "/admin";
  };

  // Sidebar animations
  const sidebarVariants = {
    expanded: { width: "256px", transition: { duration: 0.3 } },
    collapsed: { width: "70px", transition: { duration: 0.3 } },
  };

  // Content animations - faster animations with less delay
  const contentVariants = {
    visible: { opacity: 1, x: 0, transition: { delay: 0.05, duration: 0.15 } },
    hidden: { opacity: 0, x: -10, transition: { duration: 0.15 } },
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

          {/* Fixed indicator animation */}
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
                    SummitCS Admin
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

        {/* Admin Profile Section */}
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
                <div
                  className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-base font-medium"
                  style={{ borderRadius: "9999px" }}
                >
                  {user?.nama_depan?.charAt(0) || "A"}
                  {user?.nama_belakang?.charAt(0) || "D"}
                </div>
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
                    {user?.nama_depan || "Admin"}{" "}
                    {user?.nama_belakang || "Panel"}
                  </span>
                  <span className="text-blue-100 text-xs truncate">
                    {user?.email || "admin@summitcs.com"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Dropdown Menu */}
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
                      href="/admin/profile"
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
              <span className="px-2 text-xs text-blue-100">MENU UTAMA</span>
              <div className="h-px bg-blue-300 bg-opacity-30 flex-grow"></div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col space-y-1 px-3">
          <NavItem
            href="/admin"
            icon={<FiHome size={20} />}
            label="Dashboard"
          />

          <NavItem
            href="/admin/penyedia-trip"
            icon={<FiUsers size={20} />}
            label="Penyedia Trip"
          />

          <NavItem
            href="/admin/kelola-gunung"
            icon={<FiMapPin size={20} />}
            label="Kelola Gunung"
          />

          {/* <NavItem
            href="/admin/kelolah-berita"
            icon={<FiFileText size={20} />}
            label="Kelola Berita"
          /> */}

          <NavItem
            href="/admin/withdrawals"
            icon={<FaMoneyBillWave size={20} />}
            label="Penarikan Dana"
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
