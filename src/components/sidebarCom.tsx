import Link from "next/link"
import Image from "next/image"
import HomeB from "@/assets/svgs/HomeB.svg"
import GunungB from "@/assets/svgs/GunungB.svg"
import BlogB from "@/assets/svgs/BlogB.svg"
import AkunB from "@/assets/svgs/AkunB.svg"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out xl:hidden`}
    >
      <div className="flex flex-col h-full p-4">
        <button onClick={onClose} className="self-end p-2 mb-4">
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <Link href="/" className="flex items-center space-x-2 text-gray-800 hover:text-gray-600">
                <Image src={HomeB || "/placeholder.svg"} alt="Home" width={20} height={20} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/mountain" className="flex items-center space-x-2 text-gray-800 hover:text-gray-600">
                <Image src={GunungB || "/placeholder.svg"} alt="Gunung" width={20} height={20} />
                <span>Gunung</span>
              </Link>
            </li>
            <li>
              <Link href="/blog" className="flex items-center space-x-2 text-gray-800 hover:text-gray-600">
                <Image src={BlogB || "/placeholder.svg"} alt="Blog" width={20} height={20} />
                <span>Blog</span>
              </Link>
            </li>
            <li>
              <Link href="/akun" className="flex items-center space-x-2 text-gray-800 hover:text-gray-600">
                <Image src={AkunB || "/placeholder.svg"} alt="Akun" width={20} height={20} />
                <span>Akun</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

