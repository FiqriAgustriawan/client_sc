"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { bookingService } from '@/services/bookingService'
import Link from 'next/link'
import Image from 'next/image'
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaStar, FaCamera } from 'react-icons/fa'
import { MdOutlineRateReview, MdHiking } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/utils/formatters'
import Lightbox from 'yet-another-react-lightbox'
import "yet-another-react-lightbox/styles.css"
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function HistoryPage() {
  const [completedTrips, setCompletedTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [openLightbox, setOpenLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [expandedTrip, setExpandedTrip] = useState(null)
  
  useEffect(() => {
    const checkAuthAndFetchTrips = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!authLoading && !token) {
          router.push('/login?redirect=/dashboard-user/history')
          return
        }

        if (token && !authLoading) {
          await fetchCompletedTrips()
        }
      } catch (err) {
        console.error("Error in auth check:", err)
        setError("Terjadi kesalahan saat memeriksa autentikasi")
      }
    }

    checkAuthAndFetchTrips()
  }, [authLoading, router])

  const fetchCompletedTrips = async () => {
    try {
      setIsLoading(true)
      
      // Mengambil semua booking
      const response = await bookingService.getUserBookings()
      
      if (response.success) {
        // Filter hanya booking dengan trip yang sudah selesai
        const completed = response.data.filter(booking => 
          booking.status === 'confirmed' && 
          booking.trip?.status === 'closed' &&
          new Date(booking.trip?.end_date) < new Date()
        )
        
        // Mengambil detail rating jika ada
        const tripsWithRatings = await Promise.all(completed.map(async (booking) => {
          try {
            // Check if user has already rated this trip
            const ratingResponse = await fetch(`/api/ratings/check/${booking.trip_id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            })
            
            const ratingData = await ratingResponse.json()
            
            return {
              ...booking,
              userRating: ratingData.success ? ratingData.data : null
            }
          } catch (err) {
            console.error(`Failed to fetch rating for trip ${booking.trip_id}:`, err)
            return booking
          }
        }))
        
        setCompletedTrips(tripsWithRatings)
      }
    } catch (error) {
      console.error('Failed to fetch completed trips:', error)
      setError('Gagal mengambil data perjalanan yang telah selesai')
      
      if (error.response?.status === 401) {
        router.push('/login?redirect=/dashboard-user/history')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  const getStatusText = (status) => {
    switch(status) {
      case 'closed': return 'Selesai'
      case 'cancelled': return 'Dibatalkan'
      default: return status
    }
  }
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'closed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg'
    const cleanPath = imagePath.replace('public/', '')
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/storage/${cleanPath}`
  }
  
  const handleViewGallery = (trip, index = 0) => {
    setSelectedTrip(trip)
    setLightboxIndex(index)
    setOpenLightbox(true)
  }
  
  const toggleExpandedTrip = (tripId) => {
    if (expandedTrip === tripId) {
      setExpandedTrip(null)
    } else {
      setExpandedTrip(tripId)
    }
  }
  
  if (authLoading) {
    return <LoadingSpinner message="Memuat informasi pengguna..." />
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Riwayat Perjalanan</h1>
          <p className="text-gray-600">Semua perjalanan gunung yang telah Anda selesaikan</p>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <LoadingSpinner message="Memuat riwayat perjalanan..." />
        ) : error ? (
          <div className="bg-red-50 rounded-xl p-6 text-center shadow-lg">
            <div className="text-red-500 text-xl font-semibold mb-2">{error}</div>
            <button 
              onClick={() => fetchCompletedTrips()}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : completedTrips.length === 0 ? (
          <EmptyState 
            icon={<MdHiking className="text-blue-500 text-4xl" />}
            title="Belum Ada Perjalanan Selesai"
            description="Anda belum memiliki riwayat perjalanan yang telah selesai. Selesaikan perjalanan untuk melihatnya di sini."
            actionText="Jelajahi Perjalanan"
            actionLink="/trips"
          />
        ) : (
          <div className="space-y-6">
            {completedTrips.map((booking) => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="md:flex">
                  {/* Trip Image */}
                  <div className="md:w-1/3 relative h-48 md:h-auto group cursor-pointer"
                       onClick={() => booking.trip?.images?.length > 0 && handleViewGallery(booking.trip)}>
                    {booking.trip?.images?.length > 0 ? (
                      <>
                        <Image
                          src={getImageUrl(booking.trip.images[0]?.image_path)}
                          alt={booking.trip?.mountain?.nama_gunung || 'Mountain Trip'}
                          fill
                          className="object-cover transition-transform group-hover:scale-105 duration-700"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/80 backdrop-blur-sm rounded-full p-3">
                            <FaCamera className="text-gray-800 text-xl" />
                          </div>
                          <p className="absolute bottom-3 right-3 text-white bg-black/50 px-2 py-1 rounded text-xs">
                            {booking.trip?.images?.length} foto
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-400">Tidak ada foto</p>
                      </div>
                    )}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.trip?.status)}`}>
                      {getStatusText(booking.trip?.status)}
                    </div>
                  </div>
                  
                  {/* Trip Details */}
                  <div className="p-6 md:w-2/3">
                    <div className="flex flex-wrap justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold mb-1">{booking.trip?.mountain?.nama_gunung || 'Mountain Trip'}</h2>
                        <p className="text-gray-600 mb-2">
                          {new Date(booking.trip?.start_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })} - {new Date(booking.trip?.end_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      
                      {/* User Rating Badge */}
                      {booking.userRating ? (
                        <div className="bg-yellow-100 px-4 py-2 rounded-full flex items-center">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} 
                                className={`${i < booking.userRating.rating ? 'text-yellow-500' : 'text-gray-300'} text-lg`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-gray-700 font-semibold">{booking.userRating.rating}.0</span>
                        </div>
                      ) : (
                        <Link href={`/dashboard-user/trip-manage/${booking.trip_id}/rating`}>
                          <button className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors flex items-center space-x-1">
                            <MdOutlineRateReview />
                            <span>Beri Rating</span>
                          </button>
                        </Link>
                      )}
                    </div>


                    {/* Trip Info */}
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-blue-500" />
                        <span>{booking.trip?.capacity || 0} peserta</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-500" />
                        <span>{booking.trip?.mountain?.lokasi || 'Location'}</span>
                      </div>
                  
                      <div className="font-medium text-blue-700">
                        {formatCurrency(booking.trip?.price || 0)}
                      </div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <motion.button 
                        onClick={() => toggleExpandedTrip(booking.trip_id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {expandedTrip === booking.trip_id ? 'Sembunyikan Detail' : 'Lihat Detail'}
                      </motion.button>
                      
                      <Link href={`/dashboard-user/trip-manage/invoice/${booking.payment?.id}`}>
                        <motion.button 
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          Lihat Invoice
                        </motion.button>
                      </Link>
                      
                      {booking.trip?.whatsapp_group && (
                        <a 
                          href={booking.trip.whatsapp_group} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                          >
                            <FaUsers />
                            <span>Grup WhatsApp</span>
                          </motion.button>
                        </a>
                      )}
                    </div>
                    
                    {/* Expanded Details */}
                    {expandedTrip === booking.trip_id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-gray-100"
                      >
                        <h3 className="text-lg font-semibold mb-4">Detail Perjalanan</h3>
                        
                        {/* Guide Info */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Informasi Guide</h4>
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden">
                              <Image 
                                src={getImageUrl(booking.trip?.guide?.profile_photo) || '/images/avatar-placeholder.jpg'} 
                                alt={booking.trip?.guide?.name || "Guide"} 
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <div className="font-medium">{booking.trip?.guide?.name || "Guide"}</div>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <FaStar className="text-yellow-500 mr-1" />
                                <span>{booking.trip?.guide?.rating || '0'} Rating</span>
                                <span className="mx-2">•</span>
                                <span>{booking.trip?.guide?.trips_count || '0'} Perjalanan</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Trip Description */}
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Deskripsi</h4>
                          <p className="text-gray-700 whitespace-pre-line">{booking.trip?.description || "Tidak ada deskripsi perjalanan."}</p>
                        </div>
                        
                        {/* Trip Itinerary */}
                        {booking.trip?.itinerary && (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Itinerary</h4>
                            <div className="bg-blue-50 rounded-xl p-4">
                              <p className="text-gray-700 whitespace-pre-line">{booking.trip.itinerary}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* User Rating */}
                        {booking.userRating ? (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Rating Anda</h4>
                            <div className="bg-yellow-50 rounded-xl p-4">
                              <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} 
                                    className={`${i < booking.userRating.rating ? 'text-yellow-500' : 'text-gray-300'} text-xl`} 
                                  />
                                ))}
                                <span className="ml-2 text-gray-700 font-semibold">{booking.userRating.rating}.0</span>
                              </div>
                              <p className="text-gray-700">{booking.userRating.review || "Tidak ada ulasan."}</p>
                              <div className="text-xs text-gray-500 mt-2">
                                Dibuat pada {new Date(booking.userRating.created_at).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Rating Anda</h4>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                              <p className="text-gray-500 mb-3">Anda belum memberikan rating untuk perjalanan ini</p>
                              <Link href={`/dashboard-user/trip-manage/${booking.trip_id}/rating`}>
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                                  Beri Rating Sekarang
                                </button>
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {/* Photo Gallery */}
                        {booking.trip?.images && booking.trip.images.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Galeri Foto</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {booking.trip.images.slice(0, 8).map((image, index) => (
                                <motion.div 
                                  key={index}
                                  whileHover={{ scale: 1.05 }}
                                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                                  onClick={() => handleViewGallery(booking.trip, index)}
                                >
                                  <Image
                                    src={getImageUrl(image.image_path)}
                                    alt={`Gallery image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                  {index === 7 && booking.trip.images.length > 8 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                      <span className="text-white font-medium text-lg">+{booking.trip.images.length - 8}</span>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Lightbox for Gallery */}
      {selectedTrip && (
        <Lightbox
          open={openLightbox}
          close={() => setOpenLightbox(false)}
          slides={selectedTrip.images.map(img => ({ src: getImageUrl(img.image_path) }))}
          index={lightboxIndex}
        />
      )}
    </div>
  )
}