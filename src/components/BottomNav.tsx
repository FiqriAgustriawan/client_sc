"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function BottomNav() {
  const [activeItem, setActiveItem] = useState("home");
  const { user } = useAuth();
  
  // Determine user role for dashboard link
  const userRole = user?.role || 'guest';
  
  // Get dashboard link based on user role
  const getDashboardLink = () => {
    switch (userRole) {
      case 'guide':
        return '/index-jasa';
      case 'admin':
        return '/admin';
      default:
        return '/dashboard-user';
    }
  };

  // Check current path to set active navigation item
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/') setActiveItem('home');
      else if (path.includes('gunung')) setActiveItem('gunung');
      else if (path.includes('trips')) setActiveItem('trip');
      else if (path.includes('dashboard') || path.includes('index-jasa') || path.includes('admin')) setActiveItem('dashboard');
      else if (path.includes('profile')) setActiveItem('profile');
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 xl:hidden pb-safe">
      <div className="flex justify-around items-center h-16">
        <NavItem 
          href="/" 
          icon="home" 
          label="Home" 
          isActive={activeItem === "home"} 
        />
        <NavItem 
          href="/gunung" 
          icon="mountain" 
          label="Gunung" 
          isActive={activeItem === "gunung"} 
        />
        <NavItem 
          href="/trips" 
          icon="compass" 
          label="Trip" 
          isActive={activeItem === "trip"} 
        />
        {user && (
          <NavItem 
            href={getDashboardLink()} 
            icon="dashboard" 
            label="Dashboard" 
            isActive={activeItem === "dashboard"} 
          />
        )}
        <NavItem 
          href={user ? "/profile" : "/login"} 
          icon="profile" 
          label={user ? "Profile" : "Login"} 
          isActive={activeItem === "profile"} 
        />
      </div>
    </div>
  );
}

// NavItem component for bottom navigation
interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="relative w-full">
      <motion.div 
        className="flex flex-col items-center justify-center py-1"
        whileTap={{ scale: 0.9 }}
      >
        <div className={`relative ${isActive ? "text-blue-600" : "text-gray-500"}`}>
          {/* Icon container with animation */}
          <div className="flex justify-center">
            {isActive && (
              <motion.div
                className="absolute -top-3 w-10 h-10 bg-blue-50 rounded-full"
                layoutId="bottomNavIndicator"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <div className="relative z-10">
              {renderIcon(icon, isActive)}
            </div>
          </div>
          
          {/* Label with transition */}
          <motion.span 
            className={`text-xs mt-1 block text-center ${isActive ? "font-semibold" : "font-normal"}`}
            animate={{ y: isActive ? -2 : 0 }}
          >
            {label}
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
}

// Helper function to render the appropriate icon
function renderIcon(iconName: any, isActive: any) {
  const activeColor = "#2563EB"; // Blue-600
  const inactiveColor = "#6B7280"; // Gray-500
  const iconColor = isActive ? activeColor : inactiveColor;
  
  switch (iconName) {
    case "home":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      );
    case "mountain":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3L4 15h5l-1 4h2l6-10h-4l2-6H8z"></path>
          <path d="M18 8l-2 7h4l-3 5"></path>
        </svg>
      );
    case "compass":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"></path>
        </svg>
      );
    case "dashboard":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      );
    case "profile":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      );
    default:
      return null;
  }
}