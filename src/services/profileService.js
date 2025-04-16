export const profileService = {
  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !userInfo) {
        return { success: false, error: 'Unauthorized' };
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      
      // If profile doesn't exist, create a default one
      if (response.status === 404 || !data.success) {
        console.log("Profile not found, creating default profile");
        const defaultProfile = await this.createDefaultProfile();
        if (defaultProfile.success) {
          return defaultProfile;
        }
      }

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data
        };
      }

      // Create minimal profile data if everything else fails
      return {
        success: true,
        data: {
          user_id: userInfo.id,
          nama_depan: userInfo.nama_depan || '',
          nama_belakang: userInfo.nama_belakang || '',
          email: userInfo.email || '',
          gender: 'L',
          tanggal_lahir: new Date().toISOString().split('T')[0],
          nik: '0000000000000000',
          tempat_tinggal: 'Belum diisi',
          nomor_telepon: '000000000000',
          profile_image: null,
          is_profile_completed: false
        }
      };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { success: false, error: error.message };
    }
  },

  async createDefaultProfile() {
    try {
      const token = localStorage.getItem('token');
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !userInfo) {
        return { success: false, error: 'Unauthorized' };
      }

      // Generate unique identifiers
      const timestamp = Date.now();
      const uniqueId = `${userInfo.id || ''}${timestamp}`;

      const defaultData = {
        user_id: userInfo.id,
        gender: 'L',
        tanggal_lahir: new Date().toISOString().split('T')[0],
        nik: uniqueId.substring(0, 16),
        tempat_tinggal: 'Belum diisi',
        nomor_telepon: `0${timestamp.toString().slice(-11)}`,
        is_profile_completed: false,
        nama_depan: userInfo.nama_depan || '',
        nama_belakang: userInfo.nama_belakang || '',
        email: userInfo.email || ''
      };

      // Try multiple endpoints
      let response;
      try {
        // First try the create-default endpoint
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile/create-default`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(defaultData),
        });
      } catch (error) {
        // If that fails, try the regular profile endpoint
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(defaultData),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to create profile: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          ...defaultData,
          ...data.data
        }
      };
    } catch (error) {
      console.error('Default profile creation error:', error);
      // Retry once more with minimal data
      try {
        const minimalData = {
          gender: 'L',
          tanggal_lahir: new Date().toISOString().split('T')[0],
          nik: '0000000000000000',
          tempat_tinggal: 'Belum diisi',
          nomor_telepon: '000000000000',
          is_profile_completed: false
        };

        const retryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(minimalData),
        });

        const retryData = await retryResponse.json();
        if (retryResponse.ok) {
          return {
            success: true,
            data: retryData.data
          };
        }
      } catch (retryError) {
        console.error('Retry profile creation failed:', retryError);
      }
      return { success: false, error: error.message };
    }
  },
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Unauthorized' };
      }

      // Check if all required fields are filled
      const isComplete = Boolean(
        profileData.gender &&
        profileData.tanggal_lahir &&
        profileData.nik &&
        profileData.tempat_tinggal &&
        profileData.nomor_telepon
      );

      // Add is_profile_completed to the request
      const dataToSend = {
        ...profileData,
        is_profile_completed: isComplete
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return {
          success: true,
          data: {
            ...data.data,
            is_profile_completed: isComplete
          }
        };
      }

      return {
        success: false,
        error: data.message || 'Failed to update profile'
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  },

  updateProfileImage: async (formData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile image');
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
};

