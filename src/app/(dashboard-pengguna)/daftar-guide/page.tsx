'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function DaftarGuideIntro() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center mb-6">
        <Link href="/dashboard-user" className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft size={20} className="mr-2" />
          <span>Kembali</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-[#1F4068] mb-6">Menjadi Penyedia Jasa Guide</h1>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-[#1F4068] mb-3">Apa itu Penyedia Jasa Guide?</h2>
          <p className="text-gray-700">
            Penyedia Jasa Guide adalah partner SummitCess yang memiliki keahlian dan pengalaman dalam mendampingi pendaki 
            gunung. Sebagai guide, Anda akan membantu pendaki menjelajahi gunung dengan aman dan nyaman.
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-[#1F4068] mb-3">Keuntungan Menjadi Guide</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Penghasilan tambahan dari setiap perjalanan</li>
            <li>Fleksibilitas waktu kerja</li>
            <li>Kesempatan bertemu dengan berbagai pendaki dari seluruh Indonesia</li>
            <li>Akses ke pelatihan dan sertifikasi</li>
            <li>Menjadi bagian dari komunitas guide SummitCess</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-[#1F4068] mb-3">Persyaratan</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Memiliki pengalaman mendaki gunung</li>
            <li>Mengetahui jalur pendakian dengan baik</li>
            <li>Memiliki KTP yang masih berlaku</li>
            <li>Memiliki nomor telepon aktif</li>
            <li>Bersedia mengikuti standar keamanan SummitCess</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-[#1F4068] mb-3">Proses Pendaftaran</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Isi formulir pendaftaran dengan lengkap</li>
            <li>Unggah foto KTP</li>
            <li>Tunggu verifikasi dari tim SummitCess (1-3 hari kerja)</li>
            <li>Setelah disetujui, Anda dapat mulai menerima permintaan pendakian</li>
          </ol>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Link 
          href="/daftar-guide/form" 
          className="bg-[#4A90E2] hover:bg-[#1364C4] text-white font-medium py-3 px-8 rounded-full transition-colors duration-300"
        >
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
}