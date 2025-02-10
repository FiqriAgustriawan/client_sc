"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface TripMember {
  initials: string
  name: string
}

export default function DashboardTrip() {
  const members: TripMember[] = [
    { initials: "RA", name: "Muhammad Akram" },
    { initials: "RA", name: "Fiqri Agustiriawan" },
    { initials: "RA", name: "Daniel Caturangga" },
    { initials: "RA", name: "Agil Faqih" },
    { initials: "RA", name: "Adis Al Farras" },
    { initials: "RA", name: "Muhammad Fadhiul" },
    { initials: "RA", name: "Muhammad Akram" },
    { initials: "RA", name: "Fiqri Agustiriawan" },
    { initials: "RA", name: "Fiqri Agustiriawan" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8CB4DD] to-[#B5D1EC]">
      <div className="max-w-[1440px] mx-auto px-8 pt-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-3">
            <Link
              href="/gunung"
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-[#8CB4DD]" />
            </Link>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Link href="/gunung" className="hover:text-white">
                Gunung
              </Link>
              <span>/</span>
              <Link href="/gunung/bulu-baria" className="hover:text-white">
                Bulu Baria
              </Link>
              <span>/</span>
              <Link href="/gunung/bulu-baria/rawallangi" className="hover:text-white">
                RawallangiAdventure
              </Link>
              <span>/</span>
              <span>Pembayaran</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white pl-[72px]">Dashboard Trip</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Left Sidebar - Members */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8">
              <h2 className="text-xl font-semibold mb-6">Anggota Trip</h2>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#F8F8F8] rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#8CB4DD] flex items-center justify-center text-white text-sm">
                      {member.initials}
                    </div>
                    <span className="text-gray-700 text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8">
              {/* Organization Header */}
              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-20 h-20 rounded-full bg-[#8CB4DD] flex items-center justify-center text-white text-2xl mb-4">
                  RA
                </div>
                <h2 className="text-2xl font-semibold">Rawallangi Adventure</h2>
              </div>

              {/* About Section */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The Gaia Hotel Bandung is a hotel in a good neighborhood, which is located at Setiabudi. 24-hours
                  front desk is available to serve you, from check-in to check-out, or any assistance you need. Should
                  you desire more, do not hesitate to ask the front desk, we are always ready to accommodate you. WiFi
                  is available within public areas of the property to help you to stay connected with family and
                  friends.
                </p>
              </section>

              {/* General Information */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Informasi Umum</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Tanggal Trip : 10 - 11 January 2025</p>
                  <p className="text-gray-600">Durasi : 2 Hari 1 Malam</p>
                  <p className="text-gray-600">Ketinggian : 2342 MDPL</p>
                  <p className="text-gray-600">Lokasi : Gowa, Sulawesi Selatan</p>
                </div>
              </section>

              {/* Schedule */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Rencana Perjalanan</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 text-sm">
                    Hari 1 : Berkumpul di titik awal (Ranu Pane), briefing dan registrasi.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Hari 2 : Berkumpul di titik awal (Ranu Pane), briefing dan registrasi.
                  </p>
                  <p className="text-gray-600 text-sm">
                    Hari 3 : Berkumpul di titik awal (Ranu Pane), briefing dan registrasi.
                  </p>
                </div>
              </section>

              {/* Facilities */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Fasilitas</h3>
                <p className="text-gray-600 text-sm mb-4">Fasilitas yang diberikan oleh penyedia jasa</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array(7)
                    .fill("Makan 3x Sehari")
                    .map((facility, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{facility}</span>
                      </div>
                    ))}
                </div>
              </section>

              {/* Required Items */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Barang Yang Harus Di Bawa</h3>
                <p className="text-gray-600 text-sm mb-4">Fasilitas yang tidak diberikan oleh penyedia jasa</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array(5)
                    .fill("2 Hari 1 Malam")
                    .map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600 text-sm">{item}</span>
                      </div>
                    ))}
                </div>
              </section>

              {/* Contact */}
              <section>
                <h3 className="text-lg font-semibold mb-4">Kontak Penyedia Jasa</h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

