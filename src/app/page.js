'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import UserProfileModal from '@/components/UserProfileModal';
import AddFriendModal from '@/components/AddFriendModal';
import CharacterSelector from '@/components/CharacterSelector';
import ChatList from '@/components/ChatList';
import { Heart, Sparkles, Plus } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
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

  // Data loaders (declared before effects to avoid TDZ during render)
  const loadSessions = useCallback(async (uid = userId) => {
    try {
      const response = await fetch(`/api/chat/get?userId=${uid}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        setMessages(data.chats || []);
        
        // Update user profile and characters
        if (data.userProfile) {
          setUserProfile(data.userProfile);
          setCharacters(data.userProfile.characters || {});
          
          // Set current character to Tara if available and no current character
          if (data.userProfile.characters?.tara && !currentCharacter) {
            setCurrentCharacter(data.userProfile.characters.tara);
          }
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }, [userId, currentCharacter]);

  const loadMessages = useCallback(async (characterName = 'tara') => {
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

  // Load sessions on component mount
  useEffect(() => {
    // Ensure persistent userId in localStorage
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

  // Load messages when session changes
  useEffect(() => {
    if (userId) {
      loadMessages(currentCharacter?.name?.toLowerCase().replace(/\s+/g, '_') || 'tara');
    }
  }, [userId, loadMessages, currentCharacter]);

  

  // Check if user needs profile setup
  useEffect(() => {
    if (userId && userProfile === null && !isLoading && isInitialLoad) {
      // Check if user profile exists in database
      const checkUserProfile = async () => {
        try {
          const response = await fetch(`/api/user/profile?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.userProfile) {
              setUserProfile(data.userProfile);
              setCharacters(data.userProfile.characters || {});
              if (data.userProfile.characters?.tara) {
                setCurrentCharacter(data.userProfile.characters.tara);
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
  }, [userId, userProfile, isLoading, isInitialLoad]);

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
        await loadSessions();
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
          role: friendData.role 
        })
      });
      
      if (response.ok) {
        // Refresh user profile and characters
        const profileResponse = await fetch(`/api/user/profile?userId=${userId}`);
        if (profileResponse.ok) {
          const data = await profileResponse.json();
          if (data.userProfile) {
            setUserProfile(data.userProfile);
            setCharacters(data.userProfile.characters || {});
            // Set the new character as current
            const characterKey = friendData.name.toLowerCase().replace(/\s+/g, '_');
            if (data.userProfile.characters?.[characterKey]) {
              setCurrentCharacter(data.userProfile.characters[characterKey]);
            }
          }
        }
        await loadSessions();
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleCharacterSelect = (character) => {
    if (character && character.name !== currentCharacter?.name) {
      setCurrentCharacter(character);
      const characterKey = character.name.toLowerCase().replace(/\s+/g, '_');
      loadMessages(characterKey);
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
          characterName: currentCharacter?.name?.toLowerCase().replace(/\s+/g, '_') || 'tara'
        })
      });
      
      if (response.ok) {
        // Remove message from local state
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
        // If deleting current character's chat, clear messages
        if (character?.name === currentCharacter?.name) {
          setMessages([]);
        }
        // Refresh sessions
        loadSessions();
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const createNewSession = () => {
    // Sessions are no longer used; keep welcome message optional
    setSidebarOpen(false);
    if (messages.length === 0) {
      const welcomeMessage = {
        _id: uuidv4(),
        message: `Hello! I&apos;m ${currentCharacter?.name || 'Tara'}, and I&apos;m here to listen and support you. Whether you&apos;re having a great day or going through something difficult, I&apos;m here for you. What&apos;s on your mind today? 💙`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
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

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);

    try {
      // Get bot response
      const response = await fetch('/api/chat/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        // Refresh messages/sessions summary
        loadSessions();
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        _id: uuidv4(),
        message: "I&apos;m sorry, I&apos;m having trouble responding right now. But I want you to know that I&apos;m here for you, and your feelings matter. Please try again in a moment. 💙",
        role: 'bot',
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSession = () => {
    // No-op since sessions are not used
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Chat List Sidebar */}
      <ChatList
        characters={characters}
        currentCharacter={currentCharacter}
        onCharacterSelect={handleCharacterSelect}
        onAddFriend={() => setShowAddFriendModal(true)}
        onDeleteChat={handleDeleteChat}
        isLoading={isLoading}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Image
                  src="/profile.jpg"
                  alt={currentCharacter?.name || 'Tara'}
                  width={32}
                  height={32}
                  className="rounded-full"
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
                  {/* <Heart className="w-8 h-8 text-white" /> */}
                  <Image
  src="/profile.jpg"
  alt="Tara"
  width={96}
  height={96}
  className="rounded-full"
/>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to {currentCharacter?.name || 'Tara'}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {currentCharacter?.role === 'best_friend' && "I'm here as your best friend! Let's chat about anything - good days, tough times, or just random thoughts. I'm always here for you! 💕"}
                  {currentCharacter?.role === 'mentor' && "I'm here as your mentor and guide. Whether you need advice, want to learn something new, or discuss your goals, I'm here to support your growth! 🎓"}
                  {currentCharacter?.role === 'sister' && "Hey there! I'm here as your caring sister. We can talk about anything - family stuff, personal issues, or just catch up on life! 👭"}
                  {currentCharacter?.role === 'brother' && "What's up! I'm here as your supportive brother. Whether you need advice, want to share something, or just hang out, I'm here! 👬"}
                  {currentCharacter?.role === 'good_friend' && "I'm here as your good friend! Let's share stories, thoughts, and support each other through whatever life brings! 🤝"}
                  {currentCharacter?.role === 'boyfriend' && "Hey babe! I'm here for you always. Whether you want to share your day, talk about dreams, or just spend time together, I love being here with you! 💙"}
                  {currentCharacter?.role === 'girlfriend' && "Hi sweetie! I'm here for you always. Let's talk about our day, share our feelings, or just enjoy each other's company! 💕"}
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
    </div>
  );
}

