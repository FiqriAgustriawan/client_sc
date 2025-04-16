"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { bookingService } from '@/services/bookingService';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';

export default function PaymentStatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        setLoading(true);

        // Get parameters from URL
        const orderId = searchParams.get('order_id');
        const transactionStatus = searchParams.get('transaction_status');

        console.log('URL Parameters:', { orderId, transactionStatus });

        // Get stored booking ID from localStorage
        const bookingId = localStorage.getItem('currentBookingId');
        console.log('Stored booking ID:', bookingId);

        if (!bookingId && !orderId) {
          setError('No booking information found. Please return to dashboard.');
          setLoading(false);
          return;
        }

        // Complete the payment process
        const result = await bookingService.completePaymentProcess(bookingId, orderId);

        if (result.success) {
          setStatus(result.data);

          // If payment is successful, redirect to dashboard after a delay
          if (result.data.payment_status === 'paid' ||
            result.data.booking_status === 'confirmed' ||
            result.data.status === 'settlement' ||
            result.data.status === 'capture') {
            toast.success('Payment successful! Redirecting to dashboard...');
            setTimeout(() => {
              router.push('/dashboard');
            }, 3000);
          }
        } else {
          setError(result.message || 'Failed to verify payment');
          toast.error(result.message || 'Failed to verify payment');
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        setError('An error occurred while checking payment status');
        toast.error('An error occurred while checking payment status');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Status</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
            <p className="text-gray-600">Checking payment status...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <FaTimesCircle className="text-red-500 text-4xl mb-4" />
            <p className="text-red-500 text-center mb-4">{error}</p>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Return to Dashboard
            </Link>
          </div>
        ) : status ? (
          <div className="flex flex-col items-center justify-center py-4">
            {status.payment_status === 'paid' || status.booking_status === 'confirmed' || status.status === 'settlement' || status.status === 'capture' ? (
              <>
                <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                <h2 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Your booking has been confirmed.</p>
              </>
            ) : (
              <>
                <FaSpinner className="text-yellow-500 text-5xl mb-4" />
                <h2 className="text-xl font-semibold text-yellow-600 mb-2">Payment Pending</h2>
                <p className="text-gray-600 mb-6">Your payment is being processed.</p>
              </>
            )}

            <div className="w-full bg-gray-100 p-4 rounded mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">{status.payment_status || status.status}</span>
              </div>
              {status.booking_status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Status:</span>
                  <span className="font-medium">{status.booking_status}</span>
                </div>
              )}
            </div>

            <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <FaTimesCircle className="text-red-500 text-4xl mb-4" />
            <p className="text-gray-600 text-center mb-4">No payment information found.</p>
            <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Return to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}