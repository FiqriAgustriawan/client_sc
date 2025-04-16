'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import img from '@/assets/images/Jastrip.png'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { FiCalendar, FiUsers, FiMapPin, FiPlus, FiArrowRight } from 'react-icons/fi'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'

function TripJasa() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'open', 'completed'
  const router = useRouter()

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await axios.get('http://localhost:8000/api/guide/trips', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.success) {
          setTrips(response.data.data)
        } else {
          setError('Failed to fetch trips')
        }
      } catch (err) {
        console.error('Error fetching trips:', err)
        setError('Error fetching trips. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [router])

  const navigateToDashboard = (tripId) => {
    router.push(`/index-jasa/trip-jasa/dashboard/${tripId}`)
  }

  const filteredTrips = trips.filter(trip => {
    if (filter === 'all') return true
    if (filter === 'open') return trip.status === 'open'
    if (filter === 'completed') return trip.status === 'completed'
    return true
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar spacing */}
      <div className="hidden md:block w-[240px] lg:w-[26%]"></div>
      
      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 lg:p-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 md:p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-white text-2xl md:text-3xl font-bold">Trip Kamu</h1>
                  <p className="text-blue-100 mt-2">Kelola semua perjalanan pendakian yang kamu tawarkan</p>
                </div>
                <Link href={'trip-jasa/buat-trip'} className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center font-medium transition-all shadow-md hover:shadow-lg">
                  <FiPlus className="mr-2" /> Buat Trip
                </Link>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="border-b border-gray-200 px-6 md:px-8">
              <div className="flex space-x-4 -mb-px">
                <button
                  onClick={() => setFilter('all')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Semua Trip
                </button>
                <button
                  onClick={() => setFilter('open')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === 'open'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Trip Aktif
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === 'completed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Trip Selesai
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-500">Memuat trip...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
                  <p>{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : filteredTrips.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 px-4"
                >
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMapPin className="text-blue-500 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {filter === 'all' 
                      ? 'Belum Ada Trip' 
                      : filter === 'open' 
                        ? 'Tidak Ada Trip Aktif' 
                        : 'Tidak Ada Trip Selesai'}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    {filter === 'all' 
                      ? 'Kamu belum membuat trip pendakian. Mulai buat trip pertamamu sekarang!' 
                      : filter === 'open' 
                        ? 'Kamu belum memiliki trip aktif saat ini.' 
                        : 'Kamu belum memiliki trip yang telah selesai.'}
                  </p>
                  {filter === 'all' && (
                    <Link 
                      href={'trip-jasa/buat-trip'} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center font-medium transition-colors shadow-md"
                    >
                      <FiPlus className="mr-2" /> Buat Trip Sekarang
                    </Link>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  className="grid grid-cols-1 gap-6"
                >
                  {filteredTrips.map((trip) => (
                    <TripCard 
                      key={trip.id} 
                      trip={trip} 
                      onDashboardClick={() => navigateToDashboard(trip.id)} 
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function TripCard({ trip, onDashboardClick }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, 'd MMMM yyyy', { locale: id })
    } catch (error) {
      return dateString
    }
  }

  // Get the first image or use placeholder
  const tripImage = trip.images && trip.images.length > 0 
    ? `http://localhost:8000/storage/${trip.images[0].image_path}` 
    : null

  // Format price
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(trip.price)

  // Determine status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'open':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate days until trip starts
  const getDaysUntilTrip = () => {
    const today = new Date()
    const startDate = new Date(trip.start_date)
    const diffTime = startDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Sudah lewat'
    if (diffDays === 0) return 'Hari ini'
    return `${diffDays} hari lagi`
  }

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
      }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
      }}
      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all"
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 lg:w-1/4 relative h-48 md:h-auto">
          {tripImage ? (
            <Image 
              src={tripImage} 
              alt={trip.mountain?.nama_gunung || "Mountain"} 
              fill
              style={{ objectFit: 'cover' }}
              className="md:rounded-l-xl"
            />
          ) : (
            <Image 
              src={img} 
              alt="Default mountain" 
              fill
              style={{ objectFit: 'cover' }}
              className="md:rounded-l-xl"
            />
          )}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(trip.status)}`}>
              {trip.status === 'open' ? 'Open' : trip.status === 'completed' ? 'Selesai' : trip.status}
            </span>
          </div>
        </div>
        
        <div className="p-5 md:p-6 flex flex-col justify-between w-full md:w-2/3 lg:w-3/4">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-gray-800">{trip.mountain?.nama_gunung || "Mountain Trip"}</h2>
              {trip.status === 'open' && (
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  {getDaysUntilTrip()}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="flex items-center text-gray-600">
                <FiCalendar className="mr-2 text-blue-500" />
                <span className="text-sm">{formatDate(trip.start_date)} - {formatDate(trip.end_date)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiUsers className="mr-2 text-blue-500" />
                <span className="text-sm">Kapasitas: {trip.capacity} orang</span>
              </div>
              <div className="flex items-center text-gray-600">
                <RiMoneyDollarCircleLine className="mr-2 text-blue-500" />
                <span className="text-sm font-semibold">{formattedPrice}</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={onDashboardClick}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 rounded-lg flex items-center font-medium transition-all shadow-sm hover:shadow-md"
            >
              {trip.status === 'completed' ? 'Lihat Detail' : 'Masuk Dashboard'} 
              <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TripJasa