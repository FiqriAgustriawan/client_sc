import Image from "next/image"
import Link from "next/link"
import Logo  from "@/assets/svgs/LogoProduct.svg"
import bgLogin from "@/assets/images/Bg-login.png"

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen relative">
        {/* Form Section */}
        <div className="flex flex-col items-center justify-center p-6 lg:p-8 z-10 bg-white lg:bg-transparent">
          <div className="w-full max-w-md space-y-6">
            <div className="mb-8">
            <Image src={Logo} alt="Logo" width={30} height={20} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-wide text-[#1F4068]">Daftar SummitCess</h1>
              <p className="text-sm text-[#1F4068]">Lengkapi Data Diri Anda</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nama depan"
                  className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Nama belakang"
                  className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="password"
                placeholder="Konfirmasi Password"
                className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded-full" />
                <label htmlFor="terms" className="text-xs cursor-pointer">
                  Saya setuju dengan syarat dan ketentuan yang berlaku
                </label>
              </div>

              <div className="w-full py-2 rounded-3xl bg-[#4A90E2] text-white hover:bg-[#1364C4] transition-colors duration-300">
              <Link href={'Login'} className="px-52 rounded-3xl py-3 w-full" >
                Daftar
              </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Atau</span>
                </div>
              </div>

              <button className="w-full py-2 rounded-3xl border border-gray-300 hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Daftar dengan Google</span>
              </button>
            </div>

            <div className="text-center text-xs">
              {"Sudah Punya Akun? "}
              <Link href="/login" className="text-blue-500 hover:text-blue-600">
                Masuk
              </Link>
              {" Sekarang"}
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-l-3xl overflow-hidden">
              <Image
                src={bgLogin}
                alt="Summit Cess Preview"
                fill
                className="object-cover object-left-top "
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

