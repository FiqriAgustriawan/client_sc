"use client";

import Image from "next/image";
import Link from "next/link";
import bgLogin from "@/assets/images/Bg-login.png";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  const passwordInputRef = useRef(null);

  // Focus effect on load
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("email-input")?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(
          result.message || "Email atau password salah. Silakan coba lagi."
        );
        toast({
          variant: "destructive",
          title: "Login Gagal",
          description:
            result.message || "Email atau password salah. Silakan coba lagi.",
        });
      }
    } catch (error) {
      setError(
        "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi."
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    // Maintain focus on password field after toggling visibility
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 0);
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#1F4068] hover:text-[#4A90E2] transition-colors duration-300 group"
        >
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
              <h1 className="text-2xl font-bold tracking-wide text-[#1F4068] transition-all duration-300">
                Selamat Datang
              </h1>
              <p className="text-sm text-[#1F4068]">
                Masukkan Email Dan Password Anda
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-fade-in">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                {/* Email Input with Icon */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Password Input with Icon and Show/Hide Toggle */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Ingat Saya
                  </label>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm text-[#4A90E2] hover:text-[#1364C4] hover:underline transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-3xl bg-[#4A90E2] text-white hover:bg-[#1364C4] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-500">
                  atau
                </span>
              </div>
            </div>

            <div className="text-center text-sm">
              {"Belum Punya Akun? "}
              <Link
                href="/register"
                className="text-[#4A90E2] hover:text-[#1364C4] font-medium hover:underline transition-colors"
              >
                Daftar
              </Link>
              {" Sekarang"}
            </div>
          </div>
        </div>

        {/* Image Section - Keeping the original */}
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
