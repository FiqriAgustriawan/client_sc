"use client"

import React, { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { tripService } from "@/services/tripService"
import { useAuth } from "@/context/AuthContext"
import { mountainService } from "@/services/mountain.service"
import Image from "next/image"
import { IoClose } from "react-icons/io5"

export default function CreateTripForm() {
    const [mountains, setMountains] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [imagePreviewUrls, setImagePreviewUrls] = useState([])
    const [formData, setFormData] = useState({
        mountain_id: "",
        start_date: "",
        end_date: "",
        capacity: "",
        whatsapp_group: "",
        facilities: "",
        trip_info: "",
        terms_conditions: "",
        price: "",
        images: []
    })
    const router = useRouter()

    useEffect(() => {
        const fetchMountains = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await mountainService.getMountains(token)
                console.log('Mountains response:', response)
                if (response.success) {
                    setMountains(response.data)
                }
            } catch (error) {
                console.error("Failed to fetch mountains:", error)
                toast.error("Failed to load mountains")
            }
        }

        fetchMountains()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleFacilitiesChange = (e) => {
        const facilities = e.target.value.split(',').map(item => item.trim())
        setFormData({
            ...formData,
            facilities
        })
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        
        // Update form data with selected files
        setFormData({
            ...formData,
            images: [...formData.images, ...files]
        })
        
        // Generate preview URLs for the selected images
        const newImageUrls = files.map(file => URL.createObjectURL(file))
        setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls])
    }
    
    const removeImage = (index) => {
        // Create new arrays without the removed image
        const updatedImages = [...formData.images]
        const updatedPreviews = [...imagePreviewUrls]
        
        // Remove the image at the specified index
        updatedImages.splice(index, 1)
        updatedPreviews.splice(index, 1)
        
        // Update state
        setFormData({
            ...formData,
            images: updatedImages
        })
        setImagePreviewUrls(updatedPreviews)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formDataToSend = new FormData()

            // Add all form fields to FormData
            Object.keys(formData).forEach(key => {
                if (key === 'images') {
                    formData.images.forEach(image => {
                        formDataToSend.append('images[]', image)
                    })
                } else if (key === 'facilities') {
                    if (typeof formData.facilities === 'string') {
                        const facilities = formData.facilities.split(',').map(item => item.trim())
                        formDataToSend.append('facilities', JSON.stringify(facilities))
                    } else {
                        formDataToSend.append('facilities', JSON.stringify(formData.facilities))
                    }
                } else {
                    formDataToSend.append(key, formData[key])
                }
            })

            const response = await tripService.createTrip(formDataToSend)

            if (response.success) {
                toast.success("Trip berhasil dibuat!")
                router.push("/dashboard-jasa/trips")
            } else {
                toast.error(response.message || "Gagal membuat trip")
            }
        } catch (error) {
            console.error("Error creating trip:", error)
            toast.error("Gagal membuat trip. Silakan coba lagi.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white p-4 sm:p-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[66%] xl:mt-28 sm:mt-12 md:mt-16 lg:mt-20 shadow-lg rounded-3xl xl:mx-[30%] lg:mx-96 md:mx-20 mx-5 sm:mx-10">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Tambah Trip</h1>

            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4 sm:space-y-6">
                    {/* Pilih Gunung and Tanggal */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="w-full">
                            <label className="block mb-1">
                                Pilih Gunung
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <select
                                name="mountain_id"
                                value={formData.mountain_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            >
                                <option value="">Pilih Gunung</option>
                                {mountains.map(mountain => (
                                    <option key={mountain.id} value={mountain.id}>
                                        {mountain.nama_gunung}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block mb-1">
                                Tanggal Mulai
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label className="block mb-1">
                                Tanggal Selesai
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Kapasitas, Harga, dan Link WA */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="w-full">
                            <label className="block mb-1">
                                Kapasitas Peserta
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="Jumlah peserta"
                                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label className="block mb-1">
                                Harga Trip
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Harga dalam Rupiah"
                                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="w-full">
                            <label className="block mb-1">
                                Link Group WA
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <input
                                type="text"
                                name="whatsapp_group"
                                value={formData.whatsapp_group}
                                onChange={handleChange}
                                placeholder="https://chat.whatsapp.com/example"
                                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Foto Trip with Preview */}
                    <div className="w-full">
                        <label className="block mb-1">
                            Foto Trip
                            <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleImageChange}
                            className="w-full p-2 rounded-2xl border text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
                            required={formData.images.length === 0}
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload minimal 1 foto. Format: JPG, PNG (Max: 5MB)</p>
                        
                        {/* Image Previews */}
                        {imagePreviewUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {imagePreviewUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                                            <Image
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <IoClose size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Fasilitas */}
                    <div className="w-full">
                        <label className="block mb-1">
                            Fasilitas
                            <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <input
                            type="text"
                            name="facilities"
                            value={formData.facilities}
                            onChange={handleFacilitiesChange}
                            placeholder="Guide Profesional, Transportasi, Tenda, Makan 3x (pisahkan dengan koma)"
                            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Informasi Trip */}
                    <div className="w-full">
                        <label className="block mb-1">
                            Informasi Trip
                            <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <textarea
                            name="trip_info"
                            value={formData.trip_info}
                            onChange={handleChange}
                            placeholder="Deskripsi lengkap tentang trip ini"
                            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                            required
                        ></textarea>
                    </div>

                    {/* Syarat & Ketentuan */}
                    <div className="w-full">
                        <label className="block mb-1">
                            Syarat & Ketentuan
                            <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        <textarea
                            name="terms_conditions"
                            value={formData.terms_conditions}
                            onChange={handleChange}
                            placeholder="1. Wajib mengikuti arahan guide\n2. Membawa perlengkapan pribadi\n3. ..."
                            className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[150px]"
                            required
                        ></textarea>
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
                        disabled={isLoading}
                        className={`w-full sm:w-28 px-4 py-2 ${isLoading ? 'bg-blue-300' : 'bg-[#4A90E2] hover:bg-[#4483cb]'} text-white rounded-2xl`}
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </div>
    )
}

