"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getMountainById, updateMountain } from "@/services/mountain.service";
import {
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
  FiMove,
} from "react-icons/fi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";

export default function EditMountain({ params }) {
  const router = useRouter();
  const mountainId = use(params).id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nama_gunung: "",
    lokasi: "",
    ketinggian: 0,
    link_map: "",
    status_gunung: "mudah",
    status_pendakian: "pemula",
    deskripsi: "",
    peraturan: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [rules, setRules] = useState([""]);
  const [activeTab, setActiveTab] = useState("info");
  const [formProgress, setFormProgress] = useState(0);

  // Menghitung progress form
  useEffect(() => {
    const requiredFields = [
      "nama_gunung",
      "lokasi",
      "ketinggian",
      "link_map",
      "deskripsi",
    ];
    const filledFields = requiredFields.filter(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    );

    // Tambahkan pengecekan untuk peraturan
    const hasRules = formData.peraturan && formData.peraturan.trim() !== "";

    // Tambahkan pengecekan untuk gambar
    const hasImages = existingImages.length > 0 || imageFiles.length > 0;

    // Hitung persentase (fields + rules + images)
    const totalItems = requiredFields.length + 2; // +2 untuk rules dan images
    const completedItems =
      filledFields.length + (hasRules ? 1 : 0) + (hasImages ? 1 : 0);

    setFormProgress(Math.round((completedItems / totalItems) * 100));
  }, [formData, existingImages, imageFiles]);

  // Update the useEffect fetch data part
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await getMountainById(mountainId, token);
        const mountain = response.data;

        if (!mountain) {
          router.push("/admin/kelola-gunung");
          return;
        }

        setFormData({
          nama_gunung: mountain.nama_gunung || "",
          lokasi: mountain.lokasi || "",
          ketinggian: mountain.ketinggian || 0,
          link_map: mountain.link_map || "",
          status_gunung: mountain.status_gunung || "mudah",
          status_pendakian: mountain.status_pendakian || "pemula",
          deskripsi: mountain.deskripsi || "",
          peraturan: Array.isArray(mountain.peraturan)
            ? mountain.peraturan.join("\n")
            : "",
        });

        // Mengatur rules dari peraturan yang ada
        if (
          Array.isArray(mountain.peraturan) &&
          mountain.peraturan.length > 0
        ) {
          setRules(
            mountain.peraturan.map((rule) => rule.replace(/^\d+\.\s*/, ""))
          );
        }

        const imagePaths = mountain.images?.map((img) => img.image_path) || [];
        setExistingImages(imagePaths);
      } catch (error) {
        toast.error(
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-xl" />
            <div>
              <p className="font-medium">Gagal memuat data</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        );
        router.push("/admin/kelola-gunung");
      }
    };

    if (mountainId) {
      fetchData();
    }
  }, [mountainId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fungsi untuk menangani peraturan
  const handleRuleChange = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);

    // Update formData.peraturan dengan format yang benar
    const formattedRules = newRules
      .filter((rule) => rule.trim() !== "")
      .map((rule, idx) => `${idx + 1}. ${rule.replace(/^\d+\.\s*/, "")}`)
      .join("\n");

    setFormData((prev) => ({
      ...prev,
      peraturan: formattedRules,
    }));
  };

  const addRule = () => {
    setRules([...rules, ""]);
  };

  const removeRule = (index) => {
    if (rules.length > 1) {
      const newRules = [...rules];
      newRules.splice(index, 1);
      setRules(newRules);

      // Update formData.peraturan
      const formattedRules = newRules
        .filter((rule) => rule.trim() !== "")
        .map((rule, idx) => `${idx + 1}. ${rule.replace(/^\d+\.\s*/, "")}`)
        .join("\n");

      setFormData((prev) => ({
        ...prev,
        peraturan: formattedRules,
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files).slice(
      0,
      5
    );

    const validFiles = files.filter((file) => {
      const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      );
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB

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
        );
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
        );
      }
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError(
        "Beberapa file dilewati. Pastikan semua file adalah gambar (JPG/PNG) dan dibawah 2MB"
      );
    }

    // Combine with existing files if not at limit
    const totalFiles = [...imageFiles, ...validFiles].slice(0, 5);
    setImageFiles(totalFiles);

    // Create preview URLs for all files
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => {
      const combined = [...prev, ...newPreviews].slice(0, 5);
      // Clean up any unused previews
      prev.slice(combined.length).forEach((url) => URL.revokeObjectURL(url));
      return combined;
    });
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

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Fungsi untuk validasi tab
  const validateInfoTab = () => {
    const requiredFields = [
      "nama_gunung",
      "lokasi",
      "ketinggian",
      "link_map",
      "deskripsi",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].toString().trim() === ""
    );

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
    if (!formData.peraturan || formData.peraturan.trim() === "") {
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
    if (currentTab === "info") {
      if (validateInfoTab()) {
        setActiveTab("rules");
      }
    } else if (currentTab === "rules") {
      if (validateRulesTab()) {
        setActiveTab("photos");
      }
    }
  };

  const goToPrevTab = (currentTab) => {
    if (currentTab === "rules") {
      setActiveTab("info");
    } else if (currentTab === "photos") {
      setActiveTab("rules");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    toast(
      (t) => (
        <div className="flex items-start gap-3 w-[350px] bg-white rounded-lg overflow-hidden">
          <div className="flex-shrink-0 mt-4 ml-4">
            <FiAlertCircle className="text-blue-500 text-xl" />
          </div>
          <div className="flex-1 space-y-3 p-4">
            <div>
              <h4 className="font-semibold text-gray-800 text-base">
                Konfirmasi Perubahan
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Pastikan data berikut sudah lengkap:
              </p>
            </div>

            <ul className="text-sm text-gray-700 space-y-2">
              <li
                className="flex items-center gap-3 animate-fadeIn"
                style={{ animationDelay: "0.1s" }}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Informasi dasar gunung
              </li>
              <li
                className="flex items-center gap-3 animate-fadeIn"
                style={{ animationDelay: "0.2s" }}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Deskripsi dan peraturan
              </li>
              <li
                className="flex items-center gap-3 animate-fadeIn"
                style={{ animationDelay: "0.3s" }}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Foto gunung (min. 1 foto)
              </li>
            </ul>

            <div className="flex gap-2 pt-2">
              <button
                onClick={async () => {
                  const btn = document.getElementById("saveBtn");
                  btn.innerHTML = `
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                `;
                  await new Promise((resolve) => setTimeout(resolve, 800));
                  toast.dismiss(t.id);
                  processUpdate();
                }}
                id="saveBtn"
                className="flex-1 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg
                hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 
                flex items-center justify-center gap-2 shadow hover:shadow-md"
              >
                Simpan Perubahan
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
      ),
      {
        duration: Infinity,
        position: "top-right",
        style: {
          background: "white",
          padding: "0",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          animation: "slideIn 0.3s ease-out",
          marginTop: "1rem",
          marginRight: "1rem",
        },
      }
    );

    // Add required keyframes and animations
    const style = document.createElement("style");
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

  const processUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      // Validasi data
      if (!formData.nama_gunung || formData.nama_gunung.trim() === "") {
        throw new Error("Nama gunung tidak boleh kosong");
      }

      if (!formData.lokasi || formData.lokasi.trim() === "") {
        throw new Error("Lokasi gunung tidak boleh kosong");
      }

      if (!formData.ketinggian || formData.ketinggian <= 0) {
        throw new Error("Ketinggian gunung harus lebih dari 0 MDPL");
      }

      if (!formData.link_map || !formData.link_map.startsWith("https://")) {
        throw new Error("Link map harus valid dan dimulai dengan https://");
      }

      if (!formData.deskripsi || formData.deskripsi.trim() === "") {
        throw new Error("Deskripsi gunung tidak boleh kosong");
      }

      if (!formData.peraturan || formData.peraturan.trim() === "") {
        throw new Error("Minimal harus ada 1 peraturan gunung");
      }

      if (existingImages.length === 0 && imageFiles.length === 0) {
        throw new Error("Minimal harus ada 1 foto gunung");
      }

      const formDataToSend = new FormData();

      // Add _method field for Laravel to handle PUT request
      formDataToSend.append("_method", "PUT");

      // Add basic form fields
      Object.keys(formData).forEach((key) => {
        if (key === "peraturan") {
          const rules = formData[key].split("\n").filter((rule) => rule.trim());
          formDataToSend.append("peraturan", JSON.stringify(rules));
        } else if (key === "ketinggian") {
          formDataToSend.append(key, Number(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add new images if any
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formDataToSend.append("images[]", file);
        });
      }

      // FIXED: Ensure existing_images contains proper paths
      // Make sure we're sending the exact database paths without any URL prefix
      const cleanedExistingImages = existingImages.map((path) => {
        // If path already starts with 'mountains/', keep it as is
        if (path.startsWith("mountains/")) {
          return path;
        }

        // Extract just the path part if it's a full URL or contains storage/
        const pathParts = path.split("storage/");
        return pathParts.length > 1 ? pathParts[1] : path;
      });

      formDataToSend.append(
        "existing_images",
        JSON.stringify(cleanedExistingImages)
      );

      const response = await updateMountain(mountainId, formDataToSend, token);

      if (response.success) {
        toast.success(
          <div className="flex items-center gap-3 min-w-[300px]">
            <FiCheckCircle className="text-xl" />
            <div>
              <p className="font-medium">Berhasil!</p>
              <p className="text-sm text-white text-opacity-90">
                Data gunung berhasil diperbarui
              </p>
            </div>
          </div>,
          {
            position: "top-right",
            style: {
              background: "#10B981",
              color: "white",
              padding: "16px",
              borderRadius: "12px",
              animation: "slideIn 0.3s ease-out",
            },
            duration: 3000,
          }
        );

        setTimeout(() => {
          router.push("/admin/kelola-gunung");
        }, 2000);
      } else {
        throw new Error(response.message || "Gagal memperbarui data gunung");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        <div className="flex items-center gap-3 min-w-[300px]">
          <FiAlertCircle className="text-xl" />
          <div>
            <p className="font-medium">Gagal Memperbarui Data</p>
            <p className="text-sm whitespace-pre-line">{error.message}</p>
          </div>
        </div>,
        {
          style: {
            background: "#EF4444",
            color: "white",
            padding: "16px",
            borderRadius: "12px",
          },
          duration: 4000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${path}`;
  };

  return (
    <>
      <Toaster position="top-right" />

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
              Edit Data Gunung
            </motion.h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Progres:</span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {formProgress}%
              </span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-start gap-3"
            >
              <FiAlertCircle className="text-xl mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-2 border-b">
              <button
                type="button"
                onClick={() => setActiveTab("info")}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                  activeTab === "info"
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Informasi Dasar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rules")}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                  activeTab === "rules"
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Peraturan
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("photos")}
                className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                  activeTab === "photos"
                    ? "bg-blue-500 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Foto
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {activeTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Nama dan Lokasi Gunung */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="group relative">
                        <label className="block mb-1 flex items-center text-gray-700 font-medium">
                          Nama Gunung
                          <div className="relative ml-2">
                            <FiInfo className="text-gray-400 cursor-help" />
                            <div className="invisible group-hover:visible absolute z-10 bg-gray-800 text-white text-xs rounded p-2 -top-10 -left-1/2 w-48 shadow-lg">
                              Nama resmi gunung yang diakui secara geografis
                            </div>
                          </div>
                        </label>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="relative"
                      >
                        <input
                          type="text"
                          name="nama_gunung"
                          value={formData.nama_gunung}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                          placeholder="Contoh: Gunung Semeru"
                        />
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <div className="group relative">
                        <label className="block mb-1 flex items-center text-gray-700 font-medium">
                          Lokasi
                          <div className="relative ml-2">
                            <FiInfo className="text-gray-400 cursor-help" />
                            <div className="invisible group-hover:visible absolute z-10 bg-gray-800 text-white text-xs rounded p-2 -top-10 -left-1/2 w-48 shadow-lg">
                              Lokasi administratif gunung (provinsi, kabupaten)
                            </div>
                          </div>
                        </label>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="relative"
                      >
                        <input
                          type="text"
                          name="lokasi"
                          value={formData.lokasi}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                          placeholder="Contoh: Jawa Timur, Kabupaten Malang"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Status Gunung dan Status Pendakian */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="group relative">
                        <label className="block mb-1 flex items-center text-gray-700 font-medium">
                          Status Gunung
                          <div className="relative ml-2">
                            <FiInfo className="text-gray-400 cursor-help" />
                            <div className="invisible group-hover:visible absolute z-10 bg-gray-800 text-white text-xs rounded p-2 -top-10 -left-1/2 w-48 shadow-lg">
                              Tingkat kesulitan medan gunung
                            </div>
                          </div>
                        </label>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="relative"
                      >
                        <select
                          name="status_gunung"
                          value={formData.status_gunung}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        >
                          <option value="mudah">Mudah</option>
                          <option value="menengah">Menengah</option>
                          <option value="sulit">Sulit</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <div className="group relative">
                        <label className="block mb-1 flex items-center text-gray-700 font-medium">
                          Status Pendakian
                          <div className="relative ml-2">
                            <FiInfo className="text-gray-400 cursor-help" />
                            <div className="invisible group-hover:visible absolute z-10 bg-gray-800 text-white text-xs rounded p-2 -top-10 -left-1/2 w-48 shadow-lg">
                              Tingkat pengalaman yang disarankan untuk pendaki
                            </div>
                          </div>
                        </label>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="relative"
                      >
                        <select
                          name="status_pendakian"
                          value={formData.status_pendakian}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                        >
                          <option value="pemula">Pemula</option>
                          <option value="mahir">Mahir</option>
                          <option value="ahli">Ahli</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Ketinggian dan Link Map */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="group relative">
                        <label className="block mb-1 flex items-center text-gray-700 font-medium">
                          Ketinggian
                          <div className="relative ml-2">
                            <FiInfo className="text-gray-400 cursor-help" />
                            <div className="invisible group-hover:visible absolute z-10 bg-gray-800 text-white text-xs rounded p-2 -top-10 -left-1/2 w-48 shadow-lg">
                              Ketinggian gunung dalam meter di atas permukaan
                              laut (MDPL)
                            </div>
                          </div>
                        </label>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="relative"
                      >
                        <input
                          type="number"
                          name="ketinggian"
                          value={formData.ketinggian}
                          onChange={handleChange}
                          placeholder="MDPL"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                          min="1"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                          MDPL
                        </div>
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <div className="group relative">
                        <label className="block mb-1 flex items-center text-gray-700 font-medium">
                          Link Map
                          <div className="relative ml-2">
                            <FiInfo className="text-gray-400 cursor-help" />
                            <div className="invisible group-hover:visible absolute z-10 bg-gray-800 text-white text-xs rounded p-2 -top-10 -left-1/2 w-48 shadow-lg">
                              Link Google Maps lokasi gunung
                            </div>
                          </div>
                        </label>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        className="relative"
                      >
                        <input
                          type="url"
                          name="link_map"
                          value={formData.link_map}
                          onChange={handleChange}
                          placeholder="https://goo.gl/maps/..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="space-y-2">
                    <div className="group relative">
                      <label className="block mb-1 flex items-center text-gray-700 font-medium">
                        Deskripsi
                        <div className="relative ml-2">
                          <FiInfo className="text-gray-400 cursor-help" />
                          <div className="invisible group-hover:visible absolute z-10 bg-gray-800 text-white text-xs rounded p-2 -top-10 -left-1/2 w-48 shadow-lg">
                            Informasi detail tentang gunung
                          </div>
                        </div>
                      </label>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        required
                        placeholder="Deskripsikan gunung secara detail, termasuk informasi geografis, sejarah, dan karakteristik khusus..."
                      ></textarea>
                    </motion.div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => goToNextTab("info")}
                      className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
                    >
                      Lanjut ke Peraturan
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 010-1.414L10.586 10 7.293 6.707a1 1 011.414-1.414l4 4a1 1 010 1.414l-4 4a1 1 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === "rules" && (
                <motion.div
                  key="rules"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <h3 className="text-blue-800 font-medium mb-2 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 011-16 0 018 8zm-7-4a1 1 112 0 1 1 012 0zM9 9a1 1 000 2v3a1 1 001 1h1a1 1 100-2v-3a1 1 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Peraturan Pendakian
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Tambahkan peraturan yang harus dipatuhi oleh pendaki.
                      Peraturan yang jelas akan membantu pendaki mempersiapkan
                      diri dengan baik.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {rules.map((rule, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 mt-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <input
                            type="text"
                            value={rule}
                            onChange={(e) =>
                              handleRuleChange(index, e.target.value)
                            }
                            placeholder="Tambahkan peraturan pendakian..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRule(index)}
                          disabled={rules.length <= 1}
                          className={`mt-3 text-red-500 hover:text-red-700 transition-colors ${
                            rules.length <= 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <FiTrash2 />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={addRule}
                    className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition-colors mt-2"
                  >
                    <FiPlus className="text-lg" />
                    Tambah Peraturan Baru
                  </motion.button>

                  <div className="flex justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => goToPrevTab("rules")}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 010 1.414L9.414 10l3.293 3.293a1 1 01-1.414 1.414l-4-4a1 1 010-1.414l4-4a1 1 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Kembali
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => goToNextTab("rules")}
                      className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl shadow-md hover:bg-blue-600 transition-all duration-200 flex items-center gap-2"
                    >
                      Lanjut ke Foto
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 010-1.414L10.586 10 7.293 6.707a1 1 011.414-1.414l4 4a1 1 010 1.414l-4 4a1 1 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === "photos" && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <h3 className="text-blue-800 font-medium mb-2 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 011-16 0 018 8zm-7-4a1 1 112 0 1 1 012 0zM9 9a1 1 000 2v3a1 1 001 1h1a1 1 100-2v-3a1 1 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Foto Gunung
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Unggah foto gunung (maks. 5 foto). Format yang didukung:
                      JPG, PNG. Ukuran maksimal: 2MB per foto.
                    </p>
                  </div>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-gray-700 font-medium">
                        Foto yang Sudah Ada
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {existingImages.map((path, index) => (
                          <motion.div
                            key={`existing-${index}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="relative group"
                          >
                            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                              <Image
                                src={getImageUrl(path)}
                                alt={`Foto gunung ${index + 1}`}
                                width={200}
                                height={200}
                                className="object-cover w-full h-full"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(index)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  <div className="space-y-3">
                    <h3 className="text-gray-700 font-medium">
                      Tambah Foto Baru
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {/* Upload Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="aspect-w-1 aspect-h-1 w-full"
                      >
                        <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <AiOutlineCloudUpload className="w-10 h-10 text-gray-400 mb-2" />
                            <p className="text-xs text-gray-500 text-center">
                              <span className="font-medium">
                                Klik untuk unggah
                              </span>{" "}
                              atau seret dan lepas
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleImageChange}
                            multiple
                          />
                        </label>
                      </motion.div>

                      {/* Preview New Images */}
                      {imagePreview.map((url, index) => (
                        <motion.div
                          key={`preview-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="relative group"
                        >
                          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm">
                            <Image
                              src={url}
                              alt={`Preview ${index + 1}`}
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {5 - (imageFiles.length + existingImages.length)} foto
                      lagi dapat ditambahkan
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => goToPrevTab("photos")}
                      className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 010 1.414L9.414 10l3.293 3.293a1 1 01-1.414 1.414l-4-4a1 1 010-1.414l4-4a1 1 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Kembali
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-3 bg-green-500 text-white font-medium rounded-xl shadow-md hover:bg-green-600 transition-all duration-200 flex items-center gap-2 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
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
                              d="M4 12a8 8 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 04 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="text-lg" />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </motion.button>
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
