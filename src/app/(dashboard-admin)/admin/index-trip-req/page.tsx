import React from "react";
import Image from "next/image";
import kali from "@/assets/svgs/Silang.svg";
import centang from "@/assets/svgs/Centang.svg";
import Link from "next/link";

export default function HistoryTrip() {
  const trips = [
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
    },
  ];

  return (
    <div className="bg-white p-4 md:p-6 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 w-full pt-3">
        <h1 className="text-xl sm:text-2xl font-semibold">Trip</h1>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="index-trip-req" className="text-sm underline font-semibold">
            Permintaan
          </Link>
          <Link href="index-all-trip" className="text-sm">
            Semua Trip
          </Link>
        </div>
      </div>

      {/* Card List */}
      <div className="space-y-4">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="bg-[#F6F6F6] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
          >
            {/* Informasi Trip */}
            <div className="space-y-1 w-full sm:w-auto">
              <h3 className="font-semibold text-lg">{trip.destination}</h3>
              <p className="text-sm text-gray-600">{trip.type}</p>
            </div>

            {/* Detail Data */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 xl:gap-20 w-full sm:w-auto text-left sm:text-center">
              <p className="text-sm font-medium">{trip.date}</p>
              <p className="text-sm font-medium">{trip.participants}</p>
              <p className="text-sm font-medium">{trip.price}</p>

              {/* Tombol Aksi */}
              <div className="flex gap-2 justify-start sm:justify-center mt-2 sm:mt-0">
                <button className="p-1">
                  <Image src={kali} alt="Hapus" className="w-5 h-5" />
                </button>
                <button className="p-1">
                  <Image src={centang} alt="Terima" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
