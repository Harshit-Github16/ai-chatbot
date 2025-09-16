"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import UserProfileModal from '@/components/UserProfileModal';
import AddFriendModal from '@/components/AddFriendModal';
import ChatList from '@/components/ChatList';
import { Heart, Sparkles, Menu } from 'lucide-react';
import Image from 'next/image';
import MoodModal from '@/components/MoodModal';

export default function ChatPage() {
  const [currentSession, setCurrentSession] = useState('all');
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [characters, setCharacters] = useState({});
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  // Data loaders (declared before effects to avoid TDZ during render)
  const loadSessions = useCallback(async (uid = userId) => {
    try {
      const response = await fetch(`/api/chat/get?userId=${uid}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        if (data.userProfile) {
          setUserProfile(data.userProfile);
          setCharacters(data.userProfile.characters || {});
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }, [userId]);

  const loadMessages = useCallback(async (characterName) => {
    if (!characterName) return;
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`/api/chat/get?userId=${userId}&characterName=${characterName}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.chats || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Ensure persistent userId in localStorage
  useEffect(() => {
    const existing = typeof window !== 'undefined' ? localStorage.getItem('tara_user_id') : null;
    if (existing) {
      setUserId(existing);
    } else {
      const newId = uuidv4();
      if (typeof window !== 'undefined') localStorage.setItem('tara_user_id', newId);
      setUserId(newId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      loadSessions(userId);
    }
  }, [userId, loadSessions]);

  // Load messages when currentCharacter changes
  useEffect(() => {
    if (userId && currentCharacter) {
      loadMessages(currentCharacter.name.toLowerCase().replace(/\s+/g, '_'));
    }
  }, [userId, loadMessages, currentCharacter]);

  // Check if user needs profile setup
  useEffect(() => {
    if (userId && userProfile === null && !isLoading && isInitialLoad) {
      const checkUserProfile = async () => {
        try {
          const response = await fetch(`/api/user/profile?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.userProfile) {
              setUserProfile(data.userProfile);
              setCharacters(data.userProfile.characters || {});

              if (!currentCharacter) {
                const savedCharacter = typeof window !== 'undefined' ? localStorage.getItem('tara_selected_character') : null;
                if (savedCharacter) {
                  try {
                    const parsedCharacter = JSON.parse(savedCharacter);
                    const characterKey = parsedCharacter.name.toLowerCase().replace(/\s+/g, '_');
                    if (data.userProfile.characters?.[characterKey]) {
                      setCurrentCharacter(data.userProfile.characters[characterKey]);
                    } else {
                      const availableCharacters = data.userProfile.characters || {};
                      const firstCharacterKey = Object.keys(availableCharacters)[0];
                      if (firstCharacterKey && availableCharacters[firstCharacterKey]) {
                        setCurrentCharacter(availableCharacters[firstCharacterKey]);
                      }
                    }
                  } catch (e) {
                    const availableCharacters = data.userProfile.characters || {};
                    const firstCharacterKey = Object.keys(availableCharacters)[0];
                    if (firstCharacterKey && availableCharacters[firstCharacterKey]) {
                      setCurrentCharacter(availableCharacters[firstCharacterKey]);
                    }
                  }
                } else {
                  const availableCharacters = data.userProfile.characters || {};
                  const firstCharacterKey = Object.keys(availableCharacters)[0];
                  if (firstCharacterKey && availableCharacters[firstCharacterKey]) {
                    setCurrentCharacter(availableCharacters[firstCharacterKey]);
                  }
                }
              }
            } else {
              setShowProfileModal(true);
            }
          }
          setIsInitialLoad(false);
        } catch (error) {
          console.error('Error checking user profile:', error);
          setIsInitialLoad(false);
        }
      };
      checkUserProfile();
    }
  }, [userId, userProfile, isLoading, isInitialLoad, currentCharacter]);

  // Mood modal with 2-hour rule: compare last mood vs last chat time
  useEffect(() => {
    const checkMoodPrompt = async () => {
      if (!userId || !userProfile) return;
      try {
        // latest mood
        const moodRes = await fetch(`/api/mood/latest?userId=${userId}`);
        const moodJson = moodRes.ok ? await moodRes.json() : { latest: null };
        const lastMoodAt = moodJson.latest?.createdAt ? new Date(moodJson.latest.createdAt).getTime() : 0;

        // last chat across sessions
        const lastChatAt = sessions.reduce((maxTs, s) => {
          const ts = s.lastTimestamp ? new Date(s.lastTimestamp).getTime() : 0;
          return Math.max(maxTs, ts);
        }, 0);

        const lastActivity = Math.max(lastMoodAt, lastChatAt);
        const now = Date.now();
        const twoHoursMs = 2 * 60 * 60 * 1000;
        const shouldAsk = lastActivity === 0 || now - lastActivity > twoHoursMs;
        setShowMoodModal(shouldAsk);
      } catch (e) {
        // fallback to show
        setShowMoodModal(true);
      }
    };
    checkMoodPrompt();
  }, [userId, userProfile, sessions]);

  const handleMoodSelect = async (mood) => {
    try {
      setSelectedMood(mood);
      const payload = {
        userId,
        key: mood.key,
        label: mood.label,
        emoji: mood.emoji,
        selectedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('tara_current_mood', JSON.stringify(payload));
      }
      await fetch('/api/mood/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      // ignore
    } finally {
      setShowMoodModal(false);
    }
  };

  const handleProfileSubmit = async (profileData) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...profileData })
      });
      if (response.ok) {
        setUserProfile(profileData);
        setShowProfileModal(false);
      } else {
        const errorData = await response.json();
        console.error('Profile creation error:', errorData);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleAddFriend = async (friendData) => {
    try {
      const response = await fetch('/api/character/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          characterName: friendData.name, 
          role: friendData.role,
          image: friendData.image,
          description: friendData.role === 'other' ? friendData.description : undefined
        })
      });
      if (response.ok) {
        const profileResponse = await fetch(`/api/user/profile?userId=${userId}`);
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          if (data.userProfile) {
            setUserProfile(data.userProfile);
            setCharacters(data.userProfile.characters || {});
            const characterKey = friendData.name.toLowerCase().replace(/\s+/g, '_');
            if (data.userProfile.characters?.[characterKey]) {
              setCurrentCharacter(data.userProfile.characters[characterKey]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleCharacterSelect = (character) => {
    if (character && character.name !== currentCharacter?.name) {
      setMessages([]);
      setIsLoadingMessages(true);
      setCurrentCharacter(character);
      setSidebarOpen(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tara_selected_character', JSON.stringify(character));
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch('/api/chat/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          messageId,
          characterName: currentCharacter?.name?.toLowerCase().replace(/\s+/g, '_')
        })
      });
      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteChat = async (characterKey, character) => {
    try {
      const response = await fetch('/api/chat/clear', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          characterName: character?.name?.toLowerCase().replace(/\s+/g, '_') || characterKey
        })
      });
      if (response.ok) {
        if (character?.name === currentCharacter?.name) {
          setMessages([]);
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading || !currentCharacter) return;
    const userMessage = {
      _id: uuidv4(),
      message: messageText,
      role: 'user',
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          message: messageText,
          characterName: currentCharacter.name
        })
      });
      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          _id: uuidv4(),
          message: data.response.Reply,
          usermood: data.response.Mood,
          moodReason: data.response.Reason,
          role: 'bot',
          createdAt: new Date(data.response.createdAt)
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        _id: uuidv4(),
        message: "I&apos;m sorry, I&apos;m having trouble responding right now.",
        role: 'bot',
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <ChatList
          characters={characters}
          currentCharacter={currentCharacter}
          onCharacterSelect={handleCharacterSelect}
          onAddFriend={() => setShowAddFriendModal(true)}
          onDeleteChat={handleDeleteChat}
          isLoading={isLoading}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-80 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <ChatList
            characters={characters}
            currentCharacter={currentCharacter}
            onCharacterSelect={handleCharacterSelect}
            onAddFriend={() => setShowAddFriendModal(true)}
            onDeleteChat={handleDeleteChat}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                className="md:hidden mr-1 rounded-lg border border-gray-200 w-9 h-9 flex items-center justify-center bg-white"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
              >
                 <Menu className="w-5 h-5 text-gray-700" />
                {/* <span className="block w-5 h-[2px] bg-gray-700 relative before:content-[''] before:absolute before:-top-2 before:w-5 before:h-[2px] 
                before:bg-gray-700 after:content-[''] after:absolute after:top-2 after:w-5 after:h-[2px] after:bg-gray-700" /> */}


              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={currentCharacter?.image || '/profile.jpg'}
                  alt={currentCharacter?.name || 'Tara'}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-gray-800">{currentCharacter?.name || 'Tara'}</h2>
                <div className="bg-green-500 rounded-full w-2 h-2"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Emotional Support</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image
                    src={currentCharacter?.image || '/profile.jpg'}
                    alt={currentCharacter?.name || 'Tara'}
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to {currentCharacter?.name || 'Tara'}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {currentCharacter?.role === 'best_friend' && "I'm here as your best friend! Let's chat about anything - good days, tough times, or just random thoughts. I'm always here for you! 💕"}
                  {currentCharacter?.role === 'mentor' && "I'm here as your mentor and guide. Whether you need advice, want to learn something new, or discuss your goals, I'm here to support your growth! 🎓"}
                  {currentCharacter?.role === 'siblings' && "Hey! I'm here as your caring sibling. We can talk about anything - family stuff, personal issues, or just catch up on life! 👨‍👩‍👧‍👦"}
                  {currentCharacter?.role === 'good_friend' && "I'm here as your good friend! Let's share stories, thoughts, and support each other through whatever life brings! 🤝"}
                  {currentCharacter?.role === 'boyfriend' && "Hey babe! I'm here for you always. Whether you want to share your day, talk about dreams, or just spend time together, I love being here with you! 💙"}
                  {currentCharacter?.role === 'girlfriend' && "Hi sweetie! I'm here for you always. Let's talk about our day, share our feelings, or just enjoy each other's company! 💕"}
                  {currentCharacter?.role === 'other' && (currentCharacter?.description || "I'm here in a special role that you define. Let's connect in a way that suits you best! ✨")}
                  {!currentCharacter?.role && "I'm here to be your supportive companion. Whether you want to share your thoughts, talk through feelings, or just have someone to listen, I'm here for you."}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message._id || index}
                message={message.message || message.Reply}
                sender={message.role || message.Role}
                timestamp={message.createdAt}
                messageId={message._id}
                onDelete={handleDeleteMessage}
              />
            ))
          )}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-4 py-3 border border-pink-100">
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                <span className="text-sm text-gray-600">{currentCharacter?.name || 'Tara'} is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          disabled={!currentCharacter}
          currentCharacter={currentCharacter}
        />
      </div>

      {/* Modals */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSubmit={handleProfileSubmit}
      />
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
        onSubmit={handleAddFriend}
      />
      <MoodModal isOpen={showMoodModal} onSelect={handleMoodSelect} />
    </div>
  );
}

// export { default } from '../page';


