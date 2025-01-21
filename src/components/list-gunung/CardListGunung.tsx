import React from "react";
import Image from "next/image";
import BuluBaria from "@/assets/images/BuluBaria-card.png";

function CardListGunung() {
  return (
    <>
      <div>
        <div className="flex justify-between px-[20px] md:px-[50px] lg:px-[65px] pt-5 overflow-hidden">
          <h1 className="relative text-lg sm:text-2xl md:text-3xl lg:text-[34px]  leading-tight">
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
        <div className="pt-6 flex flex-wrap justify-between px-[20px] md:px-[50px] lg:px-[65px] ">
          {/* Card1 */}
          <div className="relative flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[30px] w-[685px] h-[338px] transition-all duration-500 ease-in-out">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                width={0}
                height={0}
                className="object-cover  h-full w-full"
              />
            <div className="absolute inset-0 bg-black/45 "></div>     
            <div>
              <div className="absolute inset-5 text-[65px] mx-5 font-semibold text-white">
                Bulu Baria
                <h2 className="text-white text-xl -mt-2 max-w-md ">
                  2750 MDPL
                </h2>
                <div className="grid grid-cols-2">
                  <h2 className="text-[24px] font-normal mt-[140px]">
                    3 Trip Available
                  </h2>
                  <button className="w-[194px] bg-white h-[69px] text-[24px] my-3 mx-[110px] mt-[100px]  flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                    <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                      Lihat
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Card2 */}
          <div className="relative flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[30px] w-[685px] h-[338px] transition-all duration-500 ease-in-out">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                width={0}
                height={0}
                className="object-cover  h-full w-full"
              />
            <div className="absolute inset-0 bg-black/45 "></div>     
            <div>
              <div className="absolute inset-5 text-[65px] mx-5 font-semibold text-white">
                Bulu Baria
                <h2 className="text-white text-xl -mt-2 max-w-md ">
                  2750 MDPL
                </h2>
                <div className="grid grid-cols-2">
                  <h2 className="text-[24px] font-normal mt-[140px]">
                    3 Trip Available
                  </h2>
                  <button className="w-[194px] bg-white h-[69px] text-[24px] my-3 mx-[110px] mt-[100px]  flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                    <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                      Lihat
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-[65px] flex flex-wrap justify-between px-[20px] md:px-[50px] lg:px-[65px] ">
          {/* Card1 */}
          <div className="relative flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[25px] w-[452px] h-[240px] transition-all duration-500 ease-in-out mb-5">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                width={0}
                height={0}
                className="object-cover  h-full w-full"
              />
            <div className="absolute inset-0 bg-black/45 "></div>     
            <div>
              <div className="absolute inset-5 text-[50px] -mt-4 font-semibold text-white">
                Bulu Baria
                <h2 className="text-white text-lg -mt-2 max-w-md ">
                  2750 MDPL
                </h2>
                <div className="grid grid-cols-2">
                  <h2 className="text-[20px] font-normal mt-20">
                    3 Trip Available
                  </h2>
                  <button className="w-[145px] bg-white h-[40px] text-lg my-3 mx-12 mt-20  flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                    <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                      Lihat
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Card2 */}
          <div className="relative flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[25px] w-[452px] h-[240px] transition-all duration-500 ease-in-out mb-5">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                width={0}
                height={0}
                className="object-cover  h-full w-full"
              />
            <div className="absolute inset-0 bg-black/45 "></div>     
            <div>
              <div className="absolute inset-5 text-[50px] -mt-4 font-semibold text-white">
                Bulu Baria
                <h2 className="text-white text-lg -mt-2 max-w-md ">
                  2750 MDPL
                </h2>
                <div className="grid grid-cols-2">
                  <h2 className="text-[20px] font-normal mt-20">
                    3 Trip Available
                  </h2>
                  <button className="w-[145px] bg-white h-[40px] text-lg my-3 mx-12 mt-20  flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                    <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                      Lihat
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Card3 */}
          <div className="relative flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[25px] w-[452px] h-[240px] transition-all duration-500 ease-in-out mb-5">
              <Image
                src={BuluBaria}
                alt="Bulu Baria"
                width={0}
                height={0}
                className="object-cover  h-full w-full"
              />
            <div className="absolute inset-0 bg-black/45 "></div>     
            <div>
              <div className="absolute inset-5 text-[50px] -mt-4 font-semibold text-white">
                Bulu Baria
                <h2 className="text-white text-lg -mt-2 max-w-md ">
                  2750 MDPL
                </h2>
                <div className="grid grid-cols-2">
                  <h2 className="text-[20px] font-normal mt-20">
                    3 Trip Available
                  </h2>
                  <button className="w-[145px] bg-white h-[40px] text-lg my-3 mx-12 mt-20  flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                    <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                      Lihat
                    </span>
                  </button>
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
