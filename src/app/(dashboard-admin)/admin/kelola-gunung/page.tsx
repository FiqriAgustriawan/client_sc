import React from "react";
import Image from "next/image";
import pencil from "@/assets/svgs/Pencil.svg";
import trash from "@/assets/svgs/Trash.svg";
import Link from "next/link";

export default function HistoryTrip() {
  const trips = [
    { destination: "Bulu Baria", date: "2730 MDPL", participants: "9 Trip Dibuat", price: "Sedang" },
    { destination: "Latimojong", date: "3478 MDPL", participants: "15 Trip Dibuat", price: "Tinggi" },
    { destination: "Sumbing", date: "3371 MDPL", participants: "20 Trip Dibuat", price: "Sedang" },
    { destination: "Rinjani", date: "3726 MDPL", participants: "30 Trip Dibuat", price: "Tinggi" },
    { destination: "Semeru", date: "3726 MDPL", participants: "30 Trip Dibuat", price: "Tinggi" },
    { destination: "Agung", date: "3726 MDPL", participants: "30 Trip Dibuat", price: "Tinggi" },
    { destination: "Bromo", date: "3726 MDPL", participants: "30 Trip Dibuat", price: "Tinggi" },
  ];

  return (
    <div className="bg-white p-4 md:p-6 w-full xl:max-w-[66%] max-w-[85%] md:max-w-[75%] lg:max-w-[60%] lg:mx-96 shadow-lg rounded-3xl mx-auto xl:mx-[29%] mt-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 w-full pt-3">
        <h1 className="text-lg sm:text-2xl font-semibold text-center sm:text-left">Kelola Gunung</h1>
        
        <Link href={'tambah-gunung'} className="xl:text-md :text-sm text-blue-600 font-semibold xl:mt-2 mt-0">
          + Tambah Gunung
        </Link>
      </div>

      {/* List Gunung */}
      <div className="space-y-3">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="bg-[#F6F6F6] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
          >
            {/* Nama Gunung */}
            <div className="w-full">
              <h3 className="font-semibold text-base sm:text-lg">{trip.destination}</h3>
              <p className="text-sm text-gray-600">{trip.date}</p>
            </div>

            {/* Detail & Tombol Aksi */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-auto gap-2">
              <p className="text-sm text-gray-700">{trip.participants}</p>
              <p className="text-sm font-semibold text-[#B96600]">{trip.price}</p>

              {/* Tombol Edit & Hapus */}
              <div className="flex gap-2">
                <button className="p-1">
                  <Image src={trash} alt="Delete" className="xl:w-20 xl:h-5 md:w-14 sm:w-12 w-5" />
                </button>
                <button className="p-1">
                  <Image src={pencil} alt="Edit" className="xl:w-20 xl:h-5 md:w-14 sm:w-12 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
