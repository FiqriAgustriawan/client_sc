'use client'

import React from "react";

const ReadytoChallenge = () => {
  return (
    <div className="mx-auto px-4 pt-20 md:pt-24 lg:pt-32">
      <div
        className="bg-gradient-to-t from-[#D7E9FF] to-[#4A93E8] relative rounded-3xl overflow-hidden w-full max-w-[1150px] mx-auto mb-5"
        style={{ height: "75vh" }}
      >
        <div className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center text-gray-800 px-6">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide max-w-4xl mx-auto leading-tight text-center mb-10">
            Siap Untuk Memulai
            <br />
            Petualangan Baru?
          </h1>

          <button
            type="submit"
            className="relative w-52 xl:py-2 xl:px-4 text-black text-md py-2 px-5 xl:w-56 md:text-lg xl:text-sm font-bold rounded-full overflow-hidden bg-white transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:bottom-[-150%] before:left-1/2 before:-translate-x-1/2 before:w-[0] before:h-[0] before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:bottom-0 hover:before:w-10 hover:before:scale-[560%] hover:before:h-[100%] hover:before:rounded-full"
          >
            <h1 className="hover:-translate-y-1 transition-all duration-500">
              Gabung Sekarang
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadytoChallenge;
