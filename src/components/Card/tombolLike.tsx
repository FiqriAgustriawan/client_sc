"use client"

import { useState } from "react"
import Image from "next/image"
import Like from "@/assets/svgs/Likes.svg"
interface LikeButtonProps {
  initialLiked?: boolean
  onLike?: (liked: boolean) => void
  className?: string
}

export function LikeButton({ initialLiked = false, onLike, className = "" }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked)

  const handleClick = () => {
    const newLikedState = !isLiked
    setIsLiked(newLikedState)
    onLike?.(newLikedState)
  }

  const heartFilter = isLiked ? "" : "opacity(0)"

  return (
    <button
      onClick={handleClick}
      className={`w-12 h-12 rounded-full bg-[#F5F5F5] shadow-sm flex items-center justify-center hover:bg-[#F5F5F5] transition-colors duration-200  ${className}`}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <Image
        src={Like}
        alt="heart"
        width={24}
        height={24}
        style={{
          filter: heartFilter,
          transition: "filter 0.2s ease-in-out",
        }}
      />
    </button>
  )
}

