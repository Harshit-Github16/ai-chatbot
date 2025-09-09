import { useState } from 'react';
import { Plus, MessageCircle, Users, Heart, GraduationCap, UserCheck, Smile, MoreVertical, Trash2 } from 'lucide-react';

const roleIcons = {
  best_friend: Heart,
  mentor: GraduationCap,
  sister: Heart,
  brother: Users,
  good_friend: Users,
  boyfriend: Smile,
  girlfriend: Heart
};

export default function ChatList({ characters, currentCharacter, onCharacterSelect, onAddFriend, onDeleteChat, isLoading }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
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
            <div key={key} className={`relative group w-full flex items-center mb-2 rounded-xl ${
              isActive
                ? 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 shadow-sm'
                : 'hover:bg-gray-50 border border-transparent'
            }`}>
              <button
                onClick={() => onCharacterSelect(character)}
                disabled={isLoading}
                className={`flex-1 flex items-center gap-3 p-3 transition-all duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
              
              {/* More options button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(showOptions === key ? null : key);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100 rounded-lg mr-1"
              >
                <MoreVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
              
              {/* Options dropdown */}
              {showOptions === key && onDeleteChat && (
                <div className="absolute top-0 right-0 mt-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(key);
                      setShowOptions(null);
                    }}
                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Chat
                  </button>
                </div>
              )}
            </div>
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
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-4">
            <h3 className="font-semibold text-gray-800 mb-2">Delete Chat History</h3>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to delete all messages with {characters[showDeleteConfirm]?.name}? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteChat && onDeleteChat(showDeleteConfirm, characters[showDeleteConfirm]);
                  setShowDeleteConfirm(null);
                }}
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
