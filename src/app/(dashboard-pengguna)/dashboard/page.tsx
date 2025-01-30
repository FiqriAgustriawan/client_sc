"use client"

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-4 md:p-10 flex mt-16 mr-5 max-w-[1200px] mx-auto">
      <div className="hidden md:block w-[30%]">{/* Sidebar space */}</div>
      <div className="w-full md:w-[250%] space-y-8">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Personal Data Form */}
          <div className="bg-white rounded-[24px] p-6">
            <h2 className="text-xl font-medium text-[#2D3648] mb-6">Data Pribadi</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm text-[#6B7280]">
                  Nama Lengkap <span className="text-[#FF0000]">*</span>
                </label>
                <input
                  type="text"
                  value="Summit Bin Ahmad"
                  className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                />
              </div>

              <div className="grid md:grid-cols-6 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm text-[#6B7280]">
                    Gender <span className="text-[#FF0000]">*</span>
                  </label>
                  <input
                    type="text"
                    value="Laki-Laki"
                    className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                  />
                </div>

                <div className="space-y-2 md:col-span-4">
                  <label className="block text-sm text-[#6B7280]">
                    Tanggal Lahir <span className="text-[#FF0000]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Tanggal"
                      className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                    <input
                      type="text"
                      placeholder="Bulan"
                      className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                    />
                    <input
                      type="text"
                      placeholder="Tahun"
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
                    placeholder="NIK"
                    className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                  />
                </div>

                <div className="space-y-2 md:col-span-4">
                  <label className="block text-sm text-[#6B7280]">
                    Tempat Tinggal <span className="text-[#FF0000]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Kota"
                    className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] placeholder-[#9CA3AF] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-6 py-2.5 bg-[#F3F4F6] text-[#6B7280] rounded-[12px] text-sm hover:bg-gray-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#4A90E2] text-white rounded-[12px] text-sm hover:bg-blue-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-[24px] p-6">
            <h2 className="text-xl font-medium text-[#2D3648] mb-2">Kontak Pribadi</h2>
            <p className="text-[#6B7280] text-sm mb-6">Dibutuhkan dalam proses validasi data</p>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-[#6B7280]">Nomor Telfon</label>
                  <button className="text-[#4A90E2] text-sm hover:text-blue-600 flex items-center gap-1">
                    + Tambah
                  </button>
                </div>
                <input
                  type="tel"
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
                  className="w-full px-4 py-2.5 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#2D3648] text-sm focus:outline-none focus:ring-1 focus:ring-[#4A90E2]"
                />
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-white rounded-[24px] p-6">
            <h2 className="text-xl font-medium text-[#2D3648] mb-2">Akun Terhubung</h2>
            <p className="text-[#6B7280] text-sm mb-6">Memudahkan proses login dan verifikasi</p>

            <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-[12px]">
              <div className="flex items-center gap-3">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
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

