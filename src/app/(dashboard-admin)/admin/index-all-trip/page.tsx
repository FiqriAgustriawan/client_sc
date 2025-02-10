"use client"
import Link from "next/link"

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
  ]

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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F6F6F6] text-left">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold rounded-l-2xl">Destination</th>
              <th className="px-4 py-3 text-sm font-semibold">Participants</th>
              <th className="px-4 py-3 text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-sm font-semibold rounded-r-2xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trips.map((trip, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm">{trip.destination}</h3>
                    <p className="text-xs text-gray-600">{trip.type}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{trip.date}</td>
                <td className="px-4 py-3 text-sm">{trip.participants}</td>
                <td className="px-4 py-3 text-sm">{trip.price}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      trip.activity ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {trip.activity || trip.activity2}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

