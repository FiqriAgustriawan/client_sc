"use client";

import { Poppins } from "next/font/google";
import SidebarAdmin from "@/components/Dashboard/Admin/SidebarAdmin";
import { AuthProvider } from "../../context/AuthContext";
import { NotificationProvider } from "@/app/contexts/NotificationContext";
import { SidebarProvider } from "@/services/SidebarContext";
import { useContext } from "react";
import { SidebarContext } from "@/services/SidebarContext";
import { motion } from "framer-motion";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

function AdminDashboardContent({ children }) {
  // Get sidebar status from context
  const sidebarContext = useContext(SidebarContext);
  const sidebarOpen = sidebarContext?.sidebarOpen ?? false;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarAdmin />
      <motion.main
        className={`min-h-screen flex-grow transition-all duration-300 ease-in-out ${
          sidebarOpen ? "md:ml-[256px]" : "md:ml-[70px]"
        }`}
      >
        <div className="p-6">{children}</div>
      </motion.main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <NotificationProvider>
          <div className={`${poppins.variable} font-poppins antialiased`}>
            <AdminDashboardContent>{children}</AdminDashboardContent>
          </div>
        </NotificationProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}
