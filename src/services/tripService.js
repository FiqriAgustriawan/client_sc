import api from '@/utils/axios'

export const tripService = {
  getAllTrips: async () => {
    try {
      const response = await api.get('/api/trips/all')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getTripDetail: async (id) => {
    try {
      // The api utility should already handle authorization headers
      const response = await api.get(`/api/trips/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching trip details:', error)
      throw error
    }
  },

  joinTrip: async (tripId) => {
    try {
      const response = await api.post(`/api/trips/${tripId}/join`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Add a method to get trip details for authenticated users
  getAuthenticatedTripDetail: async (id) => {
    try {
      const response = await api.get(`/api/trips/${id}/detail`)
      return response.data
    } catch (error) {
      console.error('Error fetching authenticated trip details:', error)
      throw error
    }
  },

  // Add createTrip method to handle trip creation
  createTrip: async (formData) => {
    try {
      const response = await api.post('/api/trips', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error creating trip:', error)
      throw error
    }
  }
}