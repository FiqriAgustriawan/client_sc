// import React from "react";
// import BuluBaria from "@/assets/images/BuluBaria.png";
// import Image from "next/image";

// function CardListGunung() {
//   return (
//     <>
//     <div>
//       <div className="flex justify-center gap-[1070px]">
//         <h1 className="relative -top-[360px] text-3xl">Menampilkan 48 Hasil</h1>
//         <svg
//           className="relative -top-[360px]"
//           width="46"
//           height="29"
//           viewBox="0 0 46 29"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           >
//           <path
//             d="M2.5 2H44M9.41667 14.5H37.0833M15.7774 27H30.8131"
//             stroke="#222222"
//             strokeWidth="4"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             />
//         </svg>
//       </div>
//       <div className="flex flex-wrap">
//         <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl w-[540px] h-[284px] transition-all duration-500 ease-in-out mb-5">
//           <Image
//             src={BuluBaria}
//             alt="Bulu Baria"
//             fill
//             className="rounded-3xl object-cover"
//             />
//           <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl"></div>
//           <div>
//             <div className="absolute inset-5 mx-2 text-[51px] font-semibold text-white">
//               Bulu Baria
//               <h2 className="text-white text-lg -mt-2 max-w-md ">2750 MDPL</h2>
//               <div className="grid grid-cols-2">
//                 <h2 className="text-[20px] font-normal mt-28">
//                   3 Trip Available
//                 </h2>
//                 <button className="w-[155px] bg-white h-[50px] text-xl my-3 mx-20 mt-24 flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
//                   <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
//                     Lihat
//                   </span>
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="87"
//                     height="30"
//                     viewBox="0 0 87 30"
//                     fill="none"
//                   >
//                     <path
//                       d="M2 13C0.895431 13 9.65645e-08 13.8954 0 15C-9.65645e-08 16.1046 0.89543 17 2 17L2 13ZM86.4142 16.4142C87.1953 15.6332 87.1953 14.3668 86.4142 13.5858L73.6863 0.857871C72.9052 0.0768218 71.6389 0.0768217 70.8579 0.85787C70.0768 1.63892 70.0768 2.90525 70.8579 3.6863L82.1716 15L70.8579 26.3137C70.0768 27.0948 70.0768 28.3611 70.8579 29.1421C71.6389 29.9232 72.9052 29.9232 73.6863 29.1421L86.4142 16.4142ZM2 17L85 17L85 13L2 13L2 17Z"
//                       fill="black"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }

// export default CardListGunung;

import React from "react";
import Image from "next/image";
import BuluBaria from "@/assets/images/BuluBaria-card.png";
import dataGunung from '@/data/dataGunungDummy.json'
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
          {dataGunung.map((mountain) => (
            <div key={mountain.id} className="relative flex flex-wrap overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[25px] w-[452px] h-[240px] transition-all duration-500 ease-in-out mb-5">
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
                <div className="absolute inset-5 text-[50px] -mt-4 font-semibold text-white">
                  {mountain.nama_gunung}
                  <h2 className="text-white text-lg -mt-2 max-w-md">
                    {mountain.ketinggian}
                  </h2>
                  <div className="grid grid-cols-2">
                    <h2 className="text-[20px] font-normal mt-20">
                      {mountain.trip_tersedia}
                    </h2>
                    <button className="w-[145px] bg-white h-[40px] text-lg my-3 mx-12 mt-20 flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md scale-105 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                      <span className="z-10 transition-colors duration-500 text-black group-hover:text-white">
                        Lihat
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}



        </div>
      </div>
    </>
  );
}

export default CardListGunung;
