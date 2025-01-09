'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ProfileUser from '@/assets/svgs/ProfileUser.svg'
import Icon from '@/assets/svgs/LogoProduct.svg'
export default function NavBar() {
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 50) {
        setIsScrollingUp(true)
      } else {
        setIsScrollingUp(currentScrollY < lastScrollY)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-10 transition-transform duration-300 ${!isScrollingUp ? '-translate-y-full' : ''}`}>
      <div className="bg-white bg-opacity-90 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center gap-2 space-x-2 text-black">
                <Image src={Icon} alt='Logo' width={19} height={19} />
                <span className="text-xl font-semibold">SummitCess</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-black hover:text-gray-600">Home</Link>
                <Link href="/mountain" className="text-black hover:text-gray-600">Mountain</Link>
                <Link href="/blog" className="text-black hover:text-gray-600">Blog</Link>
              </div>
            </div>
            <Link href="/login" className="flex items-center space-x-4 text-black px-4 py-2">
              <span className="text-sm font-medium">Log In</span>
              <div className='w-8 h-8 rounded-full overflow-hidden  border-black'>
                <Image
                  src={ProfileUser}
                  alt="Profile"
                  width={32}
                  height={32}
                  className='w-full h-full object-cover bg-yellow-200'
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

