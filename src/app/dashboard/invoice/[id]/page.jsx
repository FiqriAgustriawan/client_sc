'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaChevronLeft, FaDownload, FaPrint } from 'react-icons/fa';
import api from '@/utils/axios';

export default function InvoicePage({ params }) {
  const invoiceId = params.id;
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
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
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        if (error.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, router]);

  const handleDownload = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/${invoiceId}/download?token=${token}`, '_blank');
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
    switch(status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  // Status text mapping
  const getStatusText = (status) => {
    switch(status) {
      case 'paid': return 'Lunas';
      case 'pending': return 'Menunggu Pembayaran';
      default: return 'Gagal';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 print:hidden">
          <Link href="/dashboard">
            <span className="inline-flex items-center text-blue-500 hover:text-blue-700">
              <FaChevronLeft className="mr-2" />
              Kembali ke Dashboard
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 p-8 print:shadow-none">
          <div className="flex justify-between items-center mb-8 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
              <p className="text-gray-500">{invoice.invoice_number}</p>
            </div>
            <div className="print:hidden flex gap-3">
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

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Dari</h2>
              <p className="text-gray-700">Trip Gunung</p>
              <p className="text-gray-500">Jl. Pendakian No. 123</p>
              <p className="text-gray-500">Jakarta, Indonesia</p>
              <p className="text-gray-500">support@tripgunung.com</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Kepada</h2>
              <p className="text-gray-700">{invoice.user?.name || 'Pendaki'}</p>
              <p className="text-gray-500">{invoice.user?.email || '-'}</p>
              <p className="text-gray-500">{invoice.user?.phone || '-'}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Detail Pembayaran</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-gray-500">Nomor Invoice</p>
                  <p className="font-medium">{invoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tanggal</p>
                  <p className="font-medium">{formatDate(invoice.created_at)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-gray-500">Status Pembayaran</p>
                  <p className={`font-medium ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Metode Pembayaran</p>
                  <p className="font-medium">{invoice.payment_method || 'Online Payment'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Detail Trip</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Pendaki</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.trip?.title || 'Trip Pendakian'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.trip?.mountain?.nama_gunung || 'Gunung'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.trip?.start_date ? formatDate(invoice.trip.start_date) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.booking?.number_of_climbers || 1} orang
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      Rp {Number(invoice.trip?.price || 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-medium">Subtotal</td>
                    <td className="px-6 py-4 text-right font-medium">
                      Rp {Number(invoice.subtotal || 0).toLocaleString()}
                    </td>
                  </tr>
                  {invoice.tax > 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">Pajak</td>
                      <td className="px-6 py-4 text-right font-medium">
                        Rp {Number(invoice.tax || 0).toLocaleString()}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-6 py-4 text-right font-bold">Total</td>
                    <td className="px-6 py-4 text-right font-bold">
                      Rp {Number(invoice.total_amount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Catatan</h2>
            <p className="text-gray-600 text-sm">
              Terima kasih telah memesan trip pendakian bersama kami. Jika Anda memiliki pertanyaan terkait invoice ini, 
              silakan hubungi tim dukungan kami di support@tripgunung.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}