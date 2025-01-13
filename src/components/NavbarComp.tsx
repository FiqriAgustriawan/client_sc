"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from 'lucide-react';
import ProfileUser from "@/assets/svgs/ProfileUser.svg";
import Icon from "@/assets/svgs/LogoProduct.svg";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (

    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-10 w-[98%] max-w-[1440px] transition-all duration-300 ${isScrolled ? '-top-3' : 'top-6'}`}>
      <div className="flex items-center justify-between w-full">
        {/* logo */}
        <Link href="/" className="flex items-center z-10 ml-7"> 
          <Image src={Icon} alt="Logo" width={28} height={28} />
        </Link>

    <nav
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-10 transition-transform duration-300 w-[98%] max-w-[1440px] ${
        !isScrollingUp ? "-translate-y-full" : ""
      }`}
    >
      <div className="bg-[#ffffff] bg-opacity-90 shadow-md rounded-full w-full px-6 sm:px-10 md:px-16 lg:px-20">
        <div className="container mx-auto py-0.1">
          <div className="flex items-center justify-between gap-6">
            {/* Logo on the left */}
            <div className="flex items-center space-x-8 mr-4">
              <Link
                href="/"
                className="flex items-center gap-3 space-x-2 text-black"
              >
                <Image src={Icon} alt="Logo" width={28} height={28} />
                
              </Link>

            </div>

        {/* navbar */}
        <nav className="absolute inset-x-0">
          <div className="bg-[#ffffff] bg-opacity-90 shadow-md rounded-full w-full px-8 sm:px-12 md:px-20 lg:px-24">
            <div className="container mx-auto py-2">
              <div className="flex items-center justify-between">
                {/* link */}
                <div className="hidden md:flex gap-x-[55px] ml-[170px]"> 
                  <Link
                    href="/"
                    className="text-gray-800 hover:text-gray-600 font-normal"
                  >
                    Home
                  </Link>
                  <Link
                    href="/mountain"
                    className="text-gray-800 hover:text-gray-600 font-normal"
                  >
                    Gunung
                  </Link>
                  <Link
                    href="/blog"
                    className="text-gray-800 hover:text-gray-600 font-normal"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/contact"
                    className="text-gray-800 hover:text-gray-600 font-normal"
                  >
                    Contact
                  </Link>
                </div>

                {/* search input */}
                <div className="relative max-w-xs w-full mr-[170px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="search"
                    placeholder="Search"
                    className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* profile user */}
        <Link href="/login" className="flex items-center z-10 mr-7"> 
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={ProfileUser}
              alt="Profile"
              width={40}
              height={40}
              className="w-full h-full object-cover bg-yellow-200"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
