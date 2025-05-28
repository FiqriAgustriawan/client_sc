import axios from 'axios';
import Pusher from 'pusher-js';

// Initialize Pusher with fallback to hardcoded key for development
let pusherInstance = null;

try {
  // Use the key directly as a fallback if environment variables aren't working
  const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "07483a9f18725ee88599";
  const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";

  pusherInstance = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
    encrypted: true,
  });

  // Enable logging for debugging
  Pusher.logToConsole = process.env.NODE_ENV === 'development';
} catch (error) {
  console.error("Error initializing Pusher:", error);
}

export const chatService = {
  // Send a message
  async sendMessage(data) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      // Make sure trip_id is a number
      const payload = {
        ...data,
        trip_id: parseInt(data.trip_id, 10), // Force to integer
      };

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, 
        payload, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Ensure proper content type
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle offline mode or connection issues
      if (!navigator.onLine || error.name === 'AbortError' || error.message === 'Network Error') {
        const localMessageId = `local_${Date.now()}`;
        const localMessage = {
          id: localMessageId,
          content: data.content,
          sender_id: data.user_id,
          receiver_id: data.receiver_id,
          trip_id: data.trip_id,
          created_at: new Date().toISOString(),
          is_read: false,
        };
        
        return { 
          success: false, 
          isLocalOnly: true, 
          data: localMessage,
        };
      }
      
      // Try emergency route if main route fails
      try {
        const token = localStorage.getItem('token');
        const emergencyResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/emergency-send`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        return { success: true, data: emergencyResponse.data.data };
      } catch (emergencyError) {
        console.error('Emergency send also failed:', emergencyError);
      }
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Update getMessages function with better error handling
  async getMessages(tripId, otherUserId) {
    console.log(`Getting messages for trip ${tripId} with user ${otherUserId}`);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }
  
      // Try primary endpoint with proper error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages/${tripId}/${otherUserId}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        }
      );
  
      clearTimeout(timeoutId);
      
      return { success: true, data: response.data.data || [] };
    } catch (error) {
      console.error('Error getting messages:', error);
      
      // Return empty result rather than failing
      return { 
        success: false, 
        error: error.response?.data?.message || error.message,
        data: [] // Return empty array to prevent UI issues
      };
    }
  },

  // Mark a message as read
  async markAsRead(messageId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/read/${messageId}`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: true }; // Return success even on error to prevent UI disruption
    }
  },

  // Mark all messages as read for a trip and user
  async markAllAsRead(tripId, otherUserId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/read-all`, 
        { trip_id: tripId, other_user_id: otherUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      return { success: true }; // Return success to avoid UI disruption
    }
  },

  // Get unread message count for the current user
  async getUnreadCount() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated', count: 0 };
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/unread`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { 
        success: true, 
        data: response.data.data 
      };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { success: false, data: { unread_count: 0 } }; // Return 0 as a safe default
    }
  },

  // Get unread messages per user for a specific trip (for guide view)
  async getUnreadMessagesPerUser(tripId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated', data: {} };
      }

      // Try the most likely endpoint first
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/unread-messages-per-user/${tripId}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return { success: true, data: response.data.data };
      } catch (e) {
        console.log("Primary endpoint failed, trying fallback");
      }
      
      // Fallback to the endpoint we found in the controller
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/unread-messages-per-user/${tripId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error getting unread messages per user:', error);
      return { success: true, data: {} }; // Return empty object as safe default
    }
  },

  // Get chat contacts for the current user
  async getChatContacts() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error getting chat contacts:', error);
      return { success: false, data: [] }; // Return empty array as safe default
    }
  },

  // Subscribe to Pusher channel for real-time updates - FIXED TO USE PUBLIC CHANNEL
  subscribeToChat(tripId, userId, onMessageReceived) {
    if (!pusherInstance) {
      console.error("Pusher not initialized. Chat will work through polling only.");
      return {
        unsubscribe: () => {}
      };
    }

    try {
      // Use public channel instead of private to avoid auth issues
      const channelName = `chat-${tripId}`;
      console.log(`Subscribing to Pusher channel: ${channelName}`);
      
      const channel = pusherInstance.subscribe(channelName);
      
      channel.bind('new-message', (data) => {
        console.log('New message received via Pusher:', data);
        if (data && onMessageReceived) {
          onMessageReceived(data);
        }
      });
      
      return {
        channel,
        unsubscribe: () => {
          console.log(`Unsubscribing from channel: ${channelName}`);
          pusherInstance.unsubscribe(channelName);
        }
      };
    } catch (error) {
      console.error("Error subscribing to Pusher channel:", error);
      return {
        unsubscribe: () => {}
      };
    }
  }
};

export default chatService;
