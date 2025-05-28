import { useRef, useEffect, useState } from "react";
import { FaSmile, FaPaperclip, FaPaperPlane, FaImage, FaFileAlt, FaTimes, FaMicrophone } from "react-icons/fa";

export default function ChatInputArea({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isSendingMessage,
  chatError,
  showEmoji,
  setShowEmoji,
  handleFileUploadClick
}) {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Common emojis
  const quickEmojis = ["😊", "👍", "❤️", "😂", "🙏", "👋", "🔥", "✅", "🎉"];
  
  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle input resize
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.trim().length > 0);
    
    // Auto-resize the textarea (only grow to 4 rows max)
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };
  
  // Simulate recording voice
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      alert("Voice recording would be sent here in a real implementation.");
    } else {
      setIsRecording(true);
    }
  };
  
  // Quick emoji insertion
  const insertEmoji = (emoji) => {
    setNewMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };
  
  return (
    <div className="bg-white border-t border-gray-200 pt-2 pb-4">
      {chatError && (
        <div className="text-sm text-red-500 px-4 py-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
          </svg>
          {chatError}
        </div>
      )}
      
      {/* Quick emoji row */}
      <div className="px-3 flex overflow-x-auto scrollbar-hide space-x-1 mb-2">
        {quickEmojis.map(emoji => (
          <button
            key={emoji}
            className="w-9 h-9 flex-shrink-0 hover:bg-gray-100 rounded-full flex items-center justify-center text-xl transition-colors"
            onClick={() => insertEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
      
      {/* Main input area */}
      <form onSubmit={handleSendMessage} className="flex items-end px-3 gap-2">
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={handleFileUploadClick}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors relative group"
          >
            <FaPaperclip className="text-lg" />
            
            {/* Attachment options tooltip */}
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col bg-white shadow-md rounded-lg border border-gray-200 p-1">
              <button 
                type="button"
                className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded flex items-center gap-2 text-sm"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
              >
                <FaImage className="text-blue-500" />
                <span>Gambar</span>
              </button>
              <button 
                type="button"
                className="px-3 py-1.5 hover:bg-gray-100 text-gray-700 rounded flex items-center gap-2 text-sm"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = ".pdf,.doc,.docx,.xls,.xlsx";
                    fileInputRef.current.click();
                  }
                }}
              >
                <FaFileAlt className="text-green-500" />
                <span>Dokumen</span>
              </button>
            </div>
          </button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              alert(`File upload functionality would be implemented here.\nSelected file: ${file.name}`);
              e.target.value = null;
            }
          }}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
        
        {isRecording ? (
          <div className="flex-1 flex items-center px-4 py-2 bg-red-50 rounded-full border border-red-200">
            <div className="flex-1 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-600 text-sm">Merekam...</span>
            </div>
            <button 
              type="button" 
              onClick={toggleRecording}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Tulis pesan..."
            className="flex-1 outline-none bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 border border-gray-200 rounded-2xl py-3 px-4 resize-none transition-all min-h-[45px]"
            rows="1"
            disabled={isSendingMessage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
        )}
        
        <button
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <FaSmile className="text-lg" />
        </button>
        
        {!isTyping && !isRecording ? (
          <button
            type="button"
            onClick={toggleRecording}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white transition-colors flex-shrink-0"
          >
            <FaMicrophone />
          </button>
        ) : (
          <button
            type="submit"
            disabled={(!newMessage.trim() && !isRecording) || isSendingMessage}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
              !newMessage.trim() || isSendingMessage
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <FaPaperPlane className={`${isSendingMessage ? 'opacity-50' : ''} ${!newMessage.trim() ? '' : '-translate-x-px'}`} />
          </button>
        )}
      </form>
      
      {/* Emoji picker */}
      {showEmoji && (
        <div className="absolute bottom-20 right-6 bg-white shadow-xl rounded-lg p-2 border border-gray-200 z-10">
          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {["😊", "😂", "😍", "🙏", "👍", "❤️", "😎", "🔥", "👋", "😁", "🤔", 
              "👏", "🙄", "😢", "😭", "🥳", "👌", "🙌", "🤗", "😉", "😋", "🤩",
              "😃", "😆", "😅", "👀", "🎉", "✨", "🌟", "💯", "🙂", "😇"].map(emoji => (
              <button
                key={emoji}
                className="w-8 h-8 text-xl hover:bg-gray-100 rounded"
                onClick={() => {
                  insertEmoji(emoji);
                  setShowEmoji(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Typing indicator - would be activated by backend in real implementation */}
      {Math.random() > 0.7 && !isTyping && !isRecording && (
        <div className="px-4 py-1 text-xs text-gray-500 italic">
          Guide sedang mengetik...
        </div>
      )}
    </div>
  );
}