'use client';

import React from 'react';

export default function StatsSection() {
  return (
    <div className="bg-white py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Card 1 */}
          <StatCard number="50+" text="Gunung Terdaftar" />

          {/* Card 2 */}
          <StatCard number="1,234+" text="Pendaki Telah Terdaftar" />
          
          {/* Card 3 */}
          <StatCard number="20+" text="Trip Tersedia" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, text }: { number: string; text: string }) {
  return (
    <div className="text-left bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-2xl w-full h-auto p-6 transition-all duration-500 ease-in-out">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F4068] mb-2">
        {number}
      </div>
      <div className="text-sm sm:text-base font-bold text-[#1F4068]">
        {text}
      </div>
    </div>
  );
}