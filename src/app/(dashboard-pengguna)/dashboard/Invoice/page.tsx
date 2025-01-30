"use client"

import { useState } from "react"

export default function GunungFavoritPage() {
  const [transactions] = useState([
    {
      name: "RawallangiAdventure",
      location: "Bulu Baria",
      date: "10/03/2034",
      status: "Berhasil",
      amount: "135.000",
    },
    {
      name: "RawallangiAdventure",
      location: "Bulu Baria",
      date: "10/03/2034",
      status: "Berhasil",
      amount: "135.000",
    },
    {
      name: "RawallangiAdventure",
      location: "Bulu Baria",
      date: "10/03/2034",
      status: "Dibatalkan",
      amount: "135.000",
    },
    {
      name: "RawallangiAdventure",
      location: "Bulu Baria",
      date: "10/03/2034",
      status: "Berhasil",
      amount: "135.000",
    },
    {
      name: "RawallangiAdventure",
      location: "Bulu Baria",
      date: "10/03/2034",
      status: "Berhasil",
      amount: "135.000",
    },
    {
      name: "RawallangiAdventure",
      location: "Bulu Baria",
      date: "10/03/2034",
      status: "Berhasil",
      amount: "135.000",
    },
    {
      name: "RawallangiAdventure",
      location: "Bulu Baria",
      date: "10/03/2034",
      status: "Berhasil",
      amount: "135.000",
    },
    {
      name: "RawallangiAdventure",
      location: "Bulu Baria",
      date: "10/03/2034",
      status: "Berhasil",
      amount: "135.000",
    },
  ])

  return (
    <div className="flex justify-end pr-1 mt-16">
      <div className="w-[1000px] bg-white rounded-[24px] overflow-hidden relative mr-14 mt-10 shadow-lg p-6">
        <h1 className="text-[28px] font-semibold text-[#2D3648] mb-6">Invoice</h1>

        <div className="space-y-2">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
              <div className="flex flex-col">
                <span className="font-medium">{transaction.name}</span>
                <span className="text-sm text-gray-600">{transaction.location}</span>
              </div>

              <div className="text-gray-600">{transaction.date}</div>

              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    transaction.status === "Berhasil" ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {transaction.status}
                </span>
              </div>

              <div className="font-medium">{transaction.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}