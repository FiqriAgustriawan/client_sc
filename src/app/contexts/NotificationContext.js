'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import api from '../../utils/axios';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pusher, setPusher] = useState(null);

  useEffect(() => {
    // Initialize Pusher
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap1',
    });

    setPusher(pusherInstance);

    // Subscribe to the admin-notifications channel
    const channel = pusherInstance.subscribe('admin-notifications');
    
    // Listen for guide.registered event
    channel.bind('guide.registered', (data) => {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Fetch initial notifications
    fetchNotifications();

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusherInstance.disconnect();
    };
  }, []);

  // Find the fetchNotifications function and update it to handle the response data correctly
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (response.data && response.data.success) {
        // Make sure we're accessing the correct data structure
        const notificationsData = response.data.data || [];
        setNotifications(notificationsData);
        
        // Count unread notifications
        const unread = notificationsData.filter(n => !n.is_read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.patch(`/api/admin/notifications/${id}/read`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await api.post('/api/admin/notifications/mark-all-read', null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};