import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Sidebar from "@/components/Dashboard/Pengguna/SidebarPengguna";

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
      url: '/LogoProduct.svg',
      type: 'image/svg+xml',
    },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${poppins.variable} font-poppins antialiased bg-[#f5f5f5]`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
            {children}
        </div>
      </div>
    </div>
  );
}