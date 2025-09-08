'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '@/components/Sidebar';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [currentSession, setCurrentSession] = useState('all');
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [userId, setUserId] = useState(null);

  // Data loaders (declared before effects to avoid TDZ during render)
  const loadSessions = useCallback(async (uid = userId) => {
    try {
      const response = await fetch(`/api/chat/get?userId=${uid}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
        setMessages(data.chats || []);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }, [userId]);

  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/chat/get?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.chats || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
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
      loadMessages();
    }
  }, [userId, loadMessages]);

  

  const createNewSession = () => {
    // Sessions are no longer used; keep welcome message optional
    setSidebarOpen(false);
    if (messages.length === 0) {
      const welcomeMessage = {
        _id: uuidv4(),
        message: "Hello! I&apos;m Tara, and I&apos;m here to listen and support you. Whether you&apos;re having a great day or going through something difficult, I&apos;m here for you. What&apos;s on your mind today? 💙",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = {
      _id: uuidv4(),
      Reply: messageText,
      Role: 'user',
      createdAt: new Date()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);

    try {
      // Get bot response
      const response = await fetch('/api/chat/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          message: messageText
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
    <div className="flex h-screen w-7xl mx-auto bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Sidebar */}
 

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-0 min-w-0">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-pink-100 px-6 py-4 lg:pl-6 pl-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                {/* <Heart className="w-4 h-4 text-white" /> */}
                <Image
  src="/profile.jpg"
  alt="Tara"
  width={96}
  height={96}
  className="rounded-full"
/>
              </div>
              <div className="flex items-center gap-2">
  <h2 className="font-semibold text-gray-800">Tara</h2>
  <div className="bg-green-500 rounded-full w-2 h-2"></div>
  {/* <p className="text-sm text-gray-500">Always here to listen</p> */}
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
          {messages.length === 0 ? (
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
                <h3 className="text-lg font-medium text-gray-800 mb-2">Welcome to Tara</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  I&apos;m here to be your supportive companion. Whether you want to share your thoughts, 
                  talk through feelings, or just have someone to listen, I&apos;m here for you.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={message._id || index}
                message={message.message}
                sender={message.role}
                timestamp={message.createdAt}
              />
            ))
          )}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl px-4 py-3 border border-pink-100">
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                <span className="text-sm text-gray-600">Tara is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          disabled={!currentSession}
        />
      </div>
    </div>
  );
}

