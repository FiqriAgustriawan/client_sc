import React from 'react'
import Image from 'next/image'
import img from '@/assets/images/Jastrip.png'
import Link from 'next/link'

function tripjasa() {
  return (
    <>
      <div className="min-h-screen p-4 md:p-10 md:w-[93%] md:mx-10 md:max-w-[200%] lg:w-[70%] lg:mx-[33%] flex flex-col xl:mt-16 xl:max-w-[1100px] xl:w-full xl:mx-[26%] mx-auto">
        <div className="bg-white flex flex-col w-full rounded-3xl min-h-[1000px] shadow-lg p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-start font-semibold text-2xl">Trip Kamu</h1>
            <Link href={'buat-trip'} className="text-[#0066FF] font-semibold text-lg">
              + Buat Trip
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
          {[1, 2, 3, 4].map((_, index) => (
            <TripCard key={index} />
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

function TripCard() {
  return (
    <div className="bg-[#EFF6FE] xl:h-40 rounded-3xl p-4 flex flex-col md:flex-row items-center md:items-start gap-40">
      <Image src={img || "/placeholder.svg"} alt="bg" className="w-full h-[100%] md:w-72 rounded-2xl" />
      <div className="flex flex-col justify-between h-full w-full">
        <div className='xl:-ml-32'>
          <h1 className="font-semibold text-xl mb-2">Rawallangi Adventure</h1>
          <h2 className="font-normal text-md mb-2">Open Trip</h2>
          <h2 className="font-bold text-sm mb-4">12 - 14 Oktober</h2>
          <h1 className="font-semibold text-lg mb-4">Rp 105.000</h1>
        </div>
        <button
          type="submit"
          className="w-full xl:w-[40%] xl:ml-[315px] xl:-mt-20 py-2 px-4 text-white text-sm md:text-base font-semibold rounded-full bg-gradient-to-t from-[#9CCAFF] to-[#4A90E2] hover:from-[#a8d1ff] hover:to-[#4ea1ff] transition-all duration-300 ease-in-out"
        >
          <span className="block hover:-translate-y-1 transition-transform duration-300">Masuk Dashboard</span>
        </button>
      </div>
    </div>
  )
}

export default tripjasa