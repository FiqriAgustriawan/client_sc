import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const ratingService = {
  // Submit a rating for a trip
  submitRating: async (tripId, bookingId, rating, comment) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.post(
        `${API_URL}/api/ratings`,
        {
          trip_id: tripId,
          booking_id: bookingId,
          rating,
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Error submitting rating:', error)
      throw error
    }
  },

  // Check if user has already rated a trip
  checkRating: async (tripId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get(
        `${API_URL}/api/ratings/check/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return response.data
    } catch (error) {
      console.error('Error checking rating:', error)
      throw error
    }
  },

  // Get all ratings for a guide
  getGuideRatings: async (guideId) => {
    try {
      const response = await axios.get(`${API_URL}/api/guides/${guideId}/ratings`)
      return response.data
    } catch (error) {
      console.error('Error fetching guide ratings:', error)
      throw error
    }
  }
}