"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/tripService";
import { chatService } from "@/services/chatService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaComments, FaChevronLeft, FaSearch } from "react-icons/fa"; // <-- Add this

// Import components
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatInputArea from "@/components/chat/ChatInputArea";

export default function TripChat() {
  // Get params
  const params = useParams();
  const tripId = params.id;
  
  // State management
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [guideInfo, setGuideInfo] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState("offline"); // offline, online, away
  const [lastSeen, setLastSeen] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  const router = useRouter();
  const { user } = useAuth();

  // Fetch trip details
  useEffect(() => {
    const fetchTripDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Get trip details
        const tripResponse = await tripService.getTripDetail(tripId);
        if (tripResponse.success) {
          setTrip(tripResponse.data);
          
          // Set guide info
          if (tripResponse.data.guide) {
            setGuideInfo({
              id: tripResponse.data.guide.id,
              name: tripResponse.data.guide.name,
              profile_photo: tripResponse.data.guide.profile_photo,
              user_id: tripResponse.data.guide.user_id || tripResponse.data.guide.id,
            });
            
            // Simulate random online status for demo
            const statuses = ["online", "away", "offline"];
            setOnlineStatus(statuses[Math.floor(Math.random() * statuses.length)]);
            
            // Simulate random last seen for demo
            if (Math.random() > 0.5) {
              const now = new Date();
              setLastSeen(new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 5));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripDetail();
  }, [tripId, router]);

  // Load messages when chat loads
  useEffect(() => {
    const loadMessages = async () => {
      if (!trip || !user) return;
      
      try {
        setChatLoading(true);
        setChatError(null);
        
        // Get guide user ID
        let guideUserId = null;
        if (trip.guide) {
          guideUserId = trip.guide.user_id || trip.guide.id;
        } else if (trip.guide_id) {
          guideUserId = trip.guide_id;
        }

        if (!guideUserId) {
          throw new Error("Cannot find guide user ID");
        }
        
        // Attempt to load messages with retry logic
        let attempt = 0;
        let success = false;

        while (attempt < 3 && !success) {
          try {
            const response = await chatService.getMessages(tripId, guideUserId);

            if (response && response.success) {
              // Add guide_user_id and user_id to each message for local sending
              const messages = (response.data || []).map((msg) => ({
                ...msg,
                guide_user_id: guideUserId,
                user_id: user.id,
              }));

              setMessages(messages);
              scrollToBottom();
              success = true;
              
              // Mark messages as read
              if (response.data && response.data.length > 0) {
                await chatService.markAllAsRead(tripId, guideUserId);
              }
            } else {
              throw new Error("Invalid response");
            }
          } catch (err) {
            console.error(`Attempt ${attempt + 1} failed:`, err);
            attempt++;
            if (attempt < 3) {
              await new Promise((r) => setTimeout(r, 1000));
            }
          }
        }

        if (!success) {
          setChatError("Gagal memuat pesan setelah beberapa percobaan. Silakan coba lagi.");
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setChatError("Terjadi kesalahan saat memuat pesan. Coba lagi nanti.");
      } finally {
        setChatLoading(false);
      }
    };

    if (trip && user) {
      loadMessages();
      
      // Set up message polling
      const pollingId = setInterval(() => {
        (async () => {
          try {
            if (!trip) return;

            let guideUserId = null;
            if (trip.guide) {
              guideUserId = trip.guide.user_id || trip.guide.id;
            } else if (trip.guide_id) {
              guideUserId = trip.guide_id;
            }

            if (!guideUserId) return;

            const response = await chatService.getMessages(tripId, guideUserId);
            if (response.success && Array.isArray(response.data)) {
              // Check if there are new messages to update
              if (response.data.length !== messages.length) {
                console.log("New messages detected via polling, updating...");
                
                // Add guide_user_id and user_id to each message
                const updatedMessages = (response.data || []).map((msg) => ({
                  ...msg,
                  guide_user_id: guideUserId,
                  user_id: user.id,
                }));
                
                setMessages(updatedMessages);
                scrollToBottom();
                
                // Mark messages as read
                await chatService.markAllAsRead(tripId, guideUserId);
              } else {
                // Check if the latest message ID is different
                const latestCurrentMessage = messages.length > 0 ? messages[messages.length - 1] : null;
                const latestNewMessage = response.data.length > 0 ? response.data[response.data.length - 1] : null;

                if (latestCurrentMessage && latestNewMessage && latestCurrentMessage.id !== latestNewMessage.id) {
                  console.log("Different latest message detected, updating...");
                  
                  // Add guide_user_id and user_id to each message
                  const updatedMessages = (response.data || []).map((msg) => ({
                    ...msg,
                    guide_user_id: guideUserId,
                    user_id: user.id,
                  }));
                  
                  setMessages(updatedMessages);
                  scrollToBottom();
                  
                  // Mark messages as read
                  await chatService.markAllAsRead(tripId, guideUserId);
                }
              }
            }
          } catch (error) {
            console.error("Error in chat polling:", error);
          }
        })();
      }, 5000); // Poll every 5 seconds
      
      return () => {
        clearInterval(pollingId);
      };
    }
  }, [trip, user, tripId]);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Send message handler
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || isSendingMessage || !trip) return;

    setIsSendingMessage(true);

    // Create temporary message for optimistic update
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage.trim(),
      sender_id: user.id,
      receiver_id: null,
      trip_id: tripId,
      created_at: new Date().toISOString(),
      is_read: false,
      sender: {
        id: user.id,
        nama_depan: user.nama_depan || user.name?.split(" ")[0] || "Saya",
        nama_belakang: user.nama_belakang || user.name?.split(" ")[1] || "",
        profile_photo: user.profile_photo,
      },
      isTemp: true,
    };

    try {
      // Get guide user ID
      let guideUserId = null;
      if (trip.guide) {
        guideUserId = trip.guide.user_id || trip.guide.id;
      }

      // Fallback to guide_id
      if (!guideUserId && trip.guide_id) {
        guideUserId = trip.guide_id;
      }

      if (!guideUserId) {
        throw new Error("Tidak dapat menemukan ID Guide");
      }

      // Update temporary message with guide ID
      tempMessage.receiver_id = guideUserId;
      tempMessage.guide_user_id = guideUserId;
      tempMessage.user_id = user.id;

      // Add to message list immediately for UI responsiveness
      setMessages((prev) => [...prev, tempMessage]);

      // Clear input field immediately
      setNewMessage("");

      // Scroll to bottom
      scrollToBottom();

      const messageData = {
        receiver_id: guideUserId,
        trip_id: tripId,
        content: tempMessage.content,
        bypass: true,
        guide_user_id: guideUserId,
        user_id: user.id,
      };

      console.log("Sending message data:", messageData);

      const response = await chatService.sendMessage(messageData);
      console.log("Send message response:", response);

      if (response.success) {
        // Replace temp message with actual message from server
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempMessage.id ? response.data : msg))
        );

        // Poll for new messages to ensure consistency
        setTimeout(async () => {
          try {
            const refreshResponse = await chatService.getMessages(tripId, guideUserId);
            if (refreshResponse.success) {
              // Add guide_user_id and user_id to all messages
              const messages = (refreshResponse.data || []).map((msg) => ({
                ...msg,
                guide_user_id: guideUserId,
                user_id: user.id,
              }));
              setMessages(messages);
            }
          } catch (err) {
            console.error("Error refreshing messages after send:", err);
          }
        }, 1000);
      } else if (response.isLocalOnly) {
        // Handle local-only messages
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? {
                  ...response.data,
                  isLocalOnly: true,
                  isTemp: false,
                }
              : msg
          )
        );

        // Save to localStorage as fallback
        const localMessages = JSON.parse(
          localStorage.getItem(`chat_messages_${tripId}_${guideUserId}`) || "[]"
        );
        localMessages.push({
          ...response.data,
          isLocalOnly: true,
          isTemp: false,
        });
        localStorage.setItem(
          `chat_messages_${tripId}_${guideUserId}`,
          JSON.stringify(localMessages)
        );
      } else {
        // Handle error cases
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? { ...msg, isError: true, isTemp: false }
              : msg
          )
        );

        setChatError("Gagal mengirim pesan. Silakan coba lagi.");
        setTimeout(() => setChatError(null), 3000);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Update temp message to show error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, isError: true, isTemp: false }
            : msg
        )
      );

      setChatError(error.message || "Terjadi kesalahan saat mengirim pesan");
      setTimeout(() => setChatError(null), 3000);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Retry sending message
  const handleRetrySendMessage = async (message) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
    setNewMessage(message.content);
    inputRef.current?.focus();
  };

  // Handle file upload click
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // For demo purposes, we'll just show an alert
    alert(`File upload functionality would be implemented here.\nSelected file: ${file.name}`);
    
    // Reset file input
    e.target.value = null;
  };

  // Helper function for image URLs
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/placeholder.jpg";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Clean path to handle any potential double slashes
    const cleanPath = imagePath.replace(/\/storage\/+/g, "/storage/");

    if (imagePath.includes("/storage/")) {
      return `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }${cleanPath}`;
    }

    return `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    }/storage/${imagePath}`;
  };

  // Format time helper
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  // Format last seen time
  const formatLastSeen = (date) => {
    if (!date) return "Terlihat beberapa waktu yang lalu";
    
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return "Terlihat baru saja";
    if (minutes < 60) return `Terlihat ${minutes} menit yang lalu`;
    if (hours < 24) return `Terlihat ${hours} jam yang lalu`;
    
    return `Terlihat pada ${date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Filter messages based on search query
  const filteredMessages = searchQuery.trim() === "" 
    ? messages 
    : messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat chat...</p>
        </div>
      </div>
    );
  }

  // Prepare whatsapp link
  const whatsappLink = trip?.whatsapp_group || 
    `https://wa.me/${trip?.guide?.whatsapp?.replace(/\D/g, "") || ""}`;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Make the container fit the viewport properly */}
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden flex flex-col" 
           style={{ height: "calc(100vh - 2rem)" }}>
        {/* Chat header */}
        <ChatHeader 
          tripId={tripId}
          guideInfo={guideInfo}
          onlineStatus={onlineStatus}
          lastSeen={lastSeen}
          whatsappLink={whatsappLink}
          toggleSearch={() => setShowSearch(!showSearch)}
          getImageUrl={getImageUrl}
          formatLastSeen={formatLastSeen}
        />
        
        {/* Search bar - conditionally shown */}
        {showSearch && (
          <div className="bg-blue-50 p-3 border-b border-blue-100">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari dalam chat..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <FaSearch className="absolute left-4 top-3 text-gray-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="text-sm text-gray-600 mt-2 pl-4">
                {filteredMessages.length === 0 ? (
                  <p>Tidak ada hasil pencarian</p>
                ) : (
                  <p>Ditemukan {filteredMessages.length} pesan</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Chat body - using flex-grow to take available space */}
        <div 
          ref={chatContainerRef}
          className="p-4 overflow-y-auto bg-gray-50 flex-grow"
          style={{ backgroundImage: "url('/images/chat-bg.png')" }}
        >
          {chatLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : chatError ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-red-500 mb-3">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
              </div>
              <p className="text-gray-600">{chatError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Muat Ulang
              </button>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-blue-500 mb-4">
                <FaComments className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Belum Ada Pesan</h3>
              <p className="text-gray-500 mt-2 max-w-xs">
                Mulai percakapan dengan guide perjalanan Anda untuk mendiskusikan detail perjalanan
              </p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {filteredMessages.map((message, index) => {
                const isMyMessage = message.sender_id === user.id;
                const showAvatar = index === 0 || 
                  filteredMessages[index - 1]?.sender_id !== message.sender_id;
                
                const isFirstInGroup = index === 0 || 
                  filteredMessages[index - 1]?.sender_id !== message.sender_id;
                
                const isLastInGroup = index === filteredMessages.length - 1 || 
                  filteredMessages[index + 1]?.sender_id !== message.sender_id;
                
                return (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isMyMessage={isMyMessage}
                    showAvatar={showAvatar}
                    isFirstInGroup={isFirstInGroup}
                    isLastInGroup={isLastInGroup}
                    formatTime={formatTime}
                    getImageUrl={getImageUrl}
                    handleRetrySendMessage={handleRetrySendMessage}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Chat input area */}
        <ChatInputArea
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          isSendingMessage={isSendingMessage}
          chatError={chatError}
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          handleFileUploadClick={handleFileUploadClick}
        />
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
}