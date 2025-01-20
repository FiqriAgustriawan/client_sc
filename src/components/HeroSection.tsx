import React from "react";
import HeroGunung from "@/assets/images/bglogin.jpeg";
import Image from "next/image";

const HeroImage = () => {
  return (
    <div className="mx-auto px-4  pt-[79px]">
    <div
      className="relative rounded-2xl o verflow-hidden"
      style={{ height: "95vh" }}
    >
      <Image
        src={HeroGunung}
        alt="Mountain landscape"
        className="w-full h-full object-cover"
        fill
        sizes="(max-width: 1280px) 100vw, 1280px"
        priority
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold max-w-4xl mx-auto leading-tight text-center mb-6">
          Setiap Langkah Membawa
          <br />
          Anda Menuju Puncak Impian
        </h1>
  
        <p className="relative text-base md:text-lg lg:text-xl font-normal max-w-4xl mx-auto leading-tight text-center mb-6">
          Gabung bersama kami untuk pengalaman pendakian yang aman, seru dan tak
          <br />
          terlupakan. Siap melangkah lebih dekat ke puncak impian?
        </p>
  
        <button className="bg-[#2B82FE] text-white text-base px-8 py-3 rounded-full hover:bg-opacity-95 transition duration-300 font-semibold hover:-translate-y-2 hover:shadow-lg hover:shadow-[#2B82FE]">
          Mulai Petualanganmu!
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default HeroImage;