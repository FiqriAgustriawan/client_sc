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
  FiChevronRight,
  FiSettings,
  FiBell,
} from "react-icons/fi";
import { FaMoneyBillWave } from "react-icons/fa";

export default function SidebarAdmin() {
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
    if (path === "/admin" && pathname === "/admin") {
      return true;
    }
    return pathname.startsWith(path) && path !== "/admin";
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
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {user?.nama_depan?.charAt(0) || "A"}
                      {user?.nama_belakang?.charAt(0) || "D"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {user?.nama_depan || "Admin"} {user?.nama_belakang || "Panel"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {user?.email || "admin@summitcs.com"}
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
                  Menu Utama
                </h4>
              </div>

              <MobileNavItem
                href="/admin"
                icon={<FiHome size={24} />}
                label="Dashboard"
              />

              <MobileNavItem
                href="/admin/penyedia-trip"
                icon={<FiUsers size={24} />}
                label="Penyedia Trip"
              />

              <MobileNavItem
                href="/admin/kelola-gunung"
                icon={<FiMapPin size={24} />}
                label="Kelola Gunung"
              />

              <MobileNavItem
                href="/admin/withdrawals"
                icon={<FaMoneyBillWave size={24} />}
                label="Penarikan Dana"
              />

              {/* Quick Actions */}
              <div className="px-4 mb-4 mt-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Aksi Cepat
                </h4>
              </div>

              <MobileNavItem
                href="/admin/profile"
                icon={<FiUser size={24} />}
                label="Profil Saya"
              />

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
            <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-white border-2 border-white shadow-lg rounded-full flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-base font-medium rounded-full">
                {user?.nama_depan?.charAt(0) || "A"}
                {user?.nama_belakang?.charAt(0) || "D"}
              </div>
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
                  {user?.nama_depan || "Admin"}{" "}
                  {user?.nama_belakang || "Panel"}
                </span>
                <span className="text-blue-100 text-xs truncate">
                  {user?.email || "admin@summitcs.com"}
                </span>
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
        <DesktopNavItem
          href="/admin"
          icon={<FiHome size={20} />}
          label="Dashboard"
        />

        <DesktopNavItem
          href="/admin/penyedia-trip"
          icon={<FiUsers size={20} />}
          label="Penyedia Trip"
        />

        <DesktopNavItem
          href="/admin/kelola-gunung"
          icon={<FiMapPin size={20} />}
          label="Kelola Gunung"
        />

        <DesktopNavItem
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
