"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import SearchNav from "@/assets/svgs/SearchNav.svg"
import ProfileUser from "@/assets/svgs/ProfileUser.svg"
import Icon from "@/assets/svgs/LogoProduct.svg"
import Sidebar from "@/components/sidebarCom"
import { useAuth } from "@/context/AuthContext"
import { profileService } from "@/services/profileService"
import BottomNav from "./BottomNav";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeNavItem, setActiveNavItem] = useState("")
  const { user, logout } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Determine user role
  const userRole = user?.role || 'guest';

  // Check if current path matches navItem to highlight active state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/') setActiveNavItem('home');
      else if (path.includes('gunung')) setActiveNavItem('gunung');
      else if (path.includes('trips')) setActiveNavItem('trip');
      else if (path.includes('news')) setActiveNavItem('blog');
      else if (path.includes('dashboard') || path.includes('index-jasa') || path.includes('admin')) setActiveNavItem('dashboard');

      // Check if we're on mobile
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Fetch regular user profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        if (user.role !== 'guide') {
          try {
            const result = await profileService.getProfile();
            if (result.success && result.data.profile_image) {
              setProfileImage(result.data.profile_image);
            }
          } catch (error) {
            console.error("Failed to fetch profile image:", error);
          }
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  // Fetch guide profile image separately (similar to sidebar-jasa)
  useEffect(() => {
    const fetchGuideProfile = async () => {
      if (user && user.role === 'guide') {
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
              setProfileImage(profileData.profile_photo);
            }
            setProfileData(profileData);
          }
        } catch (err) {
          console.error("Error fetching guide profile:", err);
        }
      }
    };

    if (user && user.role === 'guide') {
      fetchGuideProfile();
    }
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    window.location.href = '/';
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.profile-container')) {
        closeDropdown();
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen])

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
    if (!isSearchVisible) {
      setTimeout(() => document.getElementById('desktop-search')?.focus(), 100);
    }
  }

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    switch (userRole) {
      case 'guide':
        return '/index-jasa';
      case 'admin':
        return '/admin';
      default:
        return '/dashboard-user';
    }
  }

  // Get role label for display
  const getRoleLabel = () => {
    switch (userRole) {
      case 'guide':
        return 'Penyedia Jasa';
      case 'admin':
        return 'Admin';
      default:
        return 'Pengguna';
    }
  }

  return (
    <>
      {/* Clean top area for mobile - no search bar */}
      
      <div
        className={`fixed left-1/2 transform -translate-x-1/2 z-10 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-[88rem] transition-all duration-500 ${isScrolled ? "top-[0.75rem]" : "top-[1.5rem]"
          }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Tablet-only search bar (hidden on mobile) */}
          {!isMobile && (
            <div className={`flex items-center z-10 hidden sm:flex xl:hidden w-full max-w-[250px] sm:max-w-[250px] md:max-w-[300px] ml-20 sm:ml-6 transition-all duration-300 ${isScrolled ? 'scale-[0.95]' : ''}`}>
              <div className="relative w-full">
                <motion.input
                  type="search"
                  placeholder="Search"
                  className={`w-full rounded-full py-3 pl-8 pr-4 text-sm focus:outline-none shadow-md transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  whileFocus={{ scale: 1.02, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image
                    src={SearchNav || "/placeholder.svg"}
                    alt="Search Icon"
                    width={16}
                    height={16}
                    className="text-gray-400"
                  />
                </div>
                {searchQuery && (
                  <motion.button
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setSearchQuery('')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </div>
          )}

          {/* Logo for desktop */}
          <Link href="/" className="items-center z-10 ml-4 sm:ml-[1.75rem] hidden xl:flex">
            <Image src={Icon || "/placeholder.svg"} alt="Logo" width={28} height={28} />
          </Link>

          {/* Navbar for desktop */}
          <nav className="hidden xl:flex absolute inset-x-0 items-center">
            <motion.div
              className="bg-[#ffffff] bg-opacity-90 shadow-md rounded-full w-full px-4 sm:px-[2rem] md:px-[3rem] lg:px-[5rem] xl:px-[6rem] py-2.5"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto py-[0.5rem]">
                <div className="flex items-center justify-between">
                  <AnimatePresence mode="wait">
                    {isSearchVisible ? (
                      <motion.div
                        className="flex items-center w-full"
                        initial={{ opacity: 0, width: "50%" }}
                        animate={{ opacity: 1, width: "100%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          id="desktop-search"
                          type="search"
                          placeholder="Search"
                          className="w-full rounded-full px-4 text-sm focus:outline-none bg-transparent"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                        <motion.button
                          onClick={toggleSearch}
                          className="focus:outline-none ml-2"
                          whileHover={{ rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex justify-between w-full ml-4 sm:ml-[3rem] md:ml-[4.5rem] lg:ml-[5.5rem] xl:ml-[6.5rem]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="flex space-x-4 sm:space-x-6 md:space-x-8">
                          {/* Navigation Links */}
                          <NavLink href="/" isActive={activeNavItem === 'home'} label="Home" />
                          <NavLink href="/gunung" isActive={activeNavItem === 'gunung'} label="Gunung" />
                          <NavLink href="/trips" isActive={activeNavItem === 'trip'} label="Open Trip" />

                          {user && (
                            <NavLink
                              href={getDashboardLink()}
                              isActive={activeNavItem === 'dashboard'}
                              label="Dashboard"
                            />
                          )}
                        </div>

                        {/* Search icon for desktop */}
                        <motion.div className="relative">
                          <motion.button
                            onClick={toggleSearch}
                            className="focus:outline-none mr-4 sm:mr-[3rem] md:mr-[5rem] lg:mr-[6rem] xl:mr-[7rem] mt-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Image
                              src={SearchNav || "/placeholder.svg"}
                              alt="Search Icon"
                              width={16}
                              height={16}
                              className="transition-all duration-300 ease-out"
                            />
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </nav>

          {/* Profile section for desktop */}
          <div className="hidden xl:flex items-center z-10 mr-4 sm:mr-[1.75rem] relative profile-container">
            <motion.div
              className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border-[0.125rem] border-gray-300 cursor-pointer"
              onClick={toggleDropdown}
              whileHover={{ scale: 1.05, borderColor: '#3A7DF7' }}
              whileTap={{ scale: 0.95 }}
            >
              {user && profileImage ? (
                <Image
                  src={profileImage}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.classList.add('bg-gradient-to-br', 'from-[#809CFF]', 'to-[#4A7BFF]', 'flex', 'items-center', 'justify-center', 'text-white', 'text-lg', 'font-semibold');
                      parent.innerHTML = `<span>${user.nama_depan?.charAt(0) || ''}${user.nama_belakang?.charAt(0) || ''}</span>`;
                    }
                  }}
                />
              ) : user ? (
                <div className="w-full h-full bg-gradient-to-br from-[#809CFF] to-[#4A7BFF] flex items-center justify-center text-white text-lg font-semibold">
                  {user.nama_depan?.charAt(0) || ''}{user.nama_belakang?.charAt(0) || ''}
                </div>
              ) : (
                <Image
                  src={ProfileUser || "/placeholder.svg"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover bg-white"
                />
              )}
            </motion.div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="absolute top-full right-0 bg-white shadow-md rounded-lg w-[16rem] mt-2 z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {user ? (
                    <>
                      {/* User profile header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-medium text-gray-800">{user.nama_depan} {user.nama_belakang}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <div className="mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs inline-block">
                          {getRoleLabel()}
                        </div>
                      </div>

                      <ul className="py-2">
                        {/* Dashboard Link - For all roles */}
                        <DropdownItem
                          href={getDashboardLink()}
                          icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          }
                          label="Dashboard"
                        />

                        {/* Profile Link - Only for guide */}
                        {userRole === 'guide' && (
                          <DropdownItem
                            href="/index-jasa/profile"
                            icon={
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            }
                            label="Profile"
                          />
                        )}

                        <li className="mt-2 border-t border-gray-100">
                          <motion.div
                            className="px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer"
                            onClick={handleLogout}
                            whileHover={{ backgroundColor: 'rgba(254, 226, 226, 0.7)' }}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              <p className="block">Logout</p>
                            </div>
                          </motion.div>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <ul className="py-2">
                      <DropdownItem
                        href="/register"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        }
                        label="Register"
                      />
                      <DropdownItem
                        href="/login"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        }
                        label="Login"
                      />
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <BottomNav />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}

// Helper component for navigation links
function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link href={href} className="relative group">
      <motion.span
        className={`text-gray-800 hover:text-blue-600 font-normal transition-colors duration-200 ${isActive ? 'text-blue-600 font-medium' : ''
          }`}
        whileHover={{ scale: 1.05 }}
      >
        {label}
      </motion.span>
      {isActive && (
        <motion.div
          className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-blue-600 rounded-full"
          layoutId="activeNavIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  );
}

// Helper component for dropdown items
function DropdownItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <li>
      <Link href={href}>
        <motion.div
          className="px-4 py-2 hover:bg-gray-100 flex items-center"
          whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.8)' }}
        >
          <span className="mr-2 text-gray-600">{icon}</span>
          <p className="block text-gray-800">{label}</p>
        </motion.div>
      </Link>
    </li>
  );
}

