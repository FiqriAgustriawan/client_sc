'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-[400px] p-8 bg-white rounded-3xl shadow-lg">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to Summitcees
            </h1>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                placeholder="Email or username"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className='rounded-full' />
                <Label htmlFor="remember" className="text-sm">
                  Remember Me
                </Label>
              </div>

              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Forgot Password
              </Link>
            </div>

            <Button 
              className="w-full h-10 px-4 py-2 text-white rounded-md bg-gradient-to-br from-[#0080FF] to-[#00FBFF] hover:from-[#007AFF] hover:to-[#00E6FF] focus:outline-none focus:ring-2 focus:ring-[#0080FF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={isLoading}
            >
              Sign In
            </Button>
          </div>

          <div className="text-center text-sm">
            {"Don't have an account? "}
            <Link 
              href="/sign-up" 
              className="text-blue-500 hover:text-blue-600"
            >
              Sign Up
            </Link>
            {" now"}
          </div>
        </div>
      </div>
    </div>
  )
}

