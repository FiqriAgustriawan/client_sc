'use client'

import { useState, useEffect } from 'react'

export function useScrollDirection() {
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show navbar at the top of the page
      if (currentScrollY < 50) {
        setIsScrollingUp(true)
      }
      // Determine scroll direction
      else {
        setIsScrollingUp(currentScrollY < lastScrollY)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  return isScrollingUp
}

