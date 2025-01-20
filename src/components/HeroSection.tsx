import React from "react";
import HeroGunung from "@/assets/images/HeroBackground.png";
import Image from "next/image";

const HeroImage = () => {
  return (
    <div className=" mx-auto px-4 py-8 pt-[84px]">
      <div className="relative rounded-2xl overflow-hidden" style={{ height: "70vh" }}>
        <Image
          src={HeroGunung}
          alt="Mountain landscape"
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold max-w-4xl mx-auto leading-tight text-center mb-6">
            Jelajahi Puncak,
            <br />
            Temukan Dirimu
          </h1>
          <button className="bg-white text-black text-lg px-8 py-3 rounded-full hover:bg-opacity-95 transition duration-300 font-semibold">
            Mulai Pendakian
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;