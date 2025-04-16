"use client"

import React, { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { getMountainById, updateMountain } from "@/services/mountain.service"
import { FiInfo, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import Image from 'next/image'
import { Toaster, toast } from 'react-hot-toast'

export default function EditMountain({ params }) {
  const router = useRouter()
  const mountainId = use(params).id
  const [loading, setLoading] = useState(false)
  // Update the initial state first
  // Update initial state
  const [formData, setFormData] = useState({
    nama_gunung: "",
    lokasi: "",
    ketinggian: 0,
    link_map: "",
    status_gunung: "mudah",    // lowercase to match enum
    status_pendakian: "pemula", // lowercase to match enum
    deskripsi: "",
    peraturan: "",
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [existingImages, setExistingImages] = useState([])

  // Update the useEffect fetch data part
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        const response = await getMountainById(mountainId, token)
        const mountain = response.data

        if (!mountain) {
          router.push('/admin/kelola-gunung')
          return
        }

        setFormData({
          nama_gunung: mountain.nama_gunung || '',
          lokasi: mountain.lokasi || '',
          ketinggian: mountain.ketinggian || 0,
          link_map: mountain.link_map || '',
          status_gunung: mountain.status_gunung || 'mudah',    // lowercase
          status_pendakian: mountain.status_pendakian || 'pemula', // lowercase
          deskripsi: mountain.deskripsi || '',
          peraturan: Array.isArray(mountain.peraturan) ? mountain.peraturan.join('\n') : '',
        })

        const imagePaths = mountain.images?.map(img => img.image_path) || []
        setExistingImages(imagePaths)
      } catch (error) {
        toast.error(
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-xl" />
            <div>
              <p className="font-medium">Gagal memuat data</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        )
        router.push('/admin/kelola-gunung')
      }
    }

    if (mountainId) {
      fetchData()
    }
  }, [mountainId, router])

  const handleSubmit = async (e) => {
    e.preventDefault()

    toast((t) => (
      <div className="flex items-start gap-3 w-[350px] bg-white rounded-lg overflow-hidden">
        <div className="flex-shrink-0 mt-4 ml-4">
          <FiInfo className="text-blue-500 text-xl" />
        </div>
        <div className="flex-1 space-y-3 p-4">
          <div>
            <h4 className="font-semibold text-gray-800 text-base">
              Konfirmasi Perubahan
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Pastikan data yang diubah sudah benar
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id)
                await processUpdate()
              }}
              className="flex-1 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg
                hover:bg-blue-600 active:bg-blue-700 transition-all duration-200"
            >
              Simpan Perubahan
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg
                hover:bg-gray-200 active:bg-gray-300 transition-all duration-200"
            >
              Batal
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
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
    })
  }

  const processUpdate = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token tidak ditemukan')

      const formDataToSend = new FormData()

      // Add _method field for Laravel to handle PUT request
      formDataToSend.append('_method', 'PUT')

      // Add basic form fields
      Object.keys(formData).forEach(key => {
        if (key === 'peraturan') {
          const rules = formData[key].split('\n').filter(rule => rule.trim())
          formDataToSend.append('peraturan', JSON.stringify(rules))
        } else if (key === 'ketinggian') {
          formDataToSend.append(key, Number(formData[key]))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      // Add new images if any
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formDataToSend.append('images[]', file)
        })
      }

      // Add existing images
      formDataToSend.append('existing_images', JSON.stringify(existingImages))

      const response = await updateMountain(mountainId, formDataToSend, token)

      if (response.success) {
        toast.success(
          <div className="flex items-center gap-3">
            <FiCheckCircle className="text-xl" />
            <div>
              <p className="font-medium">Berhasil!</p>
              <p className="text-sm">Data gunung berhasil diperbarui</p>
            </div>
          </div>,
          {
            style: {
              background: '#10B981',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
            },
            duration: 3000,
          }
        )

        setTimeout(() => {
          router.push('/admin/kelola-gunung')
        }, 2000)
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error(
        <div className="flex items-center gap-3">
          <FiAlertCircle className="text-xl" />
          <div>
            <p className="font-medium">Gagal Memperbarui Data</p>
            <p className="text-sm">{error.message}</p>
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
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files).slice(0, 5)

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
      const isValidSize = file.size <= 2 * 1024 * 1024 // 2MB

      if (!isValidType || !isValidSize) {
        toast.error(
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-xl" />
            <div>
              <p className="font-medium">Format Tidak Sesuai</p>
              <p className="text-sm">
                {!isValidType ? 'File harus berformat JPG atau PNG' : 'Maksimal ukuran file adalah 2MB'}
              </p>
            </div>
          </div>
        )
      }
      return isValidType && isValidSize
    })

    const totalFiles = [...imageFiles, ...validFiles].slice(0, 5)
    setImageFiles(totalFiles)

    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setImagePreview(prev => {
      const combined = [...prev, ...newPreviews].slice(0, 5)
      prev.slice(combined.length).forEach(url => URL.revokeObjectURL(url))
      return combined
    })
  }
  {/* Existing Images */ }

  const getImageUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`
  }

  return (
    <>
      <div className="bg-white p-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[66%] xl:mt-28 sm:mt-12 md:mt-16 lg:mt-20 shadow-lg rounded-3xl xl:mx-[30%] lg:mx-96 md:mx-20 mx-5 sm:mx-10">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Edit Gunung</h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Nama dan Lokasi Gunung */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <div className="group relative">
                <label className="block mb-1 flex items-center">
                  Nama Gunung
                  <FiInfo className="ml-2 text-gray-400 cursor-help" />
                </label>
                <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                  Nama resmi gunung
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
                  <FiInfo className="ml-2 text-gray-400 cursor-help" />
                </label>
                <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                  Lokasi administratif gunung
                </div>
              </div>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Status Gunung dan Status Pendakian */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <div className="group relative">
                <label className="block mb-1 flex items-center">
                  Status Gunung
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
                  <FiInfo className="ml-2 text-gray-400 cursor-help" />
                </label>
                <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                  Tingkat pengalaman yang disarankan
                </div>
              </div>
              <select
                name="status_pendakian"
                value={formData.status_pendakian}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[150px]"
                required
              ></textarea>
            </div>
            <div>
              <div className="group relative">
                <label className="block mb-1 flex items-center">
                  Peraturan
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
                placeholder="1. Wajib membawa surat izin pendakian"
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
                  <FiInfo className="ml-2 text-gray-400 cursor-help" />
                </label>
                <div className="invisible group-hover:visible absolute z-10 bg-black text-white text-xs rounded p-2 -top-8">
                  Upload foto gunung (max 2MB per file)
                </div>
              </div>
              <span className="text-sm text-gray-500">Format: JPG, PNG</span>
            </div>




            {existingImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative h-40">
                    <Image
                      src={getImageUrl(image)}
                      alt={`Existing ${index + 1}`}
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setExistingImages(prev => prev.filter((_, i) => i !== index))
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Image Upload */}
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

            {/* New Image Previews */}
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
                        URL.revokeObjectURL(url)
                        setImagePreview(prev => prev.filter((_, i) => i !== index))
                        setImageFiles(prev => prev.filter((_, i) => i !== index))
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/kelola-gunung')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}