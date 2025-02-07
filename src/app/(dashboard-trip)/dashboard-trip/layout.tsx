import { Metadata } from "next";
// import Sidebar from "@/components/Dashboard/Trip/SidebarTrip";

export const metadata: Metadata = {
  title: "Dashboard Trip - SummitCess",
  description: "Manage your trip on SummitCess",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased bg-[#f5f5f5]">
        <div className="w-full">
          {/* <Sidebar /> */}
        </div>
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  );
}
