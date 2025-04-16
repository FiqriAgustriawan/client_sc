'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'

export default function TripDashboard() {
  const params = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [finishLoading, setFinishLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        // Fetch trip details
        const tripResponse = await axios.get(`http://localhost:8000/api/trips/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (tripResponse.data.success) {
          setTrip(tripResponse.data.data)
        } else {
          setError('Failed to fetch trip details')
        }

        // Fetch bookings for this trip
        const bookingsResponse = await axios.get(`http://localhost:8000/api/guide/bookings?trip_id=${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (bookingsResponse.data.success) {
          setBookings(bookingsResponse.data.data)
        }
      } catch (err) {
        console.error('Error fetching trip details:', err)
        setError('Error fetching trip details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTripDetails()
    }
  }, [params.id, router])

  const handleFinishTrip = async () => {
    try {
      setFinishLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await axios.post(
        `http://localhost:8000/api/guide/trips/${params.id}/finish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        setSuccessMessage(response.data.message)
        // Update trip status locally
        setTrip({
          ...trip,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        
        // Show success message for 3 seconds then redirect
        setTimeout(() => {
          router.push('/index-jasa/trip-jasa')
        }, 3000)
      } else {
        setError(response.data.message || 'Failed to finish trip')
      }
    } catch (err) {
      console.error('Error finishing trip:', err)
      setError(err.response?.data?.message || 'Error finishing trip. Please try again.')
    } finally {
      setFinishLoading(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, 'd MMMM yyyy', { locale: id })
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/index-jasa/trip-jasa')}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Trip tidak ditemukan</p>
          <button 
            onClick={() => router.push('/index-jasa/trip-jasa')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Kembali ke Daftar Trip
          </button>
        </div>
      </div>
    )
  }

  // Get the first image or use placeholder
  const tripImage = trip.images && trip.images.length > 0 
    ? `http://localhost:8000/storage/${trip.images[0].image_path}` 
    : null

  return (
    <div className="min-h-screen p-4 md:p-10 md:w-[93%] md:mx-10 md:max-w-[200%] lg:w-[70%] lg:mx-[33%] flex flex-col xl:mt-16 xl:max-w-[1100px] xl:w-full xl:mx-[26%] mx-auto">
      <div className="bg-white flex flex-col w-full rounded-3xl min-h-[800px] shadow-lg p-4 md:p-8">
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p>{successMessage}</p>
            <p className="text-sm">Redirecting to trip list...</p>
          </div>
        )}
        
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push('/index-jasa/trip-jasa')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-start font-semibold text-2xl">Dashboard Trip</h1>
        </div>

        <div className="bg-[#EFF6FE] rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-64 relative rounded-2xl overflow-hidden">
              {tripImage ? (
                <Image 
                  src={tripImage} 
                  alt={trip.mountain?.nama_gunung || "Mountain"} 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-2xl"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-500">No Image</p>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-start mb-4">
                <h1 className="font-bold text-2xl">{trip.mountain?.nama_gunung || "Mountain Trip"}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trip.status === 'open' ? 'bg-green-100 text-green-800' : 
                  trip.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trip.status === 'open' ? 'Open' : trip.status === 'completed' ? 'Selesai' : trip.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Tanggal Trip</p>
                  <p className="font-medium">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Kapasitas</p>
                  <p className="font-medium">{trip.capacity} orang</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Harga per Orang</p>
                  <p className="font-medium">{new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(trip.price)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Grup WhatsApp</p>
                  <a 
                    href={trip.whatsapp_group} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Buka Grup
                  </a>
                </div>
              </div>
              
              {trip.status === 'open' && new Date(trip.end_date) < new Date() && (
                <button
                  onClick={handleFinishTrip}
                  disabled={finishLoading}
                  className="w-full md:w-auto py-2 px-6 text-white text-sm md:text-base font-semibold rounded-full bg-gradient-to-t from-[#9CCAFF] to-[#4A90E2] hover:from-[#a8d1ff] hover:to-[#4ea1ff] transition-all duration-300 ease-in-out disabled:opacity-50"
                >
                  {finishLoading ? 'Memproses...' : 'Selesaikan Trip'}
                </button>
              )}
              
              {trip.status === 'completed' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">
                    Trip ini telah selesai pada {formatDate(trip.completed_at || trip.updated_at)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="font-semibold text-xl mb-4">Daftar Peserta</h2>
        
        {bookings.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">Belum ada peserta yang mendaftar untuk trip ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Nama</th>
                  <th className="py-3 px-4 text-left">Tanggal Booking</th>
                  <th className="py-3 px-4 text-left">Jumlah Peserta</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Total Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{booking.user?.nama_depan} {booking.user?.nama_belakang}</td>
                    <td className="py-3 px-4">{formatDate(booking.created_at)}</td>
                    <td className="py-3 px-4">{booking.participants} orang</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {booking.total_price 
                        ? new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(booking.total_price)
                        : 'Rp 0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}