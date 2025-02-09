import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// import "./globals.css";
import Sidebar from "@/components/Dashboard/Admin/SidebarAdmin";


const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "SummitCess - Mountain Adventures",
  description: "Explore mountain peaks and find yourself with SummitCess",
  icons: [
    {
      rel: 'icon',
      url: '/LogoProduct.svg', // Menggunakan file dari folder public
      type: 'image/svg+xml',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins bg-[#f5f5f5]">
        <div className="w-full">
        <Sidebar/>
        </div>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}