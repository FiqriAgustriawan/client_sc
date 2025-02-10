"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleMobileMenu}
                className="fixed top-5 left-4 z-50 p-2 bg-white rounded-full shadow-md lg:hidden"
            >
                {isMobileMenuOpen ? (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Sidebar Container */}
            <div
                className={`fixed -mt-8 z-40 left-9 w-full lg:w-[35%] lg:max-w-[400px] h-full transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen
                    ? "translate-x-0 pr-16"
                    : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                <div className="h-full overflow-y-auto py-6 px-4 lg:py-8 lg:px-6">
                    {/* Content is always visible on desktop, only shown when menu is open on mobile/tablet */}
                    <div className={`${isMobileMenuOpen ? "block" : "hidden lg:block"}`}>
                        <div className="bg-white rounded-[24px] p-4 shadow-md mb-4 ">
                            {/* User Info Section */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-12 h-12 bg-[#809CFF] rounded-full flex items-center justify-center text-white text-xl">
                                    SB
                                </div>
                                <div>
                                    <h2 className="text-[#2D3648] font-medium">
                                        Summit Bin Ahmad
                                    </h2>
                                    <p className="text-[#6B7280] text-sm">Belum Lengkap</p>
                                </div>
                            </div>

                            <div className="h-px bg-gray-200 my-3"></div>

                            {/* Navigation Section */}
                            <nav className="space-y-1 mb-4">
                                <Link
                                    href="admin"
                                    className="flex items-center gap-3 p-2  text-[#2D3648] hover:bg-gray-50 rounded-xl"
                                >
                                    <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 10.6667H28M19.3333 10.6667V26.5556M26.5556 28H3.44444C3.06135 28 2.69395 27.8478 2.42307 27.5769C2.15218 27.306 2 26.9386 2 26.5556V3.44444C2 3.06135 2.15218 2.69395 2.42307 2.42307C2.69395 2.15218 3.06135 2 3.44444 2H26.5556C26.9386 2 27.306 2.15218 27.5769 2.42307C27.8478 2.69395 28 3.06135 28 3.44444V26.5556C28 26.9386 27.8478 27.306 27.5769 27.5769C27.306 27.8478 26.9386 28 26.5556 28Z" stroke="black" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Dashboard
                                </Link>
                                <Link
                                    href="penyedia-trip"
                                    className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
                                >
                                    <svg width="20" height="20" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.88421 27.4C2.09105 27.4 1.4123 27.1178 0.847958 26.5535C0.283614 25.9891 0.000961403 25.3099 0 24.5158V8.65263C0 7.85947 0.282653 7.18072 0.847958 6.61638C1.41326 6.05203 2.09201 5.76938 2.88421 5.76842H8.65263V2.88421C8.65263 2.09105 8.93528 1.4123 9.50059 0.847958C10.0659 0.283614 10.7446 0.000961403 11.5368 0H17.3053C18.0984 0 18.7777 0.282653 19.343 0.847958C19.9083 1.41326 20.1904 2.09201 20.1895 2.88421V5.76842H25.9579C26.751 5.76842 27.4303 6.05107 27.9956 6.61638C28.5609 7.18168 28.8431 7.86043 28.8421 8.65263V24.5158C28.8421 25.3089 28.5599 25.9882 27.9956 26.5535C27.4312 27.1188 26.752 27.401 25.9579 27.4H2.88421ZM11.5368 5.76842H17.3053V2.88421H11.5368V5.76842ZM5.76842 8.65263H2.88421V24.5158H5.76842V8.65263ZM20.1895 24.5158V8.65263H8.65263V24.5158H20.1895ZM23.0737 8.65263V24.5158H25.9579V8.65263H23.0737Z" fill="black" />
                                    </svg>


                                    Penyedia Trip
                                </Link>
                                <Link
                                    href="kelola-gunung"
                                    className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
                                >
                                    <svg width="20" height="20" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.1354 14.0734L15.4718 4.46314C15.3462 4.25008 15.1672 4.07348 14.9525 3.95078C14.7378 3.82809 14.4948 3.76356 14.2474 3.76356C14.0001 3.76356 13.7571 3.82809 13.5424 3.95078C13.3276 4.07348 13.1486 4.25008 13.0231 4.46314L10.1408 9.35638C10.4279 12.169 11.481 13.3116 13.5333 13.3116C16.3828 13.3116 18.9566 13.5618 21.1368 14.0734H21.1354ZM23.3453 17.8211C21.1467 16.7311 17.6932 16.154 13.5319 16.154C10.9467 16.154 9.11189 14.9716 8.11277 12.7943L3.03904 21.404C2.9117 21.6199 2.84373 21.8657 2.84203 22.1163C2.84033 22.367 2.90495 22.6137 3.02935 22.8313C3.15375 23.0489 3.33349 23.2298 3.55035 23.3555C3.7672 23.4812 4.01346 23.5474 4.26412 23.5472H24.2322C24.4827 23.5471 24.7288 23.4808 24.9455 23.355C25.1621 23.2291 25.3417 23.0482 25.4659 22.8307C25.5901 22.6131 25.6546 22.3665 25.6529 22.116C25.6511 21.8654 25.5831 21.6198 25.4558 21.404L23.3453 17.8226V17.8211ZM17.9206 3.01918L27.9046 19.9601C28.2865 20.6076 28.4904 21.3446 28.4956 22.0963C28.5008 22.8481 28.3072 23.5879 27.9344 24.2406C27.5615 24.8934 27.0227 25.436 26.3725 25.8134C25.7223 26.1908 24.9839 26.3896 24.2322 26.3896H4.26412C3.51245 26.3897 2.77411 26.1911 2.12395 25.8139C1.47378 25.4366 0.934897 24.8942 0.561915 24.2416C0.188933 23.589 -0.00488868 22.8494 9.36884e-05 22.0977C0.00507605 21.3461 0.208686 20.6091 0.590286 19.9615L10.5743 3.02061C10.9509 2.3811 11.488 1.85099 12.1323 1.48269C12.7767 1.11438 13.506 0.920654 14.2482 0.920654C14.9903 0.920654 15.7196 1.11438 16.364 1.48269C17.0083 1.85099 17.5454 2.3811 17.922 3.02061L17.9206 3.01918Z" fill="black" />
                                    </svg>


                                    Kelola Gunung
                                </Link>
                                <Link
                                    href="kelolah-berita"
                                    className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
                                >
                                    <svg width="20" height="20" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24.4 18.2V9.80002C24.4 5.84082 24.4 3.85982 23.1694 2.63062C21.9402 1.40002 19.9592 1.40002 16 1.40002H10.4C6.4408 1.40002 4.4598 1.40002 3.2306 2.63062C2 3.85982 2 5.84082 2 9.80002V18.2C2 22.1592 2 24.1402 3.2306 25.3694C4.4598 26.6 6.4408 26.6 10.4 26.6H27.2M7.6 8.40002H18.8M7.6 14H18.8M7.6 19.6H13.2" stroke="black" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M24.4004 8.40002H25.8004C27.78 8.40002 28.7698 8.40002 29.3844 9.01602C30.0004 9.63062 30.0004 10.6204 30.0004 12.6V23.8C30.0004 24.5426 29.7054 25.2548 29.1803 25.7799C28.6552 26.305 27.943 26.6 27.2004 26.6C26.4578 26.6 25.7456 26.305 25.2205 25.7799C24.6954 25.2548 24.4004 24.5426 24.4004 23.8V8.40002Z" stroke="black" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>


                                    Kelola Berita
                                </Link>
                                <Link
                                    href="index-trip-req"
                                    className="flex items-center gap-3 p-2 text-[#2D3648] hover:bg-gray-50 rounded-xl"
                                >
                                    <svg width="20" height="20" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.5 29.4014C11.1167 29.4014 8.12268 28.3745 5.51806 26.3209C2.91343 24.2673 1.22176 21.6422 0.443056 18.4458C0.335648 18.043 0.416204 17.6741 0.684722 17.339C0.953241 17.0039 1.31574 16.8089 1.77222 16.7541C2.20185 16.7004 2.5912 16.781 2.94028 16.9958C3.28935 17.2106 3.53102 17.5328 3.66528 17.9625C4.30972 20.3791 5.63889 22.3528 7.65278 23.8833C9.66667 25.4139 11.9491 26.1791 14.5 26.1791C17.6417 26.1791 20.307 25.0852 22.4959 22.8973C24.6849 20.7094 25.7788 18.0441 25.7778 14.9014C25.7767 11.7586 24.6828 9.09385 22.4959 6.90703C20.3091 4.72022 17.6438 3.62574 14.5 3.62359C12.6472 3.62359 10.9153 4.05322 9.30416 4.91248C7.69305 5.77174 6.33704 6.95322 5.23611 8.45692H8.05555C8.51204 8.45692 8.89494 8.61159 9.20428 8.92092C9.51361 9.23025 9.66774 9.61262 9.66667 10.068C9.66559 10.5234 9.51092 10.9063 9.20267 11.2168C8.89441 11.5272 8.51204 11.6813 8.05555 11.6791H1.61111C1.15463 11.6791 0.772259 11.5245 0.464 11.2151C0.155741 10.9058 0.00107407 10.5234 0 10.068V3.62359C0 3.16711 0.154667 2.78474 0.464 2.47648C0.773333 2.16822 1.1557 2.01355 1.61111 2.01248C2.06652 2.0114 2.44943 2.16607 2.75983 2.47648C3.07024 2.78689 3.22437 3.16926 3.22222 3.62359V5.79859C4.59167 4.08007 6.26346 2.7509 8.23761 1.81109C10.2118 0.871274 12.2992 0.401367 14.5 0.401367C16.5139 0.401367 18.4005 0.784275 20.1598 1.55009C21.9192 2.3159 23.4497 3.34916 24.7515 4.64987C26.0533 5.95057 27.0871 7.48112 27.8529 9.24153C28.6187 11.0019 29.0011 12.8885 29 14.9014C28.9989 16.9142 28.6166 18.8008 27.8529 20.5612C27.0892 22.3216 26.0554 23.8522 24.7515 25.1529C23.4476 26.4536 21.917 27.4874 20.1598 28.2542C18.4026 29.0211 16.516 29.4035 14.5 29.4014ZM16.1111 14.2569L20.1389 18.2847C20.4343 18.5801 20.5819 18.956 20.5819 19.4125C20.5819 19.869 20.4343 20.2449 20.1389 20.5402C19.8435 20.8356 19.4676 20.9833 19.0111 20.9833C18.5546 20.9833 18.1787 20.8356 17.8833 20.5402L13.3722 16.0291C13.2111 15.868 13.0903 15.687 13.0097 15.4862C12.9292 15.2853 12.8889 15.077 12.8889 14.8611V8.45692C12.8889 8.00044 13.0436 7.61807 13.3529 7.30981C13.6622 7.00155 14.0446 6.84688 14.5 6.84581C14.9554 6.84474 15.3383 6.9994 15.6487 7.30981C15.9591 7.62022 16.1133 8.00259 16.1111 8.45692V14.2569Z" fill="black" />
                                    </svg>



                                    Trip
                                </Link>
                            </nav>

                            <div className="h-px bg-gray-200 my-3"></div>

                            {/* Logout Section */}
                            <nav className="space-y-2">
                                
                                <button className="flex w-full items-center gap-3 p-2 text-red-500 hover:bg-gray-50 rounded-xl">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 27 33"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M18.4286 2H5.28571C4.41429 2 3.57855 2.33948 2.96236 2.94377C2.34617 3.54805 2 4.36764 2 5.22222V27.7778C2 28.6324 2.34617 29.4519 2.96236 30.0562C3.57855 30.6605 4.41429 31 5.28571 31H18.4286M25 16.5L18.4286 10.0556M25 16.5L18.4286 22.9444M25 16.5H8.57143"
                                            stroke="#FF0000"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Keluar
                                </button>
                            </nav>

                            {/* CTA Button */}
                        </div>
                        <button className="w-full mt-1 bg-[#4A90E2] text-white rounded-[24px] py-2 hover:bg-blue-600 transition-colors">
                            Jadi Penyedia Jasa
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile and tablet */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden "
                    onClick={toggleMobileMenu}
                />
            )}
        </>
    );
}
