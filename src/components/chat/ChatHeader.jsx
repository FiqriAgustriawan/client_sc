import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';
import {
  FaWhatsapp,
  FaChevronLeft,
  FaEllipsisV,
  FaSearch,
  FaInfoCircle,
  FaPhoneAlt,
  FaRegClock
} from "react-icons/fa";

export default function ChatHeader({
  tripId,
  guideInfo,
  onlineStatus,
  lastSeen,
  whatsappLink,
  toggleSearch,
  getImageUrl,
  formatLastSeen
}) {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className="bg-white text-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <Link 
          href={`/dashboard-user/trip-manage/${tripId}`} 
          className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
        >
          <FaChevronLeft className="text-gray-600" />
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            {guideInfo?.profile_photo ? (
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                <Image
                  src={getImageUrl(guideInfo.profile_photo)}
                  alt={guideInfo.name || "Guide"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-lg">
                {guideInfo?.name?.charAt(0) || "G"}
              </div>
            )}
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
              onlineStatus === "online" ? "bg-green-500" : 
              onlineStatus === "away" ? "bg-yellow-500" : "bg-gray-400"
            }`}></div>
          </div>
          
          <div>
            <h2 className="font-semibold text-gray-800">
              {guideInfo?.name || "Guide Profesional"}
            </h2>
            <p className={`text-xs flex items-center gap-1 ${
              onlineStatus === "online" ? "text-green-600" : 
              onlineStatus === "away" ? "text-yellow-600" : "text-gray-500"
            }`}>
              {onlineStatus === "online" ? (
                <>
                  <span className="inline-block h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                  Online
                </>
              ) : onlineStatus === "away" ? (
                <>
                  <span className="inline-block h-2 w-2 bg-yellow-500 rounded-full mr-1"></span>
                  Sedang Tidak Aktif
                </>
              ) : (
                <>
                  <FaRegClock className="text-gray-500" size={10} />
                  <span>{formatLastSeen(lastSeen)}</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleSearch}
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
          title="Cari Pesan"
        >
          <FaSearch size={18} />
        </button>
        
        <a
          href={whatsappLink}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-600 transition"
          title="Buka WhatsApp"
        >
          <FaWhatsapp size={18} />
        </a>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
            title="Menu Lainnya"
          >
            <FaEllipsisV size={18} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 w-48 py-1 z-10">
              <Link 
                href={`/dashboard-user/trip-manage/${tripId}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaInfoCircle size={14} />
                <span>Detail Trip</span>
              </Link>
              
              {guideInfo?.whatsapp && (
                <a 
                  href={`tel:${guideInfo.whatsapp}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaPhoneAlt size={14} />
                  <span>Telepon Guide</span>
                </a>
              )}
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link chat disalin!');
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2z" />
                </svg>
                <span>Salin Link</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}