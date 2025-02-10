"use client";

import { useState } from "react";
import type React from "react"; // Added import for React

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "RawallangiAdventure",
    password: "Rawallangi",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
            <h2 className="text-xl font-medium text-[#2D3648] mb-2">
              Social Media
            </h2>
            <p className="text-[#6B7280] text-sm -mt-2 mb-4 md:mb-6">
              Pengguna Dapat Menghubungimu
            </p>

            {/* instagram */}
            <div className="grid grid-cols-2 py-2">
              <div className="flex items-center justify-between w-[900px] px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
                {/* Nomor & Ikon */}
                <div className="flex items-center">
                  <svg
                    width="31"
                    height="31"
                    viewBox="0 0 31 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.99 0H22.01C26.97 0 31 4.03 31 8.99V22.01C31 24.3943 30.0528 26.6809 28.3669 28.3669C26.6809 30.0528 24.3943 31 22.01 31H8.99C4.03 31 0 26.97 0 22.01V8.99C0 6.6057 0.947158 4.31906 2.63311 2.63311C4.31906 0.947158 6.6057 0 8.99 0ZM8.68 3.1C7.20009 3.1 5.7808 3.68789 4.73434 4.73434C3.68789 5.7808 3.1 7.20009 3.1 8.68V22.32C3.1 25.4045 5.5955 27.9 8.68 27.9H22.32C23.7999 27.9 25.2192 27.3121 26.2657 26.2657C27.3121 25.2192 27.9 23.7999 27.9 22.32V8.68C27.9 5.5955 25.4045 3.1 22.32 3.1H8.68ZM23.6375 5.425C24.1514 5.425 24.6442 5.62913 25.0075 5.99248C25.3709 6.35583 25.575 6.84864 25.575 7.3625C25.575 7.87636 25.3709 8.36917 25.0075 8.73252C24.6442 9.09587 24.1514 9.3 23.6375 9.3C23.1236 9.3 22.6308 9.09587 22.2675 8.73252C21.9041 8.36917 21.7 7.87636 21.7 7.3625C21.7 6.84864 21.9041 6.35583 22.2675 5.99248C22.6308 5.62913 23.1236 5.425 23.6375 5.425ZM15.5 7.75C17.5554 7.75 19.5267 8.56651 20.9801 10.0199C22.4335 11.4733 23.25 13.4446 23.25 15.5C23.25 17.5554 22.4335 19.5267 20.9801 20.9801C19.5267 22.4335 17.5554 23.25 15.5 23.25C13.4446 23.25 11.4733 22.4335 10.0199 20.9801C8.56651 19.5267 7.75 17.5554 7.75 15.5C7.75 13.4446 8.56651 11.4733 10.0199 10.0199C11.4733 8.56651 13.4446 7.75 15.5 7.75ZM15.5 10.85C14.2667 10.85 13.084 11.3399 12.212 12.212C11.3399 13.084 10.85 14.2667 10.85 15.5C10.85 16.7333 11.3399 17.916 12.212 18.788C13.084 19.6601 14.2667 20.15 15.5 20.15C16.7333 20.15 17.916 19.6601 18.788 18.788C19.6601 17.916 20.15 16.7333 20.15 15.5C20.15 14.2667 19.6601 13.084 18.788 12.212C17.916 11.3399 16.7333 10.85 15.5 10.85Z"
                      fill="#333333"
                    />
                  </svg>
                  {/* Link */}
                  <a
                    href="https://www.instagram.com/summitcess?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    className="text-black text-md ps-4 truncate"
                  >
                    instagram.com/summitcess/
                  </a>

                  {/* button edit & hapus */}
                  <div className="px-[470px] flex gap-6">
                    <button
                      type="button"
                      className="w-full md:w-auto  bg-white text-[#4A90E2] text-md hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="w-full md:w-auto bg-white text-[#FF0000] text-md hover:text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* whatsapp */}
            <div className="grid grid-cols-2 py-2">
              <div className="flex items-center justify-between w-[900px] px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
                {/* Nomor & Ikon */}
                <div className="flex items-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.3367 4.65607C25.8622 3.17465 24.1062 2.00003 22.1709 1.20066C20.2356 0.401299 18.1597 -0.00682105 16.0643 8.6232e-05C7.28442 8.6232e-05 0.128643 7.12007 0.128643 15.856C0.128643 18.656 0.868342 21.376 2.25126 23.776L0 32L8.44221 29.792C10.7739 31.056 13.395 31.728 16.0643 31.728C24.8442 31.728 32 24.608 32 15.872C32 11.6321 30.3437 7.64807 27.3367 4.65607ZM16.0643 29.04C13.6844 29.04 11.3528 28.4 9.31055 27.2L8.82814 26.912L3.81106 28.224L5.14573 23.36L4.82412 22.864C3.50158 20.7633 2.79948 18.3349 2.79799 15.856C2.79799 8.59206 8.74774 2.67208 16.0482 2.67208C19.5859 2.67208 22.9146 4.04808 25.407 6.54407C26.6414 7.76625 27.6196 9.22013 28.2848 10.8214C28.9501 12.4226 29.2892 14.1394 29.2824 15.872C29.3146 23.136 23.3648 29.04 16.0643 29.04ZM23.3327 19.184C22.9307 18.992 20.9688 18.032 20.6151 17.888C20.2452 17.76 19.9879 17.696 19.7146 18.08C19.4412 18.48 18.6854 19.376 18.4603 19.632C18.2352 19.904 17.994 19.936 17.592 19.728C17.1899 19.536 15.9035 19.104 14.392 17.76C13.202 16.704 12.4141 15.408 12.1729 15.008C11.9477 14.608 12.1407 14.4001 12.3497 14.1921C12.5266 14.0161 12.7518 13.7281 12.9447 13.5041C13.1377 13.2801 13.2181 13.1041 13.3467 12.8481C13.4754 12.5761 13.4111 12.3521 13.3146 12.1601C13.2181 11.9681 12.4141 10.0161 12.0925 9.21606C11.7709 8.44806 11.4332 8.54406 11.192 8.52806H10.4201C10.1467 8.52806 9.72864 8.62406 9.35879 9.02406C9.00502 9.42406 7.97588 10.3841 7.97588 12.3361C7.97588 14.288 9.40704 16.176 9.6 16.432C9.79297 16.704 12.4141 20.704 16.402 22.416C17.3508 22.832 18.0905 23.072 18.6693 23.248C19.6181 23.552 20.4864 23.504 21.1779 23.408C21.9497 23.296 23.5417 22.448 23.8633 21.52C24.201 20.592 24.201 19.808 24.0884 19.632C23.9759 19.456 23.7347 19.376 23.3327 19.184Z"
                      fill="black"
                    />
                  </svg>

                  {/* Link */}
                  <a
                    href="https://www.instagram.com/summitcess?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    className="text-black text-md ps-4 truncate"
                  >
                    https://api.whatsapp.com/send?phone=6282240118706
                  </a>

                  {/* button edit & hapus */}
                  <div className="px-[260px] flex gap-6">
                    <button
                      type="button"
                      className="w-full md:w-auto  bg-white text-[#4A90E2] text-md hover:text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="w-full md:w-auto bg-white text-[#FF0000] text-md hover:text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* telegram */}
            <div className="grid grid-cols-2 py-2">
              <div className="flex items-center justify-between w-[900px] px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
                {/* Nomor & Ikon */}
                <div className="flex items-center">
                  <svg
                    width="33"
                    height="29"
                    viewBox="0 0 33 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M32.9675 3.16389C33.0377 2.7375 32.9924 2.30006 32.8361 1.89715C32.6798 1.49425 32.4184 1.14062 32.079 0.873114C31.7396 0.605608 31.3347 0.434014 30.9064 0.376209C30.4781 0.318404 30.0422 0.376503 29.644 0.544454L2.09643 12.1434C0.176152 12.9522 0.0778828 15.7295 2.09643 16.5672C4.09546 17.4001 6.12333 18.162 8.17623 18.8515C10.0578 19.4734 12.1102 20.0485 13.755 20.2112C14.2045 20.7493 14.7699 21.268 15.3467 21.7416C16.2279 22.4665 17.2879 23.2124 18.3833 23.9277C20.5775 25.3615 23.0117 26.7324 24.6516 27.6249C26.6122 28.6881 28.9594 27.4638 29.3106 25.326L32.9675 3.16389ZM5.18466 14.3392L29.549 4.08054L26.1369 24.7654C24.5276 23.8906 22.2094 22.5809 20.1441 21.2309C19.1923 20.6198 18.2733 19.9589 17.391 19.251C17.1552 19.0584 16.9263 18.8574 16.7047 18.6485L23.0858 12.2691C23.3881 11.967 23.558 11.5573 23.5581 11.1299C23.5583 10.7026 23.3886 10.2927 23.0866 9.99038C22.7845 9.6881 22.3747 9.51819 21.9474 9.51804C21.52 9.51789 21.1101 9.68751 20.8079 9.98958L13.8211 16.9764C12.6386 16.8249 10.9922 16.3867 9.1847 15.7907C7.83908 15.3423 6.50578 14.8578 5.18627 14.3376L5.18466 14.3392Z"
                      fill="black"
                    />
                  </svg>

                  {/* Link */}
                  <a
                    href="https://www.instagram.com/summitcess?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    className="text-[#A1A1A1] text-md ps-4 truncate"
                  >
                    Tautkan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}