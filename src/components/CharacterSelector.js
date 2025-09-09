import { useState } from 'react';
import { Plus, Users, Heart, GraduationCap, Smile, UsersRound, Sparkles } from 'lucide-react';

const roleIcons = {
  best_friend: Heart,
  mentor: GraduationCap,
  siblings: UsersRound,
  good_friend: Users,
  boyfriend: Smile,
  girlfriend: Heart,
  other: Sparkles
};

const roleLabels = {
  best_friend: 'Tara',
  mentor: 'Mentor',
  siblings: 'Siblings',
  good_friend: 'Good Friend',
  boyfriend: 'Boyfriend',
  girlfriend: 'Girlfriend',
  other: 'Other'
};

export default function CharacterSelector({ characters, currentCharacter, onCharacterSelect, onAddFriend }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-pink-300 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {currentCharacter ? (
          <>
            {(() => {
              const Icon = roleIcons[currentCharacter.role] || Users;
              return <Icon className="w-4 h-4 text-pink-500" />;
            })()}
            <span className="font-medium text-gray-800">{currentCharacter.name}</span>
          </>
        ) : (
          <>
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Select Character</span>
          </>
        )}
        <div className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-400">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-[200px]">
            <div className="p-2">
              {Object.entries(characters).map(([key, character]) => {
                const Icon = roleIcons[character.role] || Users;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onCharacterSelect(character);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-pink-50 rounded-lg transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-pink-500 group-hover:text-pink-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 group-hover:text-pink-700">{character.name}</div>
                      <div className="text-xs text-gray-500">{roleLabels[character.role]}</div>
                    </div>
                    {currentCharacter?.name === character.name && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
              
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => {
                    onAddFriend();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-pink-50 rounded-lg transition-colors text-pink-600 group"
                >
                  <Plus className="w-4 h-4 group-hover:text-pink-700" />
                  <span className="font-medium group-hover:text-pink-700">Add New Friend</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
