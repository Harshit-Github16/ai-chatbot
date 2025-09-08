import { useState } from 'react';
import { Send, Heart } from 'lucide-react';
import Image from 'next/image';

export default function ChatInput({ onSendMessage, isLoading = false, disabled = false }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? "Tara is thinking..." : "Share what\'s on your mind..."}
            disabled={isLoading || disabled}
            className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 focus:outline-none resize-none min-h-[50px] max-h-32 bg-gradient-to-r from-pink-50/30 to-purple-50/30 text-gray-800 placeholder-gray-400"
            rows={1}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          />
          
          {/* Character count indicator */}
          <div className="absolute bottom-2 right-12 text-xs text-gray-400">
            {message.length}/1000
          </div>
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
          {isLoading ? (
            <div className="animate-spin">
              <Heart className="w-5 h-5" />
              {/* <Image src="/profile.jpg" alt="Tara" width={20} height={20} /> */}
            </div>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      
      {/* Emotional support prompts */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => !isLoading && !disabled && onSendMessage("I\'m feeling a bit overwhelmed today")}
          disabled={isLoading || disabled}
          className="px-3 py-1.5 text-xs bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-600 rounded-full border border-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          I&apos;m feeling overwhelmed
        </button>
        <button
          onClick={() => !isLoading && !disabled && onSendMessage("I could use someone to talk to")}
          disabled={isLoading || disabled}
          className="px-3 py-1.5 text-xs bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 text-pink-600 rounded-full border border-pink-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          I need someone to talk to
        </button>
        <button
          onClick={() => !isLoading && !disabled && onSendMessage("How are you doing today?")}
          disabled={isLoading || disabled}
          className="px-3 py-1.5 text-xs bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-600 rounded-full border border-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Just saying hi
        </button>
      </div>
    </div>
  );
}
