'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

export default function SwipeableCard({ 
  children, 
  onSwipeLeft, 
  onSwipeRight,
  className = ""
}: SwipeableCardProps) {
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;
    // Limit drag distance to improve feel
    setDragX(Math.max(Math.min(diffX, 80), -80));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    // Check if swipe was substantial
    if (dragX > 50 && onSwipeRight) {
      onSwipeRight();
    } else if (dragX < -50 && onSwipeLeft) {
      onSwipeLeft();
    }
    
    // Reset position with animation
    setDragX(0);
    setIsDragging(false);
  };

  return (
    <motion.div
      className={`touch-manipulation ${className}`}
      animate={{ x: dragX }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        // Only use springs when returning to position, not during drag
        ...(isDragging ? { type: "tween", duration: 0.1 } : {})
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </motion.div>
  );
}