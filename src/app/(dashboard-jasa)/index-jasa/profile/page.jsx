"use client";

import { useState, useEffect } from "react";
import React from "react";

export default function ProfilePage() {
  const [guideData, setGuideData] = useState({
    name: "",
    email: "",
    about: "",
    instagram: "",
    whatsapp: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuideProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch('http://localhost:8000/api/guide/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch guide profile');
        }
        
        const data = await response.json();
        setGuideData(data.data);
      } catch (err) {
        console.error("Error fetching guide profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGuideProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:8000/api/guide/profile/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          about: guideData.about,
          instagram: guideData.instagram,
          whatsapp: guideData.whatsapp,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuideData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col md:flex-row mt-16 md:mr-5 max-w-[1200px] mx-auto">
        <div className="hidden md:block w-[10%]">{/* Sidebar space */}</div>
      <div className="w-full md:w-[90%] space-y-8">
        <div className="space-y-6">
          {/* Guide Data Display */}
          <div className="bg-white rounded-[24px] p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-[#2D3648]">Data Guide</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-[#6B7280]">Nama</label>
                <div className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm">
                  {guideData?.name || '-'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-[#6B7280]">Email</label>
                <div className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm">
                  {guideData?.email || '-'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-[#6B7280]">Tentang Kami</label>
                {isEditing ? (
                  <textarea
                    name="about"
                    value={guideData.about}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-white text-[#2D3648] text-sm min-h-[100px]"
                    placeholder="Ceritakan tentang tim anda..."
                  />
                ) : (
                  <div className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm min-h-[60px]">
                    {guideData.about || 'Belum ada deskripsi'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-[24px] p-6 shadow-md">
            <h2 className="text-xl font-medium text-[#2D3648] mb-2">Social Media</h2>
            <p className="text-[#6B7280] text-sm mb-6">Pengguna Dapat Menghubungimu</p>

            <div className="space-y-4">
              <div className="flex items-center w-full px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.99 0H22.01C26.97 0 31 4.03 31 8.99V22.01C31 24.3943 30.0528 26.6809 28.3669 28.3669C26.6809 30.0528 24.3943 31 22.01 31H8.99C4.03 31 0 26.97 0 22.01V8.99C0 6.6057 0.947158 4.31906 2.63311 2.63311C4.31906 0.947158 6.6057 0 8.99 0Z" fill="#333333"/>
                </svg>
                {isEditing ? (
                  <input
                    type="text"
                    name="instagram"
                    value={guideData.instagram}
                    onChange={handleInputChange}
                    className="flex-1 ml-4 px-2 py-1 border rounded"
                    placeholder="Username Instagram"
                  />
                ) : (
                  <span className="ml-4">{guideData.instagram || 'Tidak tersedia'}</span>
                )}
              </div>

              <div className="flex items-center w-full px-4 py-3 rounded-[12px] border border-gray-300 bg-white">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.3367 4.65607C25.8622 3.17465 24.1062 2.00003 22.1709 1.20066C20.2356 0.401299 18.1597 -0.00682105 16.0643 8.6232e-05C7.28442 8.6232e-05 0.128643 7.12007 0.128643 15.856C0.128643 18.656 0.868342 21.376 2.25126 23.776L0 32L8.44221 29.792C10.7739 31.056 13.395 31.728 16.0643 31.728C24.8442 31.728 32 24.608 32 15.872C32 11.6321 30.3437 7.64807 27.3367 4.65607Z" fill="black"/>
                </svg>
                {isEditing ? (
                  <input
                    type="text"
                    name="whatsapp"
                    value={guideData.whatsapp}
                    onChange={handleInputChange}
                    className="flex-1 ml-4 px-2 py-1 border rounded"
                    placeholder="Nomor WhatsApp"
                  />
                ) : (
                  <span className="ml-4">{guideData.whatsapp || 'Tidak tersedia'}</span>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Simpan Perubahan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}