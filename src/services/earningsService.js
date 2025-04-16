import api from '../utils/axios.js';

export const earningsService = {
  // Get earnings summary (total, pending, available balance)
  async getEarningsSummary() {
    try {
      const token = localStorage.getItem('token');
      // Fix the endpoint to match your Laravel API structure
      const response = await api.get('/api/guide/earnings-summary', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings summary:', error);
      // Return default data structure on error to prevent UI crashes
      return { 
        success: false, 
        data: { 
          total_earnings: 0, 
          pending_earnings: 0, 
          available_balance: 0 
        } 
      };
    }
  },

  // Get detailed earnings history
  async getEarnings() {
    try {
      const token = localStorage.getItem('token');
      // Fix the endpoint to match your Laravel API structure
      const response = await api.get('/api/guide/earnings-list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching earnings:', error);
      // Return empty array on error
      return { success: false, data: [] };
    }
  },

  // Get withdrawal history
  async getWithdrawals() {
    try {
      const token = localStorage.getItem('token');
      // Fix the endpoint to match your Laravel API structure
      const response = await api.get('/api/guide/withdrawals-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      // Return empty array on error instead of throwing
      return { success: false, data: [] };
    }
  },

  // Request a new withdrawal
  async requestWithdrawal(data) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/api/guide/withdrawals/request', {
        amount: data.amount,
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_name: data.account_name,
        notes: data.notes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      throw error;
    }
  },

  // Check withdrawal status
  async checkWithdrawalStatus(withdrawalId) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/guide/withdrawals/${withdrawalId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking withdrawal status:', error);
      throw error;
    }
  },

  // Check if a payment has been processed for guide earnings
  async checkPaymentEarnings(paymentId) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/guide/payments/${paymentId}/check-earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking payment earnings:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to check payment earnings',
        data: null
      };
    }
  },

  // Get earnings for a specific trip
  async getTripEarnings(tripId) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/guide/trips/${tripId}/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching earnings for trip ${tripId}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch trip earnings',
        data: []
      };
    }
  },

  // Get earnings for a specific booking
  async getBookingEarnings(bookingId) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/guide/bookings/${bookingId}/earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching earnings for booking ${bookingId}:`, error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch booking earnings',
        data: null
      };
    }
  },

  // Get monthly earnings summary (for charts/reports)
  async getMonthlyEarnings(year = new Date().getFullYear()) {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/guide/earnings/monthly/${year}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly earnings:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch monthly earnings',
        data: []
      };
    }
  }
};

export default earningsService;