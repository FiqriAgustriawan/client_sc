import api from '@/utils/axios'

export const bookingService = {
  bookTrip: async (tripId) => {
    try {
      const response = await api.post(`/api/trips/${tripId}/book`)
      return response.data
    } catch (error) {
      if (error.response?.data) {
        return error.response.data
      }
      throw error
    }
  },

  getUserBookings: async () => {
    try {
      // Ensure token is included in the request
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      const response = await api.get('/api/user/bookings')
      return response.data
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw error
    }
  },

  getPaymentStatus: async (invoiceNumber) => {
    try {
      const response = await api.get(`/api/payments/${invoiceNumber}`)
      return response.data
    } catch (error) {
      console.error('Error fetching payment status:', error)
      throw error
    }
  },
  
  // Add a method to check and update payment status
  checkAndUpdatePayment: async (bookingId) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      const response = await api.post(`/api/bookings/${bookingId}/check-payment`)
      return response.data
    } catch (error) {
      console.error('Error checking payment status:', error)
      return { success: false, message: error.response?.data?.message || 'Failed to check payment status' }
    }
  },
  
  // Add a method to complete payment for a booking
  completePayment: async (bookingId) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      const response = await api.post(`/api/bookings/${bookingId}/complete-payment`)
      return response.data
    } catch (error) {
      console.error('Error completing payment:', error)
      return { success: false, message: error.response?.data?.message || 'Failed to complete payment' }
    }
  },
  
  // Method to handle the "Complete Payment" button click
  handleCompletePayment: async (bookingId) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      // First check if payment is already completed on Midtrans
      const checkResponse = await api.get(`/api/bookings/${bookingId}/payment-status`)
      
      if (checkResponse.data.success && checkResponse.data.status === 'settlement') {
        // If payment is already settled on Midtrans, update local status
        const updateResponse = await api.post(`/api/bookings/${bookingId}/update-payment-status`, {
          status: 'paid'
        })
        return updateResponse.data
      } else {
        // If not settled, get a new payment URL
        const response = await api.post(`/api/bookings/${bookingId}/payment-url`)
        return response.data
      }
    } catch (error) {
      console.error('Error handling payment completion:', error)
      return { success: false, message: error.response?.data?.message || 'Failed to process payment' }
    }
  },
  
  // Add this new method to verify payment status
  verifyPaymentStatus: async (orderId) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      const response = await api.get(`/api/payments/${orderId}/verify`)
      return response.data
    } catch (error) {
      console.error('Error verifying payment status:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify payment status'
      }
    }
  },

  handlePaymentReturn: async (orderId, transactionStatus) => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      
      const response = await api.post('/api/payments/return', {
        order_id: orderId,
        transaction_status: transactionStatus
      })
      
      return response.data
    } catch (error) {
      console.error('Error handling payment return:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to process payment return'
      }
    }
  },
  
  // Add a method to handle payment completion
  completePaymentProcess: async (bookingId, orderId) => {
    try {
      console.log('Completing payment process for booking:', bookingId, 'Order ID:', orderId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return {
          success: false,
          message: 'Authentication required'
        };
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // First, try to verify the payment status with Midtrans order ID
      if (orderId) {
        try {
          console.log('Verifying payment with order ID:', orderId);
          const verifyResponse = await api.get(`/api/payments/${orderId}/verify`);
          console.log('Verification response:', verifyResponse.data);
          
          if (verifyResponse.data.success) {
            return verifyResponse.data;
          }
        } catch (verifyError) {
          console.error('Error verifying payment with order ID:', verifyError);
          // Continue to next approach if this fails
        }
      }
      
      // If verification with order ID fails, try completing with booking ID
      console.log('Completing payment with booking ID:', bookingId);
      const response = await api.post(`/api/bookings/${bookingId}/complete`);
      console.log('Completion response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error completing payment process:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to complete payment process'
      };
    }
  },
}
