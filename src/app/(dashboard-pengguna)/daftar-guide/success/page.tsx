'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function DaftarGuideSuccess() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle size={80} className="text-green-500" />
      </div>
      
      <h1 className="text-2xl font-bold text-[#1F4068] mb-4">Pendaftaran Berhasil!</h1>
      
      <p className="text-gray-700 mb-6">
        Terima kasih telah mendaftar sebagai Penyedia Jasa Guide di SummitCess. 
        Kami akan memverifikasi data Anda dalam 1-3 hari kerja.
      </p>
      
      <div className="bg-blue-50 p-6 rounded-lg mb-8 text-left">
        <h2 className="text-xl font-semibold text-[#1F4068] mb-3">Langkah Selanjutnya</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Tim kami akan memeriksa data yang Anda kirimkan</li>
          <li>Anda akan menerima notifikasi melalui email saat pendaftaran disetujui</li>
          <li>Setelah disetujui, Anda dapat login dan mulai menerima permintaan pendakian</li>
        </ol>
      </div>
      
      <Link 
        href="/dashboard-user" 
        className="bg-[#4A90E2] hover:bg-[#1364C4] text-white font-medium py-3 px-8 rounded-full transition-colors duration-300"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}