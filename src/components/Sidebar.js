'use client';
import { useState, useEffect } from 'react';
import { Plus, MessageCircle, Heart, Clock, Menu, X } from 'lucide-react';

export default function Sidebar({ 
  sessions, 
  currentSession, 
  onSessionSelect, 
  onNewChat, 
  isOpen, 
  onToggle 
}) {
  const [isLoading, setIsLoading] = useState(false);
console.log('sessionssessionssessions', sessions)
  const handleNewChat = async () => {
    setIsLoading(true);
    await onNewChat();
    setIsLoading(false);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // const truncateMessage = (message, maxLength = 50) => {
  //   if (message.length <= maxLength) return message;
  //   return message?.substring(0, maxLength) + '...';
  // };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200"
      >
        {isOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full w-80 bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50 border-r border-pink-100 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-pink-100 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Tara</h1>
                <p className="text-sm text-gray-600">Your caring companion</p>
              </div>
            </div>
            
            <button
              onClick={handleNewChat}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? 'Starting...' : 'New Conversation'}
            </button>
          </div>

          {/* Chat Sessions */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Conversations
              </h2>
              
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">Start a new chat to begin</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <button
                      key={session._id}
                      onClick={() => onSessionSelect('all')}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover:shadow-sm ${
                        currentSession === 'all'
                          ? 'bg-white border-2 border-pink-200 shadow-sm'
                          : 'bg-white/50 hover:bg-white/70 border border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {session.lastMessage ? session.lastMessage?.Reply || session.lastMessage : 'No messages yet'}
                        </p>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatDate(session.lastTimestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {session.messageCount} message{session.messageCount !== 1 ? 's' : ''}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-pink-100 bg-white/70">
            <div className="text-xs text-gray-500 text-center">
              <p>💙 Always here to listen</p>
              <p className="mt-1">Your conversations are private & secure</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
