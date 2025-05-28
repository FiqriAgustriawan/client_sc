import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

const SimpleLightbox = ({ images = [], initialIndex = 0, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when images change
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Disable body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const nextImage = () => {
    if (!images || images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (!images || images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen || !images || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-10 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
        onClick={onClose}
      >
        <IoClose size={24} />
      </button>

      {/* Main image */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <IoChevronBack size={24} />
          </button>
          <button
            className="absolute right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <IoChevronForward size={24} />
          </button>
        </>
      )}

      {/* Image counter */}
      <div className="absolute bottom-4 left-0 right-0 text-white text-center">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default SimpleLightbox;
