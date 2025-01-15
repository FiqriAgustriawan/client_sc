'use client';

import React from 'react';
import Image from 'next/image';
import BuluBaria from '@/assets/images/BuluBaria.png'
import arrow from '@/assets/svgs/Arrow.svg'

export default function ExploreMount() {
  return (
    <div className="bg-white py-12 mx-12">
      <div className="container mx-auto ">
        <div className="gap-4 ">
          <h2 className='font-bold text-[#1F4068] text-5xl mb-14 max-w-md '>Jelajahi <br /> Gunung Favorit</h2>

          {/* Card 1 */}
          <div className='grid grid-cols-2'>
            <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[540px] h-[284px] transition-all duration-500 ease-in-out mb-5">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
              <div>
                <div className="absolute inset-5 mx-2 text-[51px] font-semibold text-white">
                  Bulu Baria
                  <h2 className='text-white text-lg -mt-2 max-w-md '>2750 MDPL</h2>
                  <div className='grid grid-cols-2'>
                    <h2 className='text-[20px] font-normal mt-28'>3 Trip Available</h2>
                    <button className='w-[155px] bg-white h-[50px] text-xl my-3 mx-20 mt-24 flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group'>
                      <span className='z-10 transition-colors duration-500 text-black group-hover:text-white'>Lihat</span>
                      <Image
                        src={arrow}
                        alt='arrow'
                        width={50}
                        height={50}
                        className='mx-4 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert'
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[540px] h-[284px] transition-all duration-500 ease-in-out mb-5 -ml-6">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
              <div>
                <div className="absolute inset-5 mx-2 text-[51px] font-semibold text-white">
                  Bulu Baria
                  <h2 className='text-white text-lg -mt-2 max-w-md '>2750 MDPL</h2>
                  <div className='grid grid-cols-2'>
                    <h2 className='text-[20px] font-normal mt-28'>3 Trip Available</h2>
                    <button className='w-[155px] bg-white h-[50px] text-xl my-3 mx-20 mt-24 flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group'>
                      <span className='z-10 transition-colors duration-500 text-black group-hover:text-white'>Lihat</span>
                      <Image
                        src={arrow}
                        alt='arrow'
                        width={50}
                        height={50}
                        className='mx-4 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert'
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[540px] h-[284px] transition-all duration-500 ease-in-out mb-5">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
              <div>
                <div className="absolute inset-5 mx-2 text-[51px] font-semibold text-white">
                  Bulu Baria
                  <h2 className='text-white text-lg -mt-2 max-w-md '>2750 MDPL</h2>
                  <div className='grid grid-cols-2'>
                    <h2 className='text-[20px] font-normal mt-28'>3 Trip Available</h2>
                    <button className='w-[155px] bg-white h-[50px] text-xl my-3 mx-20 mt-24 flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group'>
                      <span className='z-10 transition-colors duration-500 text-black group-hover:text-white'>Lihat</span>
                      <Image
                        src={arrow}
                        alt='arrow'
                        width={50}
                        height={50}
                        className='mx-4 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert'
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[540px] h-[284px] transition-all duration-500 ease-in-out mb-5 -ml-6">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
              <div>
                <div className="absolute inset-5 mx-2 text-[51px] font-semibold text-white">
                  Bulu Baria
                  <h2 className='text-white text-lg -mt-2 max-w-md '>2750 MDPL</h2>
                  <div className='grid grid-cols-2'>
                    <h2 className='text-[20px] font-normal mt-28'>3 Trip Available</h2>
                    <button className='w-[155px] bg-white h-[50px] text-xl my-3 mx-20 mt-24 flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group'>
                      <span className='z-10 transition-colors duration-500 text-black group-hover:text-white'>Lihat</span>
                      <Image
                        src={arrow}
                        alt='arrow'
                        width={50}
                        height={50}
                        className='mx-4 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert'
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
