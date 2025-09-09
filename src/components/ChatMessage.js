'use client';
import { Heart, Bot, User, Trash2, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ChatMessage({ message, sender, timestamp, messageId, onDelete }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isBot = sender === 'bot';
  const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : '';

  const handleDelete = () => {
    onDelete && onDelete(messageId);
    setShowDeleteConfirm(false);
    setShowOptions(false);
  };

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4 group relative`}>
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
        
        {/* Delete button - shows on hover */}
        {onDelete && (
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-100 ${
              isBot ? 'ml-2' : 'mr-2'
            }`}
          >
            <MoreVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {/* Options dropdown */}
      {showOptions && onDelete && (
        <div className={`absolute top-0 ${isBot ? 'left-full ml-2' : 'right-full mr-2'} bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]`}>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="font-semibold text-gray-800 mb-2">Delete Message</h3>
            <p className="text-gray-600 text-sm mb-4">Are you sure you want to delete this message? This action cannot be undone.</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-2 bg-red-500 text-white hover:bg-red-600 rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
