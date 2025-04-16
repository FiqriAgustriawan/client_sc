'use client';

import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/svgs/LogoProduct.svg";
import bgLogin from "@/assets/images/Bg-login.png";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    nama_depan: '',
    nama_belakang: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (formData.password !== formData.password_confirmation) {
        setError('Password dan konfirmasi password tidak cocok');
        return;
      }

      const result = await register(formData);
      if (!result.success) {
        setError(result.message || 'Pendaftaran gagal. Silakan coba lagi.');
      }
      // No need to handle success case as AuthContext will handle the redirect
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // In your form button, update to show loading state:
  <button
    type="submit"
    disabled={loading}
    className="w-full py-2 rounded-3xl bg-[#4A90E2] text-white hover:bg-[#1364C4] transition-colors duration-300"
  >
    {loading ? 'Mendaftar...' : 'Daftar'}
  </button>

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="flex items-center gap-2 text-[#1F4068] hover:text-[#4A90E2] transition-colors duration-300 group">
          <div className="bg-white p-2 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Kembali</span>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 min-h-screen relative">
        {/* Form Section */}
        <div className="flex flex-col items-center justify-center p-6 lg:p-8 z-10 bg-white lg:bg-transparent">
          <div className="w-full max-w-md space-y-6">
          

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-wide text-[#1F4068]">Daftar SummitCess</h1>
              <p className="text-sm text-[#1F4068]">Lengkapi Data Diri Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nama_depan"
                  placeholder="Nama depan"
                  value={formData.nama_depan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="nama_belakang"
                  placeholder="Nama belakang"
                  value={formData.nama_belakang}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="password"
                name="password_confirmation"
                placeholder="Konfirmasi Password"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded-full" required />
                <label htmlFor="terms" className="text-xs cursor-pointer">
                  Saya setuju dengan syarat dan ketentuan yang berlaku
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-3xl bg-[#4A90E2] text-white hover:bg-[#1364C4] transition-colors duration-300"
              >
                Daftar
              </button>
            </form>
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
            <div className="text-center text-xs">
              {"Sudah Punya Akun? "}
              <Link href="/login" className="text-blue-500 hover:text-blue-600">
                Masuk
              </Link>
              {" Sekarang"}
            </div>
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
              className="object-cover object-left-top"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}