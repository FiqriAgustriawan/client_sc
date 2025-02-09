"use client"
import Image from "next/image"
import Link from "next/link"

export default function MountainDetailsWithTripSaya() {
  // Sample data for TripSaya
  const tripItems = [
    {
      id: 1,
      title: "RawallangiAdventure",
      type: "Open Trip",
      date: "12 - 14 Oktober",
      price: "Rp 105.000",
      image: "/assets/images/Card1.png",
    },
    {
      id: 2,
      title: "RawallangiAdventure",
      type: "Open Trip",
      date: "12 - 14 Oktober",
      price: "Rp 105.000",
      image: "/assets/images/Card1.png",
    },
    {
      id: 3,
      title: "RawallangiAdventure",
      type: "Open Trip",
      date: "12 - 14 Oktober",
      price: "Rp 105.000",
      image: "/assets/images/Card1.png",
    },
  ]

  return (
    <div className="">
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-12 mt-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/gunung" className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center text-white text-sm">
              <span>Gunung</span>
              <span className="mx-2">/</span>
              <span>Bulu baria</span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Bulu Baria</h1>
              <p className="text-white/90 mb-1">Bulu Baria, Manimbahoi, Parigi, Gowa Regency, South Sulawesi</p>
              <p className="text-white/90">10.00 - 22.00</p>
            </div>
            <div className="bg-white px-6 py-2 rounded-full shadow-sm">
              <span className="font-medium">2730 MDPL</span>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="bg-white rounded-[32px] p-6 shadow-lg mb-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <div className="relative aspect-[16/11] rounded-[24px] overflow-hidden">
                <Image
                  src="/images/bulu-baria-main.jpg"
                  alt="Panoramic view of Bulu Baria mountain"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="col-span-5 grid grid-cols-2 gap-4">
              {[
                { src: "/images/bulu-baria-1.jpg", alt: "Bulu Baria hiking trail" },
                { src: "/images/bulu-baria-2.jpg", alt: "Bulu Baria summit view" },
                { src: "/images/bulu-baria-3.jpg", alt: "Bulu Baria camping site" },
                { src: "/images/bulu-baria-4.jpg", alt: "Bulu Baria waterfall" },
              ].map((img, i) => (
                <div key={i} className="relative aspect-square rounded-[24px] overflow-hidden">
                  {i === 3 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white z-10">
                      <span className="font-medium">+19 Photos</span>
                    </div>
                  )}
                  <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* First Card - Peraturan */}
            <div className="bg-white rounded-[32px] p-8 shadow-lg">
              <section>
                <h2 className="text-xl font-semibold mb-4">Peraturan</h2>
                <p className="text-gray-600 leading-relaxed">
                  The Gaia Hotel Bandung is a hotel in a good neighborhood, which is located at Setiabudl. 24-hours
                  front desk is available to serve you, from check-in to check-out, or any assistance you need. Should
                  you desire more, do not hesitate to ask the front desk, we are always ready to accommodate you. WIFI
                  is available with public areas of the property to help you to stay connected with family and friends.
                </p>
              </section>
            </div>

            {/* Second Card - Peraturan & Apa Yang Tidak Boleh */}
            <div className="bg-white rounded-[32px] p-8 shadow-lg">
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Peraturan</h2>
                  <p className="text-gray-600 leading-relaxed">
                    The Gaia Hotel Bandung is a hotel in a good neighborhood, which is located at Setiabudl. 24-hours
                    front desk is available to serve you, from check-in to check-out, or any assistance you need. Should
                    you desire more, do not hesitate to ask the front desk, we are always ready to accommodate you. WIFI
                    is available with public areas of the property to help you to stay connected with family and
                    friends.
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    The Gaia Hotel Bandung is a hotel in a good neighborhood, which is located at Setiabudl. 24-hours
                    front desk is available to serve you, from check-in to check-out, or any assistance you need.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Apa Yang Tidak Boleh di Lakukan?</h2>
                  <p className="text-sm text-gray-500 mb-4">peraturan yang</p>
                  <div className="grid grid-cols-2 gap-6">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 6L6 18M6 6l12 12"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-600">Makan 3x Sehari</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 flex flex-col space-y-6">
            {/* Trip Price Card - Updated with new design */}
            <div className="bg-white rounded-[32px] p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Trip Mulai Dari</p>
                  <p className="text-[#0095FF] text-[32px] font-bold leading-tight">105.000</p>
                </div>
                <button className="flex-shrink-0 px-8 py-3 bg-gradient-to-r from-[#2B95FF] to-[#2B95FF]/90 text-white rounded-full font-medium hover:opacity-90 transition-opacity">
                  Lihat Trip
                </button>
              </div>
            </div>

            {/* Map Card - Adjusted to fill remaining space */}
            <div className="bg-white rounded-[32px] p-6 shadow-lg flex-grow flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Map Gunung</h2>
              <div className="flex-grow w-full rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.7391175229495!2d119.8335!3d-5.1347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDgnMDUuMCJTIDExOcKwNTAnMDAuNiJF!5e0!3m2!1sen!2sid!4v1635774283457!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Saya Section */}
        <div className="flex justify-center lg:justify-end pr-1 mt-16 w-[1170px]">
          <div className="w-full bg-[#FFFFFF] rounded-[24px] overflow-hidden relative mx-4 sm:mx-6 lg:mx-0 lg:mr-14 mt-10 shadow-lg">
            <div className="mt-7 px-4 sm:px-6 lg:px-6">
              <h1 className="text-[28px] font-semibold text-[#2D3648] mb-6">Trip Tersedia</h1>

              <div className="space-y-4 pb-6">
                {tripItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#eff6fe] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Image container */}
                    <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        className="object-cover"
                        priority={item.id === 1}
                      />
                    </div>

                    {/* Content and Price container */}
                    <div className="flex flex-col sm:flex-row justify-between w-full flex-grow gap-4">
                      {/* Content */}
                      <div className="flex flex-col">
                        <h2 className="text-xl font-semibold text-[#2D3648] mb-1">{item.title}</h2>
                        <p className="text-[#64748B] mb-2">{item.type}</p>
                        <p className="text-[#64748B] text-sm">{item.date}</p>
                      </div>

                      {/* Price and Button */}
                      <div className="flex flex-col sm:items-end gap-2 ml-auto">
                        <span className="text-lg font-semibold text-[#2D3648]">{item.price}</span>
                        <button
                          className="relative px-4 py-2 text-white rounded-[30px] overflow-hidden shadow-lg
                            bg-gradient-to-br from-[#9CCAFF] via-[#4A90E2] to-[#0080FF] 
                            hover:from-[#8BB8FF] hover:via-[#3A80D2] hover:to-[#0070EF]
                            transition-all duration-200 ease-in-out
                            before:absolute before:inset-0 
                            before:bg-gradient-to-br before:from-[#00FBFF] before:to-[#0080FF] 
                            before:opacity-0 before:transition-opacity before:duration-200
                            hover:before:opacity-100"
                        >
                          <span className="relative z-10">Masuk Dashboard</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}