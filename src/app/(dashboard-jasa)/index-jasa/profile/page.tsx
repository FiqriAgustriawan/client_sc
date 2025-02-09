// // import React from 'react'

// // function page() {
// //   return (
// //     <>
// //         <div className="min-h-screen p-4 md:p-10 flex flex-col md:flex-row mt-16 md:mr-5 max-w-[1200px] mx-auto">
// //         <div className="hidden md:block w-[10%]">{/* sidebar space */}</div>
// //         {/* Team Data */}
// //         <section className="mt-6 bg-white p-6 rounded-lg shadow-md">
// //           <h3 className="text-lg font-semibold">Data Tim</h3>
// //           <div className="mt-4">
// //             <label className="block text-sm font-medium">Nama Tim</label>
// //             <input type="text" className="border p-2 w-full rounded-lg" value="RawallangiAdventure" readOnly />
// //           </div>
// //           <div className="mt-4">
// //             <label className="block text-sm font-medium">Password</label>
// //             <input type="password" className="border p-2 w-full rounded-lg" value="**********" readOnly />
// //           </div>
// //           <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Ganti Password</button>
// //         </section>
// //     </div>
// //     </>
// //   )
// // }

// // export default page

"use client";

import { useState } from "react";
import type React from "react"; // Added import for React

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "RawallangiAdventure",
    password: "Rawallangi",
    birthDate: { day: "", month: "", year: "" },
    nik: "",
    city: "",
    phone: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      birthDate: {
        ...prevData.birthDate,
        [name]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col md:flex-row mt-16 md:mr-5 max-w-[1200px] mx-auto">
      <div className="hidden md:block w-[10%]">{/* Sidebar space */}</div>
      <div className="w-full md:w-[90%] space-y-8">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Team Data Form */}
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-md">
            <h2 className="text-xl font-medium text-[#2D3648] mb-4 md:mb-6">
              Data Tim
            </h2>
            <form className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="block text-sm text-[#6B7280]">
                  Nama Tim <span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Tim"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                />
              </div>

              <div className="grid grid-cols-1">
                <div className="space-y-2">
                  <label className="block text-sm text-[#6B7280]">
                    Password <span className="text-[#FF0000]">*</span>
                  </label>
                  <div className="flex justify-end">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-[780px] px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                    <button
                      type="submit"
                      className="w-full relative md:w-auto px-[27px] mx-[8px] py-2.5 bg-[#4A90E2] text-white rounded-[12px] text-sm hover:bg-blue-600"
                    >
                      Ganti Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:justify-end gap-3 mt-4 md:mt-0">
                <button
                  type="button"
                  className="w-full md:w-auto px-6 py-2.5 bg-[#F3F4F6] text-[#6B7280] rounded-[12px] text-sm hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2.5 bg-[#F3F4F6] text-[#6B7280] rounded-[12px] text-sm hover:bg-gray-200"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>

          {/* Data Anggota */}
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-md">
            <h2 className="text-xl font-medium text-[#2D3648] mb-2">Anggota</h2>
            <div className="grid grid-cols-2 py-2">            
            <div className="flex items-center justify-between w-[900px] px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
              {/* Nama */}
              <span className="text-gray-400 text-sm truncate">
                Muhammad Fiqri Agustriawan
              </span>

              {/* Nomor & Ikon */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">0851-7311-3170</span>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-6 h-6"
                />
              </div>
            </div>
            <svg
              width="26"
              height="31"
              viewBox="0 0 26 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-[445px] mt-1"
            >
              <path
                d="M21.8 11L20.568 23.597C20.3817 25.5065 20.2893 26.4605 19.864 27.182C19.491 27.8171 18.9423 28.325 18.2873 28.6415C17.5437 29 16.608 29 14.7307 29H11.2693C9.39347 29 8.45627 29 7.71267 28.64C7.05714 28.3237 6.50797 27.8158 6.13453 27.1805C5.71213 26.4605 5.61827 25.5065 5.43053 23.597L4.2 11M15.2 20.75V13.25M10.8 20.75V13.25M2 7.25H8.76867M8.76867 7.25L9.3348 3.242C9.49907 2.513 10.0916 2 10.7721 2H15.2279C15.9084 2 16.4995 2.513 16.6652 3.242L17.2313 7.25M8.76867 7.25H17.2313M17.2313 7.25H24"
                stroke="#FF0000"
                stroke-width="2.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            </div>
            <div className="grid grid-cols-2 py-2">            
            <div className="flex items-center justify-between w-[900px] px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
              {/* Nama */}
              <span className="text-gray-400 text-sm truncate">
                Muhammad Fiqri Agustriawan
              </span>

              {/* Nomor & Ikon */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">0851-7311-3170</span>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-6 h-6"
                />
              </div>
            </div>
            <svg
              width="26"
              height="31"
              viewBox="0 0 26 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-[445px] mt-1"
            >
              <path
                d="M21.8 11L20.568 23.597C20.3817 25.5065 20.2893 26.4605 19.864 27.182C19.491 27.8171 18.9423 28.325 18.2873 28.6415C17.5437 29 16.608 29 14.7307 29H11.2693C9.39347 29 8.45627 29 7.71267 28.64C7.05714 28.3237 6.50797 27.8158 6.13453 27.1805C5.71213 26.4605 5.61827 25.5065 5.43053 23.597L4.2 11M15.2 20.75V13.25M10.8 20.75V13.25M2 7.25H8.76867M8.76867 7.25L9.3348 3.242C9.49907 2.513 10.0916 2 10.7721 2H15.2279C15.9084 2 16.4995 2.513 16.6652 3.242L17.2313 7.25M8.76867 7.25H17.2313M17.2313 7.25H24"
                stroke="#FF0000"
                stroke-width="2.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            </div>
            <div className="grid grid-cols-2 py-2">            
            <div className="flex items-center justify-between w-[900px] px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
              {/* Nama */}
              <span className="text-gray-400 text-sm truncate">
                Muhammad Fiqri Agustriawan
              </span>

              {/* Nomor & Ikon */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">0851-7311-3170</span>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-6 h-6"
                />
              </div>
            </div>
            <svg
              width="26"
              height="31"
              viewBox="0 0 26 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-[445px] mt-1"
            >
              <path
                d="M21.8 11L20.568 23.597C20.3817 25.5065 20.2893 26.4605 19.864 27.182C19.491 27.8171 18.9423 28.325 18.2873 28.6415C17.5437 29 16.608 29 14.7307 29H11.2693C9.39347 29 8.45627 29 7.71267 28.64C7.05714 28.3237 6.50797 27.8158 6.13453 27.1805C5.71213 26.4605 5.61827 25.5065 5.43053 23.597L4.2 11M15.2 20.75V13.25M10.8 20.75V13.25M2 7.25H8.76867M8.76867 7.25L9.3348 3.242C9.49907 2.513 10.0916 2 10.7721 2H15.2279C15.9084 2 16.4995 2.513 16.6652 3.242L17.2313 7.25M8.76867 7.25H17.2313M17.2313 7.25H24"
                stroke="#FF0000"
                stroke-width="2.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            </div>
            <div className="grid grid-cols-2 py-2">            
            <div className="flex items-center justify-between w-[900px] px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
              {/* Nama */}
              <span className="text-gray-400 text-sm truncate">
                Muhammad Fiqri Agustriawan
              </span>

              {/* Nomor & Ikon */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">0851-7311-3170</span>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-6 h-6"
                />
              </div>
            </div>
            <svg
              width="26"
              height="31"
              viewBox="0 0 26 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-[445px] mt-1"
            >
              <path
                d="M21.8 11L20.568 23.597C20.3817 25.5065 20.2893 26.4605 19.864 27.182C19.491 27.8171 18.9423 28.325 18.2873 28.6415C17.5437 29 16.608 29 14.7307 29H11.2693C9.39347 29 8.45627 29 7.71267 28.64C7.05714 28.3237 6.50797 27.8158 6.13453 27.1805C5.71213 26.4605 5.61827 25.5065 5.43053 23.597L4.2 11M15.2 20.75V13.25M10.8 20.75V13.25M2 7.25H8.76867M8.76867 7.25L9.3348 3.242C9.49907 2.513 10.0916 2 10.7721 2H15.2279C15.9084 2 16.4995 2.513 16.6652 3.242L17.2313 7.25M8.76867 7.25H17.2313M17.2313 7.25H24"
                stroke="#FF0000"
                stroke-width="2.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            </div>
            <div className="grid grid-cols-2 py-2">            
            <div className="flex items-center justify-between w-[900px] px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
              {/* Nama */}
              <span className="text-gray-400 text-sm truncate">
                Muhammad Fiqri Agustriawan
              </span>

              {/* Nomor & Ikon */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">0851-7311-3170</span>
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-6 h-6"
                />
              </div>
            </div>
            <svg
              width="26"
              height="31"
              viewBox="0 0 26 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-[445px] mt-1"
            >
              <path
                d="M21.8 11L20.568 23.597C20.3817 25.5065 20.2893 26.4605 19.864 27.182C19.491 27.8171 18.9423 28.325 18.2873 28.6415C17.5437 29 16.608 29 14.7307 29H11.2693C9.39347 29 8.45627 29 7.71267 28.64C7.05714 28.3237 6.50797 27.8158 6.13453 27.1805C5.71213 26.4605 5.61827 25.5065 5.43053 23.597L4.2 11M15.2 20.75V13.25M10.8 20.75V13.25M2 7.25H8.76867M8.76867 7.25L9.3348 3.242C9.49907 2.513 10.0916 2 10.7721 2H15.2279C15.9084 2 16.4995 2.513 16.6652 3.242L17.2313 7.25M8.76867 7.25H17.2313M17.2313 7.25H24"
                stroke="#FF0000"
                stroke-width="2.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


// import React, { useState } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const PasswordChange = () => {
//   const [showForm, setShowForm] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.newPassword !== formData.confirmPassword) {
//       alert('Password baru dan konfirmasi password tidak cocok!');
//       return;
//     }
//     // Logika untuk mengganti password bisa ditambahkan di sini
//     console.log('Password changed:', formData);
//     setShowForm(false);
//     setFormData({
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     });
//   };

//   return (
//     <div className="w-full max-w-md">
//       <div>
//         <button>Ganti Password</button>
//       </div>
//       <div>
//         {!showForm ? (
//           <Button 
//             onClick={() => setShowForm(true)}
//             className="w-full"
//           >
//             Ganti Password
//           </Button>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 name="currentPassword"
//                 placeholder="Password Saat Ini"
//                 value={formData.currentPassword}
//                 onChange={handleChange}
//                 className="w-full pr-10"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2"
//               >
//                 {showPassword ? 
//                   <EyeOff className="h-4 w-4 text-gray-500" /> : 
//                   <Eye className="h-4 w-4 text-gray-500" />
//                 }
//               </button>
//             </div>

//             <div className="relative">
//               <Input
//                 type={showNewPassword ? "text" : "password"}
//                 name="newPassword"
//                 placeholder="Password Baru"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 className="w-full pr-10"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2"
//               >
//                 {showNewPassword ? 
//                   <EyeOff className="h-4 w-4 text-gray-500" /> : 
//                   <Eye className="h-4 w-4 text-gray-500" />
//                 }
//               </button>
//             </div>

//             <div className="relative">
//               <Input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 placeholder="Konfirmasi Password Baru"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full pr-10"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2"
//               >
//                 {showConfirmPassword ? 
//                   <EyeOff className="h-4 w-4 text-gray-500" /> : 
//                   <Eye className="h-4 w-4 text-gray-500" />
//                 }
//               </button>
//             </div>

//             <div className="flex space-x-2">
//               <Button type="submit" className="flex-1">
//                 Simpan
//               </Button>
//               <Button 
//                 type="button" 
//                 onClick={() => {
//                   setShowForm(false);
//                   setFormData({
//                     currentPassword: '',
//                     newPassword: '',
//                     confirmPassword: ''
//                   });
//                 }}
//                 variant="outline"
//                 className="flex-1"
//               >
//                 Batal
//               </Button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PasswordChange;