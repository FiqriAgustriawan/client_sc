import React from "react"
import Image from "next/image"
import pencil from '@/assets/svgs/Pencil.svg'
import trash from '@/assets/svgs/Trash.svg'

export default function HistoryTrip() {
    const trips = [
      {
        destination: "Bulu Baria",
        date: "2730 MDPL",
        participants: "9 Trip Dibuat",
        price: "Sedang"
      },      
      {
        destination: "Bulu Baria",
        date: "2730 MDPL",
        participants: "9 Trip Dibuat",
        price: "Sedang"
      },      
      {
        destination: "Bulu Baria",
        date: "2730 MDPL",
        participants: "9 Trip Dibuat",
        price: "Sedang"
      },      
      {
        destination: "Bulu Baria",
        date: "2730 MDPL",
        participants: "9 Trip Dibuat",
        price: "Sedang"
      },      
      {
        destination: "Bulu Baria",
        date: "2730 MDPL",
        participants: "9 Trip Dibuat",
        price: "Sedang"
      },      
      {
        destination: "Bulu Baria",
        date: "2730 MDPL",
        participants: "9 Trip Dibuat",
        price: "Sedang"
      },      
      {
        destination: "Bulu Baria",
        date: "2730 MDPL",
        participants: "9 Trip Dibuat",
        price: "Sedang"
      },      
      {
        destination: "Bulu Baria",
        date: "2730 MDPL",
        participants: "9 Trip Dibuat",
        price: "Sedang"
      },      

    ]
  
    return (
      <div className="bg-white p-4 md:p-6 w-full max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">
        <h1 className="text-xl md:text-2xl font-semibold mb-6 ">Kelola Gunung</h1>
        <button> + Tambah</button>
        <div className="space-y-3">
          {trips.map((trip, index) => (
            <div
              key={index}
              className="bg-[#F6F6F6] rounded-lg p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-3"
            >
              <div className="space-y-1 rounded-3xl bg-[#F6F6F6] w-full xl:my-2 md:w-auto">
                <h3 className="font-semibold text-lg">{trip.destination}</h3>
              </div>
  
              <div className="grid grid-cols-2 md:flex xl:gap-24 lg:gap-28 sm:gap-3 w-full md:w-auto justify-between md:justify-end items-center">
                <div className="text-left md:text-center">
                  <p className="text-sm md:text-base font-medium">{trip.date}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-medium">{trip.participants}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-medium text-[#B96600]">{trip.price}</p>
                </div>
                <button className="flex xl:gap-5 xl:mr-3">
                <Image src={pencil} alt="icon"/>
                <Image src={trash} alt="icon"/>
              </button>
                </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  