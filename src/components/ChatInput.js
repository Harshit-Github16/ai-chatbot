import { useState, useEffect, useRef } from 'react';
import { Send, Smile } from 'lucide-react';


export default function ChatInput({ onSendMessage, isLoading = false, disabled = false, currentCharacter = null }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiPanelRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!showEmoji) return;
      if (
        emojiPanelRef.current &&
        !emojiPanelRef.current.contains(e.target)
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmoji]);

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

  const commonEmojis = [
    // Faces & Emotions
    '😀','😁','😂','🤣','😊','😍','😘','😇','🤗','🤩',
    '🤔','🤨','😅','🥲','😴','😎','😭','😤','😡','🥳',
    '😱','🤯','😳','😏','🙃','🤤','🤒','🤕','🤧','😷',
  
    // Gestures & Hands
    '👍','🙏','👏','👀','💪','👌','🤝','✌️','🤞','🤟',
    '👋','🫶','🤲','👉','👈','☝️','👇','🖐️','✋','🤌',
  
    // Symbols
    '🔥','✨','🌟','💖','💯','✅','❌','⚡','⭐','🎯',
    '🔔','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎',
  
    // Nature & Animals
    '🌸','🌹','🌻','🌼','🌷','🌴','🌞','🌙','⭐','☁️',
    '🐶','🐱','🦁','🐯','🐻','🐼','🐨','🐧','🐦','🐤',
  
    // Food & Drink
    '🍎','🍌','🍇','🍉','🍓','🍔','🍟','🍕','🍩','🍫',
    '🍿','🥤','☕','🍵','🍺','🍷','🥂','🍽️','🥗','🍝',
  
    // Activities & Objects
    '⚽','🏀','🏈','🎾','🎮','🎲','🎵','🎤','🎧','🎁',
    '✈️','🚗','🚀','🏠','💻','📱','📝','📚','💡','🕹️'
  ];
  
  const insertEmoji = (emoji) => {
    setMessage((prev) => {
      const selectionStart = textareaRef.current?.selectionStart ?? prev.length;
      const selectionEnd = textareaRef.current?.selectionEnd ?? prev.length;
      const before = prev.slice(0, selectionStart);
      const after = prev.slice(selectionEnd);
      const next = `${before}${emoji}${after}`;
      // restore caret position after state update
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          const newPos = selectionStart + emoji.length;
          textareaRef.current.focus();
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
        }
      });
      return next;
    });
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
          {/* Emoji toggle button */}
          <button
            type="button"
            aria-label="Add emoji"
            className="absolute right-2 bottom-2 p-2 rounded-full hover:bg-gray-100 text-gray-600"
            onClick={() => setShowEmoji((s) => !s)}
            disabled={disabled}
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Emoji popover */}
          {showEmoji && (
            <div
              ref={emojiPanelRef}
              className="absolute bottom-14 right-0 z-20 lg:w-100 w-72 p-2 bg-white border border-gray-200 rounded-xl shadow-lg"
            >
              <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
              {commonEmojis.map((em, idx) => (
  <button
    key={`${em}-${idx}`}
    type="button"
    className="h-10 w-10 flex items-center justify-center rounded hover:bg-gray-100 text-base"
    onClick={() => insertEmoji(em)}
  >
    {em}
  </button>
))}

              </div>
            </div>
          )}
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
