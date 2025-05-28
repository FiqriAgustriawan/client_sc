'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaChevronLeft, FaDownload, FaPrint } from 'react-icons/fa';
import api from '@/utils/axios';
import { toast } from 'react-hot-toast';
import { use } from 'react';

export default function InvoicePage({ params }) {
  const invoiceId = use(params).id; // Menggunakan React.use() untuk membungkus params
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Silakan login terlebih dahulu');
          router.push('/login');
          return;
        }

        const response = await api.get(`/api/payments/${invoiceId}/invoice`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setInvoice(response.data.data);
        } else {
          console.error('Failed to fetch invoice:', response.data.message);
          toast.error(response.data.message || 'Gagal memuat invoice');
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Terjadi kesalahan saat memuat invoice');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, router]);

  const handleDownload = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Silakan login terlebih dahulu');
        return;
      }

      // Buka invoice di tab baru dengan metode yang lebih langsung
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/payments/${invoiceId}/download?token=${token}`;

      // Gunakan metode fetch untuk mengunduh file
      fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          // Periksa jika respons berhasil
          if (!response.ok) {
            if (response.status === 401) {
              toast.error('Sesi login Anda telah berakhir. Silakan login kembali.');
              localStorage.removeItem('token');
              router.push('/login');
              throw new Error('Unauthorized');
            }
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          // Buat URL objek untuk blob
          const url = window.URL.createObjectURL(blob);
          // Buat elemen anchor untuk mengunduh
          const a = document.createElement('a');
          a.href = url;
          a.download = `Invoice-${invoiceId}.pdf`;
          document.body.appendChild(a);
          a.click();
          // Bersihkan
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        })
        .catch(error => {
          console.error('Error downloading invoice:', error);
          if (error.message !== 'Unauthorized') {
            toast.error('Gagal mengunduh invoice');
          }
        });
    } catch (error) {
      console.error('Error handling download:', error);
      toast.error('Gagal mengunduh invoice');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invoice tidak ditemukan</h2>
          <Link href="/dashboard">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
              Kembali ke Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  // Status text mapping
  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Lunas';
      case 'pending': return 'Menunggu Pembayaran';
      default: return 'Gagal';
    }
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6 no-print">
            <Link href="/dashboard">
              <span className="inline-flex items-center text-blue-500 hover:text-blue-700">
                <FaChevronLeft className="mr-2" />
                Kembali ke Dashboard
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 p-8 print:shadow-none print-section">
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
                <p className="text-gray-500">{invoice.invoice_number}</p>
              </div>
              <div className="no-print flex gap-3">
                <button
                  onClick={handlePrint}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <FaPrint />
                  <span>Cetak</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
                >
                  <FaDownload />
                  <span>Unduh PDF</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-semibold mb-3">Dari</h2>
                <p className="text-gray-700">summitcs</p>
                <p className="text-gray-700">Jl. A. P. Pettarani No.43</p>
                <p className="text-gray-700">Makassar, Indonesia</p>
                <p className="text-gray-700">summitcs@gmail.com</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-3">Kepada</h2>
                <p className="text-gray-700">{invoice.user?.name || 'Pendaki'}</p>
                <p className="text-gray-700">{invoice.user?.email || '-'}</p>
                <p className="text-gray-700">{invoice.user?.phone || '-'}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Detail Pembayaran</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Nomor Invoice</p>
                    <p className="font-medium">{invoice.invoice_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Tanggal</p>
                    <p className="font-medium">{formatDate(invoice.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Status Pembayaran</p>
                    <p className={`font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Metode Pembayaran</p>
                    <p className="font-medium">{invoice.payment_method || 'Online Payment'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Detail Trip</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Pendaki</th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 px-4 border-b">
                        <div className="font-medium">{invoice.trip?.title || 'Trip Pendakian'}</div>
                        <div className="text-sm text-gray-500">{invoice.trip?.mountain?.nama_gunung || 'Gunung'}</div>
                      </td>
                      <td className="py-4 px-4 border-b">
                        {invoice.trip?.start_date ? formatDate(invoice.trip.start_date) : '-'}
                      </td>
                      <td className="py-4 px-4 border-b">
                        {invoice.booking?.number_of_climbers || 1} orang
                      </td>
                      <td className="py-4 px-4 border-b text-right">
                        Rp {invoice.trip?.price?.toLocaleString() || '0'}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="py-4 px-4 text-right font-medium">Subtotal</td>
                      <td className="py-4 px-4 text-right font-medium">Rp {invoice.subtotal?.toLocaleString() || '0'}</td>
                    </tr>
                    {invoice.tax > 0 && (
                      <tr>
                        <td colSpan="3" className="py-4 px-4 text-right font-medium">Pajak</td>
                        <td className="py-4 px-4 text-right font-medium">Rp {invoice.tax?.toLocaleString() || '0'}</td>
                      </tr>
                    )}
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="py-4 px-4 text-right font-bold">Total</td>
                      <td className="py-4 px-4 text-right font-bold">Rp {invoice.total_amount?.toLocaleString() || '0'}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="border-t pt-6 text-gray-500 text-sm">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Catatan</h2>
              <p>
                Terima kasih telah memesan trip pendakian bersama kami. Jika Anda memiliki pertanyaan terkait invoice ini,
                silakan hubungi tim dukungan kami di support@tripgunung.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}