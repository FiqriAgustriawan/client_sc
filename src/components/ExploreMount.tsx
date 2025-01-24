'use client';

import React from 'react';
import Image from 'next/image';
import BuluBaria from '@/assets/images/BuluBaria.png';
import arrow from '@/assets/svgs/Arrow.svg';
import Link from 'next/link';

export default function ExploreMount() {
  return (
    <div className="bg-white py-12 px-4 md:px-12">
      <div className="container mx-auto">
        <div className="text-center md:text-left">
          <h2 className="font-bold text-[#1F4068] text-3xl md:text-5xl xl:mt-7 xl:-mb-6 md:mb-14 max-w-full md:max-w-md text-start">
            Jelajahi Gunung  <br /> Favorit
          </h2>
          <h1 className='absolute text-sm md:text-xl max-w-full xl:-mt-[60px] xl:ml-[830px] text-[#58759A] text-end mt-2 px-2 hidden xl:block'>Pilih destinasi impianmu dan mulailah <br/> petualangan tak terlupakan</h1>
        </div>
          <Link href={'/'} className='flex xl:justify-end xl:pb-5 text-base text-[#4A90E2] ml-64 xl:pt-3 mt-[20px]'>Lihat Semua</Link>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 ">
          {/* Card 1 */}
          <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full h-[300px] sm:h-[320px] transition-all duration-500 ease-in-out">
            <Image
              src={BuluBaria}
              alt="Bulu Baria"
              fill
              className="rounded-3xl object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
            <div className="absolute inset-5 text-white">
              <h2 className="text-2xl sm:text-3xl font-semibold">Bulu Baria</h2>
              <p className="text-sm sm:text-base mt-1">2750 MDPL</p>
              <div className="grid grid-cols-2 mt-16">
                <p className="text-base sm:text-lg font-normal my-[110px]">3 Trip Available</p>
                <button className="w-[140px] sm:w-[155px] bg-white h-[45px] sm:h-[50px] text-base sm:text-xl flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group mt-24 mx-5 xl xl:mx-24 xl:mx-">
                  <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                    Lihat
                  </span>
                  <Image
                    src={arrow}
                    alt="arrow"
                    width={30}
                    height={30}
                    className="ml-3 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full h-[300px] sm:h-[320px] transition-all duration-500 ease-in-out">
            <Image
              src={BuluBaria}
              alt="Bulu Baria"
              fill
              className="rounded-3xl object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
            <div className="absolute inset-5 text-white">
              <h2 className="text-2xl sm:text-3xl font-semibold">Bulu Baria</h2>
              <p className="text-sm sm:text-base mt-1">2750 MDPL</p>
              <div className="grid grid-cols-2 mt-16">
                <p className="text-base sm:text-lg font-normal my-[110px]">3 Trip Available</p>
                <button className="w-[140px] sm:w-[155px] bg-white h-[45px] sm:h-[50px] text-base sm:text-xl flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group mt-24 mx-5 xl:mx-24" >
                  <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                    Lihat
                  </span>
                  <Image
                    src={arrow}
                    alt="arrow"
                    width={30}
                    height={30}
                    className="ml-3 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full h-[300px] sm:h-[320px] transition-all duration-500 ease-in-out">
            <Image
              src={BuluBaria}
              alt="Bulu Baria"
              fill
              className="rounded-3xl object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
            <div className="absolute inset-5 text-white">
              <h2 className="text-2xl sm:text-3xl font-semibold">Bulu Baria</h2>
              <p className="text-sm sm:text-base mt-1">2750 MDPL</p>
              <div className="grid grid-cols-2 mt-16">
                <p className="text-base sm:text-lg font-normal my-[110px]">3 Trip Available</p>
                <button className="w-[140px] sm:w-[155px] bg-white h-[45px] sm:h-[50px] text-base sm:text-xl flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group mt-24 mx-5 xl:mx-24">
                  <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                    Lihat
                  </span>
                  <Image
                    src={arrow}
                    alt="arrow"
                    width={30}
                    height={30}
                    className="ml-3 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full h-[300px] sm:h-[320px] transition-all duration-500 ease-in-out">
            <Image
              src={BuluBaria}
              alt="Bulu Baria"
              fill
              className="rounded-3xl object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
            <div className="absolute inset-5 text-white">
              <h2 className="text-2xl sm:text-3xl font-semibold">Bulu Baria</h2>
              <p className="text-sm sm:text-base mt-1">2750 MDPL</p>
              <div className="grid grid-cols-2 mt-16">
                <p className="text-base sm:text-lg font-normal my-[110px]">3 Trip Available</p>
                <button className="w-[140px] sm:w-[155px] bg-white h-[45px] sm:h-[50px] text-base sm:text-xl flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group mt-24 mx-5 xl:mx-24">
                  <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                    Lihat
                  </span>
                  <Image
                    src={arrow}
                    alt="arrow"
                    width={30}
                    height={30}
                    className="ml-3 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}