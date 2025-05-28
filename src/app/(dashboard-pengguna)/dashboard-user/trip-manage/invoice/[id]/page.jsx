"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaChevronLeft,
  FaDownload,
  FaPrint,
  FaHome,
  FaFileInvoiceDollar,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";
import { use } from "react";
import { motion } from "framer-motion";

export default function InvoicePage({ params }) {
  const invoiceId = use(params).id;
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Silakan login terlebih dahulu");
          router.push("/login");
          return;
        }

        const response = await api.get(`/api/payments/${invoiceId}/invoice`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setInvoice(response.data.data);
        } else {
          console.error("Failed to fetch invoice:", response.data.message);
          toast.error(response.data.message || "Gagal memuat invoice");
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        toast.error("Terjadi kesalahan saat memuat invoice");
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId, router]);

  const handleDownload = async () => {
    try {
      setDownloadLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      // Use fetch API to download the file as blob
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/payments/${invoiceId}/download?token=${token}`;
      
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the blob data from the response
      const blob = await response.blob();
      
      // Create a local URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoice.invoice_number || invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Invoice berhasil diunduh");
    } catch (error) {
      console.error("Error handling download:", error);
      toast.error("Gagal mengunduh invoice");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Memuat invoice...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mt-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-500 text-xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Invoice tidak ditemukan
            </h2>
            <p className="text-gray-600 mb-6">
              Invoice yang Anda cari mungkin telah dihapus atau tidak ada.
            </p>
            <Link href="/dashboard-user/trip-manage">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                Kembali ke Dashboard
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-red-600";
    }
  };

  // Status badge with icon
  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700">
            <FaCheck className="mr-1" size={12} />
            <span>Lunas</span>
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
            <FaClock className="mr-1" size={12} />
            <span>Menunggu Pembayaran</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700">
            <FaExclamationTriangle className="mr-1" size={12} />
            <span>Gagal</span>
          </div>
        );
    }
  };

  // Calculate total amount properly by calculating from booking details if needed
  const calculatedTotal =
    invoice.amount ||
    invoice.booking?.number_of_climbers * (invoice.trip?.price || 0) ||
    invoice.subtotal ||
    50000;

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section,
          .print-section * {
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

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-6 no-print">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-sm">
                <Link
                  href="/dashboard-user"
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <FaHome className="mr-1" />
                  <span>Dashboard</span>
                </Link>
                <span className="text-gray-400">/</span>
                <Link
                  href="/dashboard-user/trip-manage"
                  className="text-blue-500 hover:text-blue-700"
                >
                  Trip Saya
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Invoice</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <div className="flex items-center">
                <FaFileInvoiceDollar className="text-blue-500 mr-3 text-xl" />
                <div>
                  <h2 className="font-medium text-gray-800">
                    Detail Invoice Pembayaran Trip
                  </h2>
                  <p className="text-sm text-gray-600">
                    Berikut adalah detail pembayaran untuk trip pendakian Anda
                  </p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 p-8 print:shadow-none print-section"
          >
            <div className="flex justify-between items-center mb-8 border-b pb-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">INVOICE</div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {invoice.invoice_number}
                </h1>
                <div className="text-sm text-gray-500 mt-1">
                  {formatDate(invoice.created_at)}
                </div>
              </div>
              <div className="text-right">
                {getStatusBadge(invoice.status)}

                <div className="mt-4 no-print flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrint}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors text-sm"
                  >
                    <FaPrint />
                    <span>Cetak</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    disabled={downloadLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors text-sm disabled:opacity-70"
                  >
                    {downloadLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Mengunduh...</span>
                      </>
                    ) : (
                      <>
                        <FaDownload />
                        <span>Unduh PDF</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">
                  Dari
                </h2>
                <p className="font-medium text-gray-800">summitcs</p>
                <p className="text-gray-700">Jl. A. P. Pettarani No.43</p>
                <p className="text-gray-700">Makassar, Indonesia</p>
                <p className="text-gray-700">summitcs@gmail.com</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">
                  Kepada
                </h2>
                <p className="font-medium text-gray-800">
                  {invoice.user?.name || "Pendaki"}
                </p>
                <p className="text-gray-700">{invoice.user?.email || "-"}</p>
                <p className="text-gray-700">{invoice.user?.phone || "-"}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">
                Detail Pembayaran
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500 text-xs uppercase">
                    Nomor Invoice
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {invoice.invoice_number}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500 text-xs uppercase">Tanggal</p>
                  <p className="font-medium text-gray-800 mt-1">
                    {formatDate(invoice.created_at)}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500 text-xs uppercase">
                    Status Pembayaran
                  </p>
                  <p
                    className={`font-medium ${getStatusColor(
                      invoice.status
                    )} mt-1`}
                  >
                    {invoice.status === "paid"
                      ? "Lunas"
                      : invoice.status === "pending"
                      ? "Menunggu Pembayaran"
                      : "Gagal"}
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500 text-xs uppercase">
                    Metode Pembayaran
                  </p>
                  <p className="font-medium text-gray-800 mt-1">
                    {invoice.payment_method || "Online Payment"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase text-gray-500 mb-3">
                Detail Trip
              </h2>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deskripsi
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jumlah Pendaki
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harga
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 px-4 border-b">
                        <div className="font-medium text-gray-800">
                          {invoice.trip?.title || "Trip Pendakian"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.trip?.mountain?.nama_gunung || "Gunung"}
                        </div>
                      </td>
                      <td className="py-4 px-4 border-b">
                        {invoice.trip?.start_date
                          ? formatDate(invoice.trip.start_date)
                          : "-"}
                      </td>
                      <td className="py-4 px-4 border-b">
                        {invoice.booking?.number_of_climbers || 1} orang
                      </td>
                      <td className="py-4 px-4 border-b text-right">
                        Rp {invoice.trip?.price?.toLocaleString() || "0"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-gray-700">Subtotal</div>
                  <div className="font-medium">
                    Rp {invoice.subtotal?.toLocaleString() || "0"}
                  </div>
                </div>

                {invoice.tax > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-gray-700">Pajak</div>
                    <div className="font-medium">
                      Rp {invoice.tax?.toLocaleString() || "0"}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="text-lg font-bold text-gray-800">Total</div>
                  <div className="text-lg font-bold text-blue-600">
                    Rp {calculatedTotal.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-800 mb-2">
                  Catatan:
                </h3>
                <p className="text-gray-700 text-sm">
                  Terima kasih atas pembayaran Anda. Invoice ini merupakan bukti
                  pembayaran yang sah.
                </p>
              </div>

              <div className="mt-8 text-center">
                {invoice.status === "paid" && (
                  <div className="inline-block relative">
                    <div
                      className={`
                      w-[120px] h-[120px] rounded-full
                      border-8 border-green-600
                      flex items-center justify-center
                      transform rotate-[-12deg]
                      bg-green-50
                    `}
                    >
                      <span className="text-green-600 font-bold text-2xl">
                        LUNAS
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="text-center no-print">
            <Link
              href="/dashboard-user/trip-manage"
              className="inline-flex items-center text-sm text-blue-500 hover:text-blue-700"
            >
              <FaChevronLeft className="mr-1" />
              Kembali ke Trip Saya
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
