import React from "react";
import Image from "next/image";
import bg from "@/assets/images/FotoBerita.png";
import Link from "next/link";

export default function HistoryTrip() {
  
  return (
    <div className="bg-white p-4 md:p-6 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">

      <div className="flex justify-between mb-6 w-full pt-3">
        <h1 className="text-xl sm:text-2xl font-semibold">Kelola Berita</h1>
        <Link href="/admin/kelolah-berita/tambah-berita" className="text-md text-[#0066FF] font-semibold">
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
