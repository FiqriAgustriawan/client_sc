"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createMountain } from "@/services/mountain.service"
import { FiInfo } from 'react-icons/fi'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import Image from 'next/image'
import { Toaster, toast } from 'react-hot-toast';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

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
      const rules = formData.peraturan.split('\n').filter(rule => rule.trim())
      const hasValidFormat = rules.every(rule => /^\d+\.\s.+/.test(rule))

      if (!hasValidFormat) {
        throw new Error('Format data gagal diproses. Pastikan format data sesuai dengan contoh yang diberikan')
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

      Object.keys(formData).forEach(key => {
        if (key === 'peraturan') {
          const rules = formData[key].split('\n').filter(rule => rule.trim())
          rules.forEach((rule, index) => {
            formDataToSend.append(`peraturan[${index}]`, rule)
          })
        } else {
          formDataToSend.append(key, formData[key])
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

      <div className="bg-white p-4 sm:p-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[66%] xl:mt-28 sm:mt-12 md:mt-16 lg:mt-20 shadow-lg rounded-3xl xl:mx-[30%] lg:mx-96 md:mx-20 mx-5 sm:mx-10">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Tambah Gunung</h1>


        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Nama dan Lokasi Gunung */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto">

                <div className="group relative">
                  <label className="block mb-1 flex items-center">
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
                <input
                  type="text"
                  name="nama_gunung"
                  value={formData.nama_gunung}
                  onChange={handleChange}
                  className="w-full sm:w-80 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full sm:w-[63%] sm:ml-4">
                <div className="group relative">
                  <label className="block mb-1 flex items-center">
                    Lokasi
                    {isFieldEmpty('lokasi') && (
                      <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                    )}
                    <FiInfo className="ml-2 text-gray-400 cursor-help" />
                  </label>
                  <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                    Lokasi detail gunung berada
                  </div>
                </div>
                <input
                  type="text"
                  name="lokasi"
                  value={formData.lokasi}
                  onChange={handleChange}
                  placeholder="Contoh: Jawa Timur, Indonesia"
                  className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Status dan Ketinggian */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto">
                <div className="group relative">
                  <label className="block mb-1 flex items-center">
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
                <select
                  name="status_gunung"
                  value={formData.status_gunung}
                  onChange={handleChange}
                  className="w-full sm:w-80 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="mudah">Mudah</option>
                  <option value="menengah">Menengah</option>
                  <option value="sulit">Sulit</option>
                </select>
              </div>

              <div className="w-full sm:w-[63%] sm:ml-4">
                <div className="group relative">
                  <label className="block mb-1 flex items-center">
                    Status Pendakian
                    {isFieldEmpty('status_pendakian') && (
                      <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                    )}
                    <FiInfo className="ml-2 text-gray-400 cursor-help" />
                  </label>
                  <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                    Tingkat kesulitan untuk pendaki
                  </div>
                </div>
                <select
                  name="status_pendakian"
                  value={formData.status_pendakian}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="pemula">Pemula</option>
                  <option value="mahir">Mahir</option>
                  <option value="ahli">Ahli</option>
                </select>
              </div>
            </div>

            {/* Ketinggian dan Link Map */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto">
                <div className="group relative">
                  <label className="block mb-1 flex items-center">
                    Ketinggian
                    {isFieldEmpty('ketinggian') && (
                      <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                    )}
                    <FiInfo className="ml-2 text-gray-400 cursor-help" />
                  </label>
                  <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                    Ketinggian gunung dalam MDPL
                  </div>
                </div>
                <input
                  type="number"
                  name="ketinggian"
                  value={formData.ketinggian}
                  onChange={handleChange}
                  placeholder="MDPL"
                  className="w-full sm:w-80 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full sm:w-[63%] sm:ml-4">
                <div className="group relative">
                  <label className="block mb-1 flex items-center">
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
                <input
                  type="url"
                  name="link_map"
                  value={formData.link_map}
                  onChange={handleChange}
                  placeholder="https://goo.gl/maps/..."
                  className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Deskripsi dan Peraturan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="group relative">
                  <label className="block mb-1 flex items-center">
                    Deskripsi
                    {isFieldEmpty('deskripsi') && (
                      <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                    )}
                    <FiInfo className="ml-2 text-gray-400 cursor-help" />
                  </label>
                  <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                    Informasi detail tentang gunung
                  </div>
                </div>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Masukkan deskripsi gunung"
                  className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[150px]"
                  required
                ></textarea>
              </div>
              <div>
                <div className="group relative">
                  <label className="block mb-1 flex items-center">
                    Peraturan
                    {isFieldEmpty('peraturan') && (
                      <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                    )}
                    <FiInfo className="ml-2 text-gray-400 cursor-help" />
                  </label>
                  <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                    Tulis setiap peraturan dalam baris baru
                  </div>
                </div>
                <textarea
                  name="peraturan"
                  value={formData.peraturan}
                  onChange={handleChange}
                  placeholder={`1. Wajib membawa surat izin pendakian
2. Dilarang membawa minuman keras dan obat-obatan terlarang
3. Wajib membawa minimal 3 liter air per orang
`}
                  className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[150px]"
                  required
                ></textarea>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="group relative">
                  <label className="block flex items-center">
                    Foto Gunung
                    {isFieldEmpty('images') && (
                      <span className="text-red-500 ml-0.5 transition-opacity duration-200">*</span>
                    )}
                    <FiInfo className="ml-2 text-gray-400 cursor-help" />
                  </label>
                  <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                    Upload foto gunung (max 2MB per file)
                  </div>
                </div>
                <span className="text-sm text-gray-500">Format: JPG, PNG</span>
              </div>

              <div
                className="border-2 border-dashed rounded-2xl p-4 text-center hover:border-blue-500 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const files = Array.from(e.dataTransfer.files).filter(
                    file => file.type.startsWith('image/')
                  )
                  if (files.length > 0) {
                    handleImageChange({ target: { files } })
                  }
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  required={imageFiles.length === 0}
                />
                <label htmlFor="image-upload" className="cursor-pointer block">
                  <AiOutlineCloudUpload className="mx-auto text-4xl text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Klik untuk upload atau drag & drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Maksimal 5 foto
                  </p>
                </label>
              </div>

              {imagePreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {imagePreview.map((url, index) => (
                    <div key={index} className="relative h-40">
                      <Image
                        src={url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(prev => prev.filter((_, i) => i !== index))
                          setImageFiles(prev => prev.filter((_, i) => i !== index))
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-28 px-4 py-2 font-semibold border rounded-2xl hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-28 px-4 py-2 bg-[#4A90E2] text-white rounded-2xl hover:bg-[#4483cb] disabled:bg-gray-400"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}