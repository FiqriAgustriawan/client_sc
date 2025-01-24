'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FotoNws from '@/assets/images/FotoBerita.png';

export default function News2() {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className='bg-white mb-14'>
          <div className="py-20 mx-12">
            <div className="container w-full">
              <div className="gap-4 w-full">
                <h2 className='font-bold text-[#1F4068] text-6xl xl:-mt-16 mb-20 max-w-xl xl:mb-28'>Berita <br /> Terbaru</h2>
              
                {/* Cards Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 xl:gap-0.5 xl:-mt-20 xl:mx-5'>
      
                  {/* card 2 */}
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full sm:w-[150px] md:w-[180px] xl:w-[250px] h-[140px] sm:h-[160px] md:h-[180px] xl:h-[170px] transition-all duration-500 ease-in-out mb-7 xl:-ml-4">
                    <Image
                      src={FotoNws}
                      alt="Bulu Baria"
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                    <div className='flex gap-5 xl:-mt-2 w-full xl:-ml-3'>
                    <h1 className='absolute xl:mt-[185px] mt-20 xl:font-bold font-medium text-lg xl:text-md xl:leading-2 mx-4 text-start w-52 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
                      <h2 className='absolute xl:mt-[260px] font-medium text-sm mt-[80px] w-full text-[#EE2424] ml-4'>Bulu Baria</h2>
                      <h2 className='xl:ml-4 absolute xl:mt-[260px] font-medium xl:px-[70px] text-sm xl:block hidden text-[#5F6678]'> | </h2>
                      <h2 className=' xl:ml-[98px] absolute xl:mt-[259px] font-medium text-sm  py-24 w-full  xl:py-[2px] text-[#5F6678]'>14 Jam yang lalu</h2>
                    </div>
                  </div>
                  {/* card 2 */}
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full sm:w-[150px] md:w-[180px] xl:w-[250px] h-[140px] sm:h-[160px] md:h-[180px] xl:h-[170px] transition-all duration-500 ease-in-out mb-7 xl:-ml-4">
                    <Image
                      src={FotoNws}
                      alt="Bulu Baria"
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                    <div className='flex gap-5 xl:-mt-2 w-full xl:-ml-3'>
                    <h1 className='absolute xl:mt-[185px] mt-20 xl:font-bold font-medium text-lg xl:text-md xl:leading-2 mx-4 text-start w-52 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
                      <h2 className='absolute xl:mt-[260px] font-medium text-sm mt-[80px] w-full text-[#EE2424] ml-4'>Bulu Baria</h2>
                      <h2 className='xl:ml-4 absolute xl:mt-[260px] font-medium xl:px-[70px] text-sm xl:block hidden text-[#5F6678]'> | </h2>
                      <h2 className=' xl:ml-[98px] absolute xl:mt-[259px] font-medium text-sm  py-24 w-full  xl:py-[2px] text-[#5F6678]'>14 Jam yang lalu</h2>
                    </div>
                  </div>
                  {/* card 2 */}
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full sm:w-[150px] md:w-[180px] xl:w-[250px] h-[140px] sm:h-[160px] md:h-[180px] xl:h-[170px] transition-all duration-500 ease-in-out mb-7 xl:-ml-4">
                    <Image
                      src={FotoNws}
                      alt="Bulu Baria"
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                    <div className='flex gap-5 xl:-mt-2 w-full xl:-ml-3'>
                    <h1 className='absolute xl:mt-[185px] mt-20 xl:font-bold font-medium text-lg xl:text-md xl:leading-2 mx-4 text-start w-52 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
                      <h2 className='absolute xl:mt-[260px] font-medium text-sm mt-[80px] w-full text-[#EE2424] ml-4'>Bulu Baria</h2>
                      <h2 className='xl:ml-4 absolute xl:mt-[260px] font-medium xl:px-[70px] text-sm xl:block hidden text-[#5F6678]'> | </h2>
                      <h2 className=' xl:ml-[98px] absolute xl:mt-[259px] font-medium text-sm  py-24 w-full  xl:py-[2px] text-[#5F6678]'>14 Jam yang lalu</h2>
                    </div>
                  </div>
                  {/* card 2 */}
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-full sm:w-[150px] md:w-[180px] xl:w-[250px] h-[140px] sm:h-[160px] md:h-[180px] xl:h-[170px] transition-all duration-500 ease-in-out mb-7 xl:-ml-4">
                    <Image
                      src={FotoNws}
                      alt="Bulu Baria"
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                    <div className='flex gap-5 xl:-mt-2 w-full xl:-ml-3'>
                    <h1 className='absolute xl:mt-[185px] mt-20 xl:font-bold font-medium text-lg xl:text-md xl:leading-2 mx-4 text-start w-52 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
                      <h2 className='absolute xl:mt-[260px] font-medium text-sm mt-[80px] w-full text-[#EE2424] ml-4'>Bulu Baria</h2>
                      <h2 className='xl:ml-4 absolute xl:mt-[260px] font-medium xl:px-[70px] text-sm xl:block hidden text-[#5F6678]'> | </h2>
                      <h2 className=' xl:ml-[98px] absolute xl:mt-[259px] font-medium text-sm  py-24 w-full  xl:py-[2px] text-[#5F6678]'>14 Jam yang lalu</h2>
                    </div>
                  </div>

                  {/* Repeat Card 2, Card 3, and Card 4 as needed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden md:block sm:block">
        <div className='bg-white mb-14'>
          <div className="py-20 mx-12">
            <div className="container">
              <div className="gap-4">
                <h2 className='font-bold text-[#1F4068] text-6xl mb-20 max-w-xl -ml-8'>Berita <br /> Terbaru</h2>
                <Link href={'/'} className='xl:justify-end xl:pb-5 xl:-mt-20 text-md text-[#4A90E2] xl:block hidden'>Lihat Semua</Link>

                {/* Cards Grid for Mobile */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 -ml-5 w-full">
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl xl:w-[250px] xl:h-[170px] w-[120px] h-[120px] transition-all duration-500 ease-in-out">
                    <Image
                      src={FotoNws}
                      alt="Bulu Baria"
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                    <h1 className='absolute xl:mt-44 xl:font-bold font-medium text-lg xl:leading-6 mx-36 text-start w-52 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
                    <div className='flex xl:-mt-2 w-full'>
                      <h2 className='absolute xl:mt-60 font-medium text-sm mt-[80px] w-full text-[#EE2424] ml-36'>Bulu Baria</h2>
                      <h2 className='xl:ml-20 absolute xl:mt-60 font-medium w-full text-sm xl:block hidden text-[#5F6678]'> | </h2>
                      <h2 className='xl:ml-20 absolute xl:mt-60 font-medium text-sm xl:px-5 py-24 w-full ml-36 xl:py-[2px] text-[#5F6678]'>  14 Jam yang lalu</h2>
                    </div>
                  </div>

                  {/* card 2 */}
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl xl:w-[250px] xl:h-[170px] w-[120px] h-[120px] transition-all duration-500 ease-in-out">
                    <Image
                      src={FotoNws}
                      alt="Bulu Baria"
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                    <h1 className='absolute xl:mt-44 xl:font-bold font-medium text-lg xl:leading-6 mx-36 text-start w-52 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
                    <div className='flex xl:-mt-2 w-full'>
                      <h2 className='absolute xl:mt-60 font-medium text-sm mt-[80px] w-full text-[#EE2424] ml-36'>Bulu Baria</h2>
                      <h2 className='xl:ml-20 absolute xl:mt-60 font-medium w-full text-sm xl:block hidden text-[#5F6678]'> | </h2>
                      <h2 className='xl:ml-20 absolute xl:mt-60 font-medium text-sm xl:px-5 py-24 w-full ml-36 xl:py-[2px] text-[#5F6678]'>  14 Jam yang lalu</h2>
                    </div>
                  </div>
                  {/* card 3 */}
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl xl:w-[250px] xl:h-[170px] w-[120px] h-[120px] transition-all duration-500 ease-in-out">
                    <Image
                      src={FotoNws}
                      alt="Bulu Baria"
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                    <h1 className='absolute xl:mt-44 xl:font-bold font-medium text-lg xl:leading-6 mx-36 text-start w-52 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
                    <div className='flex xl:-mt-2 w-full'>
                      <h2 className='absolute xl:mt-60 font-medium text-sm mt-[80px] w-full text-[#EE2424] ml-36'>Bulu Baria</h2>
                      <h2 className='xl:ml-20 absolute xl:mt-60 font-medium w-full text-sm xl:block hidden text-[#5F6678]'> | </h2>
                      <h2 className='xl:ml-20 absolute xl:mt-60 font-medium text-sm xl:px-5 py-24 w-full ml-36 xl:py-[2px] text-[#5F6678]'>  14 Jam yang lalu</h2>
                    </div>
                  </div>
                  {/* card 4 */}
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl xl:w-[250px] xl:h-[170px] w-[120px] h-[120px] transition-all duration-500 ease-in-out ">
                    <Image
                      src={FotoNws}
                      alt="Bulu Baria"
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
                    <h1 className='absolute xl:mt-44 xl:font-bold font-medium text-lg xl:leading-6 mx-36 text-start w-52 leading-6'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
                    <div className='flex xl:-mt-2 w-full'>
                      <h2 className='absolute xl:mt-60 font-medium text-sm mt-[80px] w-full text-[#EE2424] ml-36'>Bulu Baria</h2>
                      <h2 className='xl:ml-20 absolute xl:mt-60 font-medium w-full text-sm xl:block hidden text-[#5F6678]'> | </h2>
                      <h2 className='xl:ml-20 absolute xl:mt-60 font-medium text-sm xl:px-5 py-24 w-full ml-36 xl:py-[2px] text-[#5F6678]'>  14 Jam yang lalu</h2>
                    </div>
                  </div>
                </div>

                {/* Repeat more cards for mobile as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}