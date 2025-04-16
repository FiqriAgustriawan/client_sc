'use client';

import Image from "next/image";
import Link from "next/link";
import bgLogin from "@/assets/images/Bg-login.png";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const result = await login(email, password);
        if (!result.success) {
          toast({
            variant: "destructive",
            title: "Login Gagal",
            description: result.message || 'Email atau password salah. Silakan coba lagi.',
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.",
        });
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };
  // In your login form submission handler
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  try {
    const response = await api.post('/api/login', {
      email,
      password
    });
    
    if (response.data.status === 'success') {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.role);
      
      // Redirect based on role
      if (response.data.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (response.data.role === 'guide') {
        router.push('/guide/dashboard');
      } else {
        router.push('/');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle suspension error
    if (error.response?.status === 403 && error.response?.data?.is_suspended) {
      setError(`Akun Anda telah disuspend hingga ${new Date(error.response.data.suspended_until).toLocaleDateString('id-ID')}. Alasan: ${error.response.data.suspension_reason}`);
    } else {
      setError(error.response?.data?.message || 'Email atau password salah');
    }
  } finally {
    setIsLoading(false);
  }
};

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
        <div className="flex items-center justify-center p-6 lg:p-8 z-10 bg-white lg:bg-transparent">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-wide text-[#1F4068]">Selamat Datang</h1>
              <p className="text-sm text-[#1F4068]">Masukkan Email Dan Password Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="rounded-full" />
                  <label htmlFor="remember" className="text-xs cursor-pointer">
                    Ingat Saya
                  </label>
                </div>

                <Link href="/forgot-password" className="text-xs text-[#A5A5A5] hover:text-gray-700">
                  Lupa Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-3xl bg-[#4A90E2] text-white hover:bg-[#1364C4] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  "Sign In"
                )}
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
              <span>Sign In With Google</span>
            </button>
            <div className="text-center text-xs">
              {"Belum Punya Akun? "}
              <Link href="/register" className="text-blue-500 hover:text-blue-600">
                Daftar
              </Link>
              {" Sekarang"}
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="absolute top-0 right-0 w-[55%] h-full hidden lg:block">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-[#1F4068] rounded-l-3xl overflow-hidden">
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
    </div>
  );
}

