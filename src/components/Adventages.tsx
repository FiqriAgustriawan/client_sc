'use client'

import React from 'react';
import LogoInformasi from '@/assets/svgs/LogoInformasi.svg';
import LogoTampilan from '@/assets/svgs/LogoTampilan.svg';
import LogoBanyaktrip from '@/assets/svgs/LogoBanyaktrip.svg';
import LogoPemesanan from '@/assets/svgs/LogoPemesanan.svg';
import GarisKhatulistiwa from '@/assets/svgs/GarisKhatulistiwa.svg';
import Image from 'next/image';

function Advantages() {
  return (
    <>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center text-center mt-36">
            <h4 className="font-bold leading-10 text-primary text-4xl md:text-5xl mb-16 text-[#1F4068]">
              Keunggulan<br />Kami
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1 */}
              <div className="relative backdrop-blur-md w-full h-36 rounded-3xl">
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <Image src={LogoInformasi} alt="Logo" width={39} height={39} />
                  <h2 className="text-base md:text-xl font-semibold leading-5 text-black mt-4">
                    Informasi Gunung<br />Lengkap
                  </h2>
                </div>
                <div className="text-center bg-[#AED0F8] opacity-30 rounded-3xl w-60 h-36 mx-auto hover:bg-[#6EAFFB] -z-50 transition-all duration-500 ease-in-out">
                </div>
              </div>
              {/* Card 2 */}
              <div className="relative backdrop-blur-md w-full sm:w-60 h-36 rounded-3xl">
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <Image src={LogoTampilan} alt="Logo" width={39} height={39} />
                  <h2 className="text-base md:text-xl font-semibold leading-5 text-black mt-4">
                    Tampilan<br />Menarik
                  </h2>
                </div>
                <div className="text-center bg-[#AED0F8] opacity-30 rounded-3xl w-full sm:w-60 h-36 mx-auto hover:bg-[#6EAFFB] -z-50 transition-all duration-500 ease-in-out"></div>
              </div>
              {/* Card 3 */}
              <div className="relative backdrop-blur-md w-full sm:w-60 h-36 rounded-3xl">
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <Image src={LogoBanyaktrip} alt="Logo" width={35} height={35} />
                  <h2 className="text-base md:text-xl font-semibold leading-5 text-black mt-4">
                    Banyak Trip<br />Tersedia
                  </h2>
                </div>
                <div className="text-center bg-[#AED0F8] opacity-30 rounded-3xl w-full sm:w-60 h-36 mx-auto hover:bg-[#6EAFFB] -z-50 transition-all duration-500 ease-in-out"></div>
              </div>
              {/* Card 4 */}
              <div className="relative backdrop-blur-md w-full sm:w-60 h-36 rounded-3xl">
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <Image src={LogoPemesanan} alt="Logo" width={37} height={37} />
                  <h2 className="text-base md:text-xl font-semibold leading-5 text-black mt-4">
                    Pemesanan Trip<br />Mudah
                  </h2>
                </div>
                <div className="text-center bg-[#AED0F8] opacity-30 rounded-3xl w-full sm:w-60 h-36 mx-auto hover:bg-[#6EAFFB] -z-50 transition-all duration-500 ease-in-out"></div>
              </div>
            </div>
            <Image
              src={GarisKhatulistiwa}
              alt="garis"
              className="absolute -z-50 mt-52 max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Advantages;
