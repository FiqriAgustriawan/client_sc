"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { bookingService } from '@/services/bookingService'
import Link from 'next/link'
import Image from 'next/image'
import { FaWhatsapp, FaCalendarAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Fix the isAuthenticated reference error and improve authentication handling
  useEffect(() => {
    const checkAuthAndFetchBookings = async () => {
      const token = localStorage.getItem('token')

      if (!authLoading && !token) {
        router.push('/login?redirect=/dashboard')
        return
      }

      if (token) {
        await fetchBookings()
      }
    }

    checkAuthAndFetchBookings()
  }, [authLoading])

  // Update the fetchBookings function to properly handle payment status
  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await bookingService.getUserBookings()
      if (response.success) {
        // Check each booking's payment status
        const updatedBookings = await Promise.all(response.data.map(async (booking) => {
          if (booking.payment?.status === 'pending') {
            try {
              const paymentStatus = await bookingService.verifyPaymentStatus(booking.payment.order_id)
              if (paymentStatus.success &&
                (paymentStatus.data.status === 'settlement' ||
                  paymentStatus.data.status === 'capture')) {
                booking.payment.status = 'paid'
                booking.status = 'confirmed'
              }
            } catch (error) {
              console.error('Error checking payment status:', error)
            }
          }
          return booking
        }))
        setBookings(updatedBookings)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      if (error.response?.status === 401) {
        router.push('/login?redirect=/dashboard')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Add this function to handle manual status check
  // In your handleCheckStatus function
  const handleCheckStatus = async (booking) => {
    try {
      setIsLoading(true)
      // Make sure booking.payment exists and has invoice_number
      if (!booking.payment?.invoice_number) {
        toast.error('Invalid payment information')
        return
      }

      const paymentStatus = await bookingService.verifyPaymentStatus(booking.payment.invoice_number)

      if (paymentStatus.success) {
        if (paymentStatus.data.status === 'settlement' ||
          paymentStatus.data.status === 'capture') {
          // Handle successful payment
          await bookingService.handlePaymentReturn(
            booking.payment.order_id,
            paymentStatus.data.status
          )
          toast.success('Payment verified successfully!')
          fetchBookings() // Refresh the bookings list
        } else {
          toast.info(`Payment status: ${paymentStatus.data.status}`)
        }
      } else {
        toast.error(paymentStatus.message || 'Failed to verify payment')
      }
    } catch (error) {
      console.error('Payment check error:', error)
      toast.error('Failed to check payment status')
    } finally {
      setIsLoading(false)
    }
  }

  // Update getImageUrl function to match trip detail implementation
  // Update getImageUrl function
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg'
    const cleanPath = imagePath.replace('public/', '')
    return `http://localhost:8000/storage/${cleanPath}`
  }

  // Remove the standalone Image component that was causing the error
  // It should only be used inside the return statement where booking is defined

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'failed': return 'bg-red-100 text-red-700'
      case 'expired': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Fix the loading state check that's causing the error
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  const handleCompletePayment = async (bookingId) => {
    try {
      setIsLoading(true)
      const response = await bookingService.handleCompletePayment(bookingId)

      if (response.success && response.payment_url) {
        // If we got a new payment URL, redirect to it
        window.location.href = response.payment_url
      } else if (response.success) {
        // If payment was already completed and status updated
        toast.success('Payment status updated successfully!')
        fetchBookings() // Refresh the bookings list
      } else {
        toast.error(response.message || 'Failed to process payment')
      }
    } catch (error) {
      console.error('Payment completion error:', error)
      toast.error('Failed to process payment')
    } finally {
      setIsLoading(false)
    }
  }

  // Remove the standalone payment button section that's causing the error
  // and update the payment button section inside the bookings.map()

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-gray-600">Manage your booked mountain trips</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-blue-500 text-2xl" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No trips booked yet</h2>
            <p className="text-gray-600 mb-6">Explore available trips and start your adventure!</p>
            <Link href="/trips">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                Explore Trips
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="relative h-[300px] md:h-[400px] overflow-hidden group">
                    <Image
                      src={getImageUrl(booking.trip?.images?.[0]?.image_path)}
                      alt={booking.trip?.mountain?.nama_gunung || 'Mountain View'}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      priority
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <motion.div 
                    className="p-6 md:col-span-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status === 'confirmed' ? 'Confirmed' :
                          booking.status === 'pending' ? 'Pending' : 'Cancelled'}
                      </span>
                      {booking.payment && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.payment.status)}`}>
                          Payment: {booking.payment.status === 'paid' ? 'Paid' :
                            booking.payment.status === 'pending' ? 'Pending' :
                              booking.payment.status === 'failed' ? 'Failed' : 'Expired'}
                        </span>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold mb-4 hover:text-blue-600 transition-colors">
                      {booking.trip?.mountain?.nama_gunung || 'Mountain Trip'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors">
                        <FaCalendarAlt className="text-blue-500 text-lg" />
                        <span className="text-sm">
                          {new Date(booking.trip?.start_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })} - {new Date(booking.trip?.end_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 hover:text-blue-500 transition-colors">
                        <FaUsers className="text-blue-500 text-lg" />
                        <span className="text-sm">{booking.trip?.capacity} participants</span>
                      </div>
                    </div>

                    {booking.status === 'confirmed' && (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                          <h4 className="font-medium text-gray-700 mb-2">Trip Information</h4>
                          <div className="space-y-2">
                            {booking.trip?.whatsapp_group && (
                              <a
                                href={booking.trip.whatsapp_group}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                              >
                                <FaWhatsapp size={20} />
                                <span>Join WhatsApp Group</span>
                              </a>
                            )}
                          </div>
                        </div>

                        <Link 
                          href={`/dashboard/trips/${booking.trip.id}`}
                          className="block w-full"
                        >
                          <button 
                            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                          >
                            View Trip Details
                          </button>
                        </Link>
                      </motion.div>
                    )}

                    {booking.status === 'pending' && booking.payment?.status === 'pending' && (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {/* ... Payment buttons with enhanced hover effects ... */}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}