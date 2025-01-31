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

  const heartFilter = isLiked
    ? "invert(27%) sepia(91%) saturate(2238%) hue-rotate(337deg) brightness(97%) contrast(96%)"
    : "invert(91%) sepia(6%) saturate(154%) hue-rotate(169deg) brightness(88%) contrast(84%)"

  return (
    <button
      onClick={handleClick}
      className={`w-12 h-12 rounded-full bg-white/90 shadow-sm flex items-center justify-center hover:bg-white/100 transition-colors duration-200 ${className}`}
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
