'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await api.get('/api/user');
        setUser(data);
      }
    } catch (error) {
      console.error('Check auth error:', error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const { data } = await api.post('/api/refresh');
      localStorage.setItem('token', data.access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      return true;
    } catch (error) {
      console.error('Refresh token error:', error);
      return false;
    }
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        try {
          const success = await refreshToken();
          if (success) {
            return api(error.config);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/login', { email, password });
      
      // Store complete user data in localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      setUser(data.user);

      // Create profile if needed - with retry mechanism
      let profileCreated = false;
      let retryCount = 0;
      
      while (!profileCreated && retryCount < 3) {
        try {
          // First check if profile exists
          await api.get('/api/user/profile');
          profileCreated = true;
        } catch (profileError) {
          if (profileError.response?.status === 404 || profileError.response?.status === 500) {
            console.log(`Attempt ${retryCount + 1}: Creating profile for user...`);
            try {
              // Generate unique values for profile
              const timestamp = Date.now();
              const uniqueId = `${data.user.id}${timestamp}`;
              
              const profileData = {
                gender: 'L',
                tanggal_lahir: new Date().toISOString().split('T')[0],
                nik: uniqueId.substring(0, 16),
                tempat_tinggal: 'Belum diisi',
                nomor_telepon: `0${timestamp}`.substring(0, 12),
                is_profile_completed: false
              };
              
              // Try the create-default endpoint first
              try {
                await api.post('/api/user/profile/create-default');
                profileCreated = true;
              } catch (createDefaultError) {
                // If that fails, try direct profile creation
                await api.post('/api/user/profile', profileData);
                profileCreated = true;
              }
            } catch (createError) {
              console.error('Profile creation error:', createError);
              retryCount++;
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          } else {
            console.error('Unexpected profile error:', profileError);
            break;
          }
        }
      }

      // Navigate based on role
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else if (data.user.role === 'guide') {
        router.push('/index-jasa');
      } else {
        router.push('/dashboard-user');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'An error occurred during login',
      };
    }
  };
  
  const register = async (userData) => {
    try {
      // Ensure all required fields are present
      const registerData = {
        nama_depan: userData.nama_depan,
        nama_belakang: userData.nama_belakang,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        role: 'user'
      };

      console.log('Sending registration data:', registerData);
      const response = await api.post('/api/register', registerData);
      console.log('Registration response:', response.data);

      // Verify registration was successful
      if (response.data && response.data.user && response.data.user.id) {
        console.log('User created successfully with ID:', response.data.user.id);
      } else {
        console.warn('Registration response missing user data:', response.data);
      }

      router.push('/login?registered=true');
      return { success: true };
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };
  
  const logout = async () => {
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      router.push('/login');
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};