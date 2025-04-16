"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiSearch, FiAlertCircle } from 'react-icons/fi';
import Link from "next/link";
import { getMountains, deleteMountain } from "@/services/mountain.service";
import { Toaster, toast } from 'react-hot-toast';

export default function KelolaGunung() {
  const [mountains, setMountains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMountains();
  }, []);

  const fetchMountains = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');

      const response = await getMountains(token);
      setMountains(response.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, mountainName) => {
    toast((t) => (
      <div className="flex items-start gap-3 w-[320px]">
        <div className="flex-shrink-0 mt-1">
          <FiTrash2 className="text-red-500 text-xl" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">Hapus Gunung</h4>
          <p className="text-sm text-gray-600 mt-1">
            Apakah Anda yakin ingin menghapus gunung {mountainName}? Aksi ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const token = localStorage.getItem('token');
                  if (!token) throw new Error('Token tidak ditemukan');

                  await deleteMountain(id, token);
                  toast.success('Gunung berhasil dihapus!', {
                    position: 'top-right',
                    style: {
                      background: '#10B981',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                    },
                    duration: 3000,
                  });
                  fetchMountains();
                } catch (error) {
                  toast.error(error.message || 'Gagal menghapus gunung', {
                    position: 'top-right',
                    style: {
                      background: '#EF4444',
                      color: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                    },
                    duration: 4000,
                  });
                }
              }}
              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
            >
              Hapus
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-right',
      style: {
        background: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'mudah': 'bg-green-100 text-green-800',
      'menengah': 'bg-yellow-100 text-yellow-800',
      'sulit': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <div className="bg-white p-6 w-full max-w-[90%] xl:max-w-[66%] mx-auto xl:mx-[29%] mt-28 shadow-lg rounded-3xl">
        {/* Header with Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Kelola Gunung</h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari gunung..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link
              href="/admin/kelola-gunung/tambah-gunung"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Tambah Gunung
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 flex items-center gap-2">
            <FiAlertCircle />
            {error}
          </div>
        )}

        {/* Mountain List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : mountains.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada data gunung</div>
          ) : (
            mountains
              .filter(mountain =>
                mountain.nama_gunung.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((mountain) => (
                <div
                  key={mountain.id}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <Link href={`/gunung/${mountain.id}`}>
                        <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
                          {mountain.nama_gunung}
                        </h3>
                      </Link>
                      <p className="text-gray-600 mt-1">{mountain.lokasi}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-gray-700">
                          {mountain.ketinggian} MDPL
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(mountain.status_gunung)}`}>
                          {mountain.status_gunung}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/kelola-gunung/edit/${mountain.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 size={20} />
                      </Link>
                      <button
                        onClick={() => handleDelete(mountain.id, mountain.nama_gunung)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
}
