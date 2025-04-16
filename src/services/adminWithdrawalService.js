import api from '@/utils/axios';

export const adminWithdrawalService = {
  // Get all withdrawal requests
  getWithdrawals: async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/admin/withdrawals?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      throw error;
    }
  },

  // Process a withdrawal request
  processWithdrawal: async (withdrawalId, referenceNumber) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/api/admin/withdrawals/${withdrawalId}/process`, {
        reference_number: referenceNumber
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      throw error;
    }
  },

  // Reject a withdrawal request
  rejectWithdrawal: async (withdrawalId, reason) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/api/admin/withdrawals/${withdrawalId}/reject`, {
        reason: reason
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      throw error;
    }
  },

  // Get withdrawal statistics
  getWithdrawalStats: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/admin/withdrawals/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal stats:', error);
      throw error;
    }
  },
  
  // Check guide balance after withdrawal
  checkGuideBalanceAfterWithdrawal: async (withdrawalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/admin/withdrawals/${withdrawalId}/check-balance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking guide balance:', error);
      throw error;
    }
  },
  
  // Get withdrawal details
  getWithdrawalDetails: async (withdrawalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/admin/withdrawals/${withdrawalId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
      throw error;
    }
  },
  
  // Get all guide earnings
  getAllGuideEarnings: async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/admin/guide-earnings?page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching guide earnings:', error);
      throw error;
    }
  },
  
  // Get guide balance details
  getGuideBalanceDetails: async (guideId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/admin/guides/${guideId}/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching guide balance details:', error);
      throw error;
    }
  },
  
  // Add new method to process payment to guide earnings
  processPaymentToGuideEarnings: async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/api/admin/payments/${paymentId}/process-guide-earnings`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error processing payment to guide earnings:', error);
      throw error;
    }
  },

  // Add method to check payment status and guide earnings
  checkPaymentAndEarnings: async (paymentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/admin/payments/${paymentId}/check-earnings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking payment and earnings:', error);
      throw error;
    }
  }
};