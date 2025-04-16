// Export all functions as a single service object
export const mountainService = {
  createMountain: async (formData, token) => {
    try {
      const response = await fetch('http://localhost:8000/api/mountains', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type here, let the browser set it with boundary for FormData
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create mountain');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get all mountains
  getMountains: async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/mountains', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch mountains');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Delete mountain
  deleteMountain: async (id, token) => {
    try {
      const response = await fetch(`http://localhost:8000/api/mountains/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete mountain');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get mountain by ID
  getMountainById: async (id, token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mountains/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update mountain
  updateMountain: async (id, formData, token) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mountains/${id}`, {
        method: 'POST', 
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = data.message || data.error || 'Failed to update mountain';
        throw new Error(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
      }

      return data;
    } catch (error) {
      console.error('Update error details:', error);
      throw new Error(error.message || 'Failed to update mountain');
    }
  }
};

// Keep individual exports for backward compatibility
export const {
  createMountain,
  getMountains,
  deleteMountain,
  getMountainById,
  updateMountain
} = mountainService;