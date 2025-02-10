"use client"

import React from "react"

export default function MountainForm() {
    return (
        <div className="bg-white p-4 sm:p-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[66%] xl:mt-28 sm:mt-12 md:mt-16 lg:mt-20 shadow-lg rounded-3xl xl:mx-[30%] lg:mx-96 md:mx-20 mx-5 sm:mx-10">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Tambah Trip</h1>

            <form className="space-y-4 sm:space-y-6">
                <div className="space-y-4 sm:space-y-6">
                    {/* Pilih Gunung and Lokasi Gunung */}
                    <div className="grid grid-cols-3 sm:flex-row items-start sm:items-center gap-2 relative">
                        <div className="w-full sm:w-auto">
                            <label className="block mb-1 w-full sm:w-28">
                                Pilih Gunung
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <select
                                className="w-full sm:w-80 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            >
                                <option value="">Nama Gunung</option>
                                <option value="1">Gunung 1</option>
                                <option value="2">Gunung 2</option>
                            </select>
                        </div>

                        <div className="sm:w-[63%] sm:ml-4">
                            <label className="block mb-1">
                                Tanggal
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Tanggal Pergi"
                                className="xl:w-60 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="absolute xl:mx-[67%]  transform -translate-x-1/2 top-1/2 -translate-y-1/2">
                            <h1 className="text-lg xl:mt-7 text-gray-500">Sampai</h1>
                        </div>

                        <div className="xl:w-32 xl:mx-16 sm:w-[63%] mt-8 sm:ml-4">
                            <input
                                type="text"
                                placeholder="Tanggal Pulang"
                                className="xl:w-60 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>


                    {/* Tinggi Gunung and Foto Gunung */}
                    <div className="flex tems-start sm:items-center xl:gap-[150px] sm:gap-10">
                        <div className="xl:w-48 sm:w-56">
                            <label className="block mb-1">
                                Kapasitas Peserta
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Kapasitas"
                                className="xl:w-80 px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="xl:w-96 sm:w-[73%]">
                            <label className="block mb-1">
                                Foto Gunung
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    className="xl:w-[90%] p-2 rounded-2xl border text-sm file:w-36 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="xl:w-60 xl:-ml-[17%] sm:w-[73%]">
                            <label className="block mb-1">
                                Link Group WA
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Link"
                                    className="xl:w-60 p-2 rounded-2xl border text-md file:w-36 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
                                    required
                                />
                            </div>
                        </div>
                </div>

                    {/* Syarat & Ketentuan and Peraturan */}
                        <div className="xl:w-full">
                            <label className="block mb-1">
                                Syarat & Ketentuan
                                <span className="text-red-500 ml-0.5">*</span>
                            </label>
                            <textarea
                                placeholder="Ketik"
                                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[150px]"
                                required
                            ></textarea>
                        </div>
                    </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                    <button type="button" className="w-full sm:w-28 px-4 py-2 font-semibold border rounded-2xl hover:bg-gray-50">
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="w-full sm:w-28 px-4 py-2 bg-[#4A90E2] text-white rounded-2xl hover:bg-[#4483cb]"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    )
}

