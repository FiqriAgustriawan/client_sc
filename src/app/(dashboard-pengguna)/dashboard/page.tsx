"use client"

import { useState } from "react"
import type React from "react" // Added import for React

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Laki-Laki",
    birthDate: { day: "", month: "", year: "" },
    nik: "",
    city: "",
    phone: "",
    email: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      birthDate: {
        ...prevData.birthDate,
        [name]: value,
      },
    }))
  }

  return (
    <div className="min-h-screen p-4 md:p-10 flex flex-col md:flex-row mt-16 md:mr-5 max-w-[1200px] mx-auto">
      <div className="hidden md:block w-[10%]">{/* Sidebar space */}</div>
      <div className="w-full md:w-[90%] space-y-8">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Personal Data Form */}
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-md">
            <h2 className="text-xl font-medium text-[#2D3648] mb-4 md:mb-6">Data Pribadi</h2>
            <form className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="block text-sm text-[#6B7280]">
                  Nama Lengkap <span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm text-[#6B7280]">
                    Gender <span className="text-[#FF0000]">*</span>
                  </label>
                  <input
                    type="text"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                  />
                </div>

                <div className="space-y-2 md:col-span-4">
                  <label className="block text-sm text-[#6B7280]">
                    Tanggal Lahir <span className="text-[#FF0000]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <input
                      type="text"
                      name="day"
                      placeholder="Tanggal"
                      value={formData.birthDate.day}
                      onChange={handleBirthDateChange}
                      className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                    <input
                      type="text"
                      name="month"
                      placeholder="Bulan"
                      value={formData.birthDate.month}
                      onChange={handleBirthDateChange}
                      className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                    <input
                      type="text"
                      name="year"
                      placeholder="Tahun"
                      value={formData.birthDate.year}
                      onChange={handleBirthDateChange}
                      className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm text-[#6B7280]">
                    NIK <span className="text-[#FF0000]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nik"
                    placeholder="NIK"
                    value={formData.nik}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                  />
                </div>

                <div className="space-y-2 md:col-span-4">
                  <label className="block text-sm text-[#6B7280]">
                    Tempat Tinggal <span className="text-[#FF0000]">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Nama Kota"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:justify-end gap-3 mt-4 md:mt-0">
                <button
                  type="button"
                  className="w-full md:w-auto px-6 py-2.5 bg-[#F3F4F6] text-[#6B7280] rounded-[12px] text-sm hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2.5 bg-[#4A90E2] text-white rounded-[12px] text-sm hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-md">
            <h2 className="text-xl font-medium text-[#2D3648] mb-2">Kontak Pribadi</h2>
            <p className="text-[#6B7280] text-sm mb-4 md:mb-6">Dibutuhkan dalam proses validasi data</p>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-[#6B7280]">Nomor Telfon</label>
                  <button className="text-[#4A90E2] text-sm hover:text-blue-600 flex items-center gap-1">
                    + Tambah
                  </button>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-[#6B7280]">Email</label>
                  <button className="text-[#4A90E2] text-sm hover:text-blue-600 flex items-center gap-1">
                    + Tambah
                  </button>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                />
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-white rounded-[24px] p-4 md:p-6 shadow-md">
            <h2 className="text-xl font-medium text-[#2D3648] mb-2">Akun Terhubung</h2>
            <p className="text-[#6B7280] text-sm mb-4 md:mb-6">Memudahkan proses login dan verifikasi</p>

            <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-[12px]">
              <div className="flex items-center gap-3">
                {/* <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" /> */}
                <span className="text-[#6B7280]">Belum Terhubung</span>
              </div>
              <span className="text-[#9CA3AF]">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

