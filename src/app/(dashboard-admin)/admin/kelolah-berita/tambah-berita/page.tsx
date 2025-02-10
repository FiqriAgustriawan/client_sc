import React from "react";

export default function MountainForm() {
  return (
    <div className="bg-white p-4 sm:p-6 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[60%] xl:max-w-[66%] xl:mt-28 sm:mt-12 md:mt-16 lg:mt-20 shadow-lg rounded-3xl xl:mx-[30%] lg:mx-96 md:mx-20 mx-5 sm:mx-10 mb-[235px]">
      <h1 className="text-xl font-semibold mb-6">Tambah Berita</h1>

      <div>
        <form className="space-y-4">
          <div className="space-y-4">
            {/* Judul Berita */}
            <div>
              <label className="block xl:mb-1 xl:w-28">
                Judul Berita <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                placeholder="Judul berita"
                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Foto Gunung & Gunung dalam satu baris di layar besar */}
            <div className="flex flex-col md:flex-row items-start gap-4">
              {/* Foto Gunung */}
              <div className="w-full md:w-2/3">
                <label className="block mb-1">
                  Foto Gunung <span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    className="w-full p-2 rounded-2xl border text-sm file:w-36 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
                    required
                  />
                </div>
              </div>

              {/* Gunung */}
              <div className="w-full md:w-1/3">
                <label className="block mb-1">
                  Gunung <span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Gunung"
                  className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Link Map */}
            <div>
              <label className="block mb-1">
                Link Map <span className="text-red-500 ml-0.5">*</span>
              </label>
              <input
                type="url"
                placeholder="https://linkmap.com"
                className="w-full px-3 py-2 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="w-28 px-4 py-2 font-semibold border rounded-2xl hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-28 px-4 py-2 bg-[#4A90E2] text-white rounded-2xl hover:bg-[#4483cb]"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}