'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function DaftarGuideForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    phone_number: '',
    ktp_image: null as File | null,
  });
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        ktp_image: e.target.files![0]
      }));
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== passwordConfirm) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }
    
    if (!agreeTerms) {
      setError('Anda harus menyetujui syarat dan ketentuan');
      return;
    }
    
    if (!formData.ktp_image) {
      setError('Foto KTP wajib diunggah');
      return;
    }
    
    setLoading(true);
    
    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('password_confirmation', passwordConfirm);
    data.append('phone_number', formData.phone_number);
    data.append('ktp_image', formData.ktp_image);
    
    try {
      const response = await api.post('/api/guide/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Redirect to success page
      router.push('/daftar-guide/success');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center mb-6">
        <Link href="/daftar-guide" className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft size={20} className="mr-2" />
          <span>Kembali</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-[#1F4068] mb-6">Daftar Penyedia Jasa</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Tim</label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nama tim"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan email"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan password"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Konfirmasi password"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telpon</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nomor telepon"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto KTP</label>
          <div className="flex items-center">
            <label className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-l-full cursor-pointer hover:bg-gray-300">
              <span>Pilih File</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </label>
            <div className="flex-1 px-4 py-2 border border-l-0 border-gray-300 rounded-r-full truncate">
              {fileName || "Tidak ada file dipilih"}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            Saya setuju dengan <a href="#" className="text-blue-600 hover:underline">syarat dan ketentuan</a>
          </label>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4A90E2] hover:bg-[#1364C4] text-white font-medium py-2 px-4 rounded-full transition-colors duration-300 disabled:bg-blue-300"
          >
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </div>
      </form>
    </div>
  );
}