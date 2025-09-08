'use client';
import { Heart, Bot, User } from 'lucide-react';
import Image from 'next/image';

export default function ChatMessage({ message, sender, timestamp }) {
  const isBot = sender === 'bot';
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : '';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex ${isBot ? 'flex-row' : 'flex-row-reverse'} max-w-[80%] items-start gap-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {isBot ? <Image src="/profile.jpg" alt="Tara" width={20} height={20} /> : <User className="w-4 h-4" />}
        </div>
        
        {/* Message bubble */}
        <div className={`rounded-2xl px-4 py-3 max-w-md ${
          isBot 
            ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-gray-800 border border-pink-100' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 border border-blue-100'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </div>
          {timestamp && (
            <div className={`text-xs mt-2 ${
              isBot ? 'text-pink-400' : 'text-blue-400'
            }`}>
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
