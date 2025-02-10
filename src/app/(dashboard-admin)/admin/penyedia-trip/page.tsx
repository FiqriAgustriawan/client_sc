import React from "react";
import Link from "next/link";

export default function HistoryTrip() {
    const trips = [
      { destination: "Fiqri", type: "Januari, 2022", date: "13 Trip Dibuat", participants: "1.232 Orang Masuk", price: "4.9/5.0 Rating" },
      { destination: "Faras", type: "Januari, 2022", date: "13 Trip Dibuat", participants: "1.232 Orang Masuk", price: "4.9/5.0 Rating" },
      { destination: "Faqih", type: "Januari, 2022", date: "13 Trip Dibuat", participants: "1.232 Orang Masuk", price: "4.9/5.0 Rating" },
      { destination: "Akram", type: "Januari, 2022", date: "13 Trip Dibuat", participants: "1.232 Orang Masuk", price: "4.9/5.0 Rating" },
      { destination: "Daniel", type: "Januari, 2022", date: "13 Trip Dibuat", participants: "1.232 Orang Masuk", price: "4.9/5.0 Rating" },
      { destination: "Fadhlul", type: "Januari, 2022", date: "13 Trip Dibuat", participants: "1.232 Orang Masuk", price: "4.9/5.0 Rating" },
      { destination: "Botak", type: "Januari, 2022", date: "13 Trip Dibuat", participants: "1.232 Orang Masuk", price: "4.9/5.0 Rating" },
    ];

    return (
      <div className="bg-white p-4 md:p-6 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 w-full pt-3">
          <h1 className="text-lg sm:text-2xl font-semibold text-left sm:text-left">Penyedia Trip</h1>
          
          <div className="flex xl:gap-2 gap-4 justify-end xl:mt-2 sm:mt-0">
            <Link href={'penyedia-trip'} className="text-sm sm:text-base underline font-semibold">
              Semua
            </Link>
            <Link href={'penyediatrip-req'} className="text-sm sm:text-base">
              Permintaan
            </Link>
          </div>
        </div>

        {/* Trip List */}
        <div className="space-y-3">
          {trips.map((trip, index) => (
            <div
              key={index}
              className="bg-[#F6F6F6] rounded-3xl p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
            >
              {/* Destination & Type */}
              <div className="w-full sm:w-auto">
                <h3 className="font-semibold text-lg sm:text-base">{trip.destination}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{trip.type}</p>
              </div>

              {/* Trip Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex xl:gap-24 lg:gap-16 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start items-center text-sm">
                <div className="text-left sm:text-center">
                  <p className="text-xs sm:text-base font-medium">{trip.date}</p>
                </div>
                <div className="text-left sm:text-center">
                  <p className="text-xs sm:text-base font-medium">{trip.participants}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-base font-medium">{trip.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
