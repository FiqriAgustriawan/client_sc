import Image from "next/image";
import { useState } from 'react';
import { FaRegClock, FaCheck, FaCheckDouble, FaExclamationTriangle, FaEllipsisH } from "react-icons/fa";

export default function ChatMessage({ 
  message, 
  isMyMessage, 
  showAvatar, 
  isFirstInGroup,
  isLastInGroup,
  formatTime,
  getImageUrl,
  handleRetrySendMessage
}) {
  const [showOptions, setShowOptions] = useState(false);

  // Format message timestamp to also show date if needed
  const formatMessageTime = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the message is from today, yesterday or other day
    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return formatTime(dateString);
    } else if (isYesterday) {
      return `Kemarin ${formatTime(dateString)}`;
    } else {
      // Format for other days
      return messageDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      }) + ', ' + formatTime(dateString);
    }
  };
  
  return (
    <div 
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-4' : 'mt-1'}`}
    >
      {!isMyMessage && showAvatar && (
        <div className="flex-shrink-0 mr-2 self-end mb-1">
          {message.sender?.profile_photo ? (
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              <Image 
                src={getImageUrl(message.sender.profile_photo)}
                alt={message.sender?.nama_depan || "Guide"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {message.sender?.nama_depan?.charAt(0) || "G"}
            </div>
          )}
        </div>
      )}
      
      <div 
        className={`max-w-[75%] group ${isMyMessage ? 'order-1' : 'order-2'}`}
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        <div
          className={`px-3 py-2.5 rounded-2xl shadow-sm ${
            isFirstInGroup ? 
              (isMyMessage ? 'rounded-tr-md' : 'rounded-tl-md') : 
              (isMyMessage ? 'rounded-tr-md' : 'rounded-tl-md')
          } ${
            isLastInGroup ? 
              (isMyMessage ? 'rounded-br-md' : 'rounded-bl-md') : 
              (isMyMessage ? 'rounded-br-md' : 'rounded-bl-md')
          } ${
            isMyMessage
              ? message.isError 
                ? 'bg-red-50 text-gray-800 border border-red-200' 
                : message.isTemp 
                ? 'bg-blue-100 text-gray-800'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-100'
          } transition-all duration-200 ${message.isTemp ? 'opacity-85' : ''}`}
        >
          {message.content}
          
          <div className={`text-[10px] mt-1 flex justify-end items-center gap-1 ${
            isMyMessage ? (message.isError ? 'text-red-500' : 'text-blue-100') : 'text-gray-400'
          }`}>
            {formatMessageTime(message.created_at)}
            {isMyMessage && (
              message.isTemp ? (
                <FaRegClock className="ml-0.5" />
              ) : message.isError ? (
                <FaExclamationTriangle className="ml-0.5 text-red-500" />
              ) : message.is_read ? (
                <FaCheckDouble className="ml-0.5" />
              ) : (
                <FaCheck className="ml-0.5" />
              )
            )}
          </div>
        </div>
        
        {/* Options that appear on hover */}
        <div className={`${showOptions ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200 mt-1`}>
          {message.isError ? (
            <div className="flex justify-end">
              <button
                onClick={() => handleRetrySendMessage(message)}
                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 py-1 px-2 rounded-md flex items-center gap-1 transition-colors"
              >
                <FaExclamationTriangle size={10} />
                <span>Kirim ulang</span>
              </button>
            </div>
          ) : (
            <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                }}
                className="text-xs bg-gray-50 text-gray-500 hover:bg-gray-100 py-1 px-2 rounded-md flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Salin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}