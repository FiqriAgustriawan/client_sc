  "use client"

  import Link from "next/link"
  import { useState, useEffect } from "react"
  import Image from "next/image"
  import SearchNav from "@/assets/svgs/SearchNav.svg"
  import ProfileUser from "@/assets/svgs/ProfileUser.svg"
  import Icon from "@/assets/svgs/LogoProduct.svg"
  import HomeB from "@/assets/svgs/HomeB.svg"
  import GunungB from "@/assets/svgs/GunungB.svg"
  import BlogB from "@/assets/svgs/BlogB.svg"
  import AkunB from "@/assets/svgs/AkunB.svg"

  export default function NavBar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchVisible, setIsSearchVisible] = useState(false)

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10)
      }

      window.addEventListener("scroll", handleScroll, { passive: true })
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleSearch = () => {
      setIsSearchVisible(!isSearchVisible)
    }

    return (
      <>
        <div
          className={`fixed left-1/2 transform -translate-x-1/2 z-10 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-[88rem] transition-all duration-300 ${
            isScrolled ? "top-[0.75rem]" : "top-[1.5rem]"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            {/* Search input for mobile and tablet */}
            <div className="flex items-center z-10 xl:hidden w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] ml-20 sm:ml-6">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full bg-transparent rounded-full py-2 pl-8 pr-4 text-sm focus:outline-none shadow-md"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image
                    src={SearchNav || "/placeholder.svg"}
                    alt="Search Icon"
                    width={16}
                    height={16}
                    className="text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Logo for desktop */}
            <Link href="/" className="items-center z-10 ml-4 sm:ml-[1.75rem] hidden xl:flex">
              <Image src={Icon || "/placeholder.svg"} alt="Logo" width={28} height={28} />
            </Link>

            {/* Hamburger menu for mobile and tablet */}
            <div className="xl:hidden z-10 mr-4 sm:mr-6">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-white p-1.5 rounded-full text-gray-800 focus:outline-none items-end shadow-md"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>

            {/* Dropdown menu for mobile and tablet */}
            <div
              className={`${
                isMenuOpen ? "block animate-slideUp" : "hidden"
              } absolute top-full left-0 bg-white shadow-md rounded-t-lg w-full p-4 xl:hidden`}
            >
              <Link href="/" className="block py-2 text-gray-800 hover:text-gray-600">
                Home
              </Link>
              <Link href="/mountain" className="block py-2 text-gray-800 hover:text-gray-600">
                Gunung
              </Link>
              <Link href="/blog" className="block py-2 text-gray-800 hover:text-gray-600">
                Blog
              </Link>
              <Link href="/contact" className="block py-2 text-gray-800 hover:text-gray-600">
                Contact
              </Link>
              <Link href="/dashboard" className="block py-2 text-gray-800 hover:text-gray-600">
                Dashboard
              </Link>
            </div>

            {/* Navbar for desktop */}
            <nav className="hidden xl:flex absolute inset-x-0 items-center">
              <div className="bg-[#ffffff] bg-opacity-90 shadow-md rounded-full w-full px-4 sm:px-[2rem] md:px-[3rem] lg:px-[5rem] xl:px-[6rem] py-2.5">
                <div className="container mx-auto py-[0.5rem]">
                  <div className="flex items-center justify-between">
                    {isSearchVisible ? (
                      <div className="flex items-center w-full">
                        <input
                          type="search"
                          placeholder="Search"
                          className="w-full rounded-full px-4 text-sm focus:outline-none bg-transparent"
                          autoFocus
                        />
                        <button onClick={toggleSearch} className="focus:outline-none ml-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Link for desktop */}
                        <div className="flex justify-between w-full ml-4 sm:ml-[3rem] md:ml-[4.5rem] lg:ml-[5.5rem] xl:ml-[6.5rem]">
                          <div className="flex space-x-4 sm:space-x-6 md:space-x-8">
                            <Link href="/" className="text-gray-800 hover:text-gray-600 font-normal">
                              Home
                            </Link>
                            <Link href="/mountain" className="text-gray-800 hover:text-gray-600 font-normal">
                              Gunung
                            </Link>
                            <Link href="/blog" className="text-gray-800 hover:text-gray-600 font-normal">
                              Blog
                            </Link>
                            <Link href="/contact" className="text-gray-800 hover:text-gray-600 font-normal">
                              Contact
                            </Link>
                          </div>

                          {/* Search icon for desktop */}
                          <div className="relative">
                            <button
                              onClick={toggleSearch}
                              className="focus:outline-none mr-4 sm:mr-[3rem] md:mr-[5rem] lg:mr-[6rem] xl:mr-[7rem] mt-1"
                            >
                              <Image
                                src={SearchNav || "/placeholder.svg"}
                                alt="Search Icon"
                                width={16}
                                height={16}
                                className="transition-all duration-300 ease-out"
                              />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            {/* Profile user for desktop */}
            <div className="hidden xl:flex items-center z-10 mr-4 sm:mr-[1.75rem]">
              <div className="w-[2.5rem] h-[2.5rem] rounded-full overflow-hidden border-[0.125rem] border-gray-300">
                <Image
                  src={ProfileUser || "/placeholder.svg"}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover bg-yellow-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar for mobile and tablet */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg xl:hidden z-50 h-16">
          <div className="flex justify-between items-center px-4 py-2 ml-6 mr-6 mt-2">
            <Link href="/" className="flex flex-col items-center">
              <Image src={HomeB || "/placeholder.svg"} alt="Home" width={20} height={20} />
            </Link>
            <Link href="/mountain" className="flex flex-col items-center">
              <Image src={GunungB || "/placeholder.svg"} alt="Gunung" width={20} height={20} />
            </Link>
            <Link href="/blog" className="flex flex-col items-center">
              <Image src={BlogB || "/placeholder.svg"} alt="Blog" width={20} height={20} />
            </Link>
            <Link href="/akun" className="flex flex-col items-center">
              <Image src={AkunB || "/placeholder.svg"} alt="Akun" width={20} height={20} />
            </Link>
          </div>
        </div>
      </>
    )
  }

