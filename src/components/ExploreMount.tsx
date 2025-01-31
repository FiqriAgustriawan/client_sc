'use client';

import React from 'react';
import Image from 'next/image';
import arrow from '@/assets/svgs/Arrow.svg';
import dataGunung from '@/data/dataGunungDummy.json';
import { LikeButton } from './Card/tombolLike';
export default function ExploreMount() {
  return (
    <div className="bg-white py-12 px-4 sm:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="gap-4">
          <h2 className="font-bold text-[#1F4068] text-3xl sm:text-4xl lg:text-5xl mb-8 max-w-md">
            Jelajahi <br /> Gunung Favorit
          </h2>

          {/* Desktop and Tablet Layout */}
          <div className="hidden md:block">
            {/* First Row */}
            <div className="overflow-x-auto scrollbar-hidden mb-8" style={{ scrollBehavior: 'smooth' }}>
              <div className="flex space-x-6">
                {dataGunung.slice(0, 4).map((gunung) => (
                  <div
                    key={gunung.id}
                    className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl flex-shrink-0 w-[550px] h-[290px] transition-all duration-500 ease-in-out"
                  >
                    <Image
                      src={gunung.gambar}
                      alt={gunung.nama_gunung}
                      width={500}
                      height={300}
                      className="rounded-3xl w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl"></div>
                    <div>
                      <div className="absolute inset-5 mx-2 text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-white">
                        {gunung.nama_gunung}
                        <h2 className="text-white text-sm sm:text-base md:text-lg -mt-2 max-w-md">
                          {gunung.ketinggian}
                        </h2>
                        <div className="grid grid-cols-2">
                          <h2 className="text-[14px] sm:text-[16px] md:text-[18px] font-normal mt-36">
                            {gunung.trip_tersedia}
                          </h2>
                          <button
                            className="gap-2 w-[120px] sm:w-[140px] md:w-[160px] bg-white h-[40px] sm:h-[50px] md:h-[60px] text-sm sm:text-base md:text-xl mx-20 mt-28 flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group"
                          >
                            <span className="z-10 transition-colors duration-300 font-normal text-black group-hover:text-white">
                              Lihat
                            </span>
                            <Image
                              src={arrow}
                              alt="arrow"
                              width={50}
                              height={24}
                              className="ml-2 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Row */}
            <div className="overflow-x-auto scrollbar-hidden" style={{ scrollBehavior: 'smooth' }}>
              <div className="flex space-x-6">
                {dataGunung.slice(4, 8).map((gunung) => (
                  <div
                    key={gunung.id}
                    className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl flex-shrink-0 w-[550px] h-[290px] transition-all duration-500 ease-in-out"
                  >
                    <Image
                      src={gunung.gambar}
                      alt={gunung.nama_gunung}
                      width={500}
                      height={300}
                      className="rounded-3xl w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl"></div>
                    <div>
                      <div className="absolute inset-5 mx-2 text-[24px] sm:text-[28px] md:text-[32px] font-semibold text-white">
                        {gunung.nama_gunung}
                        <h2 className="text-white text-sm sm:text-base md:text-lg -mt-2 max-w-md">
                          {gunung.ketinggian}
                        </h2>
                        <div className="grid grid-cols-2">
                          <h2 className="text-[14px] sm:text-[16px] md:text-[18px] font-normal mt-36">
                            {gunung.trip_tersedia}
                          </h2>
                          <button
                            className="gap-2 w-[120px] sm:w-[140px] md:w-[160px] bg-white h-[40px] sm:h-[50px] md:h-[60px] text-sm sm:text-base md:text-xl mx-20 mt-28 flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group"
                          >
                            <span className="z-10 transition-colors duration-300 font-normal text-black group-hover:text-white">
                              Lihat
                            </span>
                            <Image
                              src={arrow}
                              alt="arrow"
                              width={50}
                              height={24}
                              className="ml-2 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="overflow-x-auto scrollbar-hidden" style={{ scrollBehavior: 'smooth' }}>
              <div className="flex space-x-6">
                {dataGunung.map((gunung) => (
                  <div
                    key={gunung.id}
                    className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl flex-shrink-0 w-[90%] h-[400px] transition-all duration-500 ease-in-out"
                  >
                    {/* Image */}
                    <Image
                      src={gunung.gambar}
                      alt={gunung.nama_gunung}
                      width={500}
                      height={300}
                      className="rounded-3xl w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl"></div>

                    {/* Trip Tersedia (Top-Left Corner) */}
                    <div className="absolute top-5   bg-opacity-80 px-4 py-2 rounded-lg">
                      <h2 className="text-white text-md font-normal">{gunung.trip_tersedia}</h2>
                    </div>

                    {/* Card Content */}
                    <div className="absolute bottom-7 left-5 right-5 text-white">
                     
                        <LikeButton />
                     
                      {/* Ketinggian */}
                      <h2 className="text-sm sm:text-base  font-normal ">{gunung.ketinggian}</h2>
                      {/* Gunung Name */}
                      <h2 className="text-[25px] sm:text-[24px] font-medium">{gunung.nama_gunung}</h2>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}