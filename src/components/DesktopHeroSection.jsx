"use client";
"use client";

import React, { useState, useEffect, useRef } from "react";
import HeroGunung from "@/assets/images/Bg-Home.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Climber experience levels
const CLIMBER_LEVELS = [
  { id: "pemula", label: "Pemula" },
  { id: "menengah", label: "Menengah" },
  { id: "berpengalaman", label: "Berpengalaman" },
  { id: "profesional", label: "Profesional" },
];

const HeroImage = () => {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  // State for filter values
  const [selectedLevel, setSelectedLevel] = useState(CLIMBER_LEVELS[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  // Close datepicker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    // Navigate to trips page with filter params
    router.push(
      `/trips?level=${selectedLevel.id}&date=${format(
        selectedDate,
        "yyyy-MM-dd"
      )}`
    );
  };

  return (
    <div
      className="relative bg-gradient-to-b from-[#516be2] to-[#8DB7FF]"
      style={{ height: "95vh" }}
    >
      <Image
        src={HeroGunung}
        alt="Mountain landscape"
        className="w-full h-full  mt-64"
        fill
        sizes=""
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white pt-10">
        {/* Updated heading to match Figma - larger text, better spacing */}
        <h1 className="text-5xl sm:text-5xl md:text-6xl font-bold max-w-5xl mx-auto leading-tight text-center mb-6 px-4">
          Setiap Langkah Membawa Anda Menuju Puncak Impian
        </h1>

        {/* Updated paragraph spacing and line breaks to match Figma */}
        <div className="max-w-4xl mx-auto text-center ">
          <p className="text-base sm:text-lg md:text-xl lg:text-xl font-normal leading-normal">
            Gabung bersama kami untuk pengalaman pendakian yang aman, seru, dan
            tak terlupakan.
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-xl font-normal leading-normal mt-1">
            Siap melangkah lebih dekat ke puncak impian?
          </p>
        </div>

        {/* Search/Filter Component - Updated styling to match Figma */}
        <div className="absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-[750px] px-4">
          <div className="bg-white rounded-full shadow-lg flex md:flex-row items-center overflow-hidden">
            {/* Status Pendaki - Clickable WITH dropdown */}
            <div className="flex-1 border-r border-gray-200 relative">
              <div
                className="flex items-center space-x-3 px-5 py-5 w-full cursor-pointer hover:bg-gray-50"
                onClick={() => setShowLevelDropdown((prev) => !prev)}
              >
                <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-500"
                  >
                    <path
                      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">
                    Status Pendaki
                  </p>
                  <p className="text-sm font-normal text-gray-600">
                    {selectedLevel.label}
                  </p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`text-gray-400 transition-transform ${
                    showLevelDropdown ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Level Dropdown */}
              {showLevelDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-lg z-50 py-2">
                  {CLIMBER_LEVELS.map((level) => (
                    <div
                      key={level.id}
                      className="px-5 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLevel(level);
                        setShowLevelDropdown(false);
                      }}
                    >
                      <p className="text-gray-900">{level.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tanggal Mendaki Dropdown - Clickable */}
            <div ref={datePickerRef} className="relative flex-1">
              <button
                className="flex items-center space-x-3 px-5 py-5 w-full text-left cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setShowDatePicker(!showDatePicker);
                }}
              >
                <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-500"
                  >
                    <path
                      d="M8 2V5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 2V5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 9.09H20.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900">
                    Tanggal Mendaki
                  </p>
                  <p className="text-sm font-normal text-gray-600">
                    {format(selectedDate, "dd/MM/yyyy")}
                  </p>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`text-gray-400 transition-transform ${
                    showDatePicker ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Submit Button - Arrow icon */}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center transition-colors flex-shrink-0 mr-4"
              onClick={handleSearch}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.4301 5.93005L20.5001 12.0001L14.4301 18.0701"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 12H20.33"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Floating DatePicker (rendered at the root level to avoid stacking context issues) */}
      {showDatePicker && (
        <div
          className="fixed inset-0 z-[999] flex items-start justify-center pt-32"
          onClick={(e) =>
            e.target === e.currentTarget && setShowDatePicker(false)
          }
        >
          <div className="bg-white shadow-2xl rounded-xl p-5 border border-gray-100 animate-fadeIn">
            <div className="mb-2 pb-2 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">
                Pilih Tanggal Mendaki
              </h3>
            </div>

            <div className="relative">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date || new Date());
                  setShowDatePicker(false);
                }}
                inline
                minDate={new Date()}
                className="react-datepicker--custom"
                calendarClassName="!rounded-lg shadow-sm"
                monthsShown={1}
              />

              <div className="absolute inset-0 pointer-events-none rounded-lg border border-blue-100"></div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
              <button
                className="text-gray-500 text-sm font-medium hover:text-gray-700 transition-colors py-2 px-4"
                onClick={() => setShowDatePicker(false)}
              >
                Cancel
              </button>
              <button
                className="text-white text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-colors py-2 px-4 rounded-lg"
                onClick={() => setShowDatePicker(false)}
              >
                Pilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroImage;
