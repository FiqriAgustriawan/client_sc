import Link from "next/link"

interface SlideUpMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SlideUpMenu({ isOpen, onClose }: SlideUpMenuProps) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 bg-white shadow-lg xl:hidden z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "h-1/2" : "h-0"
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full p-4 justify-center space-y-4">
        <Link href="/" className="text-gray-800 hover:text-gray-600 text-lg" onClick={onClose}>
          Home
        </Link>
        <Link href="/mountain" className="text-gray-800 hover:text-gray-600 text-lg" onClick={onClose}>
          Gunung
        </Link>
        <Link href="/blog" className="text-gray-800 hover:text-gray-600 text-lg" onClick={onClose}>
          Blog
        </Link>
        <Link href="/contact" className="text-gray-800 hover:text-gray-600 text-lg" onClick={onClose}>
          Contact
        </Link>
        <Link href="/dashboard" className="text-gray-800 hover:text-gray-600 text-lg" onClick={onClose}>
          Dashboard
        </Link>
      </div>
    </div>
  )
}

