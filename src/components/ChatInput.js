import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';


export default function ChatInput({ onSendMessage, isLoading = false, disabled = false, currentCharacter = null }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      // Keep focus in the textarea after sending
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 p-4">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? `${currentCharacter?.name || 'Tara'} is thinking...` : "Share what\'s on your mind..."}
            disabled={disabled}
            className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none resize-none min-h-[50px] max-h-32 bg-gradient-to-r from-pink-50/30 to-purple-50/30 text-gray-800 placeholder-gray-400"
            rows={1}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          />
          
      
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isLoading || disabled}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            message.trim() && !isLoading && !disabled
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
      {/* Emotional support prompts */}
     
    </div>
  );
}
