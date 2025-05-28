"use client";

import Image from "next/image";
import Link from "next/link";
import bgLogin from "@/assets/images/Bg-login.png";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    nama_depan: "",
    nama_belakang: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate password strength for better UX
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, message: "" });
      return;
    }

    let score = 0;
    let message = "";

    // Check length
    if (password.length >= 8) score += 1;

    // Check for uppercase, lowercase, numbers and special chars
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set message based on score
    if (score <= 2) message = "Lemah";
    else if (score <= 3) message = "Sedang";
    else message = "Kuat";

    setPasswordStrength({ score, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (formData.password !== formData.password_confirmation) {
        setError("Password dan konfirmasi password tidak cocok");
        setLoading(false);
        return;
      }

      const result = await register(formData);
      if (!result.success) {
        setError(result.message || "Pendaftaran gagal. Silakan coba lagi.");
      }
      // No need to handle success case as AuthContext will handle the redirect
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility functions
  const togglePassword = () => {
    setShowPassword(!showPassword);
    setTimeout(() => passwordInputRef.current?.focus(), 0);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setTimeout(() => confirmPasswordInputRef.current?.focus(), 0);
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
        <div className="flex flex-col items-center justify-center p-6 lg:p-8 z-10 bg-white lg:bg-transparent">
          <div className="w-full max-w-md space-y-5">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-wide text-[#1F4068]">
                Daftar SummitCess
              </h1>
              <p className="text-sm text-[#1F4068]">Lengkapi Data Diri Anda</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-fade-in">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nama_depan"
                    placeholder="Nama depan"
                    value={formData.nama_depan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Last Name */}
                <input
                  type="text"
                  name="nama_belakang"
                  placeholder="Nama belakang"
                  value={formData.nama_belakang}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-10 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {/* Password with strength indicator */}
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={passwordInputRef}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="flex items-center gap-2 ml-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          passwordStrength.score <= 2
                            ? "bg-red-500"
                            : passwordStrength.score <= 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs ${
                        passwordStrength.score <= 2
                          ? "text-red-600"
                          : passwordStrength.score <= 3
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {passwordStrength.message}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password with match indicator */}
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={confirmPasswordInputRef}
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    placeholder="Konfirmasi Password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-3xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.password && formData.password_confirmation && (
                  <div className="flex items-center gap-1 ml-2">
                    {formData.password === formData.password_confirmation ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Password cocok</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Password tidak cocok</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-gray-600 cursor-pointer"
                >
                  Saya setuju dengan{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    syarat
                  </Link>{" "}
                  dan{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    ketentuan
                  </Link>{" "}
                  yang berlaku
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-3xl bg-[#4A90E2] text-white hover:bg-[#1364C4] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Mendaftar...</span>
                  </div>
                ) : (
                  "Daftar"
                )}
              </button>
            </form>

            <div className="relative py-2">
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
              {"Sudah Punya Akun? "}
              <Link
                href="/login"
                className="text-[#4A90E2] hover:text-[#1364C4] font-medium hover:underline transition-colors"
              >
                Masuk
              </Link>
              {" Sekarang"}
            </div>
          </div>
        </div>
      </div>

      {/* Image Section - Keeping the original */}
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
