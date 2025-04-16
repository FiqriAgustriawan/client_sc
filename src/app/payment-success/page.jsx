"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

export default function PaymentSuccess() {
  const router = useRouter()
  const { user, isAuthenticated, login } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Parse transaction status from URL if available
    const urlParams = new URLSearchParams(window.location.search)
    const transactionStatus = urlParams.get('transaction_status') || 'settlement'
    const orderId = urlParams.get('order_id') || ''
    
    // Ensure authentication is preserved
    const token = localStorage.getItem('token')
    
    const handleSuccessfulPayment = async () => {
      setIsRedirecting(true)
      
      // Show success message
      toast.success('Payment successful!')
      
      // If we have a token but user is not authenticated, try to restore session
      if (token && !isAuthenticated) {
        try {
          // You might need to implement this method in your AuthContext
          await login(token)
        } catch (error) {
          console.error('Failed to restore session:', error)
        }
      }
      
      // Use a timeout to ensure the toast is visible
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    }
    
    // Check if transaction was successful
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      handleSuccessfulPayment()
    }
  }, [user, isAuthenticated, login, router])

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
          disabled={isRedirecting}
          className={`w-full py-3 rounded-xl font-medium transition-colors ${
            isRedirecting 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isRedirecting ? 'Redirecting...' : 'Go to Dashboard'}
        </button>
      </div>
    </div>
  )
}