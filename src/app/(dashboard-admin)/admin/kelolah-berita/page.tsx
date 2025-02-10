import React from "react";
import Image from "next/image";
import bg from "@/assets/images/FotoBerita.png";
import Link from "next/link";

export default function HistoryTrip() {
  return (
    <div className="bg-white p-4 sm:p-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[66%] xl:mx-[29%] mt-8 sm:mt-12 md:mt-16 md:mx-[15%] sm:mx-[5%] mx-5 lg:mt-20 lg:mx-[35%] shadow-lg rounded-3xl">

      <div className="flex justify-between mb-6 w-full pt-3">
        <h1 className="text-xl sm:text-2xl font-semibold">Kelola Berita</h1>
        <Link href={'tambah-berita'} className="text-md text-[#0066FF] font-semibold">
          + Tambah Berita
        </Link>
      </div>
      
      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 xl:-mt-5">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="relative bg-black xl:h-44 rounded-3xl overflow-hidden">
            <Image
              src={bg || "/placeholder.svg"}
              alt="gunung"
              className="w-full h-full object-cover opacity-60"
            />
            <p className="absolute bottom-4 left-4 text-lg sm:text-sm text-white">
              Lorem ipsum odor amet,
              <br />
              consectetuer adipiscing elit.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
