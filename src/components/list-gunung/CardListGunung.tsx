import React from "react";
import Image from "next/image";
import BuluBaria from "@/assets/images/BuluBaria-card.png";
import dataGunung from "@/data/dataGunungDummy.json";
import arrow from "@/assets/svgs/Arrow.svg";
function CardListGunung() {
  return (
    <>
      <div>
        <div className="flex justify-between px-[20px] md:px-[50px] lg:px-[65px] pt-5 overflow-hidden">
          <h1 className="relative text-[15px] sm:text-[18px] md:text-[23px] lg:text-[28px] xl:text-[34px]  leading-tight">
            Menampilkan 48 Hasil
          </h1>
          <svg
            className="relative mt-[2px] mr-7"
            width="40"
            height="23"
            viewBox="0 0 46 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 2H44M9.41667 14.5H37.0833M15.7774 27H30.8131"
              stroke="#222222"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="pt-[5px] flex flex-wrap justify-between px-[20px] md:px-[50px] lg:px-[65px] ">
          {/*Desktop Layout*/}
          <div className="hidden lg:block xl:block lg:flex xl:flex flex-row  justify-between gap-[34px]">
            {/* Card1 */}
            <div className="relative flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[30px] lg:w-[100%] lg:h-[268px] xl:w-[100%] xl:h-[338px] transition-all duration-500 ease-in-out">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                width={0}
                height={0}
                className="object-cover  h-full w-full"
              />
              <div className="absolute inset-0 bg-black/45 "></div>
              <div>
                <div className="absolute inset-5 lg:text-[45px] xl:text-[59px] mx-5 -mt-0  font-semibold text-white">
                  Bulu Baria
                  <h2 className="text-white lg:text-[14px] xl:text-[22px] -mt-2 max-w-md ">
                    2750 MDPL
                  </h2>
                  <div className="grid grid-cols-2">
                    <h2 className="text-[22px] font-normal mt-[125px]">
                      3 Trip Available
                    </h2>
                    <button className="lg:w-[140px] lg:h-[50px] xl:w-[194px] xl:h-[69px] bg-white  lg:text-[15px] xl:text-[21px] my-3 mx-[110px] mt-[84px]  flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                      <span className="z-10 transition-colors duration-500 text-black group-hover:text-white ml-[10px]">
                        Lihat
                      </span>
                      <Image
                        src={arrow}
                        alt="arrow"
                        width={60}
                        height={50}
                        className="mx-4 z-10 xl:w-[70px] transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Card2 */}
            <div className="relative flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[30px] lg:w-[100%] lg:h-[100%] xl:w-[100%] xl:h-[338px] transition-all duration-500 ease-in-out">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                width={0}
                height={0}
                className="object-cover  h-full w-full"
              />
              <div className="absolute inset-0 bg-black/45 "></div>
              <div>
                <div className="absolute inset-5 text-[59px] mx-5 -mt-0  font-semibold text-white">
                  Bulu Baria
                  <h2 className="text-white text-[22px] -mt-2 max-w-md ">
                    2750 MDPL
                  </h2>
                  <div className="grid grid-cols-2">
                    <h2 className="text-[22px] font-normal mt-[125px]">
                      3 Trip Available
                    </h2>
                    <button className="w-[194px] bg-white h-[69px] text-[21px] my-3 mx-[110px] mt-[84px]  flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                      <span className="z-10 transition-colors duration-500 text-black group-hover:text-white ml-[10px]">
                        Lihat
                      </span>
                      <Image
                        src={arrow}
                        alt="arrow"
                        width={60}
                        height={50}
                        className="mx-4 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Layout */}
          <div className="block lg:hidden xl:hidden ">
            <div
              className="overflow-x-auto scrollbar-hidden"
              style={{ scrollBehavior: "smooth" }}
            >
              <div className="flex space-x-6">
                {dataGunung.map((gunung) => (
                  <div
                    key={gunung.id}
                    className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl flex-shrink-0 w-[90%] h-[400px] transition-all duration-500 ease-in-out"
                  >
                    {/* Image */}
                    <Image
                      src={gunung.gambar}
                      alt={gunung.nama_gunung}
                      width={500}
                      height={300}
                      className="rounded-3xl w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl"></div>

                    {/* Trip Tersedia (Top-Left Corner) */}
                    <div className="absolute top-5   bg-opacity-80 px-4 py-2 rounded-lg">
                      <h2 className="text-white text-md font-normal">
                        {gunung.trip_tersedia}
                      </h2>
                    </div>

                    {/* Card Content */}
                    <div className="absolute bottom-7 left-5 right-5 text-white">
                      {/* Ketinggian */}
                      <h2 className="text-sm sm:text-base  font-normal ">
                        {gunung.ketinggian}
                      </h2>
                      {/* Gunung Name */}
                      <h2 className="text-[25px] sm:text-[24px] font-medium">
                        {gunung.nama_gunung}
                      </h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/*Layout Desktop*/}
        <div className="hidden lg:block xl:block">
          <div className="pt-[65px] flex flex-wrap justify-between px-[20px] md:px-[50px] lg:px-[65px] ">
            {/* Card1 */}
            {dataGunung.map((mountain) => (
              <div
                key={mountain.id}
                className="relative  flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[15px]  lg:rounded-[25px] w-[170px] h-[170px] lg:w-[452px] lg:h-[240px] transition-all duration-500 ease-in-out mb-5"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={mountain.gambar}
                    alt={mountain.nama_gunung}
                    layout="fill" // Make the image fill the container
                    objectFit="cover" // Ensure the image covers the entire container without stretching
                    className="transition-all duration-300 rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/45"></div>
                </div>
                <div>
                  <div className="lg:absolute text-black inset-5 text-[14px] lg:text-[45px] lg:ml-[4px] -mt-[9px] lg:-mt-[6px] font-semibold lg:text-white">
                    {mountain.nama_gunung}
                    <h2 className="text-white text-[9px] lg:text-lg -mt-2 max-w-md">
                      {mountain.ketinggian}
                    </h2>
                    <div className="grid grid-cols-2">
                      <h2 className="text-[18px] font-normal mt-[69px]">
                        {mountain.trip_tersedia}
                      </h2>
                      <button className="w-[146px] bg-white h-[43px] text-lg mx-[50px] mt-[62px] flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                        <span className="z-10 transition-colors duration-500 text-[15px] text-black group-hover:text-white">
                          Lihat
                        </span>
                        <Image
                          src={arrow}
                          alt="arrow"
                          width={50}
                          height={10}
                          className="mx-2  z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/*Layout Mobile*/}
        <div className="block lg:hidden xl:hidden">
          <div className="bg-white mb-14">
            <div className="px-[1px] md:px-[50px] lg:px-[65px] flex justify-between">
              <div className="container w-full">
                <div className="gap-4 w-full">
                  {/* Cards Grid */}
                  <div className="grid grid-cols-2 gap-5 sm:gap-24">
                    {/* card 2 */}
                    {dataGunung.map((mountain) => (
                    <div className="relative bg-[#e7f2ff] mt-[70px] hover:bg-[#d4e8ff] rounded-[15px] w-[160px] h-[160px] sm:w-[270px] sm:h-[270px] transition-all duration-500 ease-in-out">
                      <Image
                        src={BuluBaria}
                        alt="Bulu Baria"
                        fill
                        className="rounded-[15px] object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-[15px]"></div>
                      <div className="flex gap-5 w-full ">
                        <h2 className="relative font-medium text-[12px] sm:text-[23px] mt-[170px] sm:mt-[280px] w-full text-black ml-4">
                        {mountain.ketinggian}
                        </h2>
                        <h2 className="absolute font-bold text-[15px] sm:text-[29px] mt-[186px] sm:mt-[310px] w-full text-black ml-4">
                        {mountain.nama_gunung}
                        </h2>
                        <h2 className="absolute font-medium text-[12px] sm:text-[23px] mt-[207px] sm:mt-[350px] ml-4 w-full text-[#5F6678]">
                        {mountain.trip_tersedia}
                        </h2>
                      </div>
                    </div>
                    ))}
                    {/* Repeat Card 2, Card 3, and Card 4 as needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardListGunung;