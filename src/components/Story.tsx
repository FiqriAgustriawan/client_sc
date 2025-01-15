'use client'

import React from "react";
import Image from "next/image";
import Fp from '@/assets/images/Profile.png';
import arrowwhite from '@/assets/svgs/Arrow2.svg'


const Story = () => {
  return (
    <div className="mx-auto px-4 pt-[100px]">
    <div
      className="min-h-screen bg-gradient-to-b from-[#4A93E8] to-[#CCE3FF] rounded-[60px] px-4 py-16 mb-32"
      style={{ height: "125vh" }}
    >
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
    </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto leading-tight text-center mb-32 py-14 text-slate-900">
          Cerita Pendaki
        <p className="relative text-base md:text-lg lg:text-2xl font-normal max-w-4xl mx-auto leading-tight text-center mb-10 text-slate-800">
          Pengalaman Nyata Di Puncak Sulawesi Selatan
        </p>
        </h1>
        <div className="bg-white rounded-full w-32 h-9 -mt-[400px] mx-[530px]">
        <h1 className="text-center py-1 font-semibold">Testimoni</h1>

        {/* card 1 */}
        <div className="grid grid-cols-2 gap-80 mt-20">
          <div className="-mt-20 ml-4">
          <div className="bg-white rounded-3xl w-72 h-36 mt-48 -m-[405px]">
            <div className="px-4 py-4 h-3">
            <Image src={Fp} alt="profile" className="rounded-full w-10 h-10">
            </Image>
            </div>
            <div className="py-12">
              <h1 className="px-16 mx-1 -my-16 font-semibold text-md">Fiqri Cool</h1>
              <h1 className="px-16 mx-1 pt-[62px]  font-normal text-xs">@bangfiqriii_</h1>
            </div>
            <div>
              <h1 className="font-bold text-4xl font-serif px-60 -my-28">''</h1>
            </div>
            <p className="text-xs font-medium px-16 py-32">Wow keren sekali saya jadi lebih mudah untuk mendaki gunung.</p>
          </div>
          {/* card 2 */}
          <div className="bg-white rounded-3xl w-72 h-36 mt-[420px] -m-[405px]">
            <div className="px-4 py-4 h-3">
            <Image src={Fp} alt="profile" className="rounded-full w-10 h-10">
            </Image>
            </div>
            <div className="py-12">
              <h1 className="px-16 mx-1 -my-16 font-semibold text-md">Akram Cuek</h1>
              <h1 className="px-16 mx-1 pt-[62px]  font-normal text-xs">@mister_arm_01</h1>
            </div>
            <div>
              <h1 className="font-bold text-4xl font-serif px-60 -my-28">''</h1>
            </div>
            <p className="text-xs font-medium px-16 py-32">Wow keren sekali saya jadi lebih mudah untuk mendaki gunung.</p>
          </div>
          </div>
          {/* card 3 */}
          <div className="-mt-[307px]">
          <div className="bg-white rounded-3xl w-72 h-44 mt-[420px] -m-[405px]">
            <div className="px-4 py-4 h-3">
            <Image src={Fp} alt="profile" className="rounded-full w-10 h-10">
            </Image>
            </div>
            <div className="py-12">
              <h1 className="px-16 mx-1 -my-16 font-semibold text-md">Fadlul Si Ganteng</h1>
              <h1 className="px-16 mx-1 pt-[62px]  font-normal text-xs">@fadlulhasan2025_</h1>
            </div>
            <div>
              <h1 className="font-bold text-4xl font-serif px-60 -my-28">''</h1>
            </div>
            <p className="text-xs font-medium px-10 py-32">Sebagai pemula, saya sangat terkesan dengan perjalanan ke Gunung Latimojong. Rute yang menantang tapi aman, berkat panduan yang detail dari website ini.</p>
          </div>
          {/* card 4 */}
          <div className="bg-white rounded-3xl w-72 h-44 mt-[420px] -m-[405px]">
            <div className="px-4 py-4 h-3">
            <Image src={Fp} alt="profile" className="rounded-full w-10 h-10">
            </Image>
            </div>
            <div className="py-12">
              <h1 className="px-16 mx-1 -my-16 font-semibold text-md">Daniel</h1>
              <h1 className="px-16 mx-1 pt-[62px]  font-normal text-xs">@danielcaturrangga_</h1>
            </div>
            <div>
              <h1 className="font-bold text-4xl font-serif px-60 -my-28">''</h1>
            </div>
            <p className="text-xs font-medium px-10 py-32">Sebagai pemula, saya sangat terkesan dengan perjalanan ke Gunung Latimojong. Rute yang menantang tapi aman, berkat panduan yang detail dari website ini.</p>
          </div>
          </div>
          {/* card 5 */}
          <div>
            
          </div>
          <div className="-mt-[472px] ml-[305px]">
          <div className="bg-white rounded-3xl w-72 h-36 mt-48 -m-[405px]">
            <div className="px-4 py-4 h-3">
            <Image src={Fp} alt="profile" className="rounded-full w-10 h-10">
            </Image>
            </div>
            <div className="py-12">
              <h1 className="px-16 mx-1 -my-16 font-semibold text-md">Faras Pria Mahal</h1>
              <h1 className="px-16 mx-1 pt-[62px]  font-normal text-xs">@adslfarass_</h1>
            </div>
            <div>
              <h1 className="font-bold text-4xl font-serif px-60 -my-28">''</h1>
            </div>
            <p className="text-xs font-medium px-16 py-32">Wow keren sekali saya jadi lebih mudah untuk mendaki gunung.</p>
          </div>
          {/* card 6 */}
          <div className="bg-white rounded-3xl w-72 h-36 mt-[420px] -m-[405px]">
            <div className="px-4 py-4 h-3">
            <Image src={Fp} alt="profile" className="rounded-full w-10 h-10">
            </Image>
            </div>
            <div className="py-12">
              <h1 className="px-16 mx-1 -my-16 font-semibold text-md">Agil Faqih </h1>
              <h1 className="px-16 mx-1 pt-[62px]  font-normal text-xs">@faqihtailwind500_</h1>
            </div>
            <div>
              <h1 className="font-bold text-4xl font-serif px-60 -my-28">''</h1>
            </div>
            <p className="text-xs font-medium px-16 py-32">Wow keren sekali saya jadi lebih mudah untuk mendaki gunung.</p>
          </div>
          </div>
        </div>
        </div>
        <div className="mx-80">
        <input
          type="text"
          placeholder="Berikan Pendapatmu Tentang Kami"
          className="w-[450px] px-6 py-4 text-sm text-gray-600 placeholder-gray-400 bg-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all mt-[600px] h-9"
          aria-label="Feedback input"
        />
        <div className="mx-[450px] -mt-9">
        <button className="bg-white rounded-full w-14 h-9 mx-3 bg-gradient-to-b from-[#4A90E2] to-[#9CCAFF] hover:from-[#007AFF] hover:to-[#00E6FF] hover:translate-x-1 transition-all duration-300">
          <Image src={arrowwhite} alt="arrow" className="w-14 h-12 -mt-1.5 pl-4 pr-4 max-w-full hover:translate-x-1 duration-300"/>
        </button>
        </div>
        </div>
      </div>
  </div>
  
  );
};

export default Story;