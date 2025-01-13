'use client';

import React from 'react';
import Image from 'next/image';
import bg1 from '@/assets/images/bgWhatwOffer1.png';
import bg2 from '@/assets/images/bgWhatwOffer2.png';
import bg3 from '@/assets/images/bgWhatwOffer3.png';
import bg4 from '@/assets/images/bgWhatwOffer4.png';

export default function WhatwOffer() {
  return (
    <>
      <div className="bg-white mt-48 mb-32 px-4 lg:px-7 max-w-full">
        <div className="container mx-auto max-w-screen-xl">
          <h2 className="text-left font-bold text-[#1F4068] text-3xl sm:text-5xl lg:text-7xl mb-10 max-w-xl mt-10 lg:mt-32">
            Apa yang kami <br /> tawarkan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {/* Card 1 */}
            <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full h-80 lg:h-[24rem] transition-all duration-500 ease-in-out">
              <Image
                src={bg1}
                alt="Paket Pendakian 1"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl"></div>
              <div className="absolute inset-5 py-4 mx-1 text-base sm:text-lg lg:text-2xl xl:text-4xl font-medium text-white">
                Paket <br />
                Pendakian
              </div>
            </div>
            {/* Card 2 */}
            <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full h-80 lg:h-[24rem] transition-all duration-500 ease-in-out">
              <Image
                src={bg2}
                alt="Paket Pendakian 2"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl"></div>
              <div className="absolute inset-5 py-4 mx-1 text-base sm:text-lg lg:text-2xl xl:text-4xl font-medium text-white">
                Pemandu <br />
                Profesional
              </div>
            </div>
            {/* Card 3 */}
            <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full h-80 lg:h-[24rem] transition-all duration-500 ease-in-out">
              <Image
                src={bg3}
                alt="Paket Pendakian 3"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl"></div>
              <div className="absolute inset-5 py-4 mx-1 text-base sm:text-lg lg:text-2xl xl:text-4xl font-medium text-white">
                Update <br />
                Berita Terkini
              </div>
            </div>
            {/* Card 4 */}
            <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full h-80 lg:h-[24rem] transition-all duration-500 ease-in-out">
              <Image
                src={bg4}
                alt="Paket Pendakian 4"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-3xl"></div>
              <div className="absolute inset-5 py-4 mx-1 text-base sm:text-lg lg:text-2xl xl:text-4xl font-medium text-white">
                Pendakian <br />
                Yang Aman
              </div>
            </div>  
          </div>
        </div>
      </div>
    </>
  );
}
