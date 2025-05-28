"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { FaStar, FaChevronLeft } from 'react-icons/fa'
import { tripService } from '@/services/tripService'
import { bookingService } from '@/services/bookingService'

export default function TripRating() {
  const params = useParams()
  const tripId = params.id
  const [trip, setTrip] = useState(null)
  const [booking, setBooking] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchTripAndBooking = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        // Get trip details
        const tripResponse = await tripService.getTripDetail(tripId)
        if (tripResponse.success) {
          setTrip(tripResponse.data)
          
          // If trip is not closed, redirect to trip page
          if (tripResponse.data.status !== 'closed') {
            router.push(`/dashboard/trips/${tripId}`)
            return
          }
        }

        // Get user bookings to find the booking for this trip
        const bookingsResponse = await bookingService.getUserBookings()
        if (bookingsResponse.success) {
          const tripBooking = bookingsResponse.data.find(b => b.trip_id === parseInt(tripId))
          if (tripBooking) {
            setBooking(tripBooking)
            
            // Check if user has already rated this trip
            try {
              // Uncomment and fix the rating check
              const checkRatingResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/ratings/check/${tripId}`, 
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              )
              
              if (checkRatingResponse.data.has_rated) {
                setHasRated(true)
                setRating(checkRatingResponse.data.rating.rating)
                setComment(checkRatingResponse.data.rating.comment)
                
                // Redirect to dashboard if already rated (optional)
                // Uncomment this if you want to prevent access to rating page after rating
                // router.push('/dashboard')
              }
            } catch (ratingError) {
              console.error('Error checking rating:', ratingError)
              // Continue without rating data
            }
          } else {
            // If no booking found, redirect to trips page
            router.push('/dashboard')
          }
        }
      } catch (error) {
        console.error('Error fetching trip:', error)
        setError('Failed to load trip details. Please try again.')
        if (error.response?.status === 401) {
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTripAndBooking()
  }, [tripId, router])

  const handleSubmitRating = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ratings`, 
        {
          trip_id: tripId,
          booking_id: booking.id,
          rating,
          comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      
      if (response.data.success) {
        setSuccess(true)
        setHasRated(true)
        
        // Clear any cached guide data to force refresh on next visit
        localStorage.removeItem('guideProfileData')
        
        // Hapus panggilan ke endpoint yang tidak ada
        // Dan ganti dengan solusi alternatif
        try {
          // Coba refresh data guide dengan endpoint yang ada
          // Jika endpoint /api/guide/profile tersedia, gunakan itu sebagai gantinya
          await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/guide/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Guide profile data refreshed');
        } catch (refreshError) {
          // Jika gagal, tidak perlu menampilkan error ke user
          console.log('Note: Guide profile will update on next login');
        }
      } else {
        setError(response.data.message || 'Failed to submit rating')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      setError('Failed to submit rating. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg'
    const cleanPath = imagePath.replace('public/', '')
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${cleanPath}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!trip || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
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
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-500 hover:text-blue-700">
            <FaChevronLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48">
            <Image
              src={getImageUrl(trip.images?.[0]?.image_path)}
              alt={trip.mountain?.nama_gunung || 'Mountain'}
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">{trip.mountain?.nama_gunung || 'Mountain Trip'}</h1>
              <div className="flex items-center gap-2">
                <div className="text-sm bg-green-500 text-white px-2 py-1 rounded">Completed</div>
                <div className="text-sm">
                  {new Date(trip.start_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">Rate Your Experience</h2>
            
            {hasRated && success ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="text-green-500 text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Thank You for Your Rating!
                </h3>
                <p className="text-gray-600 mb-4">
                  Your feedback helps improve our service and guides other climbers.
                </p>
                <Link href="/dashboard">
                  <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    Back to Dashboard
                  </button>
                </Link>
              </div>
            ) : hasRated ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">
                  You've Already Rated This Trip
                </h3>
                
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-2xl ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                {comment && (
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <p className="text-gray-700">{comment}</p>
                  </div>
                )}
                
                <div className="text-center">
                  <Link href="/dashboard">
                    <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                      Back to Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Rate your guide</label>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <FaStar
                          className={`text-3xl ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
                    Share your experience (optional)
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Tell us about your experience with the guide and the trip..."
                  ></textarea>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Guide Information</h2>
          <div className="flex items-center gap-4 mb-4">
            {trip.guide?.profile_photo ? (
              <Image
                src={getImageUrl(trip.guide.profile_photo)}
                alt={trip.guide?.name || 'Guide'}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xl">
                {trip.guide?.name?.charAt(0) || 'G'}
              </div>
            )}
            <div>
              <div className="font-medium text-lg text-gray-800">
                {trip.guide?.name || 'Professional Guide'}
              </div>
              <div className="text-sm text-gray-500">Mountain Guide</div>
              {trip.guide?.average_rating > 0 && (
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-sm ${
                          star <= Math.round(trip.guide.average_rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600">
                    ({typeof trip.guide.average_rating === 'number' 
                      ? trip.guide.average_rating.toFixed(1) 
                      : '0.0'})
                  </span>
                </div>
              )}
            </div>
          </div>
          {trip.guide?.about && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 italic">"{trip.guide.about}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}