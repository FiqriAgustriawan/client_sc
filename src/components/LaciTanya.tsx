"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  IoChevronDown,
  IoShieldCheckmark,
  IoCalendar,
  IoLocation,
  IoCard,
  IoPeople,
  IoTime,
  IoHelp,
  IoLogoWhatsapp,
  IoMail
} from "react-icons/io5";

export function LaciTanya() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const faqData = [
    {
      id: "item-1",
      icon: <IoShieldCheckmark className="w-6 h-6 text-blue-500" />,
      question: "Apakah semua open trip disini aman dan terpercaya?",
      answer: "Ya, semua open trip yang tersedia telah melalui verifikasi ketat. Kami bekerja sama dengan guide berpengalaman dan bersertifikat. Setiap trip dilengkapi dengan asuransi perjalanan, peralatan safety standar, dan protokol keamanan yang ketat. Tim kami juga melakukan monitoring real-time selama perjalanan."
    },
    {
      id: "item-2",
      icon: <IoCalendar className="w-6 h-6 text-green-500" />,
      question: "Bagaimana cara booking dan pembayaran open trip?",
      answer: "Booking sangat mudah! Pilih trip yang diinginkan, isi form pendaftaran, lakukan pembayaran melalui berbagai metode (transfer bank, e-wallet, kartu kredit). Setelah pembayaran dikonfirmasi, Anda akan mendapat voucher dan detail lengkap trip via email dan WhatsApp."
    },
    {
      id: "item-3",
      icon: <IoCard className="w-6 h-6 text-orange-500" />,
      question: "Bagaimana kebijakan pembatalan dan refund?",
      answer: "Pembatalan H-7 mendapat refund 80%, H-3 refund 50%, H-1 refund 25%. Pembatalan karena cuaca buruk atau force majeure mendapat refund 100% atau reschedule gratis. Reschedule bisa dilakukan maksimal 2x tanpa biaya tambahan (minimal H-3)."
    },
    {
      id: "item-4",
      icon: <IoPeople className="w-6 h-6 text-purple-500" />,
      question: "Berapa minimal dan maksimal peserta dalam satu trip?",
      answer: "Minimal peserta 4 orang dan maksimal 12 orang per trip untuk menjaga kualitas pengalaman dan keamanan. Jika kuota minimal tidak terpenuhi H-2, trip akan ditunda atau digabung dengan jadwal lain dengan konfirmasi peserta terlebih dahulu."
    },
    {
      id: "item-5",
      icon: <IoLocation className="w-6 h-6 text-red-500" />,
      question: "Apa saja yang sudah termasuk dalam paket open trip?",
      answer: "Paket sudah termasuk: guide berpengalaman, transportasi PP, makan selama trip, tenda dan sleeping bag, peralatan masak, P3K, dokumentasi foto, sertifikat pendakian, dan asuransi perjalanan. Peserta hanya perlu membawa perlengkapan pribadi sesuai packing list."
    },
    {
      id: "item-6",
      icon: <IoTime className="w-6 h-6 text-teal-500" />,
      question: "Bagaimana jika saya pemula dan belum pernah mendaki?",
      answer: "Kami menyediakan kategori trip khusus pemula dengan tingkat kesulitan rendah-sedang. Sebelum trip, peserta akan mendapat briefing lengkap, tips persiapan fisik, dan panduan perlengkapan. Guide akan memberikan assistance khusus untuk peserta pemula."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 animate-bounce">
            <IoHelp className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 animate-fade-in font-poppins">
            Pertanyaan Yang{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Sering Diajukan
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-poppins">
            Temukan jawaban untuk pertanyaan umum seputar open trip dan layanan kami
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion
            type="single"
            collapsible
            value={openItem || undefined}
            onValueChange={setOpenItem}
            className="space-y-4"
          >
            {faqData.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                  <div className="flex items-center space-x-4 text-left w-full">
                    <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-200">
                      {faq.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors font-poppins">
                      {faq.question}
                    </h3>
                    <IoChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ml-auto flex-shrink-0 ${openItem === faq.id ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="pl-10 animate-fade-in">
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg font-poppins">
                      {faq.answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}