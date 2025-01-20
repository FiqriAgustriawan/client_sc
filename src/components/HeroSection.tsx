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
  
        <button type="submit" className="relative py-2 px-7 text-black text-base font-bold rounded-full overflow-hidden bg-white transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:bottom-[-150%] before:left-1/2 before:-translate-x-1/2 before:w-[0] before:h-[0] before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:bottom-0 hover:before:w-10 hover:before:scale-[560%] hover:before:h-[100%] hover:before:rounded-full">
          <div className="hover:-translate-y-1 transition-all duration-500">
          Mulai Petualanganmu
          </div>
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default HeroImage;