"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createMountain } from "@/services/mountain.service"
import { FiInfo, FiAlertCircle, FiCheckCircle, FiPlus, FiTrash2, FiMove } from 'react-icons/fi'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Toaster, toast } from 'react-hot-toast';

export default function MountainForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nama_gunung: "",
    lokasi: "",
    ketinggian: 0,
    link_map: "",
    status_gunung: "mudah",
    status_pendakian: "pemula",
    deskripsi: "",
    peraturan: "",
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [rules, setRules] = useState([''])
  const [activeTab, setActiveTab] = useState('info')
  const [formProgress, setFormProgress] = useState(0)

  // Menghitung progress form
  useEffect(() => {
    const requiredFields = ['nama_gunung', 'lokasi', 'ketinggian', 'link_map', 'deskripsi'];
    const filledFields = requiredFields.filter(field => formData[field] && formData[field].toString().trim() !== '');

    // Tambahkan pengecekan untuk peraturan
    const hasRules = rules.filter(rule => rule.trim() !== '').length > 0;

    // Tambahkan pengecekan untuk gambar
    const hasImages = imageFiles.length > 0;

    // Hitung persentase (fields + rules + images)
    const totalItems = requiredFields.length + 2; // +2 untuk rules dan images
    const completedItems = filledFields.length + (hasRules ? 1 : 0) + (hasImages ? 1 : 0);

    setFormProgress(Math.round((completedItems / totalItems) * 100));
  }, [formData, rules, imageFiles]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Update the handleImageChange function with better error handling
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files).slice(0, 5)

    // Validate file size and type
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isValidSize = file.size <= 2 * 1024 * 1024 // 2MB

      if (!isValidType) {
        toast.error(
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-xl" />
            <div>
              <p className="font-medium">Format file tidak sesuai</p>
              <p className="text-sm">File harus berformat JPG atau PNG</p>
            </div>
          </div>,
          { duration: 4000 }
        )
      }
      if (!isValidSize) {
        toast.error(
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-xl" />
            <div>
              <p className="font-medium">Ukuran file terlalu besar</p>
              <p className="text-sm">Maksimal ukuran file adalah 2MB</p>
            </div>
          </div>,
          { duration: 4000 }
        )
      }
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      setError('Beberapa file dilewati. Pastikan semua file adalah gambar (JPG/PNG) dan dibawah 2MB')
    }

    // Combine with existing files if not at limit
    const totalFiles = [...imageFiles, ...validFiles].slice(0, 5)
    setImageFiles(totalFiles)

    // Create preview URLs for all files
    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setImagePreview(prev => {
      const combined = [...prev, ...newPreviews].slice(0, 5)
      // Clean up any unused previews
      prev.slice(combined.length).forEach(url => URL.revokeObjectURL(url))
      return combined
    })
  }

  // Fungsi untuk menangani peraturan
  const handleRuleChange = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);

    // Update formData.peraturan dengan format yang benar
    const formattedRules = newRules
      .filter(rule => rule.trim() !== '')
      .map((rule, idx) => `${idx + 1}. ${rule.replace(/^\d+\.\s*/, '')}`)
      .join('\n');

    setFormData(prev => ({
      ...prev,
      peraturan: formattedRules
    }));
  };

  const addRule = () => {
    setRules([...rules, '']);
  };

  const removeRule = (index) => {
    if (rules.length > 1) {
      const newRules = [...rules];
      newRules.splice(index, 1);
      setRules(newRules);

      // Update formData.peraturan
      const formattedRules = newRules
        .filter(rule => rule.trim() !== '')
        .map((rule, idx) => `${idx + 1}. ${rule.replace(/^\d+\.\s*/, '')}`)
        .join('\n');

      setFormData(prev => ({
        ...prev,
        peraturan: formattedRules
      }));
    }
  };

  const removeImage = (index) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreview[index]);

    // Remove the image from both arrays
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreview];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreview(newPreviews);
  };

  // Fungsi untuk validasi tab
  const validateInfoTab = () => {
    const requiredFields = ['nama_gunung', 'lokasi', 'ketinggian', 'link_map', 'deskripsi'];
    const emptyFields = requiredFields.filter(field => isFieldEmpty(field));

    if (emptyFields.length > 0) {
      toast.error(
        <div className="flex items-center gap-3">
          <FiAlertCircle className="text-xl" />
          <div>
            <p className="font-medium">Form belum lengkap</p>
            <p className="text-sm">Harap isi semua field yang wajib diisi</p>
          </div>
        </div>,
        { duration: 3000 }
      );
      return false;
    }
    return true;
  };

  const validateRulesTab = () => {
    const validRules = rules.filter(rule => rule.trim() !== '');

    if (validRules.length === 0) {
      toast.error(
        <div className="flex items-center gap-3">
          <FiAlertCircle className="text-xl" />
          <div>
            <p className="font-medium">Peraturan belum ditambahkan</p>
            <p className="text-sm">Minimal harus ada 1 peraturan</p>
          </div>
        </div>,
        { duration: 3000 }
      );
      return false;
    }
    return true;
  };

  // Fungsi untuk navigasi antar tab
  const goToNextTab = (currentTab) => {
    if (currentTab === 'info') {
      if (validateInfoTab()) {
        setActiveTab('rules');
      }
    } else if (currentTab === 'rules') {
      if (validateRulesTab()) {
        setActiveTab('photos');
      }
    }
  };

  const goToPrevTab = (currentTab) => {
    if (currentTab === 'rules') {
      setActiveTab('info');
    } else if (currentTab === 'photos') {
      setActiveTab('rules');
    }
  };

  // Update the handleSubmit function with better toast UI
  const handleSubmit = async (e) => {
    e.preventDefault()

    toast((t) => (
      <div className="flex items-start gap-3 w-[350px] bg-white rounded-lg overflow-hidden">
        <div className="flex-shrink-0 mt-4 ml-4">
          <FiAlertCircle className="text-blue-500 text-xl" />
        </div>
        <div className="flex-1 space-y-3 p-4">
          <div>
            <h4 className="font-semibold text-gray-800 text-base">
              Konfirmasi Data Gunung
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Pastikan data berikut sudah lengkap:
            </p>
          </div>

          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-center gap-3 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Informasi dasar gunung
            </li>
            <li className="flex items-center gap-3 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Deskripsi dan peraturan
            </li>
            <li className="flex items-center gap-3 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Foto gunung (min. 1 foto)
            </li>
          </ul>

          <div className="flex gap-2 pt-2">
            <button
              onClick={async () => {
                const btn = document.getElementById('saveBtn');
                btn.innerHTML = `
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                `;
                await new Promise(resolve => setTimeout(resolve, 800));
                toast.dismiss(t.id);
                submitData();
              }}
              id="saveBtn"
              className="flex-1 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg
                hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 
                flex items-center justify-center gap-2 shadow hover:shadow-md"
            >
              Simpan
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg
                hover:bg-gray-200 active:bg-gray-300 transition-all duration-200"
            >
              Periksa
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-right',
      style: {
        background: 'white',
        padding: '0',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        animation: 'slideIn 0.3s ease-out',
        marginTop: '1rem',
        marginRight: '1rem'
      },
    });

    // Add required keyframes and animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(5px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fadeIn {
        animation: fadeIn 0.4s ease-out forwards;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
  };

  // Update the submitData function with better error handling
  const submitData = async () => {
    setLoading(true)
    try {
      // Validate peraturan format
      const formattedRules = rules
        .filter(rule => rule.trim() !== '')
        .map((rule, idx) => `${idx + 1}. ${rule.replace(/^\d+\.\s*/, '')}`)
        .join('\n');

      if (formattedRules.trim() === '') {
        throw new Error('Minimal harus ada 1 peraturan gunung')
      }

      if (imageFiles.length === 0) {
        throw new Error('Minimal harus upload 1 foto gunung')
      }

      if (!formData.link_map.startsWith('https://')) {
        throw new Error('Link map harus valid dan dimulai dengan https://')
      }

      if (formData.ketinggian <= 0) {
        throw new Error('Ketinggian gunung harus lebih dari 0 MDPL')
      }

      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token tidak ditemukan')

      const formDataToSend = new FormData()

      // Update peraturan dalam formData
      const updatedFormData = {
        ...formData,
        peraturan: formattedRules
      };

      Object.keys(updatedFormData).forEach(key => {
        if (key === 'peraturan') {
          const rules = updatedFormData[key].split('\n').filter(rule => rule.trim())
          rules.forEach((rule, index) => {
            formDataToSend.append(`peraturan[${index}]`, rule)
          })
        } else {
          formDataToSend.append(key, updatedFormData[key])
        }
      })

      imageFiles.forEach((file, index) => {
        formDataToSend.append(`images[${index}]`, file)
      })

      const response = await createMountain(formDataToSend, token)

      // Update the success toast in submitData function
      if (response.success) {
        toast.success(
          <div className="flex items-center gap-3 min-w-[300px]">
            <div>
              <p className="font-medium">Berhasil!</p>
              <p className="text-sm text-white text-opacity-90">Data gunung telah ditambahkan</p>
            </div>
          </div>,
          {
            position: 'top-right',
            style: {
              background: '#10B981',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              animation: 'slideIn 0.3s ease-out',
            },
            duration: 3000,
          }
        );

        setTimeout(() => {
          router.push('/admin/kelola-gunung')
        }, 2000);
      } else {
        throw new Error(response.message || 'Gagal menambah data gunung')
      }
    } catch (error) {
      console.error('Error details:', error)

      // Enhanced error message handling
      let errorMessage = error.message
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = 'Terjadi kesalahan: ' + (error.message || JSON.stringify(error))
      }

      toast.error(
        <div className="flex items-center gap-3 min-w-[300px]">
          <FiAlertCircle className="text-xl" />
          <div>
            <p className="font-medium">Format Tidak Sesuai</p>
            <p className="text-sm whitespace-pre-line">{error.message}</p>
          </div>
        </div>,
        {
          style: {
            background: '#EF4444',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
          },
          duration: 4000,
        }
      );
    } finally {
      setLoading(false)
    }
  };

  // Create a new function to check if field is empty
  const isFieldEmpty = (fieldName) => {
    if (fieldName === 'images') {
      return imageFiles.length === 0;
    }
    return !formData[fieldName] || formData[fieldName].toString().trim() === '';
  };

  // Add Toaster component in the return statement, right before the main div
  return (
    <>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${formProgress}%` }}
        className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 z-50"
        transition={{ duration: 0.3 }}
      />

      <div className="bg-white p-6 sm:p-8 w-full max-w-full mx-auto mt-4 shadow-lg rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold text-gray-800"
            >
              Tambah Data Gunung
            </motion.h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Progres:</span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">{formProgress}%</span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-3"
            >
              <FiAlertCircle className="text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Terdapat kesalahan:</p>
                <p>{error}</p>
              </div>
            </motion.div>
          )}

          {/* Tab Navigation - Enhanced */}
          <div className="flex mb-8 border-b overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'info'
                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50 rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:rounded-t-lg'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informasi Dasar
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-6 py-3 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'rules'
                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50 rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:rounded-t-lg'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Peraturan
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-6 py-3 font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'photos'
                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50 rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:rounded-t-lg'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Foto Gunung
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nama Gunung */}
                    <div>
                      <div className="group relative">
                        <label className="block mb-2 flex items-center text-gray-700 font-medium">
                          Nama Gunung
                          {isFieldEmpty('nama_gunung') && (
                            <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                          )}
                          <FiInfo className="ml-2 text-gray-400 cursor-help" />
                        </label>
                        <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                          Masukkan nama resmi gunung
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 1.586l-4 4-4-4-4 4v12.828l4-4 4 4 4-4 4 4V1.586l-4 4zM3.707 3.293L2 5v10.586l1.707-1.707L5.414 15.5 8 18.086l2.586-2.586 1.707 1.707L14 15.5l2.293 2.293L18 16.086V5l-1.707 1.707L14.586 4.5 12 2.086 9.414 4.5 7.707 2.793 5.414 5.086 3.707 3.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="nama_gunung"
                          value={formData.nama_gunung}
                          onChange={handleChange}
                          placeholder="Contoh: Gunung Semeru"
                          className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    {/* Lokasi */}
                    <div>
                      <div className="group relative">
                        <label className="block mb-2 flex items-center text-gray-700 font-medium">
                          Lokasi
                          {isFieldEmpty('lokasi') && (
                            <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                          )}
                          <FiInfo className="ml-2 text-gray-400 cursor-help" />
                        </label>
                        <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                          Lokasi administratif gunung
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="lokasi"
                          value={formData.lokasi}
                          onChange={handleChange}
                          placeholder="Contoh: Jawa Timur, Indonesia"
                          className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    {/* Ketinggian */}
                    <div>
                      <div className="group relative">
                        <label className="block mb-2 flex items-center text-gray-700 font-medium">
                          Ketinggian (MDPL)
                          {isFieldEmpty('ketinggian') && (
                            <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                          )}
                          <FiInfo className="ml-2 text-gray-400 cursor-help" />
                        </label>
                        <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                          Ketinggian gunung dalam meter di atas permukaan laut
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="number"
                          name="ketinggian"
                          value={formData.ketinggian}
                          onChange={handleChange}
                          placeholder="Contoh: 3676"
                          className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          required
                          min="1"
                        />
                      </div>
                    </div>

                    {/* Link Map */}
                    <div>
                      <div className="group relative">
                        <label className="block mb-2 flex items-center text-gray-700 font-medium">
                          Link Map
                          {isFieldEmpty('link_map') && (
                            <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                          )}
                          <FiInfo className="ml-2 text-gray-400 cursor-help" />
                        </label>
                        <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                          Link Google Maps lokasi gunung
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="link_map"
                          value={formData.link_map}
                          onChange={handleChange}
                          placeholder="Contoh: https://maps.google.com/..."
                          className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          required
                        />
                      </div>
                    </div>

                    {/* Status Gunung */}
                    <div>
                      <div className="group relative">
                        <label className="block mb-2 flex items-center text-gray-700 font-medium">
                          Status Gunung
                          {isFieldEmpty('status_gunung') && (
                            <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                          )}
                          <FiInfo className="ml-2 text-gray-400 cursor-help" />
                        </label>
                        <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                          Tingkat kesulitan medan gunung
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <select
                          name="status_gunung"
                          value={formData.status_gunung}
                          onChange={handleChange}
                          className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none bg-white"
                          required
                        >
                          <option value="mudah">Mudah</option>
                          <option value="menengah">Sedang</option>
                          <option value="sulit">Sulit</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Status Pendakian */}
                    <div>
                      <div className="group relative">
                        <label className="block mb-2 flex items-center text-gray-700 font-medium">
                          Status Pendakian
                          {isFieldEmpty('status_pendakian') && (
                            <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                          )}
                          <FiInfo className="ml-2 text-gray-400 cursor-help" />
                        </label>
                        <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                          Tingkat pengalaman pendaki yang disarankan
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <select
                          name="status_pendakian"
                          value={formData.status_pendakian}
                          onChange={handleChange}
                          className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none bg-white"
                          required
                        >
                          <option value="pemula">Pemula</option>
                          <option value="mahir">Mahir</option>
                          <option value="ahli">Ahli</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <div className="group relative">
                      <label className="block mb-2 flex items-center text-gray-700 font-medium">
                        Deskripsi Gunung
                        {isFieldEmpty('deskripsi') && (
                          <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                        )}
                        <FiInfo className="ml-2 text-gray-400 cursor-help" />
                      </label>
                      <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                        Informasi lengkap tentang gunung
                      </div>
                    </div>
                    <textarea
                      name="deskripsi"
                      value={formData.deskripsi}
                      onChange={handleChange}
                      placeholder="Deskripsikan gunung secara detail, termasuk sejarah, karakteristik, dan informasi penting lainnya..."
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 min-h-[150px]"
                      required
                    ></textarea>
                  </div>

                  {/* Tombol Navigasi */}
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => goToNextTab('info')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                      Selanjutnya
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'rules' && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800">Peraturan Pendakian</h3>
                      <button
                        type="button"
                        onClick={addRule}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-blue-200 transition-colors duration-200"
                      >
                        <FiPlus className="text-blue-600" />
                        Tambah Peraturan
                      </button>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-700 flex items-start gap-3">
                      <FiInfo className="text-xl flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Petunjuk:</p>
                        <p>Tambahkan peraturan pendakian yang harus dipatuhi oleh pendaki. Peraturan akan ditampilkan dalam bentuk daftar bernomor.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {rules.map((rule, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-grow relative">
                            <input
                              type="text"
                              value={rule}
                              onChange={(e) => handleRuleChange(index, e.target.value)}
                              placeholder={`Peraturan #${index + 1}`}
                              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRule(index)}
                            className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                            disabled={rules.length === 1}
                          >
                            <FiTrash2 className={`${rules.length === 1 ? 'text-gray-300' : 'text-red-500'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tombol Navigasi */}
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => goToPrevTab('rules')}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Sebelumnya
                    </button>
                    <button
                      type="button"
                      onClick={() => goToNextTab('rules')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                      Selanjutnya
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'photos' && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800">Foto Gunung</h3>
                      <p className="text-sm text-gray-500">
                        {imageFiles.length}/5 foto
                      </p>
                    </div>

                    {/* Dropzone */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center ${imageFiles.length >= 5 ? 'border-gray-200 bg-gray-50' : 'border-blue-300 hover:bg-blue-50'
                        } transition-all duration-200`}
                    >
                      <input
                        type="file"
                        id="image-upload"
                        onChange={handleImageChange}
                        accept="image/jpeg,image/png,image/jpg"
                        multiple
                        className="hidden"
                        disabled={imageFiles.length >= 5}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center justify-center cursor-pointer ${imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      >
                        <AiOutlineCloudUpload className="text-4xl text-blue-500 mb-2" />
                        <h4 className="text-lg font-medium text-gray-700 mb-1">
                          {imageFiles.length >= 5 ? 'Maksimal 5 foto' : 'Upload Foto Gunung'}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">
                          {imageFiles.length >= 5
                            ? 'Hapus beberapa foto untuk menambahkan yang baru'
                            : 'Format: JPG, PNG (Maks. 2MB)'}
                        </p>
                        {imageFiles.length < 5 && (
                          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                            Pilih Foto
                          </span>
                        )}
                      </label>
                    </div>

                    {/* Preview Foto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                      {imagePreview.map((url, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <Image
                            src={url}
                            alt={`Foto ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>

                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1.5 px-2">
                            Foto {index + 1}
                          </div>
                        </div>
                      ))}

                      {imagePreview.length === 0 && (
                        <div className="flex items-center justify-center aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                          <div className="text-center text-gray-400">
                            <AiOutlineCloudUpload className="mx-auto text-3xl mb-2" />
                            <p className="text-sm">Belum ada foto</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-xl text-sm text-yellow-700 flex items-start gap-3 mt-4">
                      <FiInfo className="text-xl flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Catatan:</p>
                        <p>Foto pertama akan digunakan sebagai foto utama. Pastikan foto memiliki kualitas yang baik dan menampilkan keindahan gunung.</p>
                      </div>
                    </div>
                  </div>

                  {/* Tombol Navigasi */}
                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => goToPrevTab('photos')}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 flex items-center gap-2 font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Sebelumnya
                    </button>
                    <button
                      type="submit"
                      disabled={loading || imageFiles.length === 0}
                      className={`px-6 py-3 ${loading || imageFiles.length === 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-xl transition-colors duration-200 flex items-center gap-2 font-medium`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          Simpan Data
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </>
  );
}