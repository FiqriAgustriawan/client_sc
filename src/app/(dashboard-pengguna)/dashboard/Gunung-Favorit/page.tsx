"use client"

import { useState } from "react"
import Image from "next/image"

export default function GunungFavoritPage() {
  const [mountains, setMountains] = useState(
    Array(9).fill({
      name: "Bulu Baria",
      elevation: "1320 MDPL",
      isFavorite: true,
      image: "/assets/images/Card.png",
    }),
  )

  const toggleFavorite = (index: number) => {
    setMountains((prevMountains) =>
      prevMountains.map((mountain, i) => (i === index ? { ...mountain, isFavorite: !mountain.isFavorite } : mountain)),
    )
  }

  return (
    <div className="flex justify-center lg:justify-end pr-1 mt-16">
      <div className="w-full max-w-[1000px] bg-[#FFFFFF]   rounded-[24px] overflow-hidden relative mx-4 sm:mx-6 lg:mx-0 lg:mr-14 mt-10 shadow-lg">
        <div className="mt-7 px-4 sm:px-6 lg:px-6">
          <h1 className="text-[28px] font-semibold text-[#2D3648] mb-6">Gunung Favorit</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mountains.map((mountain, index) => (
              <div key={index} className="relative aspect-[16/9] rounded-[24px] overflow-hidden bg-gray-200">
                <Image
                  src={mountain.image || "/placeholder.svg"}
                  alt={mountain.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 6}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <button
                  onClick={() => toggleFavorite(index)}
                  className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-white rounded-full opacity-10"></div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className={`relative z-10 ${mountain.isFavorite ? "text-red-500" : "text-white"}`}
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill={mountain.isFavorite ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="absolute left-0 bottom-0 p-4 w-full">
                  <div className="text-sm font-medium text-white/90 mb-1">{mountain.elevation}</div>
                  <h3 className="text-xl text-white font-semibold leading-tight">{mountain.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

