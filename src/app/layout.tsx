import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "../components/NavbarComp";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "SummitCess - Mountain Adventures",
  description: "Explore mountain peaks and find yourself with SummitCess",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins antialiased bg-[#f5f5f5]">
        <div className="w-full">
          <Navbar />
        </div>
        <main className="pt-[16px] pb-[12px]">{children}</main>
      </body>
    </html>
  );
}