'use client';

import React from 'react';

export default function StatsSection() {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3">

          {/* Card 1 */}
          <div className="text-left bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-2xl w-full sm:w-80 md:w-96 h-36 px-4 transition-all duration-500 ease-in-out lg:w-[400px] lg:gap-5">
            <div className="text-3xl md:text-4xl lg:text-5xl mx-5 font-bold text-[#1F4068] mt-7">
              50+
            </div>
            <div className="text-sm md:text-base mx-5 font-bold text-[#1F4068] mt-2">
              Gunung Terdaftar
            </div>
          </div>

          {/* Card 2 */}
          <div className="text-left bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-2xl w-full sm:w-80 md:w-96 h-36 px-4 transition-all duration-500 ease-in-out lg:w-[400px] lg:gap-5">
            <div className="text-3xl md:text-4xl lg:text-5xl mx-5 font-bold text-[#1F4068] mt-7">
              1,234+
            </div>
            <div className="text-sm md:text-base mx-5 font-bold text-[#1F4068] mt-2">
              Pendaki Telah Terdaftar
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="text-left bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-2xl w-full sm:w-80 md:w-96 h-36 px-4 transition-all duration-500 ease-in-out lg:w-[400px] lg:gap-5">
            <div className="text-3xl md:text-4xl lg:text-5xl mx-5 font-bold text-[#1F4068] mt-7">
              20+
            </div>
            <div className="text-sm md:text-base mx-5 font-bold text-[#1F4068] mt-2">
              Trip Tersedia
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
