"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"
import SearchNav from "@/assets/svgs/SearchNav.svg"
import ProfileUser from "@/assets/svgs/ProfileUser.svg"
import Icon from "@/assets/svgs/LogoProduct.svg"
import Sidebar from "@/components/sidebarCom"
import { useAuth } from "@/context/AuthContext"
import { profileService } from "@/services/profileService"

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const { user, logout } = useAuth()

  // Fetch user profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (user) {
        try {
          const result = await profileService.getProfile();
          if (result.success && result.data.profile_image) {
            setProfileImage(result.data.profile_image);
          }
        } catch (error) {
          console.error("Failed to fetch profile image:", error);
        }
      }
    };

    fetchProfileImage();
  }, [user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
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

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
  }

  return (
    <>
      <div
        className={`fixed left-1/2 transform -translate-x-1/2 z-10 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-[88rem] transition-all duration-300 ${isScrolled ? "top-[0.75rem]" : "top-[1.5rem]"
          }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Search input for mobile and tablet */}
          <div className="flex items-center z-10 xl:hidden w-full max-w-[250px] sm:max-w-[250px] md:max-w-[300px] ml-20 sm:ml-6">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search"
                className="w-full  rounded-full py-3 pl-8 pr-4 text-sm focus:outline-none shadow-md"
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
            </div>
          </div>

          {/* Logo for desktop */}
          <Link href="/" className="items-center z-10 ml-4 sm:ml-[1.75rem] hidden xl:flex">
            <Image src={Icon || "/placeholder.svg"} alt="Logo" width={28} height={28} />
          </Link>

          {/* Hamburger menu for mobile and tablet */}
          <div className="xl:hidden z-10 mr-4 sm:mr-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-white p-1.5 rounded-full text-gray-800 focus:outline-none items-end shadow-md"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>

          {/* Dropdown menu for mobile and tablet */}
          <div
            className={`${isMenuOpen ? "block animate-slideUp" : "hidden"
              } absolute top-full left-0 bg-white shadow-md rounded-t-lg w-full p-4 xl:hidden`}
          >
            <Link href="/" className="block py-2 text-gray-800 hover:text-gray-600">
              Home
            </Link>
            <Link href="/pilih-gunung" className="block py-2 text-gray-800 hover:text-gray-600">
              Gunung
            </Link>
            <Link href="/news" className="block py-2 text-gray-800 hover:text-gray-600">
              Blog
            </Link>
            <Link href="/contact" className="block py-2 text-gray-800 hover:text-gray-600">
              Contact
            </Link>
            <Link href="/dashboard" className="block py-2 text-gray-800 hover:text-gray-600">
              Dashboard
            </Link>
          </div>

          {/* Navbar for desktop */}
          <nav className="hidden xl:flex absolute inset-x-0 items-center">
            <div className="bg-[#ffffff] bg-opacity-90 shadow-md rounded-full w-full px-4 sm:px-[2rem] md:px-[3rem] lg:px-[5rem] xl:px-[6rem] py-2.5">
              <div className="container mx-auto py-[0.5rem]">
                <div className="flex items-center justify-between">
                  {isSearchVisible ? (
                    <div className="flex items-center w-full">
                      <input
                        type="search"
                        placeholder="Search"
                        className="w-full rounded-full px-4 text-sm focus:outline-none bg-transparent"
                        autoFocus
                      />
                      <button onClick={toggleSearch} className="focus:outline-none ml-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Link for desktop */}
                      <div className="flex justify-between w-full ml-4 sm:ml-[3rem] md:ml-[4.5rem] lg:ml-[5.5rem] xl:ml-[6.5rem]">
                        <div className="flex space-x-4 sm:space-x-6 md:space-x-8">
                          <Link href="/" className="text-gray-800 hover:text-gray-600 font-normal">
                            Home
                          </Link>
                          <Link href="/pilih-gunung" className="text-gray-800 hover:text-gray-600 font-normal">
                            Gunung
                          </Link>
                          <Link href="/trips" className="text-gray-800 hover:text-gray-600 font-normal">
                            Open Trip
                          </Link>
                          <Link href="/news" className="text-gray-800 hover:text-gray-600 font-normal">
                            Blog
                          </Link>
                          {user && (
                            <Link href="/dashboard-user" className="text-gray-800 hover:text-gray-600 font-normal">
                              Dashboard
                            </Link>
                          )}
                        </div>

                        {/* Search icon for desktop */}
                        <div className="relative">
                          <button
                            onClick={toggleSearch}
                            className="focus:outline-none mr-4 sm:mr-[3rem] md:mr-[5rem] lg:mr-[6rem] xl:mr-[7rem] mt-1"
                          >
                            <Image
                              src={SearchNav || "/placeholder.svg"}
                              alt="Search Icon"
                              width={16}
                              height={16}
                              className="transition-all duration-300 ease-out"
                            />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Profile section for desktop */}
          <div className="hidden xl:flex items-center z-10 mr-4 sm:mr-[1.75rem] relative">
            <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border-[0.125rem] border-gray-300 cursor-pointer" onClick={toggleDropdown}>
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
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 bg-white shadow-md rounded-lg w-[10rem] mt-2 z-50">
                <ul className="py-2">
                  {user ? (
                    <>
                      <li className="px-4 py-2 hover:bg-gray-100">
                        <Link href="/dashboard-user">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="block">Profile</p>
                          </div>
                        </Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer" onClick={handleLogout}>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <p className="block">Logout</p>
                        </div>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="px-4 py-2 hover:bg-gray-100">
                        <Link href="/register">
                          <p className="block">Register</p>
                        </Link>
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100">
                        <Link href="/login">
                          <p className="block">Login</p>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 xl:hidden z-50">
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}

