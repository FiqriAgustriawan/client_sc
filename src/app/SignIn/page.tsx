'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import Line from '@/assets/svgs/LineLogin.svg'
import Google from '@/assets/svgs/Google.svg'
import bg from '@/assets/images/Bg-login.png'
  
export default function LoginPage() {
  return (
      <div className="w-full max-w-[400px] xl:p-8 rounded-3xl z-10 relative xl:pt-[118px] xl:mx-5">
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="xl:text-2xl text-start font-bold tracking-wide text-[#1F4068]">
              Selamat Datang
            </h1>
            <p className='text-start text-[#1F4068] leading-3 text-sm'>Masukkan Email Dan Password Anda</p>
          </div>


          <div className="space-y-4">
            <div className="space-y-2 xl:w-80">
              <Input
                id="email"
                placeholder="Email or username"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                className='rounded-3xl bg-white'
                />
            </div>
            <div className="space-y-2 xl:w-80">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                className='rounded-3xl bg-white'
                />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className='rounded-full' />
                <Label htmlFor="remember" className="text-xs">
                  Ingat Saya
                </Label>
              </div>

              <Link 
                href="/forgot-password" 
                className="text-xs text-[#A5A5A5] xl:mx-5"
              >
                Lupa Password?
              </Link>
            </div>

            <Button 
              className="relative xl:w-80 rounded-3xl bg-[#4A90E2] isolation-auto z-10 before:absolute before:w-full before:transition-all before:duration-300 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#1364C4] before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-300 inline-flex items-center justify-center text-sm font-normal text-white shadow-sm gap-x-2 disabled:opacity-50 disabled:pointer-events-none"
              >
              Sign In
            </Button>

            <Image src={Line} alt='batas' className='xl:w-16 xl:mx-32'/>

            <Button 
              className="relative xl:w-80 rounded-3xl text-black bg-white hover:bg-white "
              >
              <Image src={Google} alt='logo' className='xl:w-5'/>
              Sign In With Google
            </Button>
          </div>

          <div className="text-center text-xs xl:pt-[45px]">
            {"Belum Punya Akun? "}
            <Link 
              href="/SignUp" 
              className="text-blue-500 hover:text-blue-600"
              >
              Daftar
            </Link>
            {" Sekarang"}
          </div>
        </div> 
        <div className='bg-blue-800 xl:w-[850px] xl:h-[570px] xl:mx-[350px] xl:-mt-[545px] rounded-3xl'>

        </div>
      </div>
  )
}