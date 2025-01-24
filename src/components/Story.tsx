'use client'

import React from 'react';
import Image from 'next/image';
import arrow from '@/assets/svgs/Arrow2.svg';
import { Input } from './ui/input';
import profile from '@/assets/images/Profile.png'



function Story(){
  return (
    <>
    <div className='bg-white xl:h-[700px] mb-28 h-[1300px]'>
    <div className="bg-gradient-to-t from-[#D7E9FF] to-[#4A93E8] py-12 rounded-3xl mb-32 mx-5 xl:h-[770px] h-[1400px]">
      <div className="container px-4">
        <div className="flex flex-wrap justify-center gap-3 my-40">
            <div className='absolute -my-28'>
                <p className='absolute -my-14 py-0.5 font-semibold text-md text-center xl:mx-40 mx-[130px] h-8 bg-white rounded-full w-32'>Testimoni</p>
                <h1 className='text-center xl:text-6xl font-bold text-4xl'>Cerita Pendaki</h1>
                <p className='font-normal xl:text-xl xl:tracking-wider tracking-wider text-lg leading-9 text-center mb-6'>Pengalaman Nyata Di Puncak Sulawesi Selatan</p>
            </div>
 
          {/* Card kiri atas */}
          <div className="text-left bg-white rounded-3xl md:w-96 w-72 h-36 mt-7 xl:px-4 px-4 transition-all duration-500 ease-in-out xl:w-80 xl:h-40 xl:-ml-6 lg:w-[400px] xl:-mx-9 lg:gap-5 xl:mt-7">
            <Image alt='profil' src={profile} className='rounded-full xl:w-10 xl:mt-4 xl:ml-1 w-10 mt-4 ml-1'/>
            <h1 className='xl:ml-14 xl:-mt-10 font-semibold xl:text-sm text-lg mx-14 -mt-11'>
              Bang Fiqri
            </h1>
            <h2 className='xl:text-xs text-xs xl:ml-14 mx-14 text-gray-600'>
              @fiqriagustriawan2025
            </h2>
            <p className='font-semibold xl:text-xs xl:ml-12 xl:mt-7 mx-3 mt-4 text-sm'>Wow keren sekali saya jadi lebih <br/> mudah untuk mendaki gunung</p>
            <h1 className='xl:text-5xl font-serif xl:pl-6 xl:-mt-24 mx-56 -mt-24 text-4xl'>''</h1>
          </div>

          {/* Card Tengah atas */}
          <div className="text-left bg-white rounded-3xl w-72 md:w-96 h-52 px-4 transition-all duration-500 ease-in-out xl:w-80 xl:h-48 xl:ml-12 lg:w-[400px] xl:mt-7 xl:mr-1 lg:gap-5">
          <Image alt='profil' src={profile} className='rounded-full w-10 mt-4 ml-1'/>
            <h1 className='xl:ml-14 xl:-mt-10 font-semibold xl:text-sm text-lg mx-14 -mt-11'>
              Akram Ngantuk
            </h1>
            <h2 className='text-xs xl:ml-14 text-gray-600 mx-14'>
              @muhammadakram24
            </h2>
            <p className='font-semibold xl:text-xs xl:ml-7 xl:mt-5 text-sm pt-5 px-2'>Sebagai pemula, saya sangat terkesan <br/> dengan perjalanan ke Gunung Latimojong. Rute yang menantang tapi aman, berkat panduan yang detail dari website ini.</p>
            <h1 className='xl:text-5xl font-serif xl:pl-6 xl:-mt-[140px] mx-56 -mt-40 text-4xl'>''</h1>
          </div>

          {/* Card kanan atas */}
          <div className="text-left bg-white rounded-3xl md:w-96 w-72 h-36 xl:px-4 px-4 transition-all duration-500 ease-in-out xl:w-80 xl:h-40 xl:ml-2 lg:w-[400px] xl:-mx-9 lg:gap-5 xl:mt-7">
          <Image alt='profil' src={profile} className='rounded-full w-10 mt-4 ml-1'/>
            <h1 className='xl:ml-14 xl:-mt-10 font-semibold xl:text-sm text-lg mx-14 -mt-11'>
              Faras Pria Mahal
            </h1>
            <h2 className='xl:text-xs text-xs xl:ml-14 mx-14 text-gray-600'>
              @adisalfarastzees
            </h2>
            <p className='font-semibold xl:text-xs xl:ml-12 xl:mt-7 mx-3 mt-4 text-sm'>Wow keren sekali saya jadi lebih <br/> mudah untuk mendaki gunung</p>
            <h1 className='xl:text-5xl font-serif xl:pl-6 xl:-mt-24 mx-56 -mt-24 text-4xl '>''</h1>
          </div>

          {/* Card Kiri bawah */}
          <div className="text-left bg-white rounded-3xl w-72 md:w-96 h-36 px-4 transition-all duration-500 ease-in-out xl:h-40 xl:w-80 xl:-mt-8 xl:ml-12 lg:w-[400px] xl:-mx-9 lg:gap-5">
          <Image alt='profil' src={profile} className='rounded-full w-10 mt-4 ml-1'/>
            <h1 className='xl:ml-14 xl:-mt-10 font-semibold xl:text-sm text-lg mx-14 -mt-11'>
              Faqih Tailwind
            </h1>
            <h2 className='xl:text-xs text-xs xl:ml-14 mx-14 text-gray-600'>
              @ijsamagilfaqih
            </h2>
            <p className='font-semibold xl:text-xs xl:ml-12 xl:mt-7 mx-3 mt-4 text-sm'>Wow keren sekali saya jadi lebih <br/> mudah untuk mendaki gunung</p>
            <h1 className='xl:text-5xl font-serif xl:pl-6 xl:-mt-24 mx-56 -mt-24 text-4xl'>''</h1>
          </div>

          {/* Card Tengah bawah */}
          <div className="text-left bg-white rounded-3xl w-72 h-52 md:w-96 transition-all duration-500 ease-in-out xl:w-80 xl:ml-12 xl:h-48 xl:mt-1 xl:-mr-9 lg:w-[400px] lg:gap-5">
          <Image alt='profil' src={profile} className='rounded-full w-10 mt-4 ml-5'/>
            <h1 className='xl:ml-[71px] xl:-mt-10 font-semibold xl:text-sm text-lg mx-[70px] -mt-11'>
              Daniel
            </h1>
            <h2 className='text-xs xl:ml-[1px] xl:mx-24 px-[70px] text-gray-600'>
              @danielcaturrangga
            </h2>
            <p className='font-semibold xl:text-xs xl:ml-10 xl:mt-5 text-sm pt-5 px-6'>Sebagai pemula, saya sangat terkesan <br/> dengan perjalanan ke Gunung Latimojong. Rute yang menantang tapi aman, berkat panduan yang  detail dari website ini.</p>
            <h1 className='xl:text-5xl font-serif xl:pl-6 xl:-mt-[155px] mx-60 -mt-40 text-4xl'>''</h1>
          </div>

          {/* Card kanan bawah */}
          <div className="text-left bg-white rounded-3xl w-72 md:w-96 h-36 px-4 transition-all duration-500 ease-in-out xl:w-80 xl:h-40 xl:-mt-8 xl:ml-12 xl:mr-9 lg:w-[400px] lg:gap-5">
          <Image alt='profil' src={profile} className='rounded-full w-10 mt-4 ml-1'/>
            <h1 className='xl:ml-14 xl:-mt-10 font-semibold xl:text-sm text-lg mx-14 -mt-11'>
              fadlul siganteng
            </h1>
            <h2 className='text-xs text-gray-600 px-14'>
              @fadlulhasan2025
            </h2>
            <p className='font-semibold xl:text-xs xl:ml-12 xl:mt-7 mx-3 mt-4 text-sm'>Wow keren sekali saya jadi lebih <br/> mudah untuk mendaki gunung</p>
            <h1 className='xl:text-5xl font-serif xl:pl-6 xl:-mt-24 mx-56 -mt-24 text-4xl'>''</h1>
          </div>
          <form className='xl:mt-9 xl:w-[460px] xl:-ml-24 mt-[25px] -ml-16 w-[245px]'>
            <Input placeholder='Berikan Pendapatmu Tentang Kami' className='rounded-full pl-5 '></Input>
          </form>
          <button className='bg-gradient-to-t from-[#9CCAFF] to-[#4A90E2] absolute flex items-center justify-center w-14 h-[38px] mt-[1118px] text-white rounded-full hover:from-[#00E6FF] hover:to-[#007AFF] hover:translate-x-1 duration-500 xl:ml-[450px] xl:mt-[477px] ml-64'>
          <Image src={arrow} alt='arrow' className='w-14 h-9 p-3 rounded-full hover:translate-x-1 duration-300'/>
          </button>
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

export default Story
