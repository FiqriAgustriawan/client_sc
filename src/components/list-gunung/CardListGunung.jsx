'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import arrow from "@/assets/svgs/Arrow.svg";
import { getMountains } from "@/services/mountain.service";
import Link from "next/link";
import { FiMapPin } from "react-icons/fi";

function CardListGunung() {
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');
        // Call the correct function with the token
        const response = await getMountains(token);
        // Update to use the correct data structure
        setMountains(response.data || response);
      } catch (err) {
        console.error("Error fetching mountains:", err);
        setError("Failed to load mountains data");
      } finally {
        setLoading(false);
      }
    };

    fetchMountains();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="pb-16">
        <div className="flex justify-between px-[20px] md:px-[50px] lg:px-[65px] pt-5 overflow-hidden">
          <h1 className="relative text-[15px] sm:text-[18px] md:text-[23px] lg:text-[28px] xl:text-[34px] leading-tight">
            Menampilkan {mountains.length} Hasil
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

        {/* Featured Mountains - Desktop */}
        {mountains.length > 0 && (
          <div className="hidden lg:flex pt-[5px] gap-[34px] px-[20px] md:px-[50px] lg:px-[65px]">
            {/* Featured Mountain 1 */}
            <Link href={`/gunung/${mountains[0].id}`} className="w-1/2">
              <div className="relative overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[30px] h-[338px] transition-all duration-500 ease-in-out">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountains[0].images[0]?.image_path}`}
                  alt={mountains[0].nama_gunung}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/45"></div>
                <div className="absolute inset-5 text-white">
                  <h1 className="text-[45px] xl:text-[59px] font-semibold">
                    {mountains[0].nama_gunung}
                  </h1>
                  <h2 className="text-[14px] xl:text-[22px] -mt-2">
                    {mountains[0].ketinggian} MDPL
                  </h2>
                  <div className="flex justify-between items-end absolute bottom-0 left-0 right-0">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-white" />
                      <h2 className="text-[18px] xl:text-[22px] font-normal">
                        {mountains[0].lokasi.split(',')[0]}
                      </h2>
                    </div>
                    <button className="lg:w-[140px] lg:h-[50px] xl:w-[194px] xl:h-[69px] bg-white lg:text-[15px] xl:text-[21px] flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
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
            </Link>

            {/* Featured Mountain 2 */}
            {mountains.length > 1 && (
              <Link href={`/gunung/${mountains[1].id}`} className="w-1/2">
                <div className="relative overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[30px] h-[338px] transition-all duration-500 ease-in-out">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountains[1].images[0]?.image_path}`}
                    alt={mountains[1].nama_gunung}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/45"></div>
                  <div className="absolute inset-5 text-white">
                    <h1 className="text-[45px] xl:text-[59px] font-semibold">
                      {mountains[1].nama_gunung}
                    </h1>
                    <h2 className="text-[14px] xl:text-[22px] -mt-2">
                      {mountains[1].ketinggian} MDPL
                    </h2>
                    <div className="flex justify-between items-end absolute bottom-0 left-0 right-0">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-white" />
                        <h2 className="text-[18px] xl:text-[22px] font-normal">
                          {mountains[1].lokasi.split(',')[0]}
                        </h2>
                      </div>
                      <button className="lg:w-[140px] lg:h-[50px] xl:w-[194px] xl:h-[69px] bg-white lg:text-[15px] xl:text-[21px] flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
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
              </Link>
            )}
          </div>
        )}

        {/* Mobile Carousel */}
        <div className="block lg:hidden pt-[5px]">
          <div
            className="overflow-x-auto scrollbar-hidden px-[20px] md:px-[50px]"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="flex space-x-4">
              {mountains.map((mountain) => (
                <Link href={`/gunung/${mountain.id}`} key={mountain.id}>
                  <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-3xl flex-shrink-0 w-[280px] h-[400px] transition-all duration-500 ease-in-out">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountain.images[0]?.image_path}`}
                      alt={mountain.nama_gunung}
                      fill
                      className="rounded-3xl object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
                    <div className="absolute top-5 left-5 flex items-center gap-2">
                      <FiMapPin className="text-white" />
                      <h2 className="text-white text-md font-normal">
                        {mountain.lokasi.split(',')[0]}
                      </h2>
                    </div>
                    <div className="absolute bottom-7 left-5 right-5 text-white">
                      <h2 className="text-sm sm:text-base font-normal">
                        {mountain.ketinggian} MDPL
                      </h2>
                      <h2 className="text-[25px] sm:text-[28px] font-medium">
                        {mountain.nama_gunung}
                      </h2>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm opacity-80">
                          {mountain.status_gunung}
                        </div>
                        <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-300">
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mountain Grid - Desktop */}
        <div className="hidden lg:block pt-[65px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-[20px] md:px-[50px] lg:px-[65px]">
            {mountains.slice(2).map((mountain) => (
              <Link href={`/gunung/${mountain.id}`} key={mountain.id}>
                <div className="relative overflow-hidden bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[25px] h-[240px] transition-all duration-500 ease-in-out">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountain.images[0]?.image_path}`}
                    alt={mountain.nama_gunung}
                    fill
                    className="object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/45"></div>
                  <div className="absolute inset-5 text-white">
                    <h1 className="text-[28px] font-semibold">
                      {mountain.nama_gunung}
                    </h1>
                    <h2 className="text-[16px] -mt-1">
                      {mountain.ketinggian} MDPL
                    </h2>
                    <div className="flex justify-between items-end absolute bottom-0 left-0 right-0">
                      <div className="flex items-center gap-2">
                        <FiMapPin />
                        <h2 className="text-[16px] font-normal">
                          {mountain.lokasi.split(',')[0]}
                        </h2>
                      </div>
                      <button className="w-[146px] bg-white h-[43px] text-lg flex items-center justify-center rounded-full cursor-pointer relative overflow-hidden transition-all duration-500 ease-in-out shadow-md before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-[#4A90E2] before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0 group">
                        <span className="z-10 transition-colors duration-500 text-[15px] text-black group-hover:text-white">
                          Lihat
                        </span>
                        <Image
                          src={arrow}
                          alt="arrow"
                          width={50}
                          height={10}
                          className="mx-2 z-10 transition-transform duration-700 group-hover:translate-x-3 group-hover:brightness-0 group-hover:invert"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mountain Grid - Mobile */}
        <div className="block lg:hidden mt-8">
          <div className="grid grid-cols-2 gap-4 px-[20px] md:px-[50px]">
            {mountains.map((mountain) => (
              <Link href={`/gunung/${mountain.id}`} key={mountain.id}>
                <div className="relative bg-[#e7f2ff] hover:bg-[#d4e8ff] rounded-[15px] h-[200px] sm:h-[250px] transition-all duration-500 ease-in-out">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountain.images[0]?.image_path}`}
                    alt={mountain.nama_gunung}
                    fill
                    className="rounded-[15px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-[15px]"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h2 className="text-xs sm:text-sm font-normal">
                      {mountain.ketinggian} MDPL
                    </h2>
                    <h2 className="text-[15px] sm:text-[18px] font-bold truncate">
                      {mountain.nama_gunung}
                    </h2>
                    <div className="flex items-center gap-1 mt-1">
                      <FiMapPin className="text-xs" />
                      <h2 className="text-xs sm:text-sm font-medium truncate">
                        {mountain.lokasi.split(',')[0]}
                      </h2>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardListGunung;