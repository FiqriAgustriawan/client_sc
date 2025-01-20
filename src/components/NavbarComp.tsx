"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import SearchNav from "@/assets/svgs/SearchNav.svg";
import ProfileUser from "@/assets/svgs/ProfileUser.svg";
import Icon from "@/assets/svgs/LogoProduct.svg";
import HomeB from "@/assets/svgs/HomeB.svg";
import GunungB from "@/assets/svgs/GunungB.svg";
import BlogB from "@/assets/svgs/BlogB.svg";
import AkunB from "@/assets/svgs/AkunB.svg";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div
        className={`fixed left-1/2 transform -translate-x-1/2 z-10 w-[100%] max-w-[88rem] transition-all duration-300 ${
          isScrolled ? "top-[0.75rem]" : "top-[1.5rem]"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo for mobile, replaced with search input */}
          <div className="flex items-center z-10 ml-[1.75rem] md:hidden">
            <div className="relative w-full max-w-[16rem] mr-[1.75rem]">
              <Image
                src={SearchNav || "/placeholder.svg"}
                alt="Search Icon"
                width={16}
                height={16}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 transition-all duration-300 ease-out"
              />
              <input
                type="search"
                placeholder="Search"
                className="w-72 bg-[#ffffff] rounded-full py-2.5 pl-10 pr-4 text-xs focus:bg-[#E9E9E9]"
              />
            </div>
          </div>

          {/* Logo for desktop */}
          <Link href="/" className="items-center z-10 ml-[1.75rem] hidden md:block">
            <Image
              src={Icon || "/placeholder.svg"}
              alt="Logo"
              width={28}
              height={28}
            />
          </Link>

          {/* Hamburger menu for mobile */}
          <div className="md:hidden z-10 mr-[1.75rem]">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-[#ffffff] p-1.5 rounded-full text-gray-800 focus:outline-none items-end"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Dropdown menu for mobile */}
          <div
            className={`${
              isMenuOpen ? "block animate-slideUp" : "hidden"
            } absolute top-full left-0 bg-[#ffffff] shadow-md rounded-t-lg w-full p-4 md:hidden`}
          >
            <Link href="/" className="block py-2 text-gray-800 hover:text-gray-600">
              Home
            </Link>
            <Link href="/mountain" className="block py-2 text-gray-800 hover:text-gray-600">
              Gunung
            </Link>
            <Link href="/blog" className="block py-2 text-gray-800 hover:text-gray-600">
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
          <nav className="hidden md:block absolute inset-x-0">
            <div className="bg-[#ffffff] bg-opacity-90 shadow-md rounded-full w-full px-[2rem] sm:px-[3rem] md:px-[5rem] lg:px-[6rem]">
              <div className="container mx-auto py-[0.5rem]">
                <div className="flex items-center justify-between">
                  {/* Link for desktop */}
                  <div className="flex gap-x-[3.5rem] ml-[7.5em]">
                    <Link href="/" className="text-gray-800 hover:text-gray-600 font-normal">
                      Home
                    </Link>
                    <Link href="/mountain" className="text-gray-800 hover:text-gray-600 font-normal">
                      Gunung
                    </Link>
                    <Link href="/blog" className="text-gray-800 hover:text-gray-600 font-normal">
                      Blog
                    </Link>
                    <Link href="/contact" className="text-gray-800 hover:text-gray-600 font-normal">
                      Contact
                    </Link>
                  </div>

                  {/* Search input for desktop */}
                  <div className="relative w-full max-w-[16rem] mr-[12.5rem]">
                    <Image
                      src={SearchNav || "/placeholder.svg"}
                      alt="Search Icon"
                      width={16}
                      height={16}
                      className="absolute top-1/2 left-3 transform -translate-y-1/2 transition-all duration-300 ease-out"
                    />
                    <input
                      type="search"
                      placeholder="Search"
                      className="w-72 bg-[#F3F3F3] rounded-full py-2.5 pl-10 pr-4 text-xs focus:bg-[#E9E9E9]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Profile user for desktop */}
          <div className="hidden md:flex items-center z-10 mr-[1.75rem]">
            <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border-[0.125rem] border-gray-300">
              <Image
                src={ProfileUser || "/placeholder.svg"}
                alt="Profile"
                width={40}
                height={40}
                className="w-full h-full object-cover bg-yellow-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden z-50 h-16">
        <div className="flex justify-between items-center px-4 py-2 ml-4 mr-4 mt-2">
          <Link href="/" className="flex flex-col items-center">
            <Image
              src={HomeB || "/placeholder.svg"}
              alt="Home"
              width={20}
              height={20}
            />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/mountain" className="flex flex-col items-center">
            <Image
              src={GunungB || "/placeholder.svg"}
              alt="Gunung"
              width={20}
              height={20}
            />
            <span className="text-xs mt-1">Gunung</span>
          </Link>
          <Link href="/blog" className="flex flex-col items-center">
            <Image
              src={BlogB || "/placeholder.svg"}
              alt="Blog"
              width={20}
              height={20}
            />
            <span className="text-xs mt-1">Blog</span>
          </Link>
          <Link href="/akun" className="flex flex-col items-center">
            <Image
              src={AkunB || "/placeholder.svg"}
              alt="Akun"
              width={20}
              height={20}
            />
            <span className="text-xs mt-1">Akun</span>
          </Link>
        </div>
      </div>
    </>
  );
}
