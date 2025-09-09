import { useState } from 'react';
import { Plus, MessageCircle, Users, Heart, GraduationCap, UserCheck, Smile } from 'lucide-react';

const roleIcons = {
  best_friend: Heart,
  mentor: GraduationCap,
  sister: Heart,
  brother: Users,
  good_friend: Users,
  boyfriend: Smile,
  girlfriend: Heart
};

export default function ChatList({ characters, currentCharacter, onCharacterSelect, onAddFriend, isLoading }) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">My Friends</h2>
          <button
            onClick={onAddFriend}
            className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Characters List */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(characters).map(([key, character]) => {
          const Icon = roleIcons[character.role] || MessageCircle;
          const isActive = currentCharacter?.name === character.name;
          const messageCount = character.conversations?.length || 0;
          
          return (
            <button
              key={key}
              onClick={() => onCharacterSelect(character)}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 shadow-sm'
                  : 'hover:bg-gray-50 border border-transparent'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-100'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className={`font-medium ${isActive ? 'text-pink-700' : 'text-gray-800'}`}>
                  {character.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {messageCount} messages
                </div>
              </div>
              
              {isActive && (
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              )}
            </button>
          );
        })}
        
        {Object.keys(characters).length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No friends yet</p>
            <p className="text-gray-400 text-xs">Add your first friend to start chatting</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-400 text-center">
          {Object.keys(characters).length} friend{Object.keys(characters).length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
