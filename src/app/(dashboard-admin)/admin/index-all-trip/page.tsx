import React from "react";
import Link from "next/link";

export default function HistoryTrip() {
  const trips = [
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
      activity: "Sedang Berlangsung",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
      activity: "Sedang Berlangsung",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
      activity: "Sedang Berlangsung",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
      activity2: "Telah Selesai",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
      activity2: "Telah Selesai",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
      activity2: "Telah Selesai",
    },
    {
      destination: "Rawallangi Adventure",
      type: "Bulu Baria",
      date: "13 Orang",
      participants: "12-15 Januari",
      price: "Rp.135.000",
      activity2: "Telah Selesai",
    },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 w-full xl:max-w-[66%] xl:mx-[29%] lg:max-w-[60%] lg:mx-[37%] xl:mt-[7%] mt-8 sm:mt-12 lg:mt-16 shadow-lg rounded-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 w-full pt-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-left">Trip</h1>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="index-trip-req" className="text-sm">
            Permintaan
          </Link>
          <Link href="index-all-trip" className="text-sm underline font-semibold">
            Semua Trip
          </Link>
        </div>
      </div>

      {/* Card List */}
      <div className="space-y-4">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="bg-[#F6F6F6] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
          >
            {/* Informasi Trip */}
            <div className="space-y-1 w-full sm:w-auto text-left">
              <h3 className="font-semibold text-lg">{trip.destination}</h3>
              <p className="text-sm text-gray-600">{trip.type}</p>
            </div>

            {/* Detail Data */}
            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-16 w-full sm:w-auto text-left">
              <p className="text-sm font-medium">{trip.date}</p>
              <p className="text-sm font-medium">{trip.participants}</p>
              <p className="text-sm font-medium">{trip.price}</p>
              <p className="text-sm font-medium">{trip.activity || trip.activity2}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
