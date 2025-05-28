'use client';

import React from 'react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../contexts/NotificationContext';
import Link from 'next/link';

export default function NotificationBell() {
  const { unreadCount } = useNotifications();
  
  return (
    <Link href="/admin/notifications">
      <div className="relative cursor-pointer">
        <FiBell className="text-gray-600 text-xl" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </div>
    </Link>
  );
}