'use client';

import React from 'react';
import Image from 'next/image';
import BuluBaria from '@/assets/images/BuluBaria.png'

export default function News2() {
  return (
    <div className="bg-white py-12 mx-12">
      <div className="container ">
        <div className="gap-4">
          <h2 className='font-bold text-[#1F4068] text-6xl mb-14 max-w-md '>Berita <br /> Terbaru</h2>

          {/* Card 1 */}
          <div className='grid grid-cols-5 gap-52'>
          <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[250px] h-[170px] transition-all duration-500 ease-in-out mb-7">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl "></div>
              <h1 className='absolute mt-44 font-bold text-lg'>Lorem ipsum odor amet, consectetuer adipiscing elit.</h1>
              <div className='flex'>
                  <h2 className='absolute mt-60 font-medium text-sm text-[#EE2424]'>Bulu Baria</h2>
                  <h2 className='ml-20 absolute mt-60 font-medium text-sm text-[#5F6678]'> | </h2>
                  <h2 className='ml-20 absolute mt-60 font-medium text-sm px-5 py-[2px] text-[#5F6678]'>  14 Jam yang lalu</h2>
                </div>
              </div>
              {/* Card 2 */}
          <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[250px] h-[170px] transition-all duration-500 ease-in-out mb-7">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl "></div>
              <h1 className='absolute mt-44 font-bold text-lg'>Lorem ipsum odor amet, consectetuer adipiscing elit.</h1>
              <div className='flex'>
                  <h2 className='absolute mt-60 font-medium text-sm text-[#EE2424]'>Bulu Baria</h2>
                  <h2 className='ml-20 absolute mt-60 font-medium text-sm text-[#5F6678]'> | </h2>
                  <h2 className='ml-20 absolute mt-60 font-medium text-sm px-5 py-[2px] text-[#5F6678]'>  14 Jam yang lalu</h2>
                </div>
              </div>
              {/* Card 3 */}
          <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[250px] h-[170px] transition-all duration-500 ease-in-out mb-7">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl "></div>
              <h1 className='absolute mt-44 font-bold text-lg'>Lorem ipsum odor amet, consectetuer adipiscing elit.</h1>
              <div className='flex'>
                  <h2 className='absolute mt-60 font-medium text-sm text-[#EE2424]'>Bulu Baria</h2>
                  <h2 className='ml-20 absolute mt-60 font-medium text-sm text-[#5F6678]'> | </h2>
                  <h2 className='ml-20 absolute mt-60 font-medium text-sm px-5 py-[2px] text-[#5F6678]'>  14 Jam yang lalu</h2>
                </div>
              </div>
              {/* Card 4 */}
          <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[250px] h-[170px] transition-all duration-500 ease-in-out mb-7">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                fill
                className="rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl "></div>
              <h1 className='absolute mt-44 font-bold text-lg'>Lorem ipsum odor amet, consectetuer adipiscing elit.</h1>
              <div className='flex'>
                  <h2 className='absolute mt-60 font-medium text-sm text-[#EE2424]'>Bulu Baria</h2>
                  <h2 className='ml-20 absolute mt-60 font-medium text-sm text-[#5F6678]'> | </h2>
                  <h2 className='ml-20 absolute mt-60 font-medium text-sm px-5 py-[2px] text-[#5F6678]'>  14 Jam yang lalu</h2>
                </div>
              </div>

          </div>
            </div>
        </div>
      </div>
  );
}
