"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DashboardSVG from "@/assets/svgs/Dashboard.svg";
import PenyediaT from "@/assets/svgs/PenyediaTrip.svg";
import KelolaGunung from "@/assets/svgs/KelolaGunung.svg";
import KelolaBerita from "@/assets/svgs/KelolaBerita.svg";


export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-5 left-4 z-50 p-2 bg-white rounded-full shadow-md lg:hidden"
      >
        {isMobileMenuOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed mt-[87px] z-40 left-9 w-full lg:w-[35%] lg:max-w-[400px] h-full transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0 pr-16"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full overflow-y-auto py-6 px-4 lg:py-8 lg:px-6">
          {/* Content is always visible on desktop, only shown when menu is open on mobile/tablet */}
          <div className={`${isMobileMenuOpen ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-[24px] p-4 shadow-md mb-4 ">
              {/* User Info Section */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-[#809CFF] rounded-full flex items-center justify-center text-white text-xl">
                  SB
                </div>
                <div className="mt-1">
                  <h2 className="text-[#2D3648] font-medium">
                    Admin
                  </h2>
                  <p className="text-[#6B7280] -mt-1 text-[13px]">Admin</p>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-3"></div>

              {/* Navigation Section */}
              <nav className="space-y-1 mb-4">
                <Link
                  href="/trip"
                  className="flex items-center gap-3 p-2  text-[#2D3648] hover:bg-gray-50 rounded-xl"
                >
                 <Image src={DashboardSVG} width="20" height="20"/>
                  Dashboard
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
                >
                  <Image src={PenyediaT} width="20" height="20"/>
                  Penyedia Trip
                </Link>
                <Link
                  href="/invoice"
                  className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
                >
                  <Image src={KelolaGunung} width="20" height="20"/>
                  Kelola Gunung
                </Link>
                <Link
                  href="/history"
                  className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
                >
                  <Image src={KelolaBerita} width="20" height="20"/>
                  Kelola Berita
                </Link>
                <Link
                  href="/history"
                  className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 29 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.5 29.4014C11.1167 29.4014 8.12268 28.3745 5.51806 26.3209C2.91343 24.2673 1.22176 21.6422 0.443056 18.4458C0.335648 18.043 0.416204 17.6741 0.684722 17.339C0.953241 17.0039 1.31574 16.8089 1.77222 16.7541C2.20185 16.7004 2.5912 16.781 2.94028 16.9958C3.28935 17.2106 3.53102 17.5328 3.66528 17.9625C4.30972 20.3791 5.63889 22.3528 7.65278 23.8833C9.66667 25.4139 11.9491 26.1791 14.5 26.1791C17.6417 26.1791 20.307 25.0852 22.4959 22.8973C24.6849 20.7094 25.7788 18.0441 25.7778 14.9014C25.7767 11.7586 24.6828 9.09385 22.4959 6.90703C20.3091 4.72022 17.6438 3.62574 14.5 3.62359C12.6472 3.62359 10.9153 4.05322 9.30416 4.91248C7.69305 5.77174 6.33704 6.95322 5.23611 8.45692H8.05555C8.51204 8.45692 8.89494 8.61159 9.20428 8.92092C9.51361 9.23025 9.66774 9.61262 9.66667 10.068C9.66559 10.5234 9.51092 10.9063 9.20267 11.2168C8.89441 11.5272 8.51204 11.6813 8.05555 11.6791H1.61111C1.15463 11.6791 0.772259 11.5245 0.464 11.2151C0.155741 10.9058 0.00107407 10.5234 0 10.068V3.62359C0 3.16711 0.154667 2.78474 0.464 2.47648C0.773333 2.16822 1.1557 2.01355 1.61111 2.01248C2.06652 2.0114 2.44943 2.16607 2.75983 2.47648C3.07024 2.78689 3.22437 3.16926 3.22222 3.62359V5.79859C4.59167 4.08007 6.26346 2.7509 8.23761 1.81109C10.2118 0.871274 12.2992 0.401367 14.5 0.401367C16.5139 0.401367 18.4005 0.784275 20.1598 1.55009C21.9192 2.3159 23.4497 3.34916 24.7515 4.64987C26.0533 5.95057 27.0871 7.48112 27.8529 9.24153C28.6187 11.0019 29.0011 12.8885 29 14.9014C28.9989 16.9142 28.6166 18.8008 27.8529 20.5612C27.0892 22.3216 26.0554 23.8522 24.7515 25.1529C23.4476 26.4536 21.917 27.4874 20.1598 28.2542C18.4026 29.0211 16.516 29.4035 14.5 29.4014ZM16.1111 14.2569L20.1389 18.2847C20.4343 18.5801 20.5819 18.956 20.5819 19.4125C20.5819 19.869 20.4343 20.2449 20.1389 20.5402C19.8435 20.8356 19.4676 20.9833 19.0111 20.9833C18.5546 20.9833 18.1787 20.8356 17.8833 20.5402L13.3722 16.0291C13.2111 15.868 13.0903 15.687 13.0097 15.4862C12.9292 15.2853 12.8889 15.077 12.8889 14.8611V8.45692C12.8889 8.00044 13.0436 7.61807 13.3529 7.30981C13.6622 7.00155 14.0446 6.84688 14.5 6.84581C14.9554 6.84474 15.3383 6.9994 15.6487 7.30981C15.9591 7.62022 16.1133 8.00259 16.1111 8.45692V14.2569Z"
                      fill="black"
                    />
                  </svg>
                  Trip
                </Link>
              </nav>

              <div className="h-px bg-gray-200 my-3"></div>

              {/* Profile and Logout Section */}
              <nav className="space-y-2">
                <button className="flex w-full items-center gap-3 p-2 text-red-500 hover:bg-gray-50 rounded-xl">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 27 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.4286 2H5.28571C4.41429 2 3.57855 2.33948 2.96236 2.94377C2.34617 3.54805 2 4.36764 2 5.22222V27.7778C2 28.6324 2.34617 29.4519 2.96236 30.0562C3.57855 30.6605 4.41429 31 5.28571 31H18.4286M25 16.5L18.4286 10.0556M25 16.5L18.4286 22.9444M25 16.5H8.57143"
                      stroke="#FF0000"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Keluar
                </button>
              </nav>

              {/* CTA Button */}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile and tablet */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden "
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
}
