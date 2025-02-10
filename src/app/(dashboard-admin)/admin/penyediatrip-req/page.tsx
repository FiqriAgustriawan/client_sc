import React from "react"
import Link from "next/link"

export default function HistoryTrip() {
    const trips = [
      {
        name: "Akram",
        destination2: "Ingin Menjadi Penyedia Jasa",
        type: "Januari,2022"
      },      
      {
        name: "Akram",
        destination2: "Ingin Menjadi Penyedia Jasa",
        type: "Januari,2022"
      },      
      {
        name: "Akram",
        destination2: "Ingin Menjadi Penyedia Jasa",
        type: "Januari,2022"
      },      
      {
        name: "Akram",
        destination2: "Ingin Menjadi Penyedia Jasa",
        type: "Januari,2022"
      },      
      {
        name: "Akram",
        destination2: "Ingin Menjadi Penyedia Jasa",
        type: "Januari,2022"
      },      
      {
        name: "Akram",
        destination2: "Ingin Menjadi Penyedia Jasa",
        type: "Januari,2022"
      },      
      {
        name: "Akram",
        destination2: "Ingin Menjadi Penyedia Jasa",
        type: "Januari,2022"
      },      
      {
        name: "Akram",
        destination2: "Ingin Menjadi Penyedia Jasa",
        type: "Januari,2022"
      },      
      
    ]
  
    return (
      <div className="bg-white p-4 md:p-6 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">
      <div className="flex justify-between mb-6 w-full pt-3">
        <h1 className="text-xl sm:text-2xl font-semibold -mr-20">Penyedia Trip</h1>
        <Link href={'penyedia-trip'}  className="text-sm xl:pl-[72%]">
          Semua
        </Link>

        <Link href={'penyediatrip-req'} className="text-sm xl:pr-3 underline font-semibold">
          Permintaan
        </Link>
      </div>
      <div className="space-y-4">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="bg-[#F6F6F6] rounded-2xl p-4 flex items-center"
          >
            <div className="space-y-1 w-full absolute sm:w-auto mb-2 sm:mb-0 pl-2 grid grid-cols-2">
              <h3 className="font-semibold text-lg mt-0.5 mr-5">{trip.name}</h3>
              <h3 className="font-normal text-md xl:-ml-20 -ml-[77%]">{trip.destination2}</h3>
              <p className="text-sm text-gray-600 leading-3">{trip.type}</p>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-4 w-full ml-[70%] mt-4 -mb-2 xl:mt-0 xl:-mb-0 xl:gap-20 mr-7 md:ml-96 sm:w-auto xl:ml-[84%] sm:ml-[70%]">
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button className="p-1 text-[#FF0000]">
                  Tolak
                </button>
                <button className="p-1 text-[#4A90E2] ">
                  Terima
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
  }
  
  