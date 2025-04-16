"use client"
import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { FiChevronLeft, FiMapPin, FiClock, FiX, FiInfo, FiHeart } from 'react-icons/fi'
import { getMountainById } from "@/services/mountain.service"
// Add to imports
import { FiExternalLink, FiNavigation, FiMap } from 'react-icons/fi'
import { FiHelpCircle } from 'react-icons/fi'
import StatusDrawer from '@/components/StatusDrawer'


export default function MountainDetail({ params }) {
  const mountainId = use(params).id

  // Group all useState hooks together at the top
  const [mountain, setMountain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [statusDrawerOpen, setStatusDrawerOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [favorite, setFavorite] = useState(false)

  // Helper function moved outside of render
  const extractCoordinates = (url) => {
    try {
      const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/
      const matches = url.match(regex)
      return matches ? { lat: matches[1], lng: matches[2] } : null
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    const fetchMountain = async () => {
      try {
        const response = await getMountainById(mountainId)
        setMountain(response.data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMountain()
  }, [mountainId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-8 border-blue-500/20 border-t-blue-600 animate-spin"></div>
          <div className="w-12 h-12 rounded-full border-6 border-indigo-400/30 border-t-indigo-500 animate-spin absolute top-2 left-2"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-6 left-6 animate-bounce shadow-lg shadow-blue-500/50"></div>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold text-lg">
              Loading...
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (!mountain) return null

  return (
    <div className="min-h-screen bg-white">
      {/* New Header Section - Blue Background with Rounded Bottom */}
      <div className="bg-blue-400 pt-16 pb-32 relative rounded-b-[100px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Navigation */}
          <div className="flex items-center gap-2 text-white mb-6">
            <Link href="/gunung" className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full">
              <FiChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center text-sm">
              <Link href="/gunung" className="hover:text-blue-100 transition-colors">Gunung</Link>
              <span className="mx-2">/</span>
              <span className="font-medium">{mountain.nama_gunung}</span>
            </div>
          </div>

          {/* Mountain Title */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-white">{mountain.nama_gunung}</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFavorite(!favorite)}
                className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full"
              >
                <FiHeart className={`w-5 h-5 ${favorite ? 'fill-white text-white' : 'text-white'}`} />
              </button>
              <div className="bg-white px-4 py-2 rounded-full shadow-lg">
                <span className="font-semibold text-blue-600">{mountain.ketinggian} MDPL</span>
              </div>
            </div>
          </div>

          {/* Location and Time */}
          <div className="text-white/90 mb-6">
            <p className="mb-1">{mountain.lokasi}</p>
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4" />
              <p>Status: {mountain.status_gunung}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section - Overlapping with blue section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-12 relative z-20">
        <div className="bg-white rounded-3xl p-4 shadow-lg">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <div
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(mountain.images[0])}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${mountain.images[0]?.image_path}`}
                  alt={mountain.nama_gunung}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="col-span-6 grid grid-cols-2 gap-2">
              {mountain.images.slice(1, 5).map((image, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  {i === 3 && mountain.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                      <span className="font-medium">+{mountain.images.length - 5} Photos</span>
                    </div>
                  )}
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image.image_path}`}
                    alt={`${mountain.nama_gunung} view ${i + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Deskripsi</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {mountain.deskripsi}
              </p>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Peraturan Pendakian</h2>
              <ul className="space-y-3">
                {mountain.peraturan.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rest of the sidebar content remains the same */}

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="space-y-5">
                {/* Mountain Status Section */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Status Gunung</h3>
                    <div className="group relative cursor-help">
                      <FiHelpCircle className="text-gray-400 w-4 h-4 hover:text-gray-600 transition-colors" />
                      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute z-10 -top-2 right-6 w-56 bg-white text-gray-600 text-xs rounded-lg p-3 shadow-xl border border-gray-100">
                        <div className="space-y-1.5">
                          <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Mudah: Medan relatif landai
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Menengah: Medan cukup terjal
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Sulit: Medan sangat terjal
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer
    ${mountain.status_gunung === 'mudah' ? 'bg-green-50 text-green-700' : ''}
    ${mountain.status_gunung === 'menengah' ? 'bg-yellow-50 text-yellow-700' : ''}
    ${mountain.status_gunung === 'sulit' ? 'bg-red-50 text-red-700' : ''}
  `}
                    onClick={() => {
                      setSelectedStatus({ type: 'gunung', status: mountain.status_gunung })
                      setStatusDrawerOpen(true)
                    }}
                  >
                    <span className={`w-2 h-2 rounded-full mr-2
          ${mountain.status_gunung === 'mudah' ? 'bg-green-500 animate-pulse' : ''}
          ${mountain.status_gunung === 'menengah' ? 'bg-yellow-500 animate-pulse' : ''}
          ${mountain.status_gunung === 'sulit' ? 'bg-red-500 animate-pulse' : ''}
        `}></span>
                    <span className="capitalize">{mountain.status_gunung}</span>
                  </div>
                </div>

                {/* Climbing Level Section */}
                <div className="relative pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-700">Level Pendakian</h3>
                    <div className="group relative cursor-help">
                      <FiHelpCircle className="text-gray-400 w-4 h-4 hover:text-gray-600 transition-colors" />
                      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute z-10 -top-2 right-6 w-56 bg-white text-gray-600 text-xs rounded-lg p-3 shadow-xl border border-gray-100">
                        <div className="space-y-1.5">
                          <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Pemula: Cocok untuk pendaki pertama
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            Mahir: Butuh pengalaman pendakian
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Ahli: Perlu keahlian khusus
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer
    ${mountain.status_pendakian === 'pemula' ? 'bg-green-50 text-green-700' : ''}
    ${mountain.status_pendakian === 'mahir' ? 'bg-yellow-50 text-yellow-700' : ''}
    ${mountain.status_pendakian === 'ahli' ? 'bg-red-50 text-red-700' : ''}
  `}
                    onClick={() => {
                      setSelectedStatus({ type: 'pendakian', status: mountain.status_pendakian })
                      setStatusDrawerOpen(true)
                    }}
                  >
                    <span className="capitalize">{mountain.status_pendakian}</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Lokasi</h2>
                <div className="flex gap-2">
                  <a
                    href={mountain.link_map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FiMap className="w-4 h-4" />
                    <span>Lihat Maps</span>
                  </a>
                </div>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden relative group">
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mountain.lokasi)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <a
                    href={mountain.link_map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white px-6 py-3 rounded-full text-gray-800 font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <FiNavigation className="w-5 h-5" />
                    Buka di Google Maps
                  </a>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-gray-600">
                <FiMapPin className="w-4 h-4" />
                <p className="text-sm">{mountain.lokasi}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${selectedImage.image_path}`}
                alt={mountain.nama_gunung}
                width={1200}
                height={800}
                className="w-full h-auto"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
      {
        selectedStatus && (
          <StatusDrawer
            isOpen={statusDrawerOpen}
            onClose={() => setStatusDrawerOpen(false)}
            type={selectedStatus.type}
            status={selectedStatus.status}
          />
        )
      }
    </div>
  )
}
