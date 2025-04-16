"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { profileService } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import LogoProduct from "@/assets/svgs/LogoProduct.svg";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const fileInputRef = useRef(null);
  const { toast } = useToast();
  const { logout, user } = useAuth();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast({
        variant: "destructive",
        title: "Format tidak didukung",
        description: "Gunakan format gambar JPG atau PNG",
      });
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Ukuran terlalu besar",
        description: "Ukuran gambar maksimal 2MB",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('profile_image', file);

      const result = await profileService.updateProfileImage(formData);

      if (result.success) {
        toast({
          title: "Berhasil",
          description: "Foto profil berhasil diperbarui",
        });

        // Fetch updated profile data
        const profileResult = await profileService.getProfile();
        if (profileResult.success) {
          setProfileData(profileResult.data);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Gagal",
          description: result.error || "Gagal memperbarui foto profil",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui foto profil",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Add useEffect to fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const result = await profileService.getProfile();
        if (result.success && result.data) {
          // Ensure profile_image has the full URL
          setProfileData({
            ...result.data,
            profile_image: result.data.profile_image ? 
              result.data.profile_image : 
              null
          });
        } else {
          console.error('Failed to fetch profile data:', result.error);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  // Sidebar animation variants
  const sidebarVariants = {
    expanded: { width: "240px", transition: { duration: 0.3 } },
    collapsed: { width: "70px", transition: { duration: 0.3 } }
  };

  // Content animation variants
  const contentVariants = {
    visible: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } },
    hidden: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };
  // Add a new state for dropdown menus
const [activeDropdown, setActiveDropdown] = useState(null);

// Add a function to toggle dropdowns
const toggleDropdown = (menuName) => {
  if (activeDropdown === menuName) {
    setActiveDropdown(null);
  } else {
    setActiveDropdown(menuName);
  }
};


  return (
    <>
      {/* New Vertical Sidebar */}
      <motion.div 
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-[#3A7DF7] to-[#4A5EF1] z-40 shadow-lg flex flex-col"
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
      >
        {/* Logo and Brand Section */}
        <div className="flex items-center p-3 border-b border-blue-400 border-opacity-30">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div 
                className="flex items-center justify-between w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center">
                  <Image src={LogoProduct} alt="SummitCS" width={32} height={32} />
                  <span className="ml-3 text-white font-semibold">SummitCS</span>
                </div>
                <button 
                  onClick={toggleSidebar}
                  className="text-white  p-1 rounded-full transition-all transform hover:rotate-90"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ) : (
              <motion.button 
                onClick={toggleSidebar}
                className="w-full flex justify-center text-white  p-1 rounded-full transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex flex-col space-y-2 px-3 mt-4">
          {/* Trip Saya */}
          <Link href="/dashboard-user/trip-saya" className="group">
            <motion.div 
              className="flex items-center p-3 rounded-xl text-white transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-8 h-8">
                <svg width="20" height="20" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.88421 27.4C2.09105 27.4 1.4123 27.1178 0.847958 26.5535C0.283614 25.9891 0.000961403 25.3099 0 24.5158V8.65263C0 7.85947 0.282653 7.18072 0.847958 6.61638C1.41326 6.05203 2.09201 5.76938 2.88421 5.76842H8.65263V2.88421C8.65263 2.09105 8.93528 1.4123 9.50059 0.847958C10.0659 0.283614 10.7446 0.000961403 11.5368 0H17.3053C18.0984 0 18.7777 0.282653 19.343 0.847958C19.9083 1.41326 20.1904 2.09201 20.1895 2.88421V5.76842H25.9579C26.751 5.76842 27.4303 6.05107 27.9956 6.61638C28.5609 7.18168 28.8431 7.86043 28.8421 8.65263V24.5158C28.8421 25.3089 28.5599 25.9882 27.9956 26.5535C27.4312 27.1188 26.752 27.401 25.9579 27.4H2.88421ZM11.5368 5.76842H17.3053V2.88421H11.5368V5.76842ZM5.76842 8.65263H2.88421V24.5158H5.76842V8.65263ZM20.1895 24.5158V8.65263H8.65263V24.5158H20.1895ZM23.0737 8.65263V24.5158H25.9579V8.65263H23.0737Z" fill="white"/>
                </svg>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="ml-3 text-sm font-medium"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                  >
                    Trip Saya
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {/* Gunung Favorit */}
          <Link href="/dashboard-user/gunung-favorit" className="group">
            <motion.div 
              className="flex items-center p-3 rounded-xl text-white transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-8 h-8">
                <svg width="20" height="20" viewBox="0 0 29 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 25.4004C14.1617 25.4004 13.8175 25.3415 13.4676 25.2236C13.1177 25.1057 12.8093 24.9171 12.5425 24.6578L10.0413 22.4301C7.47958 20.1434 5.16538 17.8747 3.09865 15.6239C1.03192 13.373 -0.000965989 10.8917 6.77887e-07 8.17974C6.77887e-07 5.9638 0.761251 4.11326 2.28375 2.62811C3.80625 1.14296 5.70333 0.400391 7.975 0.400391C9.25583 0.400391 10.4642 0.66536 11.6 1.1953C12.7358 1.72524 13.7025 2.45037 14.5 3.37069C15.2975 2.45131 16.2642 1.72665 17.4 1.19671C18.5358 0.666774 19.7442 0.401334 21.025 0.400391C23.2967 0.400391 25.1938 1.14296 26.7162 2.62811C28.2388 4.11326 29 5.9638 29 8.17974C29 10.8907 27.9729 13.3778 25.9188 15.6408C23.8646 17.9039 21.5325 20.1788 18.9225 22.4655L16.4575 24.6578C16.1917 24.9171 15.8838 25.1057 15.5339 25.2236C15.1839 25.3415 14.8393 25.4004 14.5 25.4004Z" fill="white"/>
                </svg>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="ml-3 text-sm font-medium"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                  >
                    Gunung Favorit
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {/* Invoice */}
          <Link href="/dashboard-user/invoice" className="group">
            <motion.div 
              className="flex items-center p-3 rounded-xl text-white transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-8 h-8">
                <svg width="20" height="20" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28.1235 1.40039C26.5096 1.40039 25.2002 5.29518 25.2002 10.1006H28.1235C29.5329 10.1006 30.2362 10.1006 30.6726 9.61484C31.1076 9.12763 31.0322 8.48671 30.8814 7.20633C30.4783 3.82195 29.3966 1.40039 28.1235 1.40039Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M25.2006 10.1789V25.5377C25.2006 27.7287 25.2006 28.8249 24.5306 29.257C23.4359 29.9617 21.7437 28.4827 20.8925 27.9462C20.1892 27.5025 19.8383 27.2821 19.4483 27.269C19.0263 27.2545 18.6681 27.4677 17.9083 27.9462L15.1373 29.6935C14.3891 30.1647 14.0164 30.4011 13.6003 30.4011C13.1841 30.4011 12.81 30.1647 12.0632 29.6935L9.29367 27.9462C8.58896 27.5025 8.23805 27.2821 7.84799 27.269C7.42603 27.2545 7.06787 27.4677 6.30805 27.9462C5.45688 28.4827 3.76469 29.9617 2.66847 29.257C2 28.8249 2 27.7301 2 25.5377V10.1789C2 6.0405 2 3.97275 3.27458 2.68657C4.54771 1.40039 6.59951 1.40039 10.7002 1.40039H28.1006" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.6003 10.1007C11.998 10.1007 10.7002 11.0751 10.7002 12.2757C10.7002 13.4763 11.998 14.4508 13.6003 14.4508C15.2026 14.4508 16.5003 15.4252 16.5003 16.6258C16.5003 17.8265 15.2026 18.8009 13.6003 18.8009M13.6003 10.1007C14.8618 10.1007 15.9377 10.7053 16.335 11.5507M13.6003 10.1007V8.65063M13.6003 18.8009C12.3387 18.8009 11.2628 18.1962 10.8655 17.3508M13.6003 18.8009V20.2509" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="ml-3 text-sm font-medium"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                  >
                    Invoice
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          {/* History */}
          <Link href="/dashboard-user/history" className="group">
            <motion.div 
              className="flex items-center p-3 rounded-xl text-white transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-8 h-8">
                <svg width="20" height="20" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.5 29.4014C11.1167 29.4014 8.12268 28.3745 5.51806 26.3209C2.91343 24.2673 1.22176 21.6422 0.443056 18.4458C0.335648 18.043 0.416204 17.6741 0.684722 17.339C0.953241 17.0039 1.31574 16.8089 1.77222 16.7541C2.20185 16.7004 2.5912 16.781 2.94028 16.9958C3.28935 17.2106 3.53102 17.5328 3.66528 17.9625C4.30972 20.3791 5.63889 22.3528 7.65278 23.8833C9.66667 25.4139 11.9491 26.1791 14.5 26.1791C17.6417 26.1791 20.307 25.0852 22.4959 22.8973C24.6849 20.7094 25.7788 18.0441 25.7778 14.9014C25.7767 11.7586 24.6828 9.09385 22.4959 6.90703C20.3091 4.72022 17.6438 3.62574 14.5 3.62359C12.6472 3.62359 10.9153 4.05322 9.30416 4.91248C7.69305 5.77174 6.33704 6.95322 5.23611 8.45692H8.05555C8.51204 8.45692 8.89494 8.61159 9.20428 8.92092C9.51361 9.23025 9.66774 9.61262 9.66667 10.068C9.66559 10.5234 9.51092 10.9063 9.20267 11.2168C8.89441 11.5272 8.51204 11.6813 8.05555 11.6791H1.61111C1.15463 11.6791 0.772259 11.5245 0.464 11.2151C0.155741 10.9058 0.00107407 10.5234 0 10.068V3.62359C0 3.16711 0.154667 2.78474 0.464 2.47648C0.773333 2.16822 1.1557 2.01355 1.61111 2.01248C2.06652 2.0114 2.44943 2.16607 2.75983 2.47648C3.07024 2.78689 3.22437 3.16926 3.22222 3.62359V5.79859C4.59167 4.08007 6.26346 2.7509 8.23761 1.81109C10.2118 0.871274 12.2992 0.401367 14.5 0.401367C16.5139 0.401367 18.4005 0.784275 20.1598 1.55009C21.9192 2.3159 23.4497 3.34916 24.7515 4.64987C26.0533 5.95057 27.0871 7.48112 27.8529 9.24153C28.6187 11.0019 29.0011 12.8885 29 14.9014C28.9989 16.9142 28.6166 18.8008 27.8529 20.5612C27.0892 22.3216 26.0554 23.8522 24.7515 25.1529C23.4476 26.4536 21.917 27.4874 20.1598 28.2542C18.4026 29.0211 16.516 29.4035 14.5 29.4014ZM16.1111 14.2569L20.1389 18.2847C20.4343 18.5801 20.5819 18.956 20.5819 19.4125C20.5819 19.869 20.4343 20.2449 20.1389 20.5402C19.8435 20.8356 19.4676 20.9833 19.0111 20.9833C18.5546 20.9833 18.1787 20.8356 17.8833 20.5402L13.3722 16.0291C13.2111 15.868 13.0903 15.687 13.0097 15.4862C12.9292 15.2853 12.8889 15.077 12.8889 14.8611V8.45692C12.8889 8.00044 13.0436 7.61807 13.3529 7.30981C13.6622 7.00155 14.0446 6.84688 14.5 6.84581C14.9554 6.84474 15.3383 6.9994 15.6487 7.30981C15.9591 7.62022 16.1133 8.00259 16.1111 8.45692V14.2569Z" fill="white"/>
                </svg>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="ml-3 text-sm font-medium"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                  >
                    History
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

        </div>

        {/* Bottom Actions */}
        <div className="mt-auto px-3 pb-4 space-y-3">
          {/* User Profile Section with Dropdown */}
          <div className="relative">
            <motion.div
              className={`relative cursor-pointer flex items-center p-3 rounded-xl text-white transition-all ${!isExpanded && 'justify-center'}`}
              onClick={() => toggleDropdown('profile')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className={`flex items-center ${!isExpanded && 'justify-center w-full'}`}>
                <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-white border-2 border-white shadow-lg transition-all duration-300" 
                  style={{ 
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {profileData?.profile_image ? (
                    <div className="w-full h-full overflow-hidden" style={{ borderRadius: '9999px' }}>
                      <Image
                        src={profileData.profile_image}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                        style={{ borderRadius: '9999px' }}
                        unoptimized={true}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-[#809CFF] flex items-center justify-center text-white text-lg" style={{ borderRadius: '9999px' }}>
                      {user?.nama_depan?.charAt(0) || ''}{user?.nama_belakang?.charAt(0) || ''}
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center" style={{ borderRadius: '9999px' }}>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="ml-3 text-white"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                  >
                    <p className="font-medium text-sm truncate max-w-[140px]">
                      {user?.nama_depan} {user?.nama_belakang}
                    </p>
                    <p className="text-xs text-blue-100 truncate max-w-[140px]">{user?.email}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Profile Dropdown Menu - Improved */}
            <AnimatePresence>
              {activeDropdown === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute ${isExpanded ? 'left-[240px]' : 'left-[70px]'} bottom-[60px] w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100`}
                >
                  <div className="py-2">
                    <Link href="/" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium">Home</span>
                      </div>
                    </Link>
                    <Link href="/dashboard-user" className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium">Profil Saya</span>
                      </div>
                    </Link>
                    <div 
                      onClick={handleProfileClick} 
                      className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium">Ubah Foto</span>
                      </div>
                    </div>
                    <div 
                      onClick={logout} 
                      className="block px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-t border-gray-100 mt-1"
                    >
                      <div className="flex items-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium">Keluar</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div onClick={handleProfileClick} className="hidden">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg, image/png, image/jpg"
            />
          </div>

          {/* Jadi Penyedia Jasa - Moved up slightly */}
          <Link href="/daftar-guide" className="block mt-1">
            <motion.div 
              className="flex items-center p-3 rounded-xl bg-white text-[#3A7DF7] transition-all shadow-md hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-center w-8 h-8">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="ml-3 text-sm font-medium whitespace-nowrap"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={contentVariants}
                  >
                    Jadi Penyedia Jasa
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>      </motion.div>
    </>
)
}
