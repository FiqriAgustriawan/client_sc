"use client";

import SidebarJasa from "@/components/Dashboard/penyedia-jasa/Sidebar-jasa";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/services/SidebarContext";
import { motion } from "framer-motion";
import { useContext } from "react";
import { SidebarContext } from "@/services/SidebarContext";

function DashboardContent({ children }) {
  // Mendapatkan status sidebar dari context
  const sidebarContext = useContext(SidebarContext);
  const sidebarOpen = sidebarContext?.sidebarOpen ?? false;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarJasa />
      <motion.main 
        className={`min-h-screen flex-grow transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-[256px]' : 'md:ml-[70px]'}`}
      >
        {children}
      </motion.main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </AuthProvider>
  );
}