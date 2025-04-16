"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

export default function PaymentHandler() {
  const router = useRouter()

  useEffect(() => {
    // Store successful payment in localStorage
    localStorage.setItem('payment_completed', 'true')
    
    // Get token from localStorage
    const token = localStorage.getItem('token')
    
    // Show success message
    toast.success('Payment successful!')
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      if (token) {
        window.location.href = '/dashboard'
      } else {
        // If no token, redirect to login with dashboard as redirect target
        window.location.href = '/login?redirect=/dashboard'
      }
    }, 1500)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Your trip booking has been confirmed.</p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}