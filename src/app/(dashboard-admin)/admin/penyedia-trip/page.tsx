import React from "react"

export default function HistoryTrip() {
    const trips = [
      {
        destination: "Rawallangi Adventure",
        type: "Januari,2022",
        date: "13 Trip Dibuat",
        participants: "1.232 Peserta",
        price: "4.9/5.0 Rating",
      },
      {
        destination: "Rawallangi Adventure",
        type: "Januari,2022",
        date: "13 Trip Dibuat",
        participants: "1.232 Peserta",
        price: "4.9/5.0 Rating",
      },
      {
        destination: "Rawallangi Adventure",
        type: "Januari,2022",
        date: "13 Trip Dibuat",
        participants: "1.232 Peserta",
        price: "4.9/5.0 Rating",
      },
      {
        destination: "Rawallangi Adventure",
        type: "Januari,2022",
        date: "13 Trip Dibuat",
        participants: "1.232 Peserta",
        price: "4.9/5.0 Rating",
      },
      {
        destination: "Rawallangi Adventure",
        type: "Januari,2022",
        date: "13 Trip Dibuat",
        participants: "1.232 Peserta",
        price: "4.9/5.0 Rating",
      },
      {
        destination: "Rawallangi Adventure",
        type: "Januari,2022",
        date: "13 Trip Dibuat",
        participants: "1.232 Peserta",
        price: "4.9/5.0 Rating",
      },
      {
        destination: "Rawallangi Adventure",
        type: "Januari,2022",
        date: "13 Trip Dibuat",
        participants: "1.232 Peserta",
        price: "4.9/5.0 Rating",
      },
      {
        destination: "Rawallangi Adventure",
        date: "Januari,2022",
        type: "13 Trip Dibuat",
        participants: "1.232 Peserta",
        price: "4.9/5.0 Rating",
      },
      
    ]
  
    return (
      <div className="bg-white p-4 md:p-6 w-full max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:mt-[7%] lg:mt-[10%] xl:max-w-[66%] xl:mx-[29%] lg:mx-96 mx-auto md:mx-[13%] md:mt-[7%] shadow-lg rounded-3xl mt-20">
        <h1 className="text-xl md:text-2xl font-semibold mb-4 ">Penyedia Trip</h1>
        <div className="space-y-3">
          {trips.map((trip, index) => (
            <div
              key={index}
              className="bg-[#F6F6F6] rounded-lg p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-3"
            >
              <div className="space-y-1 rounded-3xl bg-[#F6F6F6] w-full md:w-auto">
                <h3 className="font-semibold">{trip.destination}</h3>
                <p className="text-sm leading-3 text-gray-600">{trip.type}</p>
              </div>
  
              <div className="grid grid-cols-2 md:flex xl:gap-36 lg:gap-28 sm:gap-3 w-full md:w-auto justify-between md:justify-end items-center">
                <div className="text-left md:text-center">
                  <p className="text-sm md:text-base font-medium">{trip.date}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-medium">{trip.participants}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm md:text-base font-medium">{trip.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  