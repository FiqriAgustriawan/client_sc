"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
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
    <nav className={`fixed left-1/2 transform -translate-x-1/2 z-10 w-[98%] max-w-[1440px] transition-all duration-300 ${isScrolled ? 'top-3' : 'top-6'}`}>
      <div className="bg-white  shadow-md rounded-full w-full px-8 sm:px-12 md:px-20 lg:px-24">
        <div className="container mx-auto py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center z-10">
              <Image src={Icon} alt="Logo" width={28} height={28} />
            </Link>

            {/* Navigation links */}
            <div className="hidden md:flex gap-x-[55px]">
              <Link href="/" className="text-gray-800 hover:text-gray-600 font-normal">Home</Link>
              <Link href="/mountain" className="text-gray-800 hover:text-gray-600 font-normal">Gunung</Link>
              <Link href="/blog" className="text-gray-800 hover:text-gray-600 font-normal">Blog</Link>
              <Link href="/contact" className="text-gray-800 hover:text-gray-600 font-normal">Contact</Link>
            </div>

            {/* Search input */}
            <div className="relative max-w-xs w-full">
              <input
                type="search"
                placeholder="Search"
                className="w-72 focus:w-80 focus:-ml-4 transition-all duration-300 ease-out bg-[#F3F3F3] rounded-full py-2.5 pl-10 pr-4 text-xs focus:bg-[#E9E9E9]"
              />
            </div>

            {/* Profile user */}
            <Link href="/login" className="flex items-center z-10">
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