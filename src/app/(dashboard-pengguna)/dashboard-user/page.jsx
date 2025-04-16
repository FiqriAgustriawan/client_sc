'use client';

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { profileService } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { motion } from "framer-motion";


import { Toaster } from "@/components/ui/toaster";

export default function DashboardUserPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    gender: '',
    tanggal_lahir: '',
    nik: '',
    tempat_tinggal: '',
    nomor_telepon: '',
    email: ''
  });

  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [phoneFormData, setPhoneFormData] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isFormModified, setIsFormModified] = useState(false);

  // Load profile data when component mounts
  // Update the loadProfile function in useEffect
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const result = await profileService.getProfile();
        
        if (result.success && result.data) {
          // Only set data if it's not the default values
          const isDefaultProfile = !result.data.gender && 
            !result.data.tanggal_lahir && 
            !result.data.nik && 
            !result.data.tempat_tinggal && 
            !result.data.nomor_telepon;

          if (!isDefaultProfile) {
            setProfileData(result.data);
            
            const formattedDate = result.data.tanggal_lahir ?
              new Date(result.data.tanggal_lahir).toISOString().split('T')[0] : '';

            setFormData({
              nama_lengkap: `${user.nama_depan || ''} ${user.nama_belakang || ''}`.trim(),
              gender: result.data.gender || '',
              tanggal_lahir: formattedDate,
              nik: result.data.nik || '',
              tempat_tinggal: result.data.tempat_tinggal || '',
              nomor_telepon: result.data.nomor_telepon || '',
              email: user.email || '',
              profile_image: result.data.profile_image || null
            });
          } else {
            // Set empty form data if it's default profile
            setFormData({
              nama_lengkap: `${user.nama_depan || ''} ${user.nama_belakang || ''}`.trim(),
              gender: '',
              tanggal_lahir: '',
              nik: '',
              tempat_tinggal: '',
              nomor_telepon: '',
              email: user.email || '',
              profile_image: null
            });
          }
        }
      } catch (error) {
        console.error('Profile loading error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Terjadi kesalahan saat memuat profil",
        });
      }
    };

    loadProfile();
  }, [user]);

  // Check form completion
  useEffect(() => {
    const { gender, tanggal_lahir, nik, tempat_tinggal } = formData;
    setIsFormComplete(Boolean(gender && tanggal_lahir && nik && tempat_tinggal));
  }, [formData]);

  // Handle authentication and routing
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'user') {
        router.push('/admin');
      }
    }
  }, [user, loading, router]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(phone);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsFormModified(true);
  };

  const handlePhoneSubmit = async () => {
    setPhoneError('');

    if (!validatePhoneNumber(phoneFormData)) {
      setPhoneError('Format nomor telepon tidak valid. Gunakan format: 08xx atau +62xx');
      return;
    }

    try {
      const result = await profileService.updateProfile({
        ...formData,
        nomor_telepon: phoneFormData
      });

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          nomor_telepon: phoneFormData
        }));
        setShowPhoneInput(false);
        setPhoneFormData('');
        toast({
          title: (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-green-500/20 animate-ping absolute"></div>
                <svg className="w-6 h-6 text-green-500 relative animate-bounce" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
              </div>
              <span className="font-bold tracking-wide text-lg animate-fade-in">Kontak Diperbarui!</span>
            </div>
          ),
          description: (
            <div className="flex flex-col gap-2 animate-slide-up">
              <div className="flex items-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-green-300 border-t-green-500 animate-spin"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full absolute top-1 left-1 animate-pulse"></div>
                </div>
                <span className="font-medium text-white/90 animate-fade-in">
                  Nomor telepon berhasil ditambahkan
                </span>
              </div>
              <div className="pl-8 space-y-1">
                <div className="flex items-center gap-2 text-sm text-white/80 animate-slide-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Nomor baru: {phoneFormData}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Data tersimpan dengan aman
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-green-300/20 via-green-400/40 to-green-300/20 rounded animate-pulse"></div>
              </div>
            </div>
          ),
          className: "animate-toast-slide bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white border-none shadow-2xl shadow-green-500/30 backdrop-blur-md",
          duration: 5000,
          style: {
            animation: "slide-up 0.4s ease-out, fade-out 0.4s ease-in forwards 4.6s",
            transform: "perspective(1000px) rotateX(0deg)",
          }
        });
      } else {
        setPhoneError(result.error || 'Gagal menambahkan nomor telepon');
        toast({
          title: "Gagal Memperbarui",
          description: "Nomor telepon tidak dapat diperbarui",
          variant: "destructive",
          className: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-none shadow-lg shadow-red-500/30 animate-toast-slide",
          duration: 3000,
        });
      }
    } catch (error) {
      setPhoneError('Terjadi kesalahan saat menambahkan nomor telepon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profileData = {
        gender: formData.gender || null,
        tanggal_lahir: formData.tanggal_lahir || null,
        nik: formData.nik || null,
        tempat_tinggal: formData.tempat_tinggal || null,
        nomor_telepon: formData.nomor_telepon || null,
      };

      const result = await profileService.updateProfile(profileData);

      // In handleSubmit function, after successful profile update
      if (result.success) {
        setIsFormModified(false);
        toast({
          title: (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-green-500/20 animate-ping absolute"></div>
                <svg className="w-6 h-6 text-green-500 relative animate-bounce" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
              </div>
              <span className="font-bold tracking-wide text-lg animate-fade-in">Profile Updated!</span>
            </div>
          ),
          description: (
            <div className="flex flex-col gap-2 animate-slide-up">
              <div className="flex items-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-green-300 border-t-green-500 animate-spin"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full absolute top-1 left-1 animate-pulse"></div>
                </div>
                <span className="font-medium text-white/90 animate-fade-in">
                  Data pribadi berhasil disimpan
                </span>
              </div>
              <div className="pl-8 space-y-1">
                <div className="flex items-center gap-2 text-sm text-white/80 animate-slide-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Perubahan tersimpan dengan aman
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-green-300/20 via-green-400/40 to-green-300/20 rounded animate-pulse"></div>
              </div>
            </div>
          ),
          variant: "default",
          className: "animate-toast-slide bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white border-none shadow-2xl shadow-green-500/30 backdrop-blur-md",
          duration: 5000,
          style: {
            animation: "slide-up 0.4s ease-out, fade-out 0.4s ease-in forwards 4.6s",
            transform: "perspective(1000px) rotateX(0deg)",
          }
        });
        
        const profileResult = await profileService.getProfile();
        if (profileResult.success) {
          setProfileData(profileResult.data); // This updates the last modified timestamp
          
          setFormData(prev => ({
            ...prev,
            gender: profileResult.data.gender || '',
            tanggal_lahir: profileResult.data.tanggal_lahir ? 
              new Date(profileResult.data.tanggal_lahir).toISOString().split('T')[0] : '',
            nik: profileResult.data.nik || '',
            tempat_tinggal: profileResult.data.tempat_tinggal || '',
            nomor_telepon: profileResult.data.nomor_telepon || '',
            updated_at: profileResult.data.updated_at // Add this line
          }));
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Gagal memperbarui profil",
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "Gagal!",
        description: "Terjadi kesalahan saat memperbarui data",
        variant: "destructive",
        className: "bg-red-500 text-white border-none",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      toast({
        variant: "destructive",
        title: "Format tidak didukung",
        description: "Gunakan format gambar JPG atau PNG",
      });
      return;
    }

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
      
      if (user?.id) {
        formData.append('user_id', user.id);
      }

      const result = await profileService.updateProfileImage(formData);

      if (result.success) {
        toast({
          title: (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-green-500/20 animate-ping absolute"></div>
                <svg className="w-6 h-6 text-green-500 relative animate-bounce" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
              </div>
              <span className="font-bold tracking-wide text-lg animate-fade-in">Profile Updated!</span>
            </div>
          ),
          description: (
            <div className="flex flex-col gap-2 animate-slide-up">
              <div className="flex items-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-green-300 border-t-green-500 animate-spin"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full absolute top-1 left-1 animate-pulse"></div>
                </div>
                <span className="font-medium text-white/90 animate-fade-in">
                  Foto profil berhasil diperbarui
                </span>
              </div>
              <div className="pl-8 space-y-1">
                <div className="flex items-center gap-2 text-sm text-white/80 animate-slide-left">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Perubahan tersimpan dengan aman
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-green-300/20 via-green-400/40 to-green-300/20 rounded animate-pulse"></div>
              </div>
            </div>
          ),
          className: "animate-toast-slide bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white border-none shadow-2xl shadow-green-500/30 backdrop-blur-md",
          duration: 5000,
          style: {
            animation: "slide-up 0.4s ease-out, fade-out 0.4s ease-in forwards 4.6s",
            transform: "perspective(1000px) rotateX(0deg)",
          }
        });
        
        // Force reload profile data
        const profileResult = await profileService.getProfile();
        if (profileResult.success && profileResult.data) {
          setProfileData(profileResult.data);
          // Update form data with new image URL
          setFormData(prev => ({
            ...prev,
            profile_image: profileResult.data.profile_image
          }));
          
          // // Reload the page after successful update
          window.location.reload();
        }
      } else {
        console.error('Upload failed:', result.error);
        toast({
          variant: "destructive",
          title: "Gagal",
          description: result.error || "Gagal memperbarui foto profil",
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui foto profil",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-8 border-blue-500/20 border-t-blue-600 animate-spin"></div>
          <div className="w-12 h-12 rounded-full border-6 border-indigo-400/30 border-t-indigo-500 animate-spin absolute top-2 left-2"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-6 left-6 animate-bounce shadow-lg shadow-blue-500/50"></div>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold text-lg">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'user') {
    return null;
  }

  const RequiredIndicator = ({ value }) => (
    !value ? <span className="text-[#FF0000]">*</span> : null
  );

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
       <div className="w-full transition-all duration-300 ease-in-out"></div>
  <div className="relative">
        {/* Header Background with improved height and positioning */}
        <div className="w-full h-[280px] md:h-[320px] bg-gradient-to-r from-blue-700 to-blue-500 rounded-b-[40px] relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern-bg.png')] bg-repeat"></div>
          </div>
          
          {/* Header Content with better spacing and positioning */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-8 md:pt-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard Pengguna</h1>
                <p className="text-blue-100 text-sm md:text-base max-w-xl">
                  Kelola informasi pribadi, kontak, dan akun terhubung Anda untuk pengalaman yang lebih baik.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 px-5 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Pengaturan
              </motion.button>
            </div>
            
            
          </motion.div>
        </div>
        
        {/* Profile Card - Improved positioning to prevent overlap */}
        <div className="absolute -bottom-[120px] sm:-bottom-[100px] md:-bottom-[90px] left-1/2 transform -translate-x-1/2 w-full max-w-[1300px] px-4 sm:px-6 md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-5 md:p-6 lg:p-8 flex flex-col md:flex-row items-center gap-4 md:gap-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/jpeg, image/png, image/jpg"
            />
            
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                onClick={handleProfileClick}
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden cursor-pointer border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {profileData?.profile_image ? (
                  <Image
                    src={profileData.profile_image}
                    alt="Profile"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default-avatar.png';
                    }}
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#809CFF] to-[#4A7BFF] flex items-center justify-center text-white text-3xl sm:text-4xl font-semibold">
                    {user?.nama_depan?.charAt(0) || ''}{user?.nama_belakang?.charAt(0) || ''}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
                    <span className="text-white text-xs sm:text-sm">Uploading...</span>
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-600 transition-colors" 
                onClick={handleProfileClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </motion.div>
            </div>
            
            <div className="flex flex-col text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-semibold text-[#2D3648] mb-1 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                {user?.nama_depan} {user?.nama_belakang}
              </h3>
              <p className="text-[#6B7280] text-sm mb-2">{user?.email}</p>
              
              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mb-2 mx-auto md:mx-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Pengguna
              </div>
              <p className="text-xs text-gray-500 italic flex items-center justify-center md:justify-start gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {profileData?.updated_at ? (
                  <>
                    Terakhir diperbarui:&nbsp;
                    <span className="font-medium text-gray-600">
                      {new Intl.DateTimeFormat('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'Asia/Jakarta'
                      }).format(new Date(profileData.updated_at))}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">Belum ada pembaruan</span>
                )}
              </p>
            </div>
            
            <div className="ml-auto hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Lihat Trip Saya
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Tabs Navigation - Enhanced with animations and better spacing */}
      <div className="mt-[140px] sm:mt-[130px] md:mt-[120px] max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
      <div className="flex overflow-x-auto space-x-3 pb-2 mb-6 scrollbar-hide">
          {['profile', 'contact', 'accounts'].map((tab, index) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {tab === 'profile' && 'Data Pribadi'}
              {tab === 'contact' && 'Kontak Pribadi'}
              {tab === 'accounts' && 'Akun Terhubung'}
            </motion.button>
          ))}
        </div>
        
        {/* Mobile Trip Button - Only visible on mobile */}
        <div className="md:hidden mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lihat Trip Saya
          </motion.button>
        </div>
      
        {/* Content Area - Enhanced with better animations and styling */}
        <div className="space-y-8 pb-16">
          {/* Data Pribadi Section */}
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-[#2D3648]">Data Pribadi</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                  <div className="space-y-2 md:col-span-6">
                    <label className="block text-sm text-[#6B7280] flex items-center justify-between">
                      <span>Nama Lengkap</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Tidak dapat diubah</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nama_lengkap"
                        value={formData.nama_lengkap}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-gray-50 text-[#2D3648] text-sm focus:outline-none cursor-not-allowed opacity-75"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Nama lengkap diambil dari data registrasi dan tidak dapat diubah.</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm text-[#6B7280]">
                      Gender <RequiredIndicator value={formData.gender} />
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    >
                      <option value="">Pilih Gender</option>
                      <option value="Laki-Laki">Laki-Laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-4">
                    <label className="block text-sm text-[#6B7280]">
                      Tanggal Lahir <RequiredIndicator value={formData.tanggal_lahir} />
                    </label>
                    <input
                      type="date"
                      name="tanggal_lahir"
                      value={formData.tanggal_lahir}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                    {formData.tanggal_lahir && (
                      <p className="text-sm text-[#6B7280] mt-1">
                        {new Date(formData.tanggal_lahir).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm text-[#6B7280]">
                      NIK <RequiredIndicator value={formData.nik} />
                    </label>
                    <input
                      type="text"
                      name="nik"
                      value={formData.nik}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-4">
                    <label className="block text-sm text-[#6B7280]">
                      Tempat Tinggal <RequiredIndicator value={formData.tempat_tinggal} />
                    </label>
                    <input
                      type="text"
                      name="tempat_tinggal"
                      value={formData.tempat_tinggal}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-end gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="w-full md:w-auto px-6 py-3 bg-[#F3F4F6] text-[#6B7280] rounded-xl text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Batal
                  </motion.button>
                  <motion.button
                    whileHover={{ 
                      scale: (isFormModified && formData.gender && formData.tanggal_lahir && formData.nik && formData.tempat_tinggal) ? 1.03 : 1,
                      boxShadow: (isFormModified && formData.gender && formData.tanggal_lahir && formData.nik && formData.tempat_tinggal) ? "0 10px 15px -3px rgba(59, 130, 246, 0.3)" : "none"
                    }}
                    whileTap={{ 
                      scale: (isFormModified && formData.gender && formData.tanggal_lahir && formData.nik && formData.tempat_tinggal) ? 0.97 : 1
                    }}
                    type="submit"
                    disabled={!isFormModified || isLoading || !formData.gender || !formData.tanggal_lahir || !formData.nik || !formData.tempat_tinggal}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2
                      ${(isFormModified && formData.gender && formData.tanggal_lahir && formData.nik && formData.tempat_tinggal) 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40' 
                        : 'bg-gray-400 text-white cursor-not-allowed'}`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Kontak Pribadi Section */}
          {activeTab === 'contact' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-[#2D3648]">Kontak Pribadi</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm text-[#6B7280] flex items-center justify-between">
                      <span>Email</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Tidak dapat diubah</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-[#E5E7EB] bg-gray-50 text-[#2D3648] text-sm focus:outline-none cursor-not-allowed opacity-75"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email diambil dari data registrasi dan tidak dapat diubah.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-[#6B7280]">
                      Nomor Telepon
                    </label>
                    
                    {!showPhoneInput && (
                      <div className="flex items-center space-x-3">
                        {formData.nomor_telepon ? (
                          <div className="flex-1 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm flex items-center justify-between">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {formData.nomor_telepon}
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full mr-2">Terverifikasi</span>
                              <button 
                                type="button"
                                onClick={() => {
                                  setShowPhoneInput(true);
                                  setPhoneFormData(formData.nomor_telepon);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => {
                              setShowPhoneInput(true);
                              setPhoneFormData('');
                            }}
                            className="w-full px-4 py-3 bg-white border border-blue-500 text-blue-600 rounded-xl text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Tambahkan Nomor Telepon
                          </motion.button>
                        )}
                      </div>
                    )}
                    
                    {showPhoneInput && (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="tel"
                            value={phoneFormData}
                            onChange={(e) => {
                              setPhoneFormData(e.target.value);
                              setPhoneError('');
                            }}
                            placeholder="Contoh: 08123456789 atau +6281234567890"
                            className={`w-full px-4 py-3 rounded-xl border ${phoneError ? 'border-red-500' : 'border-[#E5E7EB]'} bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]`}
                          />
                          {phoneError && (
                            <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => {
                              setShowPhoneInput(false);
                              setPhoneError('');
                            }}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                          >
                            Batal
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={handlePhoneSubmit}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                          >
                            Simpan
                          </motion.button>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          Nomor telepon akan digunakan untuk verifikasi dan komunikasi penting terkait trip Anda.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-md font-medium text-[#2D3648] mb-4">Kontak Darurat</h3>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Informasi Kontak Darurat</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Kontak darurat akan dihubungi jika terjadi keadaan darurat selama perjalanan Anda. Pastikan untuk menambahkan setidaknya satu kontak darurat sebelum melakukan pemesanan trip.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full px-4 py-3 bg-white border border-blue-500 text-blue-600 rounded-xl text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tambahkan Kontak Darurat
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Akun Terhubung Section */}
          {activeTab === 'accounts' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-[#2D3648]">Akun Terhubung</h2>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Hubungkan Akun Media Sosial</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Menghubungkan akun media sosial memungkinkan Anda untuk login dengan cepat dan berbagi pengalaman trip Anda dengan mudah.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#4267B2] flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#2D3648]">Facebook</h3>
                        <p className="text-xs text-gray-500">Tidak terhubung</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white border border-[#4267B2] text-[#4267B2] rounded-lg text-sm hover:bg-[#4267B2] hover:text-white transition-colors"
                    >
                      Hubungkan
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.162 5.65593C21.3986 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4804 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75098 3.19799 4.45893C2.82628 5.09738 2.63095 5.82315 2.63199 6.56193C2.63199 8.01193 3.36999 9.29293 4.49199 10.0429C3.828 10.022 3.17862 9.84271 2.59799 9.51993V9.57193C2.59819 10.5376 2.93236 11.4735 3.54384 12.221C4.15532 12.9684 5.00647 13.4814 5.95299 13.6729C5.33661 13.84 4.6903 13.8646 4.06299 13.7449C4.32986 14.5762 4.85 15.3031 5.55058 15.824C6.25117 16.345 7.09712 16.6337 7.96999 16.6499C7.10247 17.3313 6.10917 17.8349 5.04687 18.1321C3.98458 18.4293 2.87412 18.5142 1.77899 18.3819C3.69069 19.6114 5.91609 20.2641 8.18899 20.2619C15.882 20.2619 20.089 13.8889 20.089 8.36193C20.089 8.18193 20.084 7.99993 20.076 7.82193C20.8949 7.2301 21.6016 6.49695 22.163 5.65693L22.162 5.65593Z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#2D3648]">Twitter</h3>
                        <p className="text-xs text-gray-500">Tidak terhubung</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white border border-[#1DA1F2] text-[#1DA1F2] rounded-lg text-sm hover:bg-[#1DA1F2] hover:text-white transition-colors"
                    >
                      Hubungkan
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#405DE6] via-[#E1306C] to-[#FFDC80] flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#2D3648]">Instagram</h3>
                        <p className="text-xs text-gray-500">Tidak terhubung</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white border border-[#E1306C] text-[#E1306C] rounded-lg text-sm hover:bg-gradient-to-tr hover:from-[#405DE6] hover:via-[#E1306C] hover:to-[#FFDC80] hover:text-white transition-colors"
                    >
                      Hubungkan
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#DB4437] flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" />
                          <path d="M3.15302 7.3455L6.43851 9.755C7.32752 7.554 9.48052 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15902 2 4.82802 4.1685 3.15302 7.3455Z" fill="#F44336" />
                          <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5717 17.5742 13.3037 18.001 12 18C9.39897 18 7.19047 16.3415 6.35847 14.027L3.09747 16.5395C4.75247 19.778 8.11347 22 12 22Z" fill="#4CAF50" />
                          <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-[#2D3648]">Google</h3>
                        <p className="text-xs text-gray-500">Tidak terhubung</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white border border-[#DB4437] text-[#DB4437] rounded-lg text-sm hover:bg-[#DB4437] hover:text-white transition-colors"
                    >
                      Hubungkan
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}