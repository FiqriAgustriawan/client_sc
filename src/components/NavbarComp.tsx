"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import ProfileUser from "@/assets/svgs/ProfileUser.svg";
import Icon from "@/assets/svgs/LogoProduct.svg";

export default function NavBar() {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsScrollingUp(true);
      } else {
        setIsScrollingUp(currentScrollY < lastScrollY);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
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

            {/* Middle links */}
            <div className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-black hover:text-gray-600 text-base"
              >
                Home
              </Link>
              <Link
                href="/mountain"
                className="text-black hover:text-gray-600 text-base"
              >
                Gunung
              </Link>
              <Link
                href="/blog"
                className="text-black hover:text-gray-600 text-base"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-black hover:text-gray-600 text-base"
              >
                Contact
              </Link>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xsgit mx-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full bg-gray-100 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Profile User on the right */}
            <Link
              href="/login"
              className="flex items-center space-x-4 text-black px-4 py-2 ml-4"
            >
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
      </div>
    </nav>
  );
}
