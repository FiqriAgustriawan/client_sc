"use client";

import React from "react";
import {
  IoCompass,
  IoCalendarClear,
  IoShieldCheckmark,
  IoPeople,
  IoMap,
  IoCamera,
} from "react-icons/io5";

const BenefitCards = () => {
  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-10 font-poppins">
          Kenapa pesan di SummitCs?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 - Open Trip Experience */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full">
                  <IoPeople className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">
                  Open Trip Terjangkau & Berkualitas
                </h3>
                <p className="text-gray-600 text-sm mb-3 font-poppins">
                  Bergabung dengan pendaki lain dalam{" "}
                  <span className="font-semibold">grup kecil 4-12 orang</span>.
                  Hemat biaya dengan{" "}
                  <span className="font-semibold">paket all-in</span> sudah
                  termasuk guide, transportasi, dan peralatan camping.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 - Easy Booking & Flexible */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="w-16 h-16 flex items-center justify-center bg-green-50 rounded-full">
                  <IoCalendarClear className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">
                  Booking Mudah & Refund Policy
                </h3>
                <p className="text-gray-600 text-sm mb-3 font-poppins">
                  Pesan kapan saja dengan{" "}
                  <span className="font-semibold">pembayaran online</span> aman.
                  Ada <span className="font-semibold">kebijakan refund</span>{" "}
                  fleksibel sampai 80% untuk pembatalan H-7.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 - Safety & Professional Guide */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="w-16 h-16 flex items-center justify-center bg-red-50 rounded-full">
                  <IoShieldCheckmark className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">
                  Guide Berpengalaman & Asuransi
                </h3>
                <p className="text-gray-600 text-sm mb-3 font-poppins">
                  Didampingi{" "}
                  <span className="font-semibold">guide bersertifikat</span>{" "}
                  dengan pengalaman bertahun-tahun. Dilengkapi{" "}
                  <span className="font-semibold">asuransi perjalanan</span> dan
                  peralatan safety standar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Benefits Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
          {/* Card 4 - Complete Package */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="w-16 h-16 flex items-center justify-center bg-purple-50 rounded-full">
                  <IoCompass className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">
                  Paket Lengkap & Praktis
                </h3>
                <p className="text-gray-600 text-sm mb-3 font-poppins">
                  Semua sudah termasuk:{" "}
                  <span className="font-semibold">
                    tenda, sleeping bag, makanan
                  </span>
                  , dan peralatan masak. Tinggal bawa perlengkapan pribadi
                  sesuai <span className="font-semibold">packing list</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Card 5 - Various Destinations */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="w-16 h-16 flex items-center justify-center bg-orange-50 rounded-full">
                  <IoMap className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">
                  50+ Destinasi Terbaik
                </h3>
                <p className="text-gray-600 text-sm mb-3 font-poppins">
                  Pilihan trip ke{" "}
                  <span className="font-semibold">gunung-gunung terbaik</span>{" "}
                  Indonesia. Dari level pemula sampai advance dengan{" "}
                  <span className="font-semibold">jadwal trip</span> yang
                  fleksibel.
                </p>
              </div>
            </div>
          </div>

          {/* Card 6 - Documentation */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-5">
                <div className="w-16 h-16 flex items-center justify-center bg-teal-50 rounded-full">
                  <IoCamera className="w-8 h-8 text-teal-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">
                  Dokumentasi & Sertifikat
                </h3>
                <p className="text-gray-600 text-sm mb-3 font-poppins">
                  Dapatkan{" "}
                  <span className="font-semibold">foto dokumentasi</span>{" "}
                  perjalanan dan{" "}
                  <span className="font-semibold">sertifikat pendakian</span>{" "}
                  sebagai kenang-kenangan petualangan Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitCards;
