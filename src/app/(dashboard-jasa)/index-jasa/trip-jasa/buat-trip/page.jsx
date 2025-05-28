"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { tripService } from "@/services/tripService";
import { mountainService } from "@/services/mountain.service";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoTrash } from "react-icons/io5";
import {
  FiUpload,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiLink,
  FiInfo,
  FiFileText,
  FiImage,
  FiSave,
  FiChevronLeft,
  FiChevronRight,
  FiMap,
  FiTag,
} from "react-icons/fi";
import { FaList } from "react-icons/fa";

export default function CreateTripForm() {
  const [mountains, setMountains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [facilitiesList, setFacilitiesList] = useState([""]);
  const [imageUploadHover, setImageUploadHover] = useState(false);
  const [formData, setFormData] = useState({
    mountain_id: "",
    start_date: "",
    end_date: "",
    capacity: "",
    whatsapp_group: "",
    facilities: [],
    trip_info: "",
    terms_conditions: "",
    price: "",
    images: [],
  });
  const router = useRouter();

  useEffect(() => {
    const fetchMountains = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await mountainService.getMountains(token);
        if (response.success) {
          setMountains(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch mountains:", error);
        toast.error("Failed to load mountains");
      }
    };

    fetchMountains();
  }, []);

  useEffect(() => {
    // Update formData from facilities list
    setFormData((prev) => ({
      ...prev,
      facilities: facilitiesList.filter((item) => item.trim() !== ""),
    }));
  }, [facilitiesList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Update form data with selected files
    setFormData({
      ...formData,
      images: [...formData.images, ...files],
    });

    // Generate preview URLs for the selected images
    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls]);
  };

  const removeImage = (index) => {
    // Create new arrays without the removed image
    const updatedImages = [...formData.images];
    const updatedPreviews = [...imagePreviewUrls];

    // Remove the image at the specified index
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);

    // Update state
    setFormData({
      ...formData,
      images: updatedImages,
    });
    setImagePreviewUrls(updatedPreviews);
  };

  const addFacility = () => {
    setFacilitiesList([...facilitiesList, ""]);
  };

  const updateFacility = (index, value) => {
    const newFacilities = [...facilitiesList];
    newFacilities[index] = value;
    setFacilitiesList(newFacilities);
  };

  const removeFacility = (index) => {
    const newFacilities = [...facilitiesList];
    newFacilities.splice(index, 1);
    setFacilitiesList(newFacilities);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return (
          formData.mountain_id &&
          formData.start_date &&
          formData.end_date &&
          formData.capacity &&
          formData.price &&
          formData.whatsapp_group
        );
      case 2:
        return (
          facilitiesList.some((f) => f.trim() !== "") &&
          formData.trip_info &&
          formData.terms_conditions
        );
      case 3:
        return formData.images.length > 0;
      default:
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((image) => {
            formDataToSend.append("images[]", image);
          });
        } else if (key === "facilities") {
          formDataToSend.append(
            "facilities",
            JSON.stringify(formData.facilities)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await tripService.createTrip(formDataToSend);

      if (response.success) {
        toast.success("Trip berhasil dibuat!");
        router.push("/index-jasa/trip-jasa");
      } else {
        toast.error(response.message || "Gagal membuat trip");
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("Gagal membuat trip. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Steps configuration
  const steps = [
    { number: 1, name: "Detail Trip" },
    { number: 2, name: "Informasi" },
    { number: 3, name: "Foto Trip" },
  ];

  return (
    <motion.div
      className="p-4 w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header with improved step indicators */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Buat Trip Baru</h1>
          <p className="text-blue-100 mt-1">
            Isi data untuk membuat trip pendakian baru
          </p>

          {/* Simplified Step Indicator */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-medium border-2 transition-colors ${
                      currentStep >= step.number
                        ? "bg-white text-blue-700 border-white"
                        : "bg-transparent text-white border-white/40"
                    }`}
                  >
                    {step.number}
                  </div>
                  <p className="mt-2 text-sm text-center text-white font-medium">
                    {step.name}
                  </p>

                  {/* Connect with lines (except last item) */}
                  {step.number < steps.length && (
                    <div
                      className="hidden md:block absolute h-[2px] bg-white/30 w-24"
                      style={{
                        left: `calc(${
                          (step.number * 100) / steps.length
                        }% + 2rem)`,
                        top: "62px",
                        width: `calc(${100 / steps.length}% - 4rem)`,
                      }}
                    >
                      <div
                        className={`h-full bg-white transition-all duration-500 ${
                          currentStep > step.number ? "w-full" : "w-0"
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Detail Trip
                </h2>

                <div className="space-y-6">
                  {/* Pilih Gunung & Harga */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Pilih Gunung <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiMap className="text-gray-400" size={18} />
                        </div>
                        <select
                          name="mountain_id"
                          value={formData.mountain_id}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 text-base border-0 focus:outline-none focus:ring-0"
                          required
                        >
                          <option value="">Pilih Gunung</option>
                          {mountains.map((mountain) => (
                            <option key={mountain.id} value={mountain.id}>
                              {mountain.nama_gunung}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Harga Trip <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiDollarSign className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          inputMode="numeric"
                          onChange={handleChange}
                          placeholder="Harga dalam Rupiah"
                          className="block w-full pl-10 pr-3 py-3 text-base border-0 focus:outline-none focus:ring-0"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Harga per peserta dalam Rupiah
                      </p>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tanggal Mulai <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiCalendar className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 text-base border-0 focus:outline-none focus:ring-0"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tanggal Selesai <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiCalendar className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 text-base border-0 focus:outline-none focus:ring-0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kapasitas & Link WA */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Kapasitas Peserta{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiUsers className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          placeholder="Jumlah peserta"
                          className="block w-full pl-10 pr-3 py-3 text-base border-0 focus:outline-none focus:ring-0"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Jumlah maksimal peserta yang dapat ikut trip
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Link Group WhatsApp{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <FiLink className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="text"
                          name="whatsapp_group"
                          value={formData.whatsapp_group}
                          onChange={handleChange}
                          placeholder="https://chat.whatsapp.com/example"
                          className="block w-full pl-10 pr-3 py-3 text-base border-0 focus:outline-none focus:ring-0"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Peserta akan bergabung ke grup ini setelah mendaftar
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Information and Terms */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Informasi dan Ketentuan
                </h2>

                <div className="space-y-6">
                  {/* Informasi Trip */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Informasi Trip <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FiInfo className="text-gray-400" size={18} />
                      </div>
                      <textarea
                        name="trip_info"
                        value={formData.trip_info}
                        onChange={handleChange}
                        placeholder="Deskripsi lengkap tentang trip ini. Ceritakan tentang rute pendakian, jadwal, dan hal-hal menarik yang akan didapatkan peserta."
                        className="block w-full pl-10 pr-3 py-3 text-base border-0 focus:outline-none focus:ring-0 min-h-[120px]"
                        required
                      ></textarea>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Berikan informasi selengkap mungkin tentang trip ini
                    </p>
                  </div>

                  {/* Fasilitas dengan tampilan yang diperbaiki */}
                  <div className="space-y-2">
                    <label className="flex justify-between items-center text-sm font-medium text-gray-700">
                      <span>
                        Fasilitas <span className="text-red-500">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={addFacility}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Tambah Fasilitas
                      </button>
                    </label>
                    <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                      {facilitiesList.map((facility, index) => (
                        <div
                          key={index}
                          className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white"
                        >
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <FiTag className="text-gray-400" size={18} />
                          </div>
                          <input
                            type="text"
                            value={facility}
                            onChange={(e) =>
                              updateFacility(index, e.target.value)
                            }
                            placeholder={`Fasilitas #${
                              index + 1
                            } (contoh: Guide Profesional)`}
                            className="block w-full pl-10 pr-12 py-3 text-base border-0 focus:outline-none focus:ring-0"
                          />
                          {facilitiesList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFacility(index)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500"
                            >
                              <IoTrash size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Fasilitas yang akan diberikan kepada peserta trip
                    </p>
                  </div>

                  {/* Syarat & Ketentuan sebagai textarea */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Syarat & Ketentuan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FaList className="text-gray-400" size={18} />
                      </div>
                      <textarea
                        name="terms_conditions"
                        value={formData.terms_conditions}
                        onChange={handleChange}
                        placeholder="Masukkan syarat dan ketentuan yang berlaku untuk trip ini. Contoh: Peserta wajib mengikuti arahan guide, Dilarang merokok di area camping, dll."
                        className="block w-full pl-10 pr-3 py-3 text-base border-0 focus:outline-none focus:ring-0 min-h-[150px]"
                        required
                      ></textarea>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Tuliskan semua syarat dan ketentuan yang harus dipatuhi
                      peserta
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Images */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Foto Trip
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Foto Trip <span className="text-red-500">*</span>
                    </label>

                    <div
                      className={`border-2 border-dashed rounded-lg p-6 transition-all ${
                        imageUploadHover
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setImageUploadHover(true);
                      }}
                      onDragLeave={() => setImageUploadHover(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setImageUploadHover(false);
                        const files = Array.from(e.dataTransfer.files).filter(
                          (file) => file.type.includes("image")
                        );
                        if (files.length > 0) {
                          const newFormData = {
                            ...formData,
                            images: [...formData.images, ...files],
                          };
                          setFormData(newFormData);
                          setImagePreviewUrls([
                            ...imagePreviewUrls,
                            ...files.map((file) => URL.createObjectURL(file)),
                          ]);
                        }
                      }}
                    >
                      <div className="flex flex-col items-center justify-center space-y-3 text-center">
                        <div className="rounded-full bg-blue-50 p-4">
                          <FiImage size={28} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Drag & drop atau pilih foto
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Format: JPG, PNG (Maks: 5MB per file)
                          </p>
                        </div>
                        <label className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer transition-colors flex items-center">
                          <FiUpload size={16} className="mr-2" />
                          Pilih File
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleImageChange}
                            className="hidden"
                            required={formData.images.length === 0}
                          />
                        </label>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Upload minimal 1 foto. Format: JPG, PNG (Max: 5MB)
                    </p>

                    {/* Image Previews */}
                    {imagePreviewUrls.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-700 mb-3">
                          Preview Foto ({imagePreviewUrls.length})
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div
                              key={index}
                              className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                            >
                              <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover transition-all group-hover:scale-105 group-hover:brightness-75"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                              >
                                <IoClose size={14} />
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs py-0.5 px-2 rounded-full">
                                Foto {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Navigation */}
          <div className="border-t border-gray-200 mt-6 p-6 bg-gray-50 flex justify-between">
            <button
              type="button"
              onClick={currentStep > 1 ? prevStep : () => router.back()}
              className="px-5 py-2.5 border border-gray-300 rounded-lg flex items-center text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {currentStep > 1 ? (
                <>
                  <FiChevronLeft className="mr-1" />
                  Sebelumnya
                </>
              ) : (
                <>
                  <FiChevronLeft className="mr-1" />
                  Kembali
                </>
              )}
            </button>

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className={`px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center ${
                  validateStep(currentStep)
                    ? "hover:bg-blue-700"
                    : "opacity-70 cursor-not-allowed"
                }`}
                disabled={!validateStep(currentStep)}
              >
                Selanjutnya <FiChevronRight className="ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !validateStep(currentStep)}
                className={`px-5 py-2.5 rounded-lg flex items-center ${
                  isLoading || !validateStep(currentStep)
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" /> Simpan Trip
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
