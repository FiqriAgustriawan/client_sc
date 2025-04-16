"use client"

import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { tripService } from '@/services/tripService'
import { useAuth } from '@/context/AuthContext'
import { IoChevronBack } from 'react-icons/io5'
import { IoClose } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { bookingService } from '@/services/bookingService'
import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'
// Add these imports at the top

import { paymentConfig } from '@/config/payment'
// Add this new component for the image modal
const ImageModal = ({ image, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={onClose}>
        <IoClose size={32} />
      </button>
      <div className="relative max-w-7xl max-h-[90vh] w-full h-full" onClick={e => e.stopPropagation()}>
        <Image
          src={image}
          alt="Preview"
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>
    </div>
  )
}



// Add these helper functions
const getGuideName = (guide) => {
  return guide?.user?.name || 'Guide'
}

const getGuideInitials = (guide) => {
  if (!guide?.user?.name) return 'G'
  const names = guide.user.name.split(' ')
  if (names.length > 1) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
}

export default function TripDetail({ params }) {
  const [trip, setTrip] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [previewImage, setPreviewImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const tripId = use(params).id

  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const response = await tripService.getTripDetail(tripId)
        if (response.success) {
          console.log('Trip Detail Data:', response.data) // Add this to debug
          setTrip(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch trip details:', error)
      }
    }

    fetchTripDetail()
  }, [tripId])

  // Update the helper functions
  const getGuideName = (guide) => {
    console.log('Guide Data:', guide) // Add this to debug
    return guide?.user?.name || guide?.name || 'Guide'
  }

  const getGuideInitials = (guide) => {
    const name = guide?.user?.name || guide?.name
    if (!name) return 'G'
    return name.charAt(0).toUpperCase()
  }
  // Update the handleBookTrip function
  const handleBookTrip = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(`/trips/${tripId}`))
      return
    }
  
    try {
      setIsLoading(true)
      
      // Check if user already has a booking for this trip
      const bookingsResponse = await bookingService.getUserBookings()
      
      if (bookingsResponse.success) {
        const existingBooking = bookingsResponse.data.find(
          booking => booking.trip_id === parseInt(tripId)
        )
        
        // If booking exists and is confirmed or payment is completed, go to dashboard
        if (existingBooking && (existingBooking.status === 'confirmed' || 
            existingBooking.payment?.status === 'paid')) {
          toast.success('You already have a booking for this trip')
          router.push('/dashboard')
          return
        }
      }
      
      // Proceed with booking
      const response = await bookingService.bookTrip(tripId)
      
      if (response.success && response.data?.payment_url) {
        // Store trip ID before redirecting to payment
        localStorage.setItem('pending_trip_id', tripId)
        window.location.href = response.data.payment_url
      } else if (!response.success && response.data?.payment_url) {
        // For existing bookings with pending payment
        window.location.href = response.data.payment_url
      } else {
        // For any other case
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to process booking')
    } finally {
      setIsLoading(false)
    }
  }
  

  // Replace the existing useEffect that handles payment success
  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const response = await tripService.getTripDetail(tripId)
        if (response.success) {
          setTrip(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch trip details:', error)
      }
    }

    fetchTripDetail()

    // Check if we're coming from a payment
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get('status')
    const transactionStatus = urlParams.get('transaction_status')
    
    // If we have payment success parameters, redirect to dashboard
    if (status === 'success' || transactionStatus === 'settlement' || transactionStatus === 'capture') {
      // Store authentication token in localStorage if not already there
      const token = localStorage.getItem('token')
      if (!token && user?.token) {
        localStorage.setItem('token', user.token)
      }
      
      toast.success('Payment successful!')
      // Use window.location for a full page reload to clear parameters
      window.location.href = '/dashboard'
    }
  }, [tripId, user])
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg'
    return `http://localhost:8000/storage/${imagePath}`
  }

  if (!trip) return null

  return (
    <div className="min-h-screen bg-white">
      {/* Header with curved background */}
      <div className="relative bg-blue-400 h-[30vh] rounded-b-[3rem] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/30 to-transparent z-10" />
        <Link 
          href="/trips" 
          className="absolute top-8 left-4 z-20 flex items-center text-white hover:text-blue-100 transition-colors"
        >
          <IoChevronBack size={24} />
          <span className="ml-1">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        {/* Image Gallery Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-8"
        >
          <div
            className="relative h-[400px] rounded-2xl overflow-hidden mb-4 cursor-pointer"
            onClick={() => setPreviewImage(getImageUrl(trip?.images?.[selectedImage]?.image_path))}
          >
            <Image
              src={getImageUrl(trip?.images?.[selectedImage]?.image_path)}
              alt={trip?.mountain?.nama_gunung || 'Mountain View'}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
            {trip?.images?.map((img, idx) => (
              <div
                key={idx}
                className={`relative h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 
                  ${selectedImage === idx ? 'ring-2 ring-blue-500 scale-95' : 'hover:opacity-80'}`}
                onClick={() => setSelectedImage(idx)}
              >
                <Image
                  src={getImageUrl(img.image_path)}
                  alt={`Trip image ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trip Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h1 className="text-3xl font-bold mb-2">{trip?.mountain?.nama_gunung}</h1>
              <div className="flex items-center gap-3 text-gray-600 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                  Open Trip
                </span>
                <span>•</span>
                <span>{trip?.capacity} Pendaki</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Informasi Trip</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap max-h-[200px] overflow-y-auto pr-2">
                    {trip?.trip_info}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Fasilitas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {trip?.facilities?.map((facility, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-gray-600 p-2 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Syarat & Ketentuan</h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {trip?.terms_conditions}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-2xl font-bold text-blue-600 mb-6">
                Rp {trip.price.toLocaleString()}
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-gray-700 mb-2">Jadwal Trip</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mulai</span>
                      <span className="font-medium">{new Date(trip.start_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Selesai</span>
                      <span className="font-medium">{new Date(trip.end_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                  </div>
                </div>
                
                {/* Guide info section */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100"
                >
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">Guide Info</span>
                    <div className="h-px flex-grow bg-gradient-to-r from-green-200 to-transparent"></div>
                  </h4>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="relative w-16 h-16 shadow-md rounded-full overflow-hidden"
                    >
                      {trip.guide?.user?.profile_image ? (
                        <Image
                          src={getImageUrl(trip.guide.user.profile_image)}
                          alt={getGuideName(trip.guide)}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xl font-semibold">
                          {getGuideInitials(trip.guide)}
                        </div>
                      )}
                    </motion.div>
                    <div>
                      <div className="font-semibold text-gray-800 text-lg">{getGuideName(trip.guide)}</div>
                      <div className="text-sm text-emerald-600 font-medium">Professional Mountain Guide</div>
                    </div>
                  </div>
                  
                  {trip.guide?.about && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mb-4 bg-white bg-opacity-60 p-4 rounded-lg border border-green-100"
                    >
                      <h5 className="text-sm font-medium text-emerald-700 mb-2">About Guide</h5>
                      <p className="text-sm text-gray-600 leading-relaxed italic">"{trip.guide.about}"</p>
                    </motion.div>
                  )}
                  
                  {trip.guide?.whatsapp && (
                    <motion.a 
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={`https://wa.me/${trip.guide.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium transition-colors w-full mt-2 shadow-sm"
                    >
                      <FaWhatsapp size={18} />
                      <span>Contact Guide</span>
                    </motion.a>
                  )}
                </motion.div>
              </div>
              
              {user ? (
                <button 
                  onClick={handleBookTrip}
                  disabled={isLoading}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    isLoading 
                      ? 'bg-blue-300 text-white cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Masuk Trip'}
                </button>
              ) : (
                <button 
                  onClick={() => router.push('/login?redirect=' + encodeURIComponent(`/trips/${tripId}`))}
                  className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Login untuk Bergabung
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImageModal 
          image={previewImage} 
          onClose={() => setPreviewImage(null)} 
        />
      )}
    </div>
  )
}
