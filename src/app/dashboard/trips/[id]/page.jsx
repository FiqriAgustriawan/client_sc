"use client"

import { useEffect, useState, use } from 'react'
import { useAuth } from '@/context/AuthContext'
import { tripService } from '@/services/tripService'
import { bookingService } from '@/services/bookingService'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  FaWhatsapp,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaInfoCircle,
  FaList,
  FaCheckCircle,
  FaDownload // Add this
} from 'react-icons/fa'

export default function TripDetail({ params }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params)
  const tripId = unwrappedParams.id

  const [trip, setTrip] = useState(null)
  const [booking, setBooking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('info')
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        // Get trip details - using unwrapped tripId
        const tripResponse = await tripService.getTripDetail(tripId)
        if (tripResponse.success) {
          setTrip(tripResponse.data)
        }

        // Get user bookings to find the booking for this trip
        const bookingsResponse = await bookingService.getUserBookings()
        if (bookingsResponse.success) {
          const tripBooking = bookingsResponse.data.find(b => b.trip_id === parseInt(tripId))
          if (tripBooking) {
            setBooking(tripBooking)
          } else {
            // If no booking found, redirect to trips page
            router.push('/trips')
          }
        }
      } catch (error) {
        console.error('Error fetching trip:', error)
        if (error.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTripDetail()
  }, [tripId, router])

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg'
    const cleanPath = imagePath.replace('public/', '')
    return `http://localhost:8000/storage/${cleanPath}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!trip || !booking || booking.status !== 'confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trip not found or not confirmed</h2>
          <Link href="/dashboard">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-500 hover:text-blue-700">
            <FaChevronLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64">
            <Image
              src={getImageUrl(trip.images?.[0]?.image_path)}
              alt={trip.mountain?.nama_gunung || 'Mountain'}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{trip.mountain?.nama_gunung || 'Mountain Trip'}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt />
                  <span>
                    {new Date(trip.start_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })} - {new Date(trip.end_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers />
                  <span>{trip.capacity} participants</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="border-b">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`px-6 py-4 font-medium ${activeTab === 'info'
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaInfoCircle />
                      <span>Trip Info</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('facilities')}
                    className={`px-6 py-4 font-medium ${activeTab === 'facilities'
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaList />
                      <span>Facilities</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('terms')}
                    className={`px-6 py-4 font-medium ${activeTab === 'terms'
                        ? 'text-blue-500 border-b-2 border-blue-500'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaCheckCircle />
                      <span>Terms</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Trip Information</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {trip.trip_info}
                    </p>
                  </div>
                )}

                {activeTab === 'facilities' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Facilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trip.facilities?.map((facility, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                            <FaCheckCircle />
                          </div>
                          <span className="text-gray-700">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'terms' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Terms & Conditions</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {trip.terms_conditions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Trip Contact</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <h4 className="font-medium text-gray-700 mb-2">WhatsApp Group</h4>
                    {trip.whatsapp_group ? (
                      <a
                        href={trip.whatsapp_group}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <FaWhatsapp size={20} />
                        <span>Join Group Chat</span>
                      </a>
                    ) : (
                      <p className="text-gray-500">No WhatsApp group available yet</p>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-medium text-gray-700 mb-2">Guide Information</h4>
                    <div className="flex items-center gap-3 mb-3">
                      {trip.guide?.user?.profile_image ? (
                        <Image
                          src={getImageUrl(trip.guide.user.profile_image)}
                          alt={trip.guide?.user?.name || 'Guide'}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {trip.guide?.user?.name?.charAt(0) || 'G'}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-800">
                          {trip.guide?.user?.name || 'Professional Guide'}
                        </div>
                        <div className="text-sm text-gray-500">Mountain Guide</div>
                      </div>
                    </div>
                    {trip.guide?.about && (
                      <div className="mb-3 p-3 bg-blue-50/50 rounded-lg">
                        <p className="text-sm text-gray-600 italic">"{trip.guide.about}"</p>
                      </div>
                    )}
                    {trip.guide?.whatsapp && (
                      <a
                        href={`https://wa.me/${trip.guide.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <FaWhatsapp size={16} />
                        <span>Contact Guide</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Payment Information</h3>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="font-medium text-green-600">Paid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Invoice</span>
                      <span className="font-medium">{booking.payment?.invoice_number || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium">Rp {trip.price?.toLocaleString()}</span>
                    </div>

                    {/* Add Invoice Buttons */}
                    <div className="pt-4 space-y-2">
                      <Link
                        href={`/dashboard/invoice/${booking.payment?.invoice_number}`}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                      >
                        <FaInfoCircle />
                        <span>View Invoice</span>
                      </Link>

                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}/api/payments/${booking.payment?.invoice_number}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                        download
                      >
                        <FaDownload />
                        <span>Download Invoice</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}