"use client"

import { useState } from "react"
import Link from "next/link"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md md:hidden"
      >
        {isMobileMenuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar Container */}
      <div
        className={`fixed top-28 left-5 z-40 w-full ml-4 md:w-[35%] md:max-w-[400px] transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full overflow-y-auto py-1 px-4 md:py-2 md:px-6 max-h-[calc(100vh-14rem)]">
          <div className="bg-white rounded-[24px] p-4 shadow-md mb-4">
            {/* User Info Section */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 bg-[#809CFF] rounded-full flex items-center justify-center text-white text-xl">
                SB
              </div>
              <div>
                <h2 className="text-[#2D3648] font-medium">Summit Bin Ahmad</h2>
                <p className="text-[#6B7280] text-sm">Belum Lengkap</p>
              </div>
            </div>

            <div className="h-px bg-gray-200 my-3"></div>

            {/* Navigation Section */}
            <nav className="space-y-1 mb-4">
              <Link href="/trip" className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" />
                </svg>
                Trip Saya
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Gunung Favorit
              </Link>
              <Link href="/invoice" className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z" />
                </svg>
                Invoice
              </Link>
              <Link href="/history" className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History Pendakian
              </Link>
            </nav>

            <div className="h-px bg-gray-200 my-3"></div>

            {/* Profile and Logout Section */}
            <nav className="space-y-2">
              <Link href="/profile" className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profil
              </Link>
              <button className="flex w-full items-center gap-3 p-2 text-red-500 hover:bg-gray-50 rounded-xl">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Keluar
              </button>
            </nav>
          </div>
          {/* CTA Button - outside the card */}
          <button className="w-full bg-[#4A90E2] text-white rounded-[24px] py-2 hover:bg-blue-600 transition-colors">
            Jadi Penyedia Jasa
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={toggleMobileMenu} />
      )}
    </>
  )
}

